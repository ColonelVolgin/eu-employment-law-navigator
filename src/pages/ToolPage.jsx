import { useState, useCallback, useRef } from "react";
import { Link } from 'react-router-dom'

const COUNTRIES = [
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
];

const CATEGORIES = [
  { id: "pension", label: "Retirement Benefits", icon: "🏦" },
  { id: "social_security", label: "Social Security", icon: "🛡️" },
  { id: "death", label: "Death Benefits", icon: "🕊️" },
  { id: "disability", label: "Disability Benefits", icon: "♿" },
  { id: "medical", label: "Medical Benefits", icon: "🏥" },
  { id: "parental", label: "Parental & Dependent Care", icon: "👶" },
  { id: "social", label: "Social Benefits", icon: "🤝" },
  { id: "perquisites", label: "Perquisites & Allowances", icon: "💼" },
  { id: "flexible", label: "Flexible Benefits", icon: "⚙️" },
  { id: "severance", label: "Severance & Termination", icon: "📋" },
  { id: "working_time", label: "Working Time", icon: "⏱️" },
  { id: "residence", label: "Entry & Residence", icon: "🛂" },
  { id: "contract", label: "Contract of Employment", icon: "📝" },
  { id: "health_safety", label: "Occupational H&S", icon: "🦺" },
  { id: "industrial", label: "Industrial Relations", icon: "⚖️" },
];

// Official verified sources per country per category
const SOURCES = {
  DE: {
    pension: [
      { label: "Deutsche Rentenversicherung (DRV)", url: "https://www.deutsche-rentenversicherung.de", desc: "Official statutory pension insurer — benefit calculators, contribution records, application forms" },
      { label: "SGB VI — Gesetze im Internet", url: "https://www.gesetze-im-internet.de/sgb_6/", desc: "Full statutory text of Social Code Book VI (Pension Insurance)" },
      { label: "BMAS — Betriebliche Altersversorgung", url: "https://www.bmas.de/DE/Arbeit/betriebliche-altersvorsorge/betriebliche-altersvorsorge.html", desc: "Federal Ministry guide on occupational pensions (bAV)" },
      { label: "Bundesfinanzministerium — Riester", url: "https://www.bundesfinanzministerium.de", desc: "Official guidance on Riester/Rürup subsidies and tax treatment" },
    ],
    social_security: [
      { label: "GKV-Spitzenverband", url: "https://www.gkv-spitzenverband.de", desc: "National Association of Statutory Health Insurance Funds" },
      { label: "BMAS — Sozialversicherung", url: "https://www.bmas.de/DE/Soziales/sozialversicherung.html", desc: "Federal Ministry overview of all SS branches and contribution rates" },
    ],
    medical: [
      { label: "GKV-Spitzenverband", url: "https://www.gkv-spitzenverband.de", desc: "Statutory health insurance framework and contribution rates" },
      { label: "PKV-Verband", url: "https://www.pkv.de", desc: "Private Health Insurance Association — eligibility and switching rules" },
    ],
    parental: [
      { label: "BMFSFJ — Elterngeld & Elternzeit", url: "https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/elterngeld", desc: "Official Elterngeld calculator and application guide" },
      { label: "BEEG — Gesetze im Internet", url: "https://www.gesetze-im-internet.de/beeg/", desc: "Federal Parental Allowance and Parental Leave Act full text" },
    ],
    severance: [
      { label: "KSchG — Kündigungsschutzgesetz", url: "https://www.gesetze-im-internet.de/kschg/", desc: "Protection Against Dismissal Act" },
      { label: "BMAS — Kündigung", url: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Kuendigung/kuendigung.html", desc: "Federal Ministry guide on dismissal procedures and notice periods" },
    ],
    working_time: [
      { label: "ArbZG — Arbeitszeitgesetz", url: "https://www.gesetze-im-internet.de/arbzg/", desc: "Working Time Act — maximum hours, rest periods, exceptions" },
      { label: "BUrlG — Bundesurlaubsgesetz", url: "https://www.gesetze-im-internet.de/burlg/", desc: "Federal Vacation Act — minimum entitlement rules" },
    ],
    contract: [
      { label: "NachwG — Nachweisgesetz (2022)", url: "https://www.gesetze-im-internet.de/nachweisgesetz/", desc: "Transparency in Employment Conditions Act (EU directive transposition)" },
      { label: "TzBfG — Befristungsgesetz", url: "https://www.gesetze-im-internet.de/tzbfg/", desc: "Part-Time and Fixed-Term Employment Act" },
    ],
    health_safety: [
      { label: "ArbSchG — Arbeitsschutzgesetz", url: "https://www.gesetze-im-internet.de/arbschg/", desc: "Occupational Health and Safety Act — employer duties" },
      { label: "DGUV", url: "https://www.dguv.de", desc: "German Social Accident Insurance — sector-specific prevention rules" },
    ],
    industrial: [
      { label: "BetrVG — Betriebsverfassungsgesetz", url: "https://www.gesetze-im-internet.de/betrvg/", desc: "Works Constitution Act — works council rights and composition" },
      { label: "DGB", url: "https://www.dgb.de", desc: "German Trade Union Confederation — collective agreement database" },
    ],
    residence: [
      { label: "BAMF — Fachkräfteeinwanderung", url: "https://www.bamf.de/DE/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Arbeit/arbeit-node.html", desc: "Federal Office for Migration — work visa types and requirements" },
      { label: "Make it in Germany", url: "https://www.make-it-in-germany.com", desc: "Official skilled worker immigration portal — Blue Card, Chancenkarte" },
    ],
    death: [{ label: "DRV — Hinterbliebenenrente", url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Familienstand-und-Rente/Hinterbliebenenrente/hinterbliebenenrente_node.html", desc: "Survivor pension eligibility and calculation guide" }],
    disability: [{ label: "DRV — Erwerbsminderungsrente", url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Erwerbsminderung/erwerbsminderung_node.html", desc: "Disability pension types, qualifying conditions, amounts" }],
    social: [{ label: "Bundesagentur für Arbeit", url: "https://www.arbeitsagentur.de", desc: "Federal Employment Agency — ALG I/II, Bürgergeld" }, { label: "BMAS — Bürgergeld", url: "https://www.bmas.de/DE/Arbeit/Buergergeld/buergergeld.html", desc: "Basic income support reform 2023" }],
    perquisites: [{ label: "BMF — Sachbezüge", url: "https://www.bundesfinanzministerium.de", desc: "Federal Finance Ministry guidance on non-cash benefits taxation" }],
    flexible: [{ label: "BMAS — bAV Entgeltumwandlung", url: "https://www.bmas.de/DE/Arbeit/betriebliche-altersvorsorge/betriebliche-altersvorsorge.html", desc: "Salary sacrifice for pension — rules and employer obligations" }],
  },
  FR: {
    pension: [
      { label: "Info-Retraite.fr", url: "https://www.info-retraite.fr", desc: "Official French inter-regime portal — personal pension estimates, career statements" },
      { label: "AGIRC-ARRCO", url: "https://www.agirc-arrco.fr", desc: "Supplementary pension scheme — points accrual, transfer rules, early retirement conditions" },
      { label: "Legifrance — CSS", url: "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006073189/", desc: "Code de la Sécurité Sociale — full statutory text" },
      { label: "Service-Public — Retraite", url: "https://www.service-public.fr/particuliers/vosdroits/N381", desc: "Official citizen guide to the 2023 reform, retirement conditions, and procedures" },
    ],
    social_security: [
      { label: "URSSAF", url: "https://www.urssaf.fr", desc: "Social contribution collection — rates, ceilings, declarations" },
      { label: "Ameli.fr", url: "https://www.ameli.fr", desc: "Assurance Maladie portal — health insurance rights and contributions" },
    ],
    medical: [
      { label: "Ameli.fr", url: "https://www.ameli.fr", desc: "CNAM official portal — reimbursement rates, ALD, complementary coverage rules" },
      { label: "Service-Public — Mutuelle Obligatoire", url: "https://www.service-public.fr/particuliers/vosdroits/F34966", desc: "Mandatory employer complementary health — ANI 2016 rules" },
    ],
    parental: [
      { label: "CAF — Congé maternité/paternité", url: "https://www.caf.fr", desc: "Family allowance fund — parental benefits calculator" },
      { label: "Service-Public — Congé parental", url: "https://www.service-public.fr/particuliers/vosdroits/F2280", desc: "Official guide to parental leave duration and allowances" },
    ],
    severance: [
      { label: "Code du Travail — Légifrance", url: "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072050/", desc: "Labour Code — dismissal procedures, notice periods, severance formula" },
      { label: "Service-Public — Licenciement", url: "https://www.service-public.fr/particuliers/vosdroits/N480", desc: "Official guide to dismissal procedures and indemnity calculation" },
    ],
    working_time: [
      { label: "Legifrance — Code du Travail L.3121", url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006195759/", desc: "Working time articles — 35-hour week, overtime, RTT rules" },
    ],
    contract: [{ label: "Service-Public — Contrat de travail", url: "https://www.service-public.fr/particuliers/vosdroits/N19871", desc: "Types of employment contracts, probation rules" }],
    health_safety: [{ label: "INRS", url: "https://www.inrs.fr", desc: "National Research and Safety Institute — DUER requirements, prevention" }],
    industrial: [{ label: "Legifrance — CSE", url: "https://www.legifrance.gouv.fr", desc: "Comité Social et Économique — thresholds, election rules, prerogatives" }],
    residence: [{ label: "Service-Public — Titre de séjour salarié", url: "https://www.service-public.fr/particuliers/vosdroits/N110", desc: "Work authorisation types for non-EU nationals" }],
    death: [{ label: "Retraite.com — Réversion", url: "https://www.info-retraite.fr", desc: "Survivor pension eligibility, income ceiling, reversion rate calculation" }],
    disability: [{ label: "Ameli — Invalidité", url: "https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation/arret-maladie-salarie/pension-invalidite", desc: "Disability pension categories and amounts" }],
    social: [{ label: "CAF — RSA & Prime d'activité", url: "https://www.caf.fr", desc: "RSA, activity bonus — eligibility and amounts" }],
    perquisites: [{ label: "URSSAF — Avantages en nature", url: "https://www.urssaf.fr/portail/home/employeur/calculer-les-cotisations/les-elements-entrant-dans-lassiette/les-avantages-en-nature.html", desc: "Non-cash benefits valuation and contribution rules" }],
    flexible: [{ label: "PER — Service-Public", url: "https://www.service-public.fr/particuliers/vosdroits/F34982", desc: "PER Collectif rules — salary sacrifice, tax treatment" }],
  },
  GB: {
    pension: [
      { label: "GOV.UK — New State Pension", url: "https://www.gov.uk/new-state-pension", desc: "State pension rates, qualifying years, deferral options, forecast tool" },
      { label: "The Pensions Regulator (TPR)", url: "https://www.thepensionsregulator.gov.uk", desc: "Auto-enrolment duties, contribution rates, master trust oversight" },
      { label: "MoneyHelper — Pension Wise", url: "https://www.moneyhelper.org.uk/en/pensions-and-retirement", desc: "Impartial guidance on pension options, tax-free cash, drawdown" },
      { label: "Check Your State Pension Forecast", url: "https://www.gov.uk/check-state-pension", desc: "Personal state pension forecast and NI contribution record" },
    ],
    social_security: [{ label: "GOV.UK — National Insurance", url: "https://www.gov.uk/national-insurance", desc: "NI contributions guide — rates, thresholds, credits" }],
    medical: [{ label: "NHS Overview", url: "https://www.nhs.uk/nhs-services/", desc: "NHS entitlements and services" }, { label: "GOV.UK — Statutory Sick Pay", url: "https://www.gov.uk/statutory-sick-pay", desc: "SSP rules, employer obligations" }],
    parental: [{ label: "GOV.UK — Maternity Pay", url: "https://www.gov.uk/maternity-pay-leave", desc: "SMP rates, eligibility, statutory leave rights" }, { label: "GOV.UK — Shared Parental Leave", url: "https://www.gov.uk/shared-parental-leave-and-pay", desc: "SPL rules, notification requirements" }],
    severance: [{ label: "GOV.UK — Redundancy Pay", url: "https://www.gov.uk/redundancy-your-rights", desc: "Statutory redundancy pay calculator, notice entitlements" }, { label: "ACAS", url: "https://www.acas.org.uk", desc: "Dismissal codes of practice, early conciliation, ET procedures" }],
    working_time: [{ label: "GOV.UK — Working Time Regulations", url: "https://www.gov.uk/maximum-weekly-working-hours", desc: "48-hour limit, opt-out rules, rest breaks" }, { label: "GOV.UK — Holiday Entitlement", url: "https://www.gov.uk/holiday-entitlement-rights", desc: "5.6 weeks statutory calculation, pay during leave" }],
    contract: [{ label: "GOV.UK — Written Statement", url: "https://www.gov.uk/employment-contracts-and-conditions", desc: "Day-1 written statement requirements since 2020" }],
    health_safety: [{ label: "HSE — Health and Safety Executive", url: "https://www.hse.gov.uk", desc: "Risk assessment guidance, RIDDOR reporting portal, sector regulations" }],
    industrial: [{ label: "GOV.UK — Trade Union Rights", url: "https://www.gov.uk/join-trade-union", desc: "Union recognition, collective bargaining, CAC procedures" }],
    residence: [{ label: "GOV.UK — Skilled Worker Visa", url: "https://www.gov.uk/skilled-worker-visa", desc: "Salary threshold, sponsorship requirements, points system" }],
    death: [{ label: "GOV.UK — Bereavement Support", url: "https://www.gov.uk/bereavement-support-payment", desc: "BSP lump sum and monthly payments — eligibility" }],
    disability: [{ label: "GOV.UK — PIP", url: "https://www.gov.uk/pip", desc: "Personal Independence Payment assessment criteria and rates" }],
    social: [{ label: "GOV.UK — Universal Credit", url: "https://www.gov.uk/universal-credit", desc: "UC standard allowance, work allowances, taper rates" }],
    perquisites: [{ label: "GOV.UK — Benefits in Kind", url: "https://www.gov.uk/employer-reporting-expenses-benefits", desc: "P11D reporting, BIK tax calculations for company cars, PMI" }],
    flexible: [{ label: "GOV.UK — Salary Sacrifice", url: "https://www.gov.uk/guidance/salary-sacrifice-and-the-effects-on-paye", desc: "HMRC guidance on salary sacrifice arrangements and NI savings" }],
  },
  IT: {
    pension: [
      { label: "INPS — Pensioni", url: "https://www.inps.it/it/it/dettaglio-scheda.schede-servizio-e-prestazioni.schede-prestazioni.pensioni-dirette-5616.html", desc: "INPS official pension portal — NDC calculations, application, extracts" },
      { label: "COVIP — Fondi Pensione", url: "https://www.covip.it", desc: "Pension fund supervisor — registered funds list, portability rules, performance data" },
      { label: "Legge 335/1995 — Riforma Dini", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1995-08-08;335", desc: "NDC system reform — contributivo calculation rules" },
      { label: "Legge 214/2011 — Riforma Fornero", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2011-12-22;214", desc: "2011 Fornero reform — transition to full NDC, new retirement ages" },
    ],
    social_security: [{ label: "INPS", url: "https://www.inps.it", desc: "All SS branches — contributions, benefits, DM declarations" }],
    medical: [{ label: "Ministero Salute — SSN", url: "https://www.salute.gov.it/portale/lea/homeLea.jsp", desc: "LEA (essential healthcare levels) definition and regional delivery" }],
    parental: [{ label: "INPS — Maternità e paternità", url: "https://www.inps.it/it/it/dettaglio-scheda.schede-servizio-e-prestazioni.schede-prestazioni.maternita-e-paternita.html", desc: "Maternity/paternity leave rates, parental leave calculator" }],
    severance: [{ label: "INPS — TFR", url: "https://www.inps.it", desc: "TFR rules — accrual, advance payment, fund destination choice" }, { label: "D.Lgs. 23/2015 — Jobs Act", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2015-03-04;23", desc: "Dismissal protection reform — compensation scale" }],
    working_time: [{ label: "D.Lgs. 66/2003", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-04-08;66", desc: "Working time decree — maximum hours, overtime limits, rest periods" }],
    contract: [{ label: "D.Lgs. 81/2015 — Jobs Act", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2015-06-15;81", desc: "Labour contracts reform — types, fixed-term rules, apprenticeship" }],
    health_safety: [{ label: "D.Lgs. 81/2008 — Testo Unico Sicurezza", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2008-04-09;81", desc: "Consolidated occupational health & safety text" }],
    industrial: [{ label: "CNEL — Archivio CCNL", url: "https://www.cnel.it/Contratti-Collettivi", desc: "National collective agreement archive — all sectors" }],
    residence: [{ label: "Polizia di Stato — Permesso soggiorno", url: "https://www.poliziadistato.it/articolo/10787", desc: "Residence permit application and renewal procedures" }],
    death: [{ label: "INPS — Pensioni ai superstiti", url: "https://www.inps.it", desc: "Survivor pension rates, income reduction thresholds" }],
    disability: [{ label: "INPS — Invalidità civile", url: "https://www.inps.it/it/it/dettaglio-scheda.schede-servizio-e-prestazioni.schede-prestazioni.invalidita-civile-cecita-civile-sordomutismo.html", desc: "Disability assessment and benefit types" }],
    social: [{ label: "INPS — NASpI", url: "https://www.inps.it/it/it/dettaglio-scheda.schede-servizio-e-prestazioni.schede-prestazioni.nuova-prestazione-di-assicurazione-sociale-per-l-impiego---naspi.html", desc: "Unemployment benefit calculator and application" }],
    perquisites: [{ label: "Agenzia Entrate — Fringe Benefits", url: "https://www.agenziaentrate.gov.it", desc: "TUIR Art.51 — non-cash benefit thresholds, tax treatment" }],
    flexible: [{ label: "ADAPT — Welfare aziendale", url: "https://adapt.it/adapt-indice-a-z/welfare-aziendale/", desc: "Company welfare plans — Art.51 TUIR exemptions and case studies" }],
  },
  ES: {
    pension: [
      { label: "Seguridad Social — Pensiones", url: "https://www.seg-social.es/wps/portal/wss/internet/Pensionistas", desc: "Official SS portal — pension simulator, contribution query, retirement procedures" },
      { label: "MITRAMISS — Pensión de jubilación", url: "https://www.mites.gob.es", desc: "Ministry guide — 2021 reform, regulatory base calculation, MEI contribution" },
      { label: "LGSS — BOE", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724", desc: "General Social Security Act (RDL 8/2015) full text" },
      { label: "Ley 21/2021 — Reforma pensiones", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2021-21652", desc: "2021 pension reform — CPI restoration, sustainability factor suspension" },
    ],
    social_security: [{ label: "TGSS", url: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores", desc: "Treasury General of SS — contribution bases, rates, registration" }],
    medical: [{ label: "Ministerio Sanidad — SNS", url: "https://www.sanidad.gob.es/organizacion/sns/home.htm", desc: "National Health System — common benefit portfolio, regional delivery" }],
    parental: [{ label: "Seguridad Social — Maternidad/Paternidad", url: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/PrestacionesPension/10574", desc: "Equal 16-week parental leave — calculation and application" }],
    severance: [{ label: "Estatuto de los Trabajadores — BOE", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430", desc: "ET full text — Art.53-56 objective/disciplinary dismissal, indemnity formula" }, { label: "SMAC — Conciliación laboral", url: "https://www.mites.gob.es/es/Guia/texto/guia_10/contenidos/guia_10_39_1.htm", desc: "Pre-litigation conciliation procedure" }],
    working_time: [{ label: "ET — Jornada laboral", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430", desc: "ET Art.34-38 — working hours, overtime, vacation" }],
    contract: [{ label: "RDL 32/2021 — Reforma laboral", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2021-21828", desc: "2021 labour reform — end of precarious contracts, fijo-discontinuo" }],
    health_safety: [{ label: "LPRL — Ley 31/1995", url: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292", desc: "Occupational Risk Prevention Law — full text" }, { label: "INSST", url: "https://www.insst.es", desc: "National Institute of Safety and Health at Work — technical guides" }],
    industrial: [{ label: "CCOO", url: "https://www.ccoo.es", desc: "Comisiones Obreras — largest union, collective agreement database" }, { label: "UGT", url: "https://www.ugt.es", desc: "Second largest union — CLA negotiations, labour rights guides" }],
    residence: [{ label: "Extranjería — Ministerio Interior", url: "https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/extranjeria/", desc: "Work and residence permits — types, quota decree" }],
    death: [{ label: "Seguridad Social — Viudedad", url: "https://www.seg-social.es/wps/portal/wss/internet/Pensionistas/Pensiones/10558", desc: "Survivor pension — income test, cohabitation conditions" }],
    disability: [{ label: "Seguridad Social — Incapacidad Permanente", url: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/PrestacionesPension/10576", desc: "IP types — parcial/total/absoluta/gran invalidez calculation" }],
    social: [{ label: "SEPE — Desempleo", url: "https://www.sepe.es/HomeSepe/Personas/distributiva-prestaciones/prestaciones-contributivas-desempleo.html", desc: "Unemployment benefit calculator, application, duration" }, { label: "IMV — INSS", url: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/PrestacionesPension/IMV", desc: "Minimum Vital Income — 2020 reform, amounts, family units" }],
    perquisites: [{ label: "AEAT — Retribuciones en especie", url: "https://www.agenciatributaria.es", desc: "IRPF Art.42-43 — non-cash benefit valuation and exemptions" }],
    flexible: [{ label: "AEAT — Retribución flexible", url: "https://www.agenciatributaria.es", desc: "Cafeteria plan rules — IRPF optimization conditions" }],
  },
  NL: {
    pension: [
      { label: "SVB — AOW", url: "https://www.svb.nl/nl/aow", desc: "Social Insurance Bank — AOW entitlement, deferral, international aspects" },
      { label: "Pensioenfederatie", url: "https://www.pensioenfederatie.nl", desc: "Pension Federation — sector fund directory, WTP reform guidance" },
      { label: "Rijksoverheid — WTP Toekomst Pensioenen", url: "https://www.rijksoverheid.nl/onderwerpen/pensioen/toekomst-pensioenstelsel", desc: "Future Pensions Act (WTP) — transition timeline, new contract types" },
      { label: "MijnPensioenoverzicht.nl", url: "https://www.mijnpensioenoverzicht.nl", desc: "Personal pension overview — total pension forecast across all schemes" },
    ],
    social_security: [{ label: "UWV", url: "https://www.uwv.nl", desc: "Employee Insurance Agency — WW, WIA, ZW administration" }, { label: "SVB", url: "https://www.svb.nl", desc: "Volksverzekeringen — AOW, ANW, AKW administration" }],
    medical: [{ label: "Rijksoverheid — Zorgverzekering", url: "https://www.rijksoverheid.nl/onderwerpen/zorgverzekering", desc: "Basic insurance package, premium, deductible rules" }],
    parental: [{ label: "UWV — Zwangerschapsverlof", url: "https://www.uwv.nl/particulieren/zwanger-adoptie-pleegzorg/index.aspx", desc: "Maternity/paternity/parental leave — 70% WIEG benefit payment" }],
    severance: [{ label: "Rijksoverheid — Transitievergoeding", url: "https://www.rijksoverheid.nl/onderwerpen/ontslag/transitievergoeding", desc: "Transition payment calculator, maximum, exceptions" }, { label: "UWV — Ontslag", url: "https://www.uwv.nl/werkgevers/werknemer-ontslaan/index.aspx", desc: "UWV dismissal route — procedures, timelines" }],
    working_time: [{ label: "Arbeidstijdenwet — Overheid.nl", url: "https://wetten.overheid.nl/BWBR0007671/", desc: "Working Time Act full text — maximum hours, rest periods" }],
    contract: [{ label: "WAB 2020 — Overheid.nl", url: "https://wetten.overheid.nl/BWBR0043411/", desc: "Balanced Labour Market Act — ketenregeling, payroll, flex work rules" }],
    health_safety: [{ label: "Inspectie SZW", url: "https://www.inspectieszw.nl", desc: "Labour Authority — RI&E requirements, Arbowet enforcement" }],
    industrial: [{ label: "WOR — Overheid.nl", url: "https://wetten.overheid.nl/BWBR0002747/", desc: "Works Council Act — rights, composition, election procedures" }],
    residence: [{ label: "IND — Kennismigrant", url: "https://ind.nl/nl/werk/kennismigrant", desc: "Knowledge migrant visa — salary threshold 2024, employer recognition" }],
    death: [{ label: "SVB — ANW", url: "https://www.svb.nl/nl/anw", desc: "Survivor benefit — eligibility, income test, transitional rules" }],
    disability: [{ label: "UWV — WIA", url: "https://www.uwv.nl/particulieren/ziek/na-104-weken-ziek/wia/index.aspx", desc: "WIA — IVA vs WGA, assessment process, benefit calculation" }],
    social: [{ label: "Rijksoverheid — WW", url: "https://www.rijksoverheid.nl/onderwerpen/ww-uitkering", desc: "Unemployment benefit — entitlement, duration, work history requirements" }],
    perquisites: [{ label: "Belastingdienst — WKR", url: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/personeel_en_loon/werkkostenregeling/", desc: "Work-related costs scheme — free space calculation, final levy" }],
    flexible: [{ label: "Belastingdienst — Cafetariaregeling", url: "https://www.belastingdienst.nl", desc: "Tax rules for salary exchange — conditions for valid trade-offs" }],
  },
  SE: {
    pension: [
      { label: "Pensionsmyndigheten", url: "https://www.pensionsmyndigheten.se", desc: "Swedish Pensions Agency — income/premium pension, guarantee pension, personal forecast" },
      { label: "Minpension.se", url: "https://www.minpension.se", desc: "Total pension overview — state + occupational combined forecast" },
      { label: "Collectum — ITP", url: "https://www.collectum.se", desc: "ITP white-collar occupational pension — ITP1 (DC) and ITP2 (DB) details" },
      { label: "SFB — Riksdagen", url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/socialforsakringsbalk-2010110_sfs-2010-110/", desc: "Social Insurance Code — full statutory text" },
    ],
    social_security: [{ label: "Försäkringskassan", url: "https://www.forsakringskassan.se", desc: "Social Insurance Agency — all benefit applications and guidance" }],
    medical: [{ label: "1177 Vårdguiden", url: "https://www.1177.se", desc: "Regional healthcare portal — patient fees, services" }],
    parental: [{ label: "Försäkringskassan — Föräldrapenning", url: "https://www.forsakringskassan.se/privatpersoner/foralder/nar-barnet-ar-fott/foraldrapenning", desc: "480 days parental allowance — levels, earmarking, calculation" }],
    severance: [{ label: "LAS — Riksdagen", url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1982-80-om-anstallningsskydd_sfs-1982-80/", desc: "Employment Protection Act — notice periods, turordning (LIFO)" }, { label: "TRR Trygghetsrådet", url: "https://www.trr.se", desc: "White-collar retraining fund — outplacement support" }],
    working_time: [{ label: "Arbetstidslagen — Riksdagen", url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/arbetstidslag-1982673_sfs-1982-673/", desc: "Working Time Act — limits, overtime, compensatory rest" }],
    contract: [{ label: "LAS 2022 revision", url: "https://www.riksdagen.se", desc: "2022 LAS reform — abolition of general fixed-term (ALVA), new special fixed-term" }],
    health_safety: [{ label: "Arbetsmiljöverket", url: "https://www.av.se", desc: "Swedish Work Environment Authority — AML, AFS regulations, inspection" }],
    industrial: [{ label: "LO", url: "https://www.lo.se", desc: "Swedish Trade Union Confederation (blue collar) — CLA database" }, { label: "Medlingsinstitutet", url: "https://www.mi.se", desc: "National Mediation Office — collective agreement statistics" }],
    residence: [{ label: "Migrationsverket — Arbetstillstånd", url: "https://www.migrationsverket.se/Privatpersoner/Arbeta-i-Sverige.html", desc: "Work permit — employer sponsorship, 4-year to PR pathway" }],
    death: [{ label: "Försäkringskassan — Efterlevandepension", url: "https://www.forsakringskassan.se/privatpersoner/separation-och-dodsfall/nar-nagon-dor", desc: "Survivor benefits — barnpension, änkepension rules" }],
    disability: [{ label: "Försäkringskassan — Sjukersättning", url: "https://www.forsakringskassan.se/privatpersoner/sjuk/sjukersattning-och-aktivitetsersattning", desc: "Disability benefit — permanent and activity compensation" }],
    social: [{ label: "Arbetsförmedlingen", url: "https://www.arbetsformedlingen.se", desc: "Public Employment Service — a-kassa, activation requirements" }],
    perquisites: [{ label: "Skatteverket — Förmåner", url: "https://www.skatteverket.se/foretagochorganisationer/arbetsgivare/lonochersattning/formaner.html", desc: "Non-cash benefits taxation — company car, wellness, meals" }],
    flexible: [{ label: "Skatteverket — Löneväxling", url: "https://www.skatteverket.se", desc: "Salary sacrifice to pension — conditions, social security implications" }],
  },
  CH: {
    pension: [
      { label: "AHV-IV — Ihre AHV-Rente", url: "https://www.ahv-iv.ch/de/Sozialversicherungen/Alters-und-Hinterlassenenversicherung-AHV/Renten", desc: "Official AHV portal — rent calculation, contribution history, gaps" },
      { label: "BSV — Berufliche Vorsorge (BVG)", url: "https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/bv.html", desc: "Federal Social Insurance Office — BVG minimum standards, coordination deduction, conversion rate" },
      { label: "AHVG — Fedlex", url: "https://www.fedlex.admin.ch/eli/cc/1952/1021_1046_1050/de", desc: "AHV Act full text" },
      { label: "BVG — Fedlex", url: "https://www.fedlex.admin.ch/eli/cc/1983/797_797_797/de", desc: "Occupational Pension Act (LPP/BVG) full text" },
    ],
    social_security: [{ label: "BSV — Übersicht Sozialversicherungen", url: "https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen.html", desc: "Federal overview of all Swiss social insurance branches" }],
    medical: [{ label: "BAG — Krankenversicherung", url: "https://www.bag.admin.ch/bag/de/home/versicherungen/krankenversicherung.html", desc: "Federal Health Office — KVG rules, basic package (LAMal), premium regions" }],
    parental: [{ label: "BSV — Mutterschafts/Vaterschaftsentschädigung", url: "https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/eo-msv/grundlagen-und-gesetze/mutterschaft.html", desc: "EO maternity/paternity allowance — 14/2 weeks, 80% cap" }],
    severance: [{ label: "OR Art.335 — Fedlex", url: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de", desc: "Swiss Code of Obligations — notice periods, unfair dismissal compensation" }],
    working_time: [{ label: "ArG — Fedlex", url: "https://www.fedlex.admin.ch/eli/cc/1966/57_57_57/de", desc: "Labour Act — maximum working hours, rest periods by sector" }],
    contract: [{ label: "OR Art.319-362 — Fedlex", url: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de", desc: "Contract of Employment — Swiss Code of Obligations provisions" }],
    health_safety: [{ label: "SUVA", url: "https://www.suva.ch", desc: "National accident insurance fund — UVG, sector rates, prevention" }],
    industrial: [{ label: "Seco — Arbeitsrecht", url: "https://www.seco.admin.ch/seco/de/home/Arbeit/Arbeitsbedingungen/Arbeitsrecht.html", desc: "State Secretariat for Economic Affairs — labour law overview" }],
    residence: [{ label: "SEM — Aufenthalt und Arbeit", url: "https://www.sem.admin.ch/sem/de/home/arbeit.html", desc: "State Secretariat for Migration — permit types, EU bilateral agreements" }],
    death: [{ label: "AHV — Witwenrente", url: "https://www.ahv-iv.ch/de/Sozialversicherungen/Alters-und-Hinterlassenenversicherung-AHV/Hinterlassenenrenten", desc: "AHV survivor pension — widow/widower/orphan conditions" }],
    disability: [{ label: "IV — Invalidenversicherung", url: "https://www.ahv-iv.ch/de/Sozialversicherungen/Invalidenversicherung-IV", desc: "IV — disability degree assessment, integration priority, pension amounts" }],
    social: [{ label: "SECO — Arbeitslosenversicherung", url: "https://www.seco.admin.ch/seco/de/home/Arbeit/Arbeitslosenversicherung.html", desc: "ALV — qualifying days, daily rate calculation, max duration" }],
    perquisites: [{ label: "ESTV — Spesenwesen", url: "https://www.estv.admin.ch/estv/de/home/direkte-bundessteuer/dbst/fachinformationen/steuerpflichtige-personen/unselbstaendig-erwerbende/spesen.html", desc: "Federal Tax Administration — expense regulations, company car rules" }],
    flexible: [{ label: "BSV — Pillar 3a", url: "https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/bv/grundlagen-und-gesetze/saeule-3a.html", desc: "Tax-privileged private savings — annual limits, investment options" }],
  },
  BE: {
    pension: [
      { label: "MyPension.be", url: "https://www.mypension.be", desc: "Official pension portal — personal statement, career overview, simulator" },
      { label: "ONPRVP — Pensionsamt", url: "https://www.onprvp.fgov.be", desc: "National Pension Office — WAP rules, GRAPA, pension bonus" },
      { label: "WAP/LPC — Belgisch Staatsblad", url: "https://www.ejustice.just.fgov.be", desc: "Supplementary Pension Act 2003 full text" },
      { label: "FSMA — Aanvullend pensioen", url: "https://www.fsma.be/nl/pensioenen", desc: "Financial regulator — DB/DC pension fund oversight, WAP compliance" },
    ],
    social_security: [{ label: "RSZ/ONSS", url: "https://www.rsz.fgov.be", desc: "National Social Security Office — contribution rates, declaration obligations" }],
    medical: [{ label: "RIZIV/INAMI", url: "https://www.riziv.fgov.be", desc: "Health insurance institute — nomenclature, reference fees, mutuality rules" }],
    parental: [{ label: "RVA/ONEM — Ouderschapsverlof", url: "https://www.rva.be/nl/documentatie/infoblad/t2", desc: "Parental leave allowance — 4 months per parent, 88% RVA payment" }],
    severance: [{ label: "Wet 3/7/1978 — Arbeidsovereenkomst", url: "https://www.ejustice.just.fgov.be", desc: "Employment Contracts Act — dismissal rules" }, { label: "Wet 26/12/2013 — Eenheidsstatuut", url: "https://www.ejustice.just.fgov.be", desc: "Single statute reform — unified notice periods for workers/employees" }],
    working_time: [{ label: "Arbeidswet 16/3/1971", url: "https://www.ejustice.just.fgov.be", desc: "Labour Act — working time limits, overtime premiums, double vacation pay" }],
    contract: [{ label: "Arbeidsovereenkomstenwet 3/7/1978", url: "https://www.ejustice.just.fgov.be", desc: "Employment Contracts Act — trial period abolished, fixed-term rules" }],
    health_safety: [{ label: "Wet Welzijn 4/8/1996", url: "https://www.ejustice.just.fgov.be", desc: "Well-being at Work Act — prevention hierarchy, IDPB/EDPB obligations" }],
    industrial: [{ label: "CNT/NAR", url: "https://www.cnt-nar.be", desc: "National Labour Council — collective agreements, jurisprudence" }, { label: "FOD WASO", url: "https://employment.belgium.be", desc: "Federal Labour Ministry — social elections, CLA enforcement" }],
    residence: [{ label: "IBZ — Gecombineerde vergunning", url: "https://dofi.ibz.be", desc: "Single permit — combined work + residence for non-EU nationals" }],
    death: [{ label: "MyPension — Overlevingspensioen", url: "https://www.mypension.be", desc: "Survivor pension — age conditions, income ceiling, WAP death capital" }],
    disability: [{ label: "RIZIV — Invaliditeit", url: "https://www.riziv.fgov.be/nl/professionals/zorgverstrekkers/artsen/adviserend-arts/Paginas/invaliditeitsbeoordeling.aspx", desc: "Disability assessment — primary incapacity vs. invalidité from year 2" }],
    social: [{ label: "RVA/ONEM — Werkloosheid", url: "https://www.rva.be", desc: "Unemployment benefit — degressive system, qualification conditions" }],
    perquisites: [{ label: "RSZ — Maaltijdcheques", url: "https://www.rsz.fgov.be/nl/themas/loon/voordelen-alle-aard/maaltijdcheques", desc: "Meal vouchers — €8/day exemption, electronic obligation" }],
    flexible: [{ label: "CAO 90 — CNT/NAR", url: "https://www.cnt-nar.be/CAO-ORIG/cao-090-(30-09-2008).pdf", desc: "CLA 90 — non-recurring results bonus (profit sharing scheme)" }],
  },
  AT: {
    pension: [
      { label: "Pensionsversicherungsanstalt (PVA)", url: "https://www.pensionsversicherung.at", desc: "Official pension insurer — Kontenmodell statements, retirement calculator, application" },
      { label: "BMSGPK — Pensionen", url: "https://www.sozialministerium.at/Themen/Soziales/Pensionen-und-Ruhebezüge.html", desc: "Federal Social Ministry — retirement age timetable, Schwerarbeit rules" },
      { label: "ASVG — RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008147", desc: "Social Security General Act — full statutory text" },
      { label: "BMSVG — Abfertigung Neu", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20001919", desc: "Severance and Betriebliche Vorsorgekasse Act" },
    ],
    social_security: [{ label: "Hauptverband — SV", url: "https://www.sozialversicherung.at", desc: "Main Association of Austrian Social Insurance — contribution rates, limits" }],
    medical: [{ label: "ÖGK — Österreichische Gesundheitskasse", url: "https://www.gesundheitskasse.at", desc: "Merged statutory health insurer — benefits, Wahlarzt reimbursement" }],
    parental: [{ label: "BMSGPK — Kinderbetreuungsgeld", url: "https://www.bundeskanzleramt.gv.at/agenda/frauen-und-gleichstellung/familienpolitik.html", desc: "Child-care benefit models — flat-rate vs. income-related, duration options" }],
    severance: [{ label: "AngG — RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008044", desc: "Employees Act — notice periods for Angestellte" }, { label: "BMSVG — MVK", url: "https://www.ris.bka.gv.at", desc: "Betriebliche Mitarbeitervorsorgekasse — Abfertigung Neu portable accounts" }],
    working_time: [{ label: "AZG — RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008104", desc: "Working Time Act — daily/weekly limits, flexible working arrangements" }],
    contract: [{ label: "AVRAG — RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008061", desc: "Employment Contract Law Adaptation Act" }],
    health_safety: [{ label: "ASchG — RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008927", desc: "Workers Protection Act — Präventivfachkräfte, Evaluierung" }, { label: "AUVA", url: "https://www.auva.at", desc: "General Accident Insurance — UVG, accident reporting, rehabilitation" }],
    industrial: [{ label: "AK — Arbeiterkammer", url: "https://www.arbeiterkammer.at", desc: "Chamber of Labour — CLA database, labour rights guides" }, { label: "ArbVG — RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008102", desc: "Labour Constitution Act — Betriebsrat rights and procedures" }],
    residence: [{ label: "BMI — Rot-Weiß-Rot Karte", url: "https://www.migration.gv.at/en/living-and-working-in-austria/", desc: "Red-White-Red Card — points requirements, eligible professions" }],
    death: [{ label: "PVA — Hinterbliebenenpension", url: "https://www.pensionsversicherung.at/cdscontent/?contentid=10007.726671", desc: "Austrian survivor pension — unique income-ratio calculation" }],
    disability: [{ label: "PVA — Invalidität/Berufsunfähigkeit", url: "https://www.pensionsversicherung.at", desc: "Disability pension — reference profession test, Rehageld alternative" }],
    social: [{ label: "AMS — Arbeitslosengeld", url: "https://www.ams.at/arbeitnehmerinnen/bei-arbeitslosigkeit", desc: "AMS — unemployment benefit rates, qualifying conditions, Notstandshilfe" }],
    perquisites: [{ label: "BMF — Lohnsteuer Sachbezüge", url: "https://www.bmf.gv.at/steuern/selbststaendige-unternehmer/lohnabgaben/sachbezuege.html", desc: "Non-cash benefits taxable values — SachbezugsVO thresholds" }],
    flexible: [{ label: "WKO — Pensionskasse", url: "https://www.wko.at/service/wirtschaftsrecht-gewerberecht/pensionskassen.html", desc: "Corporate pension funds — employer contribution deductibility rules" }],
  },
  DK: {
    pension: [
      { label: "ATP.dk", url: "https://www.atp.dk", desc: "Supplementary Labour Market Pension — flat contributions, death cover, disability" },
      { label: "Borger.dk — Folkepension", url: "https://www.borger.dk/pension-og-efterloen/folkepension", desc: "State pension — eligibility, income test, early retirement (Arne-pension)" },
      { label: "Forsikring & Pension", url: "https://www.forsikringogpension.dk", desc: "Industry association — sector pension fund statistics, WTP-equivalent Danish rules" },
      { label: "PensionsInfo.dk", url: "https://www.pensionsinfo.dk", desc: "Personal total pension overview — all sector funds combined" },
    ],
    social_security: [{ label: "Borger.dk — Dagpenge", url: "https://www.borger.dk/arbejde-dagpenge-ferie/Dagpenge-og-efterloen/Dagpenge", desc: "Unemployment insurance — a-kasse membership, rates" }],
    medical: [{ label: "Sundhed.dk", url: "https://www.sundhed.dk", desc: "Danish health portal — GP, hospital referrals, regional services" }],
    parental: [{ label: "Borger.dk — Barsel", url: "https://www.borger.dk/familie-og-boern/Barsel", desc: "2022 parental leave reform — 48 weeks, earmarking, dagpenge rates" }],
    severance: [{ label: "Funktionærloven — Retsinformation", url: "https://www.retsinformation.dk/eli/lta/2019/82", desc: "Salaried Employees Act — notice periods, severance entitlements" }],
    working_time: [{ label: "Ferieloven 2018 — Retsinformation", url: "https://www.retsinformation.dk/eli/lta/2019/1325", desc: "Concurrent holiday system — earn and spend in same year" }],
    contract: [{ label: "Ansættelsesbevisloven — Retsinformation", url: "https://www.retsinformation.dk/eli/lta/2010/240", desc: "Employment Evidence Act — written statement within 7 days" }],
    health_safety: [{ label: "Arbejdstilsynet", url: "https://at.dk", desc: "Working Environment Authority — APV, sector risk assessments" }],
    industrial: [{ label: "FH — Fagbevægelsens Hovedorganisation", url: "https://www.fho.dk", desc: "Danish Trade Union Confederation — CLA coverage statistics" }, { label: "DA — Dansk Arbejdsgiverforening", url: "https://www.da.dk", desc: "Confederation of Danish Employers — bipartite labour market model" }],
    residence: [{ label: "SIRI — Styrelsen for International Rekruttering", url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme", desc: "Work permit schemes — Pay Limit, Positive List, Fast Track" }],
    death: [{ label: "ATP — Dødsfald", url: "https://www.atp.dk/privat/naar-nogen-dor", desc: "ATP death payment and sector pension death cover" }],
    disability: [{ label: "Borger.dk — Førtidspension", url: "https://www.borger.dk/pension-og-efterloen/Foertidspension-og-fleksjob/Foertidspension", desc: "Early disability pension — strict criteria, rehab team assessment" }],
    social: [{ label: "Borger.dk — Kontanthjælp", url: "https://www.borger.dk/arbejde-dagpenge-ferie/Kontanthjaelp", desc: "Social assistance — municipal administration, activation" }],
    perquisites: [{ label: "SKAT — Personalegoder", url: "https://skat.dk/erhverv/aarbog-og-statistik/personalegoder", desc: "Staff benefits taxation — company car 25% rule, health insurance BIK" }],
    flexible: [{ label: "SKAT — Cafeteriaordning", url: "https://skat.dk", desc: "Cafeteria arrangement — salary sacrifice conditions, pension contribution" }],
  },
  PT: {
    pension: [
      { label: "Segurança Social — Pensão de velhice", url: "https://www.seg-social.pt/pensao-de-velhice", desc: "Official SS portal — career query, pension simulator, procedures" },
      { label: "ISS.IP — Centro Nacional de Pensões", url: "https://www.seg-social.pt/centros-nacionais-de-pensoes", desc: "National Pension Centre — accrual rates, sustainability factor" },
      { label: "DL 187/2007 — DRE", url: "https://dre.pt/dre/detalhe/decreto-lei/187-2007-641817", desc: "Pension calculation regulation — career average formula, sustainability factor" },
      { label: "ASF — PPR Fundos de Pensões", url: "https://www.asf.com.pt", desc: "Insurance and pension supervisor — PPR rules, fund performance" },
    ],
    social_security: [{ label: "Segurança Social — Contribuições", url: "https://www.seg-social.pt/taxa-contributiva", desc: "TSU contribution rates — employee/employer by contract type" }],
    medical: [{ label: "SNS — Portal da Saúde", url: "https://www.sns.gov.pt", desc: "National Health Service — LEA (care levels), access rights, co-payments" }],
    parental: [{ label: "Segurança Social — Parentalidade", url: "https://www.seg-social.pt/parentalidade", desc: "Parental benefits — maternity/paternity equivalence, bonus days, amounts" }],
    severance: [{ label: "Código do Trabalho — DRE", url: "https://dre.pt/dre/legislacao-consolidada/lei/2009-34546475", desc: "Labour Code — notice periods (Art.363), compensation formula (Art.366)" }],
    working_time: [{ label: "CT — Organização do tempo de trabalho", url: "https://dre.pt", desc: "CT Art.197-229 — working hours, overtime premiums, 4-day week pilot" }],
    contract: [{ label: "Código do Trabalho — L.7/2009", url: "https://dre.pt/dre/legislacao-consolidada/lei/2009-34546475", desc: "Employment contract types, probation periods, fixed-term rules" }],
    health_safety: [{ label: "Lei 102/2009 — DRE", url: "https://dre.pt/dre/detalhe/lei/102-2009-491595", desc: "Safety and Health at Work Framework Law" }, { label: "ACT — Autoridade Condições Trabalho", url: "https://www.act.gov.pt", desc: "Labour Inspectorate — enforcement, reporting obligations" }],
    industrial: [{ label: "DGERT — Convenções coletivas", url: "https://www.dgert.gov.pt/convencoes-coletivas-de-trabalho", desc: "Official CLA register — sector and company agreements" }],
    residence: [{ label: "SEF/AIMA — Autorização de residência", url: "https://www.sef.pt", desc: "Immigration authority — Digital Nomad D8 visa, work residency" }],
    death: [{ label: "Segurança Social — Sobrevivência", url: "https://www.seg-social.pt/pensao-de-sobrevivencia", desc: "Survivor pension — 60% rate, de facto union rules, lump sum" }],
    disability: [{ label: "Segurança Social — Invalidez", url: "https://www.seg-social.pt/pensao-de-invalidez", desc: "Disability pension types — relative/absolute, qualifying contributions" }],
    social: [{ label: "Segurança Social — Desemprego", url: "https://www.seg-social.pt/subsidio-de-desemprego", desc: "Unemployment benefit — qualifying days, duration, calculation" }],
    perquisites: [{ label: "AT — Benefícios em espécie", url: "https://www.portaldasfinancas.gov.pt", desc: "Tax authority — IRS Art.2 non-cash benefit valuation rules" }],
    flexible: [{ label: "AT — PPR deduções", url: "https://www.portaldasfinancas.gov.pt", desc: "PPR tax deductions — age-based limits, penalty-free withdrawal conditions" }],
  },
};

const FIELD_LABELS = {
  system: "System Structure", type: "System Type", retirementAge: "Retirement Age",
  earlyRetirement: "Early Retirement", lateRetirement: "Late Retirement Incentive",
  qualifyingPeriod: "Qualifying Period", employerContrib: "Employer Contribution",
  employeeContrib: "Employee Contribution", ceiling: "Contribution Ceiling / Cap",
  formula: "Benefit Formula", indexation: "Indexation Mechanism",
  minPension: "Minimum Pension / Safety Net", maxPension: "Maximum Pension",
  pillar2: "2nd Pillar (Occupational)", pillar3: "3rd Pillar (Private)",
  recentReforms: "Recent Reforms (2020–2024)", taxation: "Taxation Treatment",
  keyLaw: "Key Legislation", overview: "System Overview", branches: "Insurance Branches",
  totalEmployee: "Total Employee Contributions", totalEmployer: "Total Employer Contributions",
  spousePension: "Spouse / Survivor Pension", orphanPension: "Orphan Pension",
  lumpSum: "Lump Sum / Death Grant", conditions: "Eligibility Conditions",
  amount: "Benefit Amount", qualifying: "Qualifying Conditions",
  duration: "Duration", contribution: "Contribution", private: "Private Insurance",
  coverage: "Coverage", maternity: "Maternity Leave", paternity: "Paternity Leave",
  parentalLeave: "Parental Leave", childcare: "Childcare Support",
  unemployment: "Unemployment Benefit", socialAssistance: "Social Assistance",
  childBenefit: "Child Benefit", commonBenefits: "Common Employer Benefits",
  taxFree: "Tax-Free Benefit Rules", companyPension: "Company Pension",
  cafeteria: "Cafeteria / Flexible Plan", commonModels: "Typical Models",
  notice: "Notice Period", severance: "Severance Payment", protection: "Employment Protection",
  maxHours: "Maximum Working Hours", overtime: "Overtime Rules",
  vacation: "Annual Vacation Entitlement", publicHolidays: "Public Holidays",
  eu: "EU Citizens", nonEu: "Non-EU Citizens", forms: "Contract Forms",
  probation: "Probation Period", written: "Written Form Requirements",
  framework: "Legal Framework", occupationalDoctor: "Occupational Doctor",
  reporting: "Accident Reporting", tradeUnions: "Trade Unions",
  worksCouncil: "Works Council / Employee Reps", boardLevel: "Board-Level Representation",
};

// Compact DATA (same as before - abbreviating for space, keeping all fields)
const DATA = {
  DE: {
    pension: { system:"Three-pillar: Statutory (GRV) + Occupational (bAV) + Private",type:"Points-based PAYG (Entgeltpunkte system)",retirementAge:"67 (born after 1964); transitional step-up applies",earlyRetirement:"63 with 45 contribution years (Langzeitversicherte); 63 with 35yr with reduction −0.3%/month",lateRetirement:"+0.5% per month deferred beyond statutory age (max +18% for 3yr deferral)",qualifyingPeriod:"5 years minimum; 35yr for early; 45yr for full early pension",employerContrib:"9.3% of gross salary up to BBG ceiling (€7,550/mo, 2024)",employeeContrib:"9.3% of gross salary up to BBG ceiling",ceiling:"€90,600/yr (West) / €89,400/yr (East) 2024",formula:"Points × Pension Value (€37.60 W / €37.43 E) × Access Factor × Type Factor",indexation:"Wage-indexed; Nachhaltigkeitsfaktor (sustainability factor) adjusts for contributor/pensioner ratio",minPension:"No statutory minimum pension; Grundrente supplement for 33+ yrs with low earnings",maxPension:"~€2,800/mo for full career at ceiling; capped by BBG",pillar2:"bAV: 5 vehicles (Direktversicherung, Pensionskasse, PF, Direktzusage, UK); legal right to deferred comp; BRSG 2019 mandates 15% employer top-up on salary sacrifice",pillar3:"Riester-Rente (€175 base + child bonuses, subsidized) & Rürup/Basisrente (100% tax-deductible up to €27,565/yr, mainly self-employed)",recentReforms:"2023: Aktienrente sovereign fund introduced; contributions projected to rise to 22.3% by 2035; Grundrente fully operational",taxation:"EET — contributions & growth exempt; benefits taxed progressively (Kohortenregelung: 2024 cohort: 83% taxable)",keyLaw:"SGB VI; BRSG 2017 (bAV reform); AltZertG (Riester)" },
    social_security:{ overview:"Bismarckian 5-branch mandatory system",branches:"KV (health), PV (long-term care), RV (pension), AV (unemployment), UV (accident)",totalEmployee:"~20.2% incl. long-term care (0.35% surcharge childless)",totalEmployer:"~20.2% + full UV premium (~1.3%) + FAG",ceiling:"€7,550/mo RV/AV; €5,175/mo KV/PV (2024)",keyLaw:"SGB I–XII" },
    death:{ spousePension:"55% of deceased's pension (große Witwenrente); 25% (kleine Witwenrente if <45yr/no children)",orphanPension:"10% per half-orphan; 20% full orphan; until 18 (27 in education)",lumpSum:"No statutory death grant; bAV group life insurance common",conditions:"Spouse must be married (not remarried); kleine Witwenrente max 24 months" },
    disability:{ type:"Erwerbsminderungsrente: partial (3–6hrs/day) or full (<3hrs/day work capacity)",amount:"Full EM: ~33–40% of final salary equivalent; partial: 50% of full EM rate",qualifying:"5 years contributions minimum; 3 of last 5 years must be mandatory contributions",duration:"Until statutory retirement age; then converts to old-age pension",keyLaw:"SGB VI §§43–44" },
    medical:{ system:"Statutory (GKV) mandatory if income <€69,300/yr; 95% of population",contribution:"14.6% base + ~1.7% avg additional levy; split 50/50",private:"PKV available for high earners; civil servants (Beamte); self-employed",coverage:"Universal; free family co-insurance; nearly no co-payments" },
    parental:{ maternity:"14 weeks (6 pre + 8 post); full salary via GKV + employer top-up to full salary",paternity:"No separate statutory paternity; covered under Elterngeld/Elternzeit",parentalLeave:"Elternzeit: 3 years per parent until age 8; Elterngeld: 65–67% net, €300–€1,800/mo, 12+2 months (bonus for both parents)",childcare:"Legal Kita right from age 1; heavily state-subsidized; Kinderzuschlag for low-income families",keyLaw:"BEEG (BElterngeld- und ElternzeitG)" },
    social:{ unemployment:"ALG I: 60% (67% with child) of last net salary; up to 24 months if >58yr",socialAssistance:"Bürgergeld: €563/mo single adult (2024) + housing costs; replaced Hartz IV",childBenefit:"Kindergeld: €250/mo per child regardless of rank (2023 reform)" },
    perquisites:{ commonBenefits:"Company car (Dienstwagen), meal vouchers (€6.90/day tax-free), job ticket, phone, housing",taxFree:"€50/mo non-cash allowance; €600/yr health promotion (§3 Nr.34 EStG); gym subsidy",companyPension:"bAV salary sacrifice: up to €604/mo (8% BBG) tax + SV-free" },
    flexible:{ cafeteria:"No mandatory framework; typically via CLA or employer policy",commonModels:"Flexible spending for health/mobility; salary sacrifice for pension, leased cars, bike-to-work" },
    severance:{ notice:"Statutory: 4 weeks from 15th/month-end; up to 7 months at 20yr seniority",severance:"No statutory right; court settlement norm: 0.5 months/yr of service",protection:"KSchG: dismissal protection after 6 months; 10+ employees; Social Selection (age, dependents, disability)",keyLaw:"KSchG; BGB §622" },
    working_time:{ maxHours:"48hrs/week (8hrs/day normal; 10hrs exceptional for max 30 days/yr)",overtime:"Must be compensated (time-off or pay) within 6 months; no statutory premium rate",vacation:"20 working days minimum (5-day week); CLA norm 25–30 days",publicHolidays:"9–13 days depending on federal state",keyLaw:"ArbZG; BUrlG" },
    residence:{ eu:"Free movement; Einwohnermeldeamt registration mandatory within 2 weeks",nonEu:"EU Blue Card (€48,300 threshold); Chancenkarte opportunity card from 2024; Fachkräfteeinwanderungsgesetz 2020",keyLaw:"AufenthG; BeschV; FEG 2020" },
    contract:{ forms:"Unbefristet (indefinite) / Befristet (fixed-term: TzBfG max 2yr, max 3 renewals without cause)",probation:"Up to 6 months; only 4-week notice during probation",written:"Electronic form valid since NachwG 2022; all material terms required",keyLaw:"BGB; TzBfG; NachwG" },
    health_safety:{ framework:"ArbSchG: employer duty of care; Gefährdungsbeurteilung (risk assessment) mandatory",occupationalDoctor:"Betriebsarzt mandatory for certain industries; ASiG-based; regular workplace visits",reporting:"Accidents >3 days lost time → Berufsgenossenschaft; fatal → Arbeitsinspektorat immediately",keyLaw:"ArbSchG; ASiG; DGUV regulations" },
    industrial:{ tradeUnions:"DGB confederation (8 unions); ~19% unionization; industry-wide Tarifverträge",worksCouncil:"Betriebsrat: mandatory on employee request (5+ employees); BetrVG co-determination rights",boardLevel:"Mitbestimmung: 1/3 workers (500–2000 employees); 50% parity for 2000+ (Montan exception)",keyLaw:"BetrVG; MitbestG; Montan-MitbestG" },
  },
  FR: {
    pension:{ system:"Two-pillar: General Regime (CNAV) + Complementary AGIRC-ARRCO mandatory for all private-sector employees",type:"Points-based complementary atop earnings-related base; 2023 reform raised age",retirementAge:"64 (post-2023 reform, was 62); full rate at 67 regardless of contributions",earlyRetirement:"58–63 for long careers (carrières longues); disability/incapacity tracks remain",lateRetirement:"+1.25% per quarter beyond full-rate age (surcote); no upper limit",qualifyingPeriod:"172 quarters (43 years) for full rate for born 1965+ cohort; taper by generation",employerContrib:"CNAV: 8.55% (capped) + 1.9% (uncapped); AGIRC-ARRCO: 4.65% T1 + 12.95% T2",employeeContrib:"CNAV: 6.9% (capped) + 0.4% (uncapped); AGIRC-ARRCO: 3.1% T1 + 8.64% T2",ceiling:"PASS: €46,368/yr (2024); AGIRC-ARRCO T2: up to 8×PASS",formula:"Base: 50% × avg best 25yr salary (capped at PASS) × rate coefficient × duration ratio",indexation:"Base pension: CPI; AGIRC-ARRCO: CPI minus 0.5% (since 2016 agreement)",minPension:"Minimum contributif: ~€847/mo (full career); ASPA means-tested: €1,012/mo (2024)",maxPension:"~€1,714/mo CNAV + AGIRC-ARRCO points; no hard ceiling",pillar2:"AGIRC-ARRCO mandatory complementary; points accumulated over entire career",pillar3:"PER (Plan d'Épargne Retraite) since 2019: individual/collective, tax-advantaged",recentReforms:"Loi 2023-270: retirement age 62→64; accelerated quarter requirements; massive social unrest; CEDS challenge",taxation:"EET; pension income subject to IRPP + 9.1% CSG (6.8% deductible)",keyLaw:"CSS; Loi n°2023-270; Décret 2023-436" },
    social_security:{ overview:"Sécurité Sociale via URSSAF collection; 5 branches + CSG/CRDS",branches:"Maladie, AT-MP, Famille, Retraite, Autonomie (new CNSA branch)",totalEmployee:"~10% direct SS + 9.7% CSG/CRDS uncapped = ~22% effective",totalEmployer:"~42–45% total including all charges (cotisations patronales)",ceiling:"PASS €46,368; SS plafond applies to most branches",keyLaw:"CSS; LFSS (annual SS financing law)" },
    death:{ spousePension:"Réversion: 54% of deceased pension; income-tested <55yr; PACS excluded from base regime",orphanPension:"Simple orphan: 25% of deceased salary avg; full orphan: 50%",lumpSum:"Capital décès: 3 months' reference salary paid to dependents",conditions:"Marriage required for base regime réversion; AGIRC-ARRCO réversion requires 2yr marriage" },
    disability:{ type:"3 categories: Cat.1 (partial capacity), Cat.2 (no work capacity), Cat.3 (requires care assistance)",amount:"Cat.1: 30% avg salary; Cat.2: 50%; Cat.3: 50% + 40% supplement (PASS ceiling)",qualifying:"12 months affiliation; 800hrs or €4,725 earnings in last 12 months",duration:"Until 60/62 then converts to retirement pension at same rate",keyLaw:"CSS Art.L.341–L.355" },
    medical:{ system:"Assurance Maladie (CNAM) — universal coverage via PUMA (Protection Universelle Maladie) since 2016",contribution:"13% employer (maladie) + 0.75% employee + 7.3% CSG",private:"Mutuelle complémentaire mandatory employer provision since ANI 2016 (min 50% employer-funded)",coverage:"70–100% reimbursement (100% for ALD chronic diseases); tickets modérateurs apply" },
    parental:{ maternity:"16 weeks basic (6+10); 26 weeks from 3rd child; 100% salary via SS (capped PASS/365)",paternity:"28 calendar days (7 mandatory + 21 optional); same rate as maternity leave",parentalLeave:"Congé parental until child age 3; CLCA allowance ~€428/mo full-time (reduced part-time)",childcare:"CMG Complément Mode de Garde: covers 70–85% of approved childcare costs to age 6",keyLaw:"Code du Travail Art.L.1225; PAJE allocation" },
    social:{ unemployment:"ARE: 57% of daily reference salary; 6mo qualifying; 6–24 months duration (degressive)",socialAssistance:"RSA: €635/mo single adult; Prime d'activité for working poor",childBenefit:"AF: €174/mo for 2 children (income-tested since 2015); CAF family benefits system" },
    perquisites:{ commonBenefits:"Tickets restaurant (€13.91/day; 60% employer tax-free), 50% Navigo transport obligation, chèques vacances",taxFree:"Tickets restaurant employer share exempt (up to €6.91/day); transport 50% mandatory",companyPension:"Article 83/PER Collectif: employer contributions exempt up to 8×PASS × 8%" },
    flexible:{ cafeteria:"No specific law; PEE/PERCO/PER collectif frameworks popular",commonModels:"Salary sacrifice for PER; CET (Compte Épargne Temps) for time-off banking; intéressement" },
    severance:{ notice:"1 month (0–2yr), 2 months (2yr+) statutory; CLAs typically improve",severance:"Indemnité légale: 1/4 salary/yr (0–10yr) + 1/3 salary/yr (beyond 10yr)",protection:"Justification required; Barème Macron (Prud'hommes scale): 0.5–20 months",keyLaw:"Code du Travail Art.L.1234; Ordonnances Macron 2017" },
    working_time:{ maxHours:"35hrs/week legal duration; 44hrs max average; 48hrs absolute; RTT days for overwork",overtime:"25% premium hrs 36–43; 50% premium hr 44+; or RTT time-off",vacation:"5 weeks (25 working days); acquisition at 2.5 days/month; D+1 reference",publicHolidays:"11 national holidays",keyLaw:"Code du Travail L.3121-L.3133; Accords de modulation" },
    residence:{ eu:"Free movement; Carte de séjour mention EU citizen recommended for 5yr+ stays",nonEu:"Titre de séjour Salarié or Passeport Talent (highly skilled); OFII registration",keyLaw:"CESEDA (Code de l'entrée et du séjour des étrangers)" },
    contract:{ forms:"CDI (indefinite), CDD (max 18mo), intérim, apprentissage, professionnalisation",probation:"CDI: 2mo (workers), 3mo (supervisors), 4mo (executives); renewable once only",written:"CDD mandatory written; CDI written required since EU Directive transposition",keyLaw:"Code du Travail L.1221–L.1248" },
    health_safety:{ framework:"Code du Travail L.4121: obligation de sécurité de résultat; DUER mandatory risk document",occupationalDoctor:"Service de Prévention et de Santé au Travail mandatory; medical fitness visits",reporting:"AT declaration within 48h to CPAM; serious accidents to DREETS immediately",keyLaw:"Code du Travail L.4121–L.4161; Loi santé au travail 2021" },
    industrial:{ tradeUnions:"CGT, CFDT, FO, CFTC, CFE-CGC; ~11% density; representative thresholds apply at 10%",worksCouncil:"CSE mandatory from 11 employees; full CSE from 50 with SSCT, negotiation rights",boardLevel:"Board representation for >1000 employees (2 employee directors in SA/SE)",keyLaw:"Code du Travail; Loi Rebsamen; Ordonnances Macron 2017" },
  },
  GB: {
    pension:{ system:"Two-pillar: New State Pension (NSP) flat-rate + Auto-enrolment DC occupational (since 2012)",type:"Universal flat-rate state + defined contribution compulsory occupational; Master Trusts dominant",retirementAge:"66 (2024); rising to 67 by 2028; 68 under review (2044–2046)",earlyRetirement:"NSP: not possible early; private pensions accessible from age 57 (from 2028, was 55)",lateRetirement:"+1% per 9 weeks deferred NSP (approx +5.8%/yr); no upper deferral limit",qualifyingPeriod:"35 qualifying years for full NSP (£221.20/wk 2024); minimum 10 years for any NSP",employerContrib:"Auto-enrolment minimum: 3% of qualifying earnings (£6,240–£50,270 band)",employeeContrib:"Auto-enrolment minimum: 5% total including tax relief (employee net contribution ~4%)",ceiling:"Qualifying earnings band: £6,240–£50,270/yr; AE applies to earnings in this range",formula:"NSP: £221.20/week (2024/25 full rate); each qualifying NI year = £221.20 ÷ 35 = £6.32/wk",indexation:"Triple lock: highest of CPI, average earnings growth, or 2.5% minimum",minPension:"Pension Credit Guarantee: £218.15/wk single (2024); savings credit for those above £189.80",maxPension:"NSP: £221.20/wk; occupational: uncapped; LTA abolished April 2024 (was £1.07m)",pillar2:"Auto-enrolment since 2012; NEST + employer master trusts; DC dominant; DB closed to accrual in most sectors",pillar3:"SIPP; Lifetime ISA (£4,000/yr + 25% government bonus to age 50); ISAs",recentReforms:"2024: Lifetime Allowance abolished; AE review: extend to 18yr olds, remove lower qualifying band; Pot for Life (sidecar) proposals",taxation:"EET; 25% tax-free lump sum (now capped at £268,275 PCLS from 2024); pension income taxed at marginal rate",keyLaw:"Pensions Act 2008 (AE); Pensions Act 2014 (NSP); Finance Act 2024 (LTA abolition)" },
    social_security:{ overview:"National Insurance Contributions (NI) — Beveridgean universal, mostly flat-rate",branches:"NI funds: State Pension, JSA, ESA, SMP, Bereavement; NHS funded from general taxation",totalEmployee:"NI Class 1: 8% (£12,570–£50,270) + 2% above; threshold from April 2024",totalEmployer:"NI employer: 13.8% above £9,100/yr; no upper ceiling",ceiling:"No upper ceiling for employer NI; employee NI reduces to 2% above UEL",keyLaw:"SSCBA 1992; NI Contributions (Reduction in Rates) Act 2023" },
    death:{ spousePension:"No NSP survivor pension; DB occupational schemes typically 50% spouse pension",orphanPension:"Guardian's Allowance: £21.75/wk; Child Benefit continues for dependants",lumpSum:"Bereavement Support Payment: £3,500 lump sum + £350/mo for 18 months",conditions:"BSP requires marriage or civil partnership; not available to cohabiting partners" },
    disability:{ type:"PIP: daily living component (enhanced/standard) + mobility component; ESA/UC for income",amount:"PIP: £28.70–£184.30/wk depending on components; enhanced DL + enhanced mobility = £184.30",qualifying:"PIP assessment by HP (usually Capita/Atos); 3-month qualifying; 9-month prospective",duration:"Fixed-term awards 1–10 years; ongoing review; managed migration to UC",keyLaw:"Welfare Reform Act 2012; PIP Regs 2013; SSCS Act 1998" },
    medical:{ system:"NHS: universal free at point of use; funded from general taxation + NI",contribution:"No separate health contribution; NHS funded via consolidated fund",private:"PMI: employer benefit taxed as BIK; ~13% of population have private cover",coverage:"Comprehensive NHS; prescriptions £9.90/item (free Scotland/Wales/NI/exempt groups)" },
    parental:{ maternity:"52 weeks: 6wks at 90% + 33wks at £184.03/wk SMP + 13wks unpaid",paternity:"2 weeks SPP at £184.03/wk; government consultation on extension underway",parentalLeave:"18 weeks unpaid per child (to age 18); SPL: up to 50 weeks total shared between parents",childcare:"15hrs free from age 3; expanding to 9 months from Sept 2024; Tax-Free Childcare (£500/qtr)",keyLaw:"ERA 1996; MAPLE 2014; Childcare Act 2016" },
    social:{ unemployment:"Universal Credit: £311.68/mo standard allowance; replaces legacy JSA/ESA/Housing Benefit",socialAssistance:"UC system; Council Tax Reduction; Household Support Fund",childBenefit:"£25.60/wk first child; £16.95/wk additional; HICBC clawback threshold raised to £60k (2024)" },
    perquisites:{ commonBenefits:"Company car (BIK 2–37% list price/yr), PMI, cycle-to-work (£1,000 limit), season ticket loans",taxFree:"Trivial benefits: £50/instance; workplace EV charging exemption; cycle-to-work",companyPension:"AE salary sacrifice widely used — saves NI for employer and employee" },
    flexible:{ cafeteria:"No specific legislation; HMRC approved salary sacrifice arrangements",commonModels:"Salary sacrifice for pension, cycle, EV car lease; flexible benefit platforms" },
    severance:{ notice:"Statutory: 1wk/yr service (1–12yr max); contractual notice usually higher in practice",severance:"Statutory Redundancy Pay: 0.5wk/yr (<22yr) + 1wk/yr (22–40yr) + 1.5wk/yr (40+); cap £643/wk",protection:"Unfair dismissal after 2 years; ACAS early conciliation mandatory; ET claims within 3 months",keyLaw:"ERA 1996; Equality Act 2010; TULRCA 1992" },
    working_time:{ maxHours:"48hrs/wk average (17-week reference period); individual opt-out by written agreement possible",overtime:"No statutory OT premium; NMW must be maintained across all hours",vacation:"5.6 weeks (28 days incl. public holidays) statutory; most employers grant 25+ days",publicHolidays:"8 England/Wales; 9 Scotland; 10 Northern Ireland — not automatically paid",keyLaw:"WTR 1998 (SI 1998/1833); Holiday Pay cases (Sash Window, Bear Scotland)" },
    residence:{ eu:"Post-Brexit: EU Settlement Scheme closed June 2021; new arrivals need visa",nonEu:"Skilled Worker visa: min salary £38,700 (2024, up from £26,200); points-based system",keyLaw:"Immigration Act 2014; Immigration Rules; Points-Based System" },
    contract:{ forms:"Employment / Worker / Self-employed tripartite distinction; fixed-term equal treatment after 4yr",probation:"No statutory maximum; typically 3–6 months; day-one rights apply regardless",written:"Day-1 written statement of all terms required (since April 2020)",keyLaw:"ERA 1996 s.1; Fixed-Term Employees Regs 2002; Agency Workers Regs 2010" },
    health_safety:{ framework:"HSWA 1974: employer duty of care; Management Regs 1999: written risk assessment (5+ employees)",occupationalDoctor:"Not mandatory; OH services encouraged; Fit Note from GP after 7 days; OH referral employer-driven",reporting:"RIDDOR 2013: fatal/specified immediately; >7-day injuries within 15 days; diseases: diagnosed",keyLaw:"HSWA 1974; RIDDOR 2013; MHSWR 1999; DSE Regs 1992" },
    industrial:{ tradeUnions:"TUC umbrella; ~23% density; collective bargaining voluntary; statutory recognition via CAC",worksCouncil:"No continental-style works councils; ICE Regs 2004 for 50+ employees (on request)",boardLevel:"No statutory board representation; BEIS worker voice consultation (voluntary only)",keyLaw:"TULRCA 1992; ICE Regs 2004; PIDA 1998 (whistleblowing)" },
  },
  IT: {
    pension:{ system:"Notional Defined Contribution (NDC) — pure contributivo for post-1996; mixed for earlier cohorts",type:"NDC (contributivo) since Fornero 2012 full transition; notional accounts linked to GDP",retirementAge:"67 (pensione di vecchiaia); 41yr 10mo contributions for early regardless of age",earlyRetirement:"Quota 103: age 62 + 41yr contributions (2023–2024 temporary); reduced benefit calculation",lateRetirement:"Continued accrual of contributions → higher capital; higher age conversion coefficient",qualifyingPeriod:"20yr for vecchiaia; 41yr10mo for anticipata; 5yr social pension",employerContrib:"23.81% of gross salary to INPS IVS (pension branch)",employeeContrib:"9.19% of gross salary",ceiling:"No ceiling — full salary subject to contributions",formula:"Accumulated contributions (revalued at 5yr avg GDP growth) × conversion coefficient (e.g. 5.26% at age 67, 2024)",indexation:"Notional capital: 5yr GDP average; pension payment: CPI (tiered protection 90–100%)",minPension:"Assegno Sociale: €534/mo means-tested (2024); pensione di cittadinanza for legacy",maxPension:"No cap; highest pensions via legacy retributivo component for pre-1996 workers",pillar2:"Fondi Pensione (TFR diversion: employee choice mandatory); fondi aperti; PIP individual plans",pillar3:"PIP (Piani Individuali Pensionistici): tax deduction up to €5,164/yr; growing market",recentReforms:"Annual legge di bilancio adjustments; Quota 103 (2023-24); Opzione Donna restrictions tightened; TFR silent consent rules",taxation:"EET; TFR substitutive tax 17–23% on accrual; pension income: IRPEF progressive; fondi: 20% capital gains tax",keyLaw:"L.335/1995 (Dini); L.214/2011 (Fornero); D.Lgs.503/1992; D.Lgs.252/2005 (complementary)" },
    social_security:{ overview:"INPS manages all main branches; comprehensive but structural deficit issues",totalEmployee:"~9.19% pension + 0.30% unemployment + minor others",totalEmployer:"~30%+ total charges including pension, INAIL accidents, family, SS",keyLaw:"D.Lgs.81/2015; INPS circolari" },
    death:{ spousePension:"60% to spouse; 20% per child; total capped 80% (income-tested reductions apply)",orphanPension:"20% per child; 40% full orphan; additional if no surviving spouse",lumpSum:"TFR (severance fund) transferred to heirs; INAIL death benefit for work accidents",conditions:"Marriage required; reversibility rate varies by regime and income of survivor" },
    disability:{ type:"AOI (Assegno ordinario d'invalidità): 67–99% incapacity; Pensione d'inabilità: 100%",amount:"AOI: NDC calculation on imputed career; Pensione inabilità: full early pension at any age",qualifying:"5yr total + 3 of last 5 years; INPS medical commission assessment",duration:"AOI: 3-year renewable; Inabilità: permanent",keyLaw:"L.222/1984; D.Lgs.503/1992" },
    medical:{ system:"SSN (Servizio Sanitario Nazionale) universal; administered by 21 regions",contribution:"Funded via IRAP regional tax + general taxation; no specific employee SS contribution",private:"Fondi sanitari integrativi; employer-provided health plans common for executives (quadri)",coverage:"Universal LEA (essential care levels); co-payments (ticket) apply except for exemptions" },
    parental:{ maternity:"5 months (2+3 or 1+4): 80% salary via INPS; extensions for complications",paternity:"10 days mandatory (2024 law); 80% salary via INPS",parentalLeave:"6 months per parent (10 months combined) until child 12; 30% salary (raised 2023 for first year)",childcare:"Asilo nido voucher €3,000/yr; Bonus bebè €1,920/yr means-tested",keyLaw:"D.Lgs.151/2001; D.Lgs.105/2022 (parental leave reform)" },
    social:{ unemployment:"NASpI: 75% of avg monthly salary (capped ~€1,550/mo); reduces by 3% every 4 months after 90 days; max 24 months",socialAssistance:"Assegno di Inclusione: replaced RdC from Jan 2024; targeted at vulnerable families",childBenefit:"Assegno Unico e Universale: €57–€189/mo per child under 21 (means-tested tiers)" },
    perquisites:{ commonBenefits:"Auto aziendale, buoni pasto (€8/day electronic; tax-free limit), fringe benefits, assistenza sanitaria integrativa",taxFree:"Fringe benefits €1,000/yr general (€2,000 with children); energy bills included 2022-23",companyPension:"TFR diversion to fondi; employer contributions: deductible; D.Lgs.252/2005" },
    flexible:{ cafeteria:"Welfare aziendale: structured plans under Art.51 TUIR; significant tax exemptions",commonModels:"Health, education, mobility, culture credits — growing significantly post-pandemic" },
    severance:{ notice:"Per CCNL — typically 1–6 months depending on contract category and seniority",severance:"TFR: 1/13.5 of annual salary per year; accrues annually; payable on termination/retirement",protection:"Reintegration possible large firms (Art.18 legacy) or indemnity €6–36 months (Jobs Act)",keyLaw:"Art.2120 CC (TFR); L.604/1966; L.300/1970 (Statuto); D.Lgs.23/2015" },
    working_time:{ maxHours:"40hrs/week standard; 48hrs max over 4-month reference; overtime max 250hrs/yr",overtime:"Min +15% (CCNL typically 25–50%); night/holiday work additional premiums",vacation:"Minimum 4 weeks (20 days); most CCNLs grant 25–30 days",publicHolidays:"12 national + 1 local patron saint day",keyLaw:"D.Lgs.66/2003; CCNL provisions" },
    residence:{ eu:"Free movement; registration within 3 months; Attestato di iscrizione anagrafica",nonEu:"Decreto Flussi quota system; Visto D for work; Permesso di soggiorno",keyLaw:"D.Lgs.286/1998 (Testo Unico Immigrazione)" },
    contract:{ forms:"Tempo indeterminato, determinato (max 24mo/4 renewals), somministrazione, apprendistato",probation:"Periodo di prova: typically 3–6 months as per CCNL",written:"Written form mandatory for fixed-term; strongly advisable for all contracts",keyLaw:"D.Lgs.81/2015 (Jobs Act); Art.2094 CC" },
    health_safety:{ framework:"D.Lgs.81/2008 (TUSSL): DVR mandatory risk document; RSPP safety officer; Medico Competente",occupationalDoctor:"Mandatory for defined risk exposures; health surveillance programme required",reporting:"INAIL notification mandatory within 3 days (>3 days lost); fatal accidents immediately",keyLaw:"D.Lgs.81/2008" },
    industrial:{ tradeUnions:"CGIL, CISL, UIL; ~32% density; CCNL sectoral contracts dominant",worksCouncil:"RSU (Rappresentanza Sindacale Unitaria): 15+ employees; negotiation + information rights",boardLevel:"No statutory board-level representation",keyLaw:"L.300/1970 (Statuto dei Lavoratori); Art.39 Constitution" },
  },
  ES: {
    pension:{ system:"Contributory INSS system — earnings-related PAYG; NDC-like since 2011; MEI from 2023",type:"Pay-as-you-go earnings-related with sustainability and intergenerational equity mechanisms",retirementAge:"66yr 6mo (2024) → 67 (2027) with <38.5yr; 65 if 38yr 6mo+ contributions",earlyRetirement:"Voluntary: 2yr early + 35yr contributions (penalty 1.875–6.5%/qtr); involuntary: 4yr early",lateRetirement:"+4% per additional year beyond 67 (up to +12% with 44.5yr contributions)",qualifyingPeriod:"15yr minimum; 37yr for full 100% (2027 target); last 25yr salary for base calculation",employerContrib:"23.6% contingencia común + 0.6% FOGASA + accident/sickness variable",employeeContrib:"4.7% contingencia común + 1.55% unemployment + 0.1% training",ceiling:"Base máxima: €4,720.50/mo (2024); base mínima varies by professional category",formula:"Base reguladora (avg last 25yr indexed to CPI) × percentage (50% at 15yr → 100% at 37yr)",indexation:"CPI guaranteed (Ley 21/2021 restored); additional revaluation per annual budget law",minPension:"~€950/mo (with spouse); complemento a mínimos for eligible pensioners",maxPension:"€3,175.04/mo (2024 statutory maximum pension)",pillar2:"PPE (Planes de Pensiones Empleo) voluntary; Fondo de Pensiones de Empleo de Promoción Pública (FPEPP 2023)",pillar3:"Planes individuales: €1,500/yr limit (severely reduced 2022); PPSE employer €8,500/yr",recentReforms:"Ley 21/2021: suspended SDG factor; restored CPI linkage; Ley 12/2022: new MEI contribution +0.58%; FPEPP public occupational fund",taxation:"Contributions deductible; benefits as rendimientos del trabajo — IRPF progressive rates apply",keyLaw:"LGSS RDL 8/2015; Ley 21/2021; Ley 12/2022 (MEI)" },
    social_security:{ overview:"Sistema de Seguridad Social — INSS contributory + IMSERSO social services",totalEmployee:"~6.47% total (4.7% pension + 1.55% paro + 0.1% FP + 0.12% FOGASA)",totalEmployer:"~30% (23.6% pension + 5.5% paro + accident variable + others)",keyLaw:"LGSS RDL 8/2015; Orden de cotización annual" },
    death:{ spousePension:"52% viudedad (60% if 65+ or disabled); income-tested for working-age separated",orphanPension:"20% per child (52% total orphan); until 21 (25 if studying)",lumpSum:"Auxilio por defunción: €46.50 (symbolic); work accident: significant INSS/Mutua benefit",conditions:"Marriage required; 2yr cohabitation with common children for couples; income test" },
    disability:{ type:"IP Parcial (33–74%), Total (75%+), Absoluta, Gran Invalidez — professional capacity test",amount:"IP Total: 55% base reguladora (75% if 55+ limited options); IP Absoluta: 100%; Gran Invalidez: +45%",qualifying:"IP Total: 5yr (or 1/3 of working life if under 31); EVI medical tribunal assessment",duration:"Permanent with periodic review; converts to retirement pension at 65",keyLaw:"LGSS Art.193–200" },
    medical:{ system:"SNS (Sistema Nacional de Salud) universal; decentralised to 17 CCAA",contribution:"Funded via general taxes + SS; free at point of use",private:"Mutuas de trabajo accidentales; private Iguala médica common for executives",coverage:"Universal (restored for undocumented migrants); co-payment for medications (income-related)" },
    parental:{ maternity:"16 weeks (6 mandatory post-birth) at 100% base reguladora",paternity:"16 weeks equal (since 2021 RDL 6/2019 full equality); 6 weeks mandatory post-birth",parentalLeave:"Permiso parental: 8 weeks per parent (child <8yr) unpaid — new right from Ley 15/2022",childcare:"Escuelas infantiles 0–3 heavily subsidised by CCAA; working mothers deduction",keyLaw:"ET Art.48; LGSS Art.177–182; Ley 15/2022; RDL 6/2019" },
    social:{ unemployment:"70% (first 180 days) → 50% thereafter; max 24 months (with 6yr contributions)",socialAssistance:"IMV (Ingreso Mínimo Vital): €564/mo single adult (2024); CCAA supplementary aids",childBenefit:"Prestación hijo: €28/mo general (means-tested); higher for children with disability" },
    perquisites:{ commonBenefits:"Cheque comida/restaurante (€12.5/day tax-free), vales guardería, seguro médico, vehículo empresa",taxFree:"Transport vouchers €136.36/mo; guardería; formación — various Art.42 LIRPF exemptions",companyPension:"PPE contributions deductible per LIRPF; MEI top-up for employer contributions" },
    flexible:{ cafeteria:"Retribución flexible: salary sacrifice for restaurant, transport, healthcare, training",commonModels:"IRPF optimization via retribución en especie within Art.42-43 LIRPF limits" },
    severance:{ notice:"ET: 15 days (<1yr), 20 days (1–5yr), 30 days (5yr+); CLA may improve",severance:"Despido improcedente: 33 days/yr × max 24mo salary; procedente: 20 days/yr × 12mo max",protection:"Justification required (disciplinary or objective causes); SMAC conciliation pre-litigation",keyLaw:"ET (RDL 2/2015) Art.49–56; RDL 32/2021 (labour reform)" },
    working_time:{ maxHours:"40hrs/week; 9hrs/day; 80hrs/yr overtime maximum",overtime:"+25% rate or compensatory rest; voluntary except force majeure",vacation:"30 calendar days (22 working days) minimum; not replaceable by pay except on termination",publicHolidays:"14 days (national + regional + local mix)",keyLaw:"ET Art.34–38; RD 1561/1995" },
    residence:{ eu:"Free movement; NIE number required; registration municipality",nonEu:"Visado de trabajo; Tarjeta de Residencia; Digital Nomad Visa (Ley de Startups 2023)",keyLaw:"LO 4/2000 (LOEx); RD 557/2011" },
    contract:{ forms:"Indefinido (default since RDL 32/2021 reform), temporal (max 6mo), fijo discontinuo, formación",probation:"2 months (standard); 6 months technicians/managers per CLA; special rules",written:"All contracts in writing since 2021 labour reform",keyLaw:"ET; RDL 32/2021" },
    health_safety:{ framework:"LPRL L.31/1995: employer duty of prevention; PSST mandatory; Plan de Prevención de Riesgos Laborales",occupationalDoctor:"Vigilancia de la salud: medical exams voluntary for employee; mandatory for specific risks",reporting:"Parte de accidente to Delt@ system within 5 working days; fatal: 24hr to ITSS",keyLaw:"LPRL L.31/1995; RSP RD 39/1997" },
    industrial:{ tradeUnions:"CCOO, UGT major confederations; ~14% density; Convenios Colectivos sectoral/company",worksCouncil:"Comité empresa (50+); Delegados de personal (6–49): consultation and negotiation rights",boardLevel:"No statutory board representation",keyLaw:"ET; LOLS L.11/1985; Ley 11/2023" },
  },
  NL: {
    pension:{ system:"Three-pillar: AOW (state flat-rate) + Quasi-mandatory DC/DB occupational (95% coverage) + Private",type:"Flat-rate state + sector pension funds; transitioning to DC under WTP (Wet Toekomst Pensioenen)",retirementAge:"67 (2024); linked to life expectancy from 2025 (1:2/3 ratio, avg 3yr lead)",earlyRetirement:"AOW: no early; occupational: early possible with actuarial reduction (RVU exemption until 2025)",lateRetirement:"AOW deferral: +6.5%/yr; occupational: scheme-specific deferred accrual",qualifyingPeriod:"AOW: 50 years of residence builds 100% (2% per year from age 17); no contribution required",employerContrib:"AOW: 17.9% employee-paid only; occupational: 15–25% total (employer-dominant)",employeeContrib:"AOW: 17.9% on first €38,098; occupational: typically 4–8% employee share",ceiling:"AOW franchise (offset): ~€17,545; occupational ceiling ~€137,800 (Witteveenkader)",formula:"AOW: €1,419/mo net single (2024); occupational: career-average 1.875%/yr × pensionable salary",indexation:"AOW: linked to statutory minimum wage; occupational: CPI or wage conditional on funding ratio",minPension:"AOW guaranteed minimum; AIO (Aanvullende Inkomensvoorziening) means-tested supplement",maxPension:"No hard cap; fiscally capped at 100% final salary over career; Witteveenkader limits",pillar2:"Quasi-mandatory via sector/company funds; ABP (govt), PFZW (healthcare), PMT (metalworkers); WTP DC transition by 2028",pillar3:"Lijfrente (annuity): jaarruimte/reserveringsruimte system; Box 3 private savings",recentReforms:"WTP 2023: major shift from collective DB to individual DC (solidaire/flexibele contract); 2028 deadline; major implementation challenge",taxation:"EET model; AOW taxable income; annuities taxable; Box 3 annual wealth tax on savings (1.36%)",keyLaw:"AOW 1956; PW (Pensioenwet) 2007; WTP (Wet Toekomst Pensioenen) 2023" },
    social_security:{ overview:"Volksverzekeringen (national) + Werknemersverzekeringen (employee insurance); comprehensive",totalEmployee:"Premies: AOW 17.9% + ANW 0.1% + WLZ 9.65% (on first bracket ~€38,098)",totalEmployer:"WIA/WAO, WW, ZVW bijdrage: ~9%; eigenrisicodrager option for WGA",keyLaw:"AOW, ANW, WLZ, ZVW, WIA, WW; Arbeidsongeschiktheidswet" },
    death:{ spousePension:"ANW: ~€1,487/mo if caring for child under 18 or >45% incapacitated; 2yr transition for others",orphanPension:"Half/full orphan ANW supplements; occupational partner pension varies (at-risk model now common)",lumpSum:"No statutory death grant; occupational partner pension typical 70% of retirement pension",conditions:"ANW income-tested; at-risk partner pension via occupational: only accrued before date of death" },
    disability:{ type:"WIA: WGA (35–80%+ partial/recoverable) or IVA (permanent >80% incapacity)",amount:"WGA: 70% ref salary × 2 months then 70% min wage + salary loss component; IVA: 75%",qualifying:"2-year sick leave (Poortwachter reintegration process mandatory); arboarts throughout",duration:"WGA/IVA to state pension age; eigenrisicodrager option",keyLaw:"WIA 2005; Poortwachter Wet 2002" },
    medical:{ system:"ZVW: mandatory private health insurance with community-rated basic package",contribution:"Nominal premium ~€1,900/yr individual + income-related ZVW bijdrage 6.57% (via employer)",private:"All insurance is regulated-private; supplemental aanvullende verzekering optional",coverage:"Basic basisverzekering mandatory; deductible €385 (2024) + 10% co-insurance max €385" },
    parental:{ maternity:"16 weeks (ZEZ): 100% salary via UWV (capped at daily wage limit)",paternity:"Geboorteverlof: 1wk paid 100% + 5wks WIEG at 70% within 6 months of birth",parentalLeave:"9 weeks at 70% paid (first 9 of 26wk total entitlement) via UWV; remaining 17wks unpaid",childcare:"Kinderopvangtoeslag: 70–96% subsidized; reform to flat 96% for all from 2025",keyLaw:"WAZO; WIEG; Wet Kinderopvang" },
    social:{ unemployment:"WW: 75% (2mo) → 70% salary; max 24 months; contributory (38yr history max)",socialAssistance:"Participatiewet: bijstand €1,131/mo single (2024); municipal administration + activation",childBenefit:"AKW Kinderbijslag: €254/qtr (0–5yr) → €487/qtr (12–17yr); universal" },
    perquisites:{ commonBenefits:"Lease auto, reiskostenvergoeding (€0.23/km tax-free), thuiswerkvergoeding (€2.35/day), NS-businesscard",taxFree:"WKR: 1.92% of payroll free allowance + 1.18% above €400k; overspend final levy 80%",companyPension:"Fully deductible within Witteveenkader 1.875%/yr career average; transitioning to DC" },
    flexible:{ cafeteria:"Cafeteria plan common via WKR budget; salary exchange for lease car, extra leave, pension",commonModels:"À-la-carte benefit exchange via payroll; tax optimization within WKR framework" },
    severance:{ notice:"1mo/3yr service period (max 4 months); must go via UWV or Kantonrechter",severance:"Transitievergoeding: 1/3 monthly salary per year of service; max €94,000 (2024)",protection:"UWV route (business/redundancy) or Kantonrechter (personal reasons); preventive toetsing",keyLaw:"WWZ 2015; WAB 2020; BW Boek 7 Art.669–686" },
    working_time:{ maxHours:"40hrs/week standard; 60hrs max any week; 48hr average over 16 weeks",overtime:"No statutory rate; CLA determines; mandatory rest periods after OT",vacation:"20 days minimum (4× weekly hours); most CLAs 25 days; 6-month carry-over rule",publicHolidays:"11 public holidays — no automatic statutory right; granted via CLA",keyLaw:"ATW (Arbeidstijdenwet); BW Boek 7 Art.634–645" },
    residence:{ eu:"Free movement; BRP municipal registration; sofi-nummer (BSN) required",nonEu:"GVVA combined permit; kennismigrant €70,800 threshold (2024); 30% ruling for expats",keyLaw:"Wav; Vw 2000; 30%-ruling (IB 2001 Art.31a)" },
    contract:{ forms:"Onbepaalde/bepaalde tijd (max 3 in 3yr); payrolling; oproepcontract (0-hours)",probation:"1 month (≤6mo contract); 2 months (permanent); prohibited for fixed-term <6 months",written:"Fixed-term: written mandatory; WAB 2020 strengthened documentation requirements",keyLaw:"BW Boek 7 Titel 10; WAB 2020" },
    health_safety:{ framework:"Arbowet: employer duty; RI&E risk inventory mandatory; basiscontract arbodienst required",occupationalDoctor:"Basiscontract with arbodienst mandatory; open spreekuur (walk-in) for employees required",reporting:"Ernstige arbeidsongevallen: immediate to NLA (Inspectie SZW); within 5 days written report",keyLaw:"Arbowet; Arbeidsomstandighedenbesluit" },
    industrial:{ tradeUnions:"FNV, CNV, VCP; ~16% density; sector CAO dominant; AVV erga omnes extension",worksCouncil:"OR mandatory 50+ employees; WOR: consultation + approval rights + right of initiative",boardLevel:"Structuurregime: large companies — Supervisory Board appointment rights for OR",keyLaw:"WOR 1971; BW Boek 2 structuurregeling" },
  },
  SE: {
    pension:{ system:"Three-pillar: Allmän pension (income+premium NDC/FDC) + Quasi-mandatory occupational (ITP/SAF-LO) + Private",type:"NDC income pension + 2.5% FDC premium pension + sector collective occupational",retirementAge:"Minimum 63 (rising to 64 in 2026); riktålder 67 (adjusts with life expectancy)",earlyRetirement:"From minimum age (63/64) with actuarial reduction; no formal early retirement program",lateRetirement:"No upper age limit; continued accrual and conversion delay increases pension",qualifyingPeriod:"No minimum for NDC (all contributions accrue); garantipension: 3yr Swedish residence",employerContrib:"Allmän pension: 10.21% employer; ITP/SAF-LO occupational: 4.5–30%+ depending on agreement",employeeContrib:"Allmän pension: 7% employee (deducted via pension rights calculation); premium pension 2.5% of inkomstpension",ceiling:"Income ceiling: 8.07× IBB ≈ SEK 614,000 (2024); above ceiling no state pension accrual",formula:"Income pension: contributions + income index notional interest; premium: market returns; occupational: per scheme",indexation:"Income pension: balance index (income-linked); automatic balance mechanism (bromsen) if ratio <1",minPension:"Garantipension: SEK 9,631/mo single (2024); income supplement and housing allowance",maxPension:"No cap; highest income pension ~SEK 30,000+/mo; uncapped occupational",pillar2:"ITP1/ITP2 (white collar, Collectum), SAF-LO (blue collar, Fora), KAP-KL (local govt); ~90% coverage",pillar3:"SAVR (up to SEK 35,809/yr deductible); Investeringssparkonto (ISK) flat-rate wealth tax",recentReforms:"2019: Premium pension reform — new fund platform PPM/Pensionsmyndigheten; 2026: minimum age 64; 2023: life expectancy indexing rate negotiation",taxation:"EET for occupational; allmän pension taxable with pensionärsrabatt; ISK: 30% × 1.5% schablonränta",keyLaw:"SFB (Socialförsäkringsbalken) 2010:110; ITP plan collective agreement; SFL (Skatteförfarandelagen)" },
    social_security:{ overview:"Comprehensive universal system unified under SFB; employer-paid arbetsgivaravgifter",totalEmployee:"7% allmän pension; all other branches paid by employer via arbetsgivaravgifter",totalEmployer:"31.42% arbetsgivaravgift covers: pension 10.21%, health 3.55%, parental 2.6%, unemployment 2.64%, others",keyLaw:"SFB 2010:110; SAL (Socialavgiftslagen) 2000:980" },
    death:{ spousePension:"Efterlevandepension via occupational: ITP2 provides family pension; state survivor: barnpension only",orphanPension:"Barnpension: 35% of IBB per child until age 20 via income pension system",lumpSum:"Grupplivförsäkring (GFL): collective life insurance per CLA; typically 1–3 annual salaries",conditions:"State survivor limited to children; spousal cover mainly via occupational scheme" },
    disability:{ type:"Sjukersättning (permanent) / Aktivitetsersättning (19–29yr); Sjukpenning (temporary SGI-based)",amount:"Sjukersättning: 64.7% of assumed income (up to ceiling); Sjukpenning: 77.6% (day 1–364)",qualifying:"Medical assessment; Arbetsförmedlingen activation; rehabilitation plan; no min period for sjukpenning",duration:"Sjukpenning: 364 days + 550-day extension; Sjukersättning: until age 65",keyLaw:"SFB Kap.33–36; AF-SAF collective agreement on sick pay" },
    medical:{ system:"Landsting/Region-administered universal healthcare; funded via regional income tax",contribution:"No specific employee contribution; funded via regional tax (~11%) + state grants",private:"Privat sjukvårdsförsäkring: employer benefit common in white-collar; rapid specialist access",coverage:"Universal; patient fees SEK 200–400/visit; high-cost protection ceiling ~SEK 1,300/yr" },
    parental:{ maternity:"Part of shared 480-day pool; 10-day faderskapsledighet at birth (100% up to SGI ceiling)",paternity:"10 days at birth at 100% SGI + 90 earmarked föräldrapenning days per parent",parentalLeave:"480 days per child: 390 days at 77.6% (max SEK 1,173/day) + 90 days SEK 180 flat; 90 days earmarked per parent",childcare:"Maxtaxa: max SEK 1,572/mo per child; universal right from 1yr; avgiftsfri förskola from age 3",keyLaw:"SFB Kap.12; Föräldraledighetslagen 1995:584; Skollagen" },
    social:{ unemployment:"A-kassa: 80% (100 days) → 70% salary; max SEK 1,200/day; requires a-kassa membership",socialAssistance:"Ekonomiskt bistånd: municipal means-tested; SKOFS norm-based calculation",childBenefit:"Barnbidrag: SEK 1,250/mo per child; flerbarnstillägg for 3+ children; universal" },
    perquisites:{ commonBenefits:"Tjänstebil, friskvårdsbidrag (SEK 5,000/yr tax-free), lunchförmån, milersättning",taxFree:"Friskvård SEK 5,000 wholly tax-free; cycle benefit expanding; EV company car reduced BIK",companyPension:"ITP/SAF-LO occupational pension; extra employer contributions deductible" },
    flexible:{ cafeteria:"Limited; salary sacrifice for pension most common; benefits mainly via CLA",commonModels:"Friskvård, extra pensionsinbetalningar, additional vacation via löneavstående (salary sacrifice)" },
    severance:{ notice:"LAS: 1mo (<2yr) → 6mo (10yr+) by seniority; Turordningsregler (LIFO) applies",severance:"No statutory severance pay; TRR/TSL retraining funds per CLA; Trygghetsrådet outplacement",protection:"Turordning (last-in-first-out); 2-exception rule since 2022 LAS reform; Diskrimineringslagen",keyLaw:"LAS 1982:80 (rev.2022); MBL 1976:580; Turordningsavtalet" },
    working_time:{ maxHours:"40hrs/week; 48hr max average (4-month reference); overtime 200hrs/yr statutory max",overtime:"50% premium OT; 100% emergency OT; or compensatory time per CLA",vacation:"25 days minimum (Semesterlagen); generous CLA additions; rollover with restrictions",publicHolidays:"13 red days; Midsommarafton/Christmas Eve de facto free (not statutory)",keyLaw:"ATL (Arbetstidslagen) 1982:673; Semesterlagen 1977:480" },
    residence:{ eu:"Free movement; voluntary registration; SINK tax for short stays",nonEu:"Arbetstillstånd employer-sponsored; 4yr → permanent residency; fast track for specialists",keyLaw:"Utlänningslagen 2005:716; IF 2006:97" },
    contract:{ forms:"Tillsvidareanställning (permanent); ALVA abolished 2022 → specialsvikarier/säsongsanställning",probation:"Provanställning: max 6 months; terminable 2-week notice by either party",written:"LAS: written terms within 1 month; EU Directive 2019/1152 transposed",keyLaw:"LAS 1982:80; MBL 1976:580" },
    health_safety:{ framework:"AML (Arbetsmiljölagen): SAM (systematic work environment management) mandatory",occupationalDoctor:"Företagshälsovård expected but not mandated; Arbetsmiljöverket supervision",reporting:"Allvarliga tillbud/olyckor: immediate to Arbetsmiljöverket via ISA system",keyLaw:"AML 1977:1160; AFS 2001:1 (systematic work env. management)" },
    industrial:{ tradeUnions:"LO (blue), TCO (white), Saco (academic); ~60-65% density; bipartite model",worksCouncil:"MBL: primary negotiation obligation before changes; no formal European-style works council",boardLevel:"Worker board representation: 25+ employees: 2 members; 1000+: 3 members",keyLaw:"MBL 1976:580; Styrelserepresentationslagen 1987:1245" },
  },
  CH: {
    pension:{ system:"Three-pillar: AHV/AVS (1st state) + BVG/LPP (2nd mandatory occupational) + Voluntary private (3rd)",type:"Flat-rate state pension + earnings-related mandatory DC occupational; unique 3-pillar model",retirementAge:"65 for both genders (women from 2025 after AHV21 transitional; was 64)",earlyRetirement:"AHV: 1–2yr early with 6.8–13.6% actuarial reduction; BVG: scheme-specific",lateRetirement:"AHV deferral 1–5yr: +5.2% to +31.5%; BVG: continued accrual raises capital",qualifyingPeriod:"AHV: 44 years for full pension; each missing year = 1/44 reduction; minimum 1yr",employerContrib:"AHV: 5.3% + 1.1% ALV; BVG: age-graded 7–18% total (employer must match ≥ employee share)",employeeContrib:"AHV: 5.3% + 1.1% ALV; BVG: age-graded 7–18% total (employer pays ≥ 50%)",ceiling:"AHV: CHF 88,200/yr; BVG coordinated salary: CHF 25,725–88,200 (mandatory portion)",formula:"AHV: min CHF 1,225/mo – max CHF 2,450/mo (2024) based on contribution years × average income; BVG: capital × conversion rate (6.8% mandatory minimum)",indexation:"AHV: mixed index (50% wages + 50% CPI); BVG: Federal Council sets annual minimum return (1.25% 2024)",minPension:"AHV min CHF 1,225/mo; EL (Ergänzungsleistungen) means-tested supplement fills gap",maxPension:"AHV max CHF 2,450/mo (single); BVG+AHV combined typically 60–70% of final salary",pillar2:"BVG/LPP mandatory for salary >CHF 22,050; obligatory + over-mandatory portions; Sammelstiftungen (collective foundations)",pillar3:"Pillar 3a: CHF 7,056/yr (employed) fully tax-deductible; Pillar 3b: free savings (insurance/bank products)",recentReforms:"AHV21 (2024 in force): women's retirement age 65; AHV13 (Sept 2024 referendum): 13th monthly AHV payment approved; BVG reform rejected (Sept 2024 referendum) — coordination deduction changes blocked",taxation:"BVG: EET; lump-sum at retirement taxed at privileged rate (1/5 rule); annuity taxed as income; Pillar 3a: full deductibility + deferred tax on withdrawal",keyLaw:"AHVG/LAVS; BVG/LPP; AHV21 (in Kraft 2024); AHV13 volksinitiative" },
    social_security:{ overview:"AHV (old age/survivors), IV (disability), EO (loss of earnings), ALV (unemployment), UVG (accident), KVG (health)",totalEmployee:"AHV/IV/EO: 10.6%; ALV: 2.2% (up to CHF 148,200); KVG: private premiums separate",totalEmployer:"AHV/IV/EO: 10.6% (equal split); ALV: 2.2%; UVG BO: full employer; FAK family allowances ~0.5%",keyLaw:"AHVG, IVG, EOG, AVIG, UVG, KVG" },
    death:{ spousePension:"AHV Witwenrente: 80% of AHV pension if children or ≥45yr + 5yr marriage; BVG partner pension ~60%",orphanPension:"AHV: 40% per child (max 2: 80%); until 18 (25 if in education); BVG additional",lumpSum:"BVG: death capital (2× annual salary or accumulated capital) if no pension drawn; SUVA for accidents",conditions:"AHV widower only if minor children (stricter than widow); BVG partner pension varies by foundation rules" },
    disability:{ type:"IV: degree-based 40% (1/4 pension) → 70%+ (full pension); integration priority (Eingliederung first)",amount:"Full IV pension: same formula as AHV max; BVG disability pension also triggered; rehabilitation priority",qualifying:"12 months incapacity; IV five-stage process; integration measures exhausted first",duration:"Until 65 (then AHV); periodic review; WeiterEntwicklung IV reform 2022 strengthened integration",keyLaw:"IVG; WeiterEntwicklung der IV 2022" },
    medical:{ system:"KVG/LAMal: mandatory private health insurance (Krankenkasse); community rating within canton/region",contribution:"Monthly premiums CHF ~300–600/person/month (large regional variation); employer not legally required",private:"VVG supplemental insurance for private hospital room, dental, abroad; employer often subsidizes",coverage:"Mandatory basic package; franchise CHF 300–2,500 (chosen); 10% co-insurance up to CHF 700/yr" },
    parental:{ maternity:"14 weeks EO Mutterschaftsentschädigung: 80% salary (max CHF 220/day)",paternity:"2 weeks EO Vaterschaftsurlaub (since 2021): 80% salary (max CHF 220/day)",parentalLeave:"No federal parental leave beyond 14+2wks; cantonal supplements; employer CLA improvements common",childcare:"Bundesbeiträge for childcare expansion; cantonal subsidies vary widely; employer subsidies common",keyLaw:"EOG Art.16b–16k; EOV" },
    social:{ unemployment:"ALV: 70% (no children) / 80% (with children); max 400 days (520 if 55+); Kurzarbeit (short-time work) available",socialAssistance:"Sozialhilfe: cantonal; SKOS guidelines ~CHF 1,000–1,200/mo; obligation to work",childBenefit:"Kinderzulagen: min CHF 200/mo per child under 16 (18 if not employed); cantonal variation upwards" },
    perquisites:{ commonBenefits:"Mobile Natel, SBB Halbtax/GA, Überbrückungsrente for early retirement, company meals",taxFree:"Expense flat-sums per Spesenreglement; BVG contributions deductible; representation expenses",companyPension:"BVG over-mandatory contributions tax-deductible; cadre pension plans widely offered by multinationals" },
    flexible:{ cafeteria:"Limited legal framework; salary components regulated by OR; bonus structures flexible per employer",commonModels:"Pillar 3a salary deductions; employer KVG premium contributions; extra vacation days" },
    severance:{ notice:"OR Art.335c: 1 month (1yr) → 3 months (10yr+); calendar months only; contractual extension common",severance:"No statutory severance; Abgangsentschädigung mandatory: age ≥50 + ≥20yr service; typically contractual",protection:"Unfair dismissal: max 6 months salary compensation (no reinstatement); Sperrfristen protected periods",keyLaw:"OR Art.335–341 (Obligationenrecht); GlG (Gleichstellungsgesetz)" },
    working_time:{ maxHours:"45hrs/week (industrial/office); 50hrs/week (other sectors); ArG",overtime:"+25% salary OT compensation; time-off agreement possible; ArG limits",vacation:"4 weeks minimum; 5 weeks under 20yr; most employers give 5 weeks",publicHolidays:"8 federal holidays; cantonal additions up to 5; no uniform national standard",keyLaw:"ArG (Arbeitsgesetz) SR 822.11; ArGV 1–5" },
    residence:{ eu:"AFMP (Bilaterals I): free movement EU/EFTA; Aufenthaltsbewilligung B (5yr) → C (permanent)",nonEu:"Annual national quotas; highly qualified focus; Arbeitsbewilligung for 90-day+ stays",keyLaw:"AIG (Ausländer- und Integrationsgesetz); VZAE; AFMP bilateral" },
    contract:{ forms:"Unbefristeter/befristeter Arbeitsvertrag; Temporärarbeit; no Employment Rights Act equivalent",probation:"Default 1 month OR; max 3 months contractually; terminable 7-day notice",written:"No mandatory written form (OR); strongly recommended; executive employment contracts (KEV) standard",keyLaw:"OR Art.319–362" },
    health_safety:{ framework:"ArG + UVG: employer duty; SUVA (national accident insurer) for most employees; EKAS coordination",occupationalDoctor:"Not universally mandated; SUVA sector-specific requirements; Betriebsarzt for larger firms",reporting:"UVG: accidents within 3 days to insurer (SUVA or VVG alternative); ArG: serious to cantonal authority",keyLaw:"ArG SR 822.11; UVG SR 832.20; SUVA-Präventionsvorschriften" },
    industrial:{ tradeUnions:"Travailsuisse, SGB/USS; ~17% density; bipartite model; sector GAV (Gesamtarbeitsverträge)",worksCouncil:"MitwG: employee representation committees 20+ employees; information/consultation rights",boardLevel:"No statutory board representation; voluntary corporate governance (Swiss Code)",keyLaw:"MitwG (Mitwirkungsgesetz) SR 822.14; OR" },
  },
  BE: {
    pension:{ system:"Three-pillar: Wettelijk/Légal PAYG (1st) + WAP mandatory occupational (2nd) + Personal savings (3rd)",type:"Earnings-related PAYG + quasi-mandatory supplementary via WAP/LPC (all private sector since 2004)",retirementAge:"65 (2025); 66 (2025); 67 (2030) per reform law",earlyRetirement:"62yr + 42yr career; 60yr + 44yr career; Landingsbaan time-credit (55+)",lateRetirement:"+2% per year deferred beyond 65 (Pensioensbonus since 2021)",qualifyingPeriod:"Minimum 1yr partial; 45yr full career = 1/45th per year",employerContrib:"Pension branch: ~8.86% as part of 25% global RSZ/ONSS employer contribution",employeeContrib:"13.07% total ONSS personal; pension share ~7.5%; WAP additionally ~3-5%",ceiling:"Annual salary ceiling for calculation: ~€66,393 (2024); WAP contributions separate",formula:"60% (single) / 75% (household) × average career salary × (career years ÷ 45)",indexation:"Health index (smoothed CPI); pension bonus 2% per deferred year",minPension:"GRAPA/INIG (means-tested): €1,338/mo household (2024); minimum pensioen ~€1,600 full career",maxPension:"Capped at calculation ceiling; practical max ~€3,000–4,000/mo",pillar2:"WAP mandatory since 2004 at sector level; DC dominant; guaranteed min return: 1.75% (employer) / 0% (employee); IPT for executives",pillar3:"Pensioensparen max €990/yr (30%) or €1,270 (25%) tax relief; Levensverzekering long-term saving",recentReforms:"2015–2020 retirement age gradual increase; 2021: pensioensbonus; 2022 WAP return revision; 2024 coalition discussions ongoing",taxation:"EET; WAP capital: 10–20% separate taxation; pension income: IPB/IPP progressive; pensioensparen credit",keyLaw:"Wet 5/8/1992; WAP/LPC 2003; KB Pensioenbonus 2021" },
    social_security:{ overview:"ONSS/RSZ global collection for all branches; RIZIV/INAMI for health; ONEM/RVA for unemployment",totalEmployee:"13.07% personal social security contribution on gross salary",totalEmployer:"~25% global ONSS + sectoral charges; Patronale bijdrage varies by sector",keyLaw:"RSZ-wet; BVP-wet; RVACB" },
    death:{ spousePension:"Overlevingspensioen: 80% of deceased pension; age ≥48 (reducing) or caring for child; duration-based",orphanPension:"Wezenpension per deceased parent pension; until 18 (25 if studying); plus applicable WAP death capital",lumpSum:"Overlijdensvergoeding: 1 month salary from ONSS; WAP capital on death before retirement",conditions:"Marriage required; no cohabiting partner state pension right; WAP survivor typically 80%" },
    disability:{ type:"Primaire arbeidsongeschiktheid year 1 (mutualité) → Invaliditeit from month 13 (RIZIV/INAMI)",amount:"Primary/Invalidité: 60% gross (isolated); 65% (with dependents) — unique inverse system",qualifying:"1 month affiliation; médecin-conseil approval; RIZIV assessment from month 13",duration:"Invalidité to pension age; reassessment; reintegration incentives",keyLaw:"ZIV; RIZIV/INAMI-wet" },
    medical:{ system:"Ziekenfonds/Mutualité obligatoire via mutualities; RIZIV/INAMI framework",contribution:"3.55% employee ONSS + employer sickness/invalidity portion of global ONSS",private:"Hospitalisatieverzekering employer-provided widely; Groepsverzekering with health rider",coverage:"RIZIV nomenclature reference fees; Global Medical Record (GMD/DMG) for lower co-payment" },
    parental:{ maternity:"15 weeks (17 multiple births): 82% first 30 days → 75% thereafter via mutualité",paternity:"20 days co-parent leave: 82% via RIZIV/INAMI; 3 mandatory + 17 optional within 4 months",parentalLeave:"4 months full-time per parent (until child 12): €988/mo (full-time) via RVA/ONEM",childcare:"Groeipakket (Fl)/ONE (Fr): income-adjusted subsidized childcare; belastingkrediet kinderopvang",keyLaw:"Wet 22/4/1997; CAO 45/46/109" },
    social:{ unemployment:"Werkloosheidsuitkering: 65% (1st 3mo) → 60% → degressive to minimum; no absolute time limit",socialAssistance:"Leefloon/Revenu d'intégration: €1,215/mo single (2024); OCMW/CPAS administration",childBenefit:"Groeipakket/Allocations familiales: regionalized since 2019; universal base allowance" },
    perquisites:{ commonBenefits:"Bedrijfswagen (very high uptake), ecocheques (€250/yr tax-free), maaltijdcheques (€8/day), hospitalisatieverzekering",taxFree:"Maaltijdcheques employer max €6.91/day exempt; ecocheques €250; CAO 90 bonus €3,714/yr",companyPension:"IPT for managers (individual pension promise); WAP for all employees; groepsverzekering" },
    flexible:{ cafeteria:"Cafetariaplan: tax-optimised salary exchange for bedrijfswagen, extra verlof, fiets, hospitalisatie",commonModels:"CAO 90 non-recurring results bonus; benefits in exchange for gross components" },
    severance:{ notice:"Eenheidsstatuut 2014: unified scale 1wk/3mo → 62wks (17yr+) for all employee categories",severance:"Notice equivalent or payment in lieu; outplacement mandatory for 30yr+ service or 45+ year old",protection:"Redenen vereist (reasoned grounds); compensation via Arbeidsrechtbank",keyLaw:"Wet 3/7/1978; Wet 26/12/2013 (Eenheidsstatuut)" },
    working_time:{ maxHours:"38hrs/week; 40hrs possible with CLA + compensation; ADAV (reduced work time) available",overtime:"50% premium normal OT; 100% Sunday/holiday; CLA modulation possible",vacation:"20 days (5-day week) + double holiday pay (vakantiegeld/pécule de vacances)",publicHolidays:"10 national + 1 sectoral holiday by CLA",keyLaw:"Arbeidswet 16/3/1971; KB 25/11/1991" },
    residence:{ eu:"Free movement; commune registration within 3 months; E-kaart residence document",nonEu:"Gecombineerde Vergunning (single permit) + verblijfsvergunning; employer sponsorship",keyLaw:"Wet 4/12/2012 (gecombineerde vergunning); Wet 15/12/1980" },
    contract:{ forms:"Onbepaalde duur, bepaalde duur (justified), vervanging, studentenarbeid",probation:"Abolished since Eenheidsstatuut 2014; no probationary period in indefinite contracts",written:"Fixed-term written mandatory; student written required; indefinite: Dienstzettel",keyLaw:"Arbeidsovereenkomstenwet 3/7/1978; Wet Eenheidsstatuut 2013" },
    health_safety:{ framework:"Wet Welzijn 4/8/1996 (Codex): IDPB (internal) + EDPB (external) prevention advisors mandatory",occupationalDoctor:"Arbeidsgeneesheer mandatory for safety-critical and hazardous functions; CPBW committee",reporting:"Accidents >4 days: notification FOD WASO within 10 days; fatal: immediate",keyLaw:"Wet Welzijn 1996; Codex over het Welzijn op het Werk 2017" },
    industrial:{ tradeUnions:"ACV/CSC, FGTB/ABVV, CGSLB/ACLVB; ~55% density; interprofessional + sector + company CLAs",worksCouncil:"OR/CE: 100+ employees; CPBW: 50+; Syndicale Delegatie: 50+",boardLevel:"No statutory board representation; public-sector exceptions",keyLaw:"Wet 20/9/1948 (OR); NAR/CNT recommendations; Wet Welzijn" },
  },
  AT: {
    pension:{ system:"ASVG points-based PAYG + Abfertigung Neu (Betriebliche Vorsorgekasse) mandatory DC since 2003",type:"Modified NDC Kontenmodell since 2005 — account-based points system transitioning from old formula",retirementAge:"65 men; women 60→65 transitional (2024: 62, reaches 65 by 2033); Langzeitversicherte 60/62",earlyRetirement:"Schwerarbeitspension: 60 after 45yr with heavy work; Hacklerregelung: 60(m)/55(w) + 45yr contributions",lateRetirement:"+4.2% per additional year of deferral; additional accrual points",qualifyingPeriod:"180 months insurance (minimum); 7 contribution months; full pension: 45 insurance years",employerContrib:"ASVG pension (PV): 12.55% of gross salary",employeeContrib:"ASVG pension (PV): 10.25%; total ASVG employee: ~18.07%",ceiling:"ASVG Höchstbeitragsgrundlage: €6,060/mo (2024)",formula:"Annual pension = sum of insurance months × pension percentage (1.78% base) × pension value",indexation:"ASVG-Anpassungsfaktor: CPI-based; political supplements (2024: +9.7%)",minPension:"Ausgleichszulagenrichtsatz: €1,217/mo single (2024) — means-tested social top-up",maxPension:"Effectively capped by Höchstbeitragsgrundlage; ~€3,500/mo ASVG maximum",pillar2:"Abfertigung Neu (BMSVG): 1.5372% employer → Mitarbeitervorsorgekasse (MVK) portable DC individual accounts",pillar3:"Private Lebensversicherung; Pensionskasse (voluntary corporate); Zukunftsvorsorge (discontinued)",recentReforms:"Annual ASVG-Anpassung; Schwerarbeit definition expansions; demographic commission ongoing; no major structural reform since 2005",taxation:"EET for Pensionskassen; ASVG pensions: Einkünfte aus NSA; Pensionistenabsetzbetrag deduction",keyLaw:"ASVG BGBl 1955/189; BMSVG BGBl I 2002/100" },
    social_security:{ overview:"ASVG 5 branches: KV (health 7.65%), UV (accident AUVA), PV (pension 22.8%), AlV (unemployment 6%), + care",totalEmployee:"~18.07% total (KV 3.87%, PV 10.25%, AlV 3%, AK 0.5%)",totalEmployer:"~21.48% + Abfertigung Neu 1.53% + FLAF 3.9% + AUVA ~1.4%",keyLaw:"ASVG BGBl 1955/189; GSVG (self-employed)" },
    death:{ spousePension:"Witwen/Witwerpensioen: unique income-ratio system — 0–60% depending on combined incomes of spouses",orphanPension:"Waisenpension: 24% half-orphan; 36% full orphan; until 18 (27 if studying)",lumpSum:"Abfertigung Neu capital to heirs; AUVA death benefit for work accidents",conditions:"Marriage required; means-tested (unique Austrian system based on income ratio)" },
    disability:{ type:"Invaliditätspension (manual workers) / Berufsunfähigkeitspension (white collar): <50% work capacity in reference profession",amount:"Full pension as if normal retirement; Rehabilitationsgeld for under-50s (rehabilitation priority since 2014)",qualifying:"5 insurance years; PVA medical assessment; Rehageld phase precedes pension for under-50s",duration:"Until standard retirement; annual review; IPR 2014 reform introduced Rehageld priority",keyLaw:"ASVG §254–271; Budgetbegleitgesetz 2011 (Rehageld reform)" },
    medical:{ system:"ÖGK (merged 2020 from 9 regional KV): mandatory statutory health insurance",contribution:"KV: employee 3.87% + employer 3.78% = 7.65% total; additional FLAF employer",private:"Wahlarztsystem (private doctors) partially reimbursed; Zusatzversicherung (supplemental) widely used",coverage:"ÖGK contract doctors free at point of care; Wahlarztzuschuss (partial refund); dental co-payments" },
    parental:{ maternity:"16 weeks (8+8): full net salary via ÖGK Wochengeld",paternity:"Papamonat: 1 month unpaid with protected return right (since 2019 MSchG reform); no dedicated pay",parentalLeave:"Kinderbetreuungsgeld: 4 models (365d–851d flat or income-related max €66/day); until child age 2",childcare:"Gratis-Kindergartenjahr (1yr free before school); Kinderbetreuungsgeld subsidy varies by model",keyLaw:"MSchG (Mutterschutzgesetz); KBGG (Kinderbetreuungsgeldgesetz)" },
    social:{ unemployment:"AMS Arbeitslosengeld: 55% net salary; Notstandshilfe: 92–95% of ALG after exhaustion (no absolute end)",socialAssistance:"Sozialhilfe-Grundsatzgesetz 2019: ~€1,059/mo single; Länder-level implementation",childBenefit:"Familienbeihilfe: €114–€165/mo by age group; universal; Kinderabsetzbetrag €700/child tax credit" },
    perquisites:{ commonBenefits:"Dienstwohnungen, Essenszuschuss (€8/day SV-free), Öffi-Ticket (€29.70/mo tax-free), Deputate",taxFree:"Sachbezug per SachbezugsVO; public transport: €29.70/mo; health promotion lump sum",companyPension:"Pensionskasse: employer tax-deductible; employee: 2.5% tax relief up to €1,000/yr contribution" },
    flexible:{ cafeteria:"Baukastenprinzip: salary conversion for Öffi-Ticket, extra pension, additional leave; cafeteria growing",commonModels:"Non-cash benefits within SachbezugsVO thresholds; salary sacrifice for Pensionskasse" },
    severance:{ notice:"AngG: 6wk (0–2yr) → 5mo (>25yr); Arbeiter: AVRAG separate scales",severance:"Abfertigung Neu: accumulated MVK balance portable (post-2003 hires); Alt system: lump sum for pre-2003",protection:"Kündigungsschutz: BehinderteneinstellungsG; Betriebsrat prior consent for certain dismissals",keyLaw:"AngG; BMSVG (Abfertigung Neu); ArbVG" },
    working_time:{ maxHours:"40hrs/week; 10hrs/day; maximum 60hrs/week (exceptional circumstances); AZG",overtime:"25% premium regular OT; 50% weekend/holiday; or compensatory time off",vacation:"25 working days (<25yr service); 30 days (25yr+); most CLAs grant 25 days uniformly",publicHolidays:"13 public holidays (highest count in EU); most are guaranteed rest days",keyLaw:"AZG (Arbeitszeitgesetz); ARG (Arbeitsruhegesetz)" },
    residence:{ eu:"Free movement; Anmeldung within 3 days mandatory; EU-Bürger Aufenthaltsbescheinigung",nonEu:"Rot-Weiß-Rot-Karte: points-based by category; Blue Card; Niederlassungsbewilligung",keyLaw:"NAG (Niederlassungs- und Aufenthaltsgesetz); AuslBG (Ausländerbeschäftigungsgesetz)" },
    contract:{ forms:"Angestellter (AngG) / Arbeiter (historical distinction fading); unbefristet/befristet",probation:"Probezeit: 1 month standard; some CLAs up to 3 months; freely terminable from both sides",written:"Dienstzettel mandatory within 1 month; electronic valid; NachwG equivalent in AVRAG",keyLaw:"AVRAG; AngG; GlBG (Gleichbehandlungsgesetz)" },
    health_safety:{ framework:"ASchG: employer duty; Präventivfachkräfte (Sicherheitsfachkraft + Arbeitsmediziner) mandatory",occupationalDoctor:"Arbeitsmediziner mandatory by employee-hour thresholds; regular workplace visits; ASchG schedule",reporting:"Arbeitsunfälle: AUVA within 5 days; fatal: immediately by phone to Arbeitsinspektorat",keyLaw:"ASchG BGBl 1994/450; VGÜ; DRÄX" },
    industrial:{ tradeUnions:"ÖGB (7 component unions); ~26% density; unique Kammersystem (WKÖ + AK mandatory)",worksCouncil:"Betriebsrat: 5+ employees (on request); ArbVG: comprehensive co-determination, prior consent for dismissals",boardLevel:"ArbVG §110: 1/3 worker reps on Aufsichtsrat for AG/GmbH above threshold",keyLaw:"ArbVG BGBl 1974/22" },
  },
  DK: {
    pension:{ system:"Three-pillar: Folkepension (universal state) + ATP (mandatory flat contribution) + Sector occupational (quasi-mandatory via CLA)",type:"Flat-rate means-tested state + universal ATP DC + sector funds via collective agreement (90%+ coverage)",retirementAge:"67 (2024); rising to 68 (2030); thereafter linked to life expectancy (set 15yr ahead)",earlyRetirement:"Arne-pension (Tidlig pension): max 3yr early for 29+ years in physically/psychologically demanding work",lateRetirement:"Folkepension deferred: +0.5%/mo beyond 67; actuarial neutrality aim",qualifyingPeriod:"Folkepension: 40yr Danish residence for 100%; 1/40 per year; ATP: no minimum accrues from day 1",employerContrib:"ATP: DKK 2,272/yr flat; occupational: 8–12% total (e.g. DA/LO 12%: 8% employer + 4% employee)",employeeContrib:"ATP: DKK 1,136/yr; occupational: typically 1/3 of total contribution",ceiling:"Folkepension: income-tested above DKK 427,272 earnings; occupational: uncapped",formula:"Folkepension: DKK 91,992/yr single (2024 base); income above threshold reduces by DKK 30.9 per DKK 100",indexation:"Reguleringsprocenterne: weighted wages/CPI blend for public benefits",minPension:"Folkepension base + ældrecheck supplement; garantipension via Pension Denmark schemes",maxPension:"No cap on occupational; Folkepension effectively 0 for very high earners from other pensions",pillar2:"Sector pension funds (PensionDanmark, PKA, Industriens Pension, AP Pension): quasi-mandatory via DA/LO and sector CLAs",pillar3:"Ratepension (max DKK 63,100/yr deductible); Aldersopsparing (DKK 9,100/yr non-deductible); FRI investments",recentReforms:"2022: Arne-pension (early retirement) — major political achievement; 2023: agreement to slow life expectancy indexing; 2024: labour market reform",taxation:"EET for occupational; Folkepension taxed as income; PAL-skat 15.3% on pension fund returns annually",keyLaw:"Lov om social pension; ATP-loven; Pensionsbeskatningsloven; Arne-pension Lov 2021" },
    social_security:{ overview:"Beveridgean universal; mainly tax-financed; minimal contribution element (ATP only)",totalEmployee:"ATP DKK 1,136/yr only; all branches (health, unemployment, social) funded via income tax",totalEmployer:"ATP DKK 2,272/yr; AER (Arbejdsmarkedets Erhvervssikring) for work injuries; no major payroll tax",keyLaw:"ATP-loven; Lov om sygedagpenge; ABL; AES" },
    death:{ spousePension:"No state survivor pension in new system; ATP death sum ~DKK 10,000–60,000; sector pension death cover",orphanPension:"Børnepension via sector pension fund; state child benefit continues",lumpSum:"ATP death payment; sector pension: death cover typically 2–3× salary via collective life insurance",conditions:"Survivor pension mainly via occupational schemes; state entirely individual-based in new system" },
    disability:{ type:"Fleksjob (subsidized employment, partial work capacity) or Førtidspension (complete, very strict criteria)",amount:"Førtidspension: ~DKK 238,000/yr (2024 after tax); income-tested for spouse; supplemented by housing benefit",qualifying:"All other options (retraining, fleksjob, rehabilitation) must be exhausted; Rehabiliteringsteam multi-disciplinary",duration:"Permanent until Folkepension age 67; no conversion",keyLaw:"Lov om social pension; Lov om fleksydelse; Lov om aktiv beskæftigelsesindsats" },
    medical:{ system:"Tax-funded universal healthcare via 5 regions; free at point of use",contribution:"No health insurance contribution; funded via income tax (~sundhedsbidrag abolished 2012, merged to income tax)",private:"Sygeforsikring Danmark (voluntary supplementary): very common employer benefit; dental, glasses",coverage:"Universal yellow/green card; free GP and hospital; patient fee zero; dental partial subsidy" },
    parental:{ maternity:"4wks pre-birth + 14wks post-birth maternal leave; part of 48-wk total family pool",paternity:"2wks paternity + 22wks of shared parental pool (EU directive 2022 reform implementation)",parentalLeave:"48 weeks total: 24wks per parent (9 transferable each); DKK 575/day max dagpenge",childcare:"Pasningsgaranti from 6 months; maxtakst (max parental contribution) based on income; free preschool from 3yr",keyLaw:"Barselsloven; Dagtilbudsloven; new 2022 structure" },
    social:{ unemployment:"Dagpenge: 90% salary max DKK 19,322/mo; a-kasse membership required; 2yr in 3yr qualifying",socialAssistance:"Kontanthjælp: DKK 14,192/mo under 30; activation (jobplan) mandatory",childBenefit:"Børnetilskud: DKK 5,034/qtr (0–2yr); DKK 3,975/qtr (3–6yr); DKK 3,258/qtr (7–17yr); universal" },
    perquisites:{ commonBenefits:"Firmabil (company car; 25% annual taxable value BIK), sundhedsforsikring (employer-provided), kantine",taxFree:"Multi-media tax abolished; frisundhedsforsikring treatment tax-free; no general benefit exemption",companyPension:"Standard sector pension via DA/LO; employer contributions fully deductible; no special regime needed" },
    flexible:{ cafeteria:"Cafeteriaordninger: salary sacrifice for extra pension, Bike to Work, extra vacation allowance",commonModels:"Cykelordning (cycle benefit), extra pension top-up, sundhedsforsikring; increasing private sector use" },
    severance:{ notice:"Funktionærloven (white collar): 1mo (0–6mo) → 6mo (9yr+); Overenskomst for blue collar",severance:"Fratrædelsesgodtgørelse: 1mo salary (12yr+), 3mo salary (17yr+); DHL termination obligation",protection:"Saglig grund required; Ligebehandlingsnævnet for discrimination; no reinstatement general rule",keyLaw:"Funktionærloven; Ansættelsesbevisloven; Ligebehandlingsloven; Afskedigelsesnævn" },
    working_time:{ maxHours:"48hrs/week average (4-month reference); Arbejdstidsloven EU WTD implementation",overtime:"No statutory OT premium; CLA sets rules; most white collar: time off in lieu",vacation:"25 days (5 weeks) concurrent system since 2020 (earn and spend same year)",publicHolidays:"10 red days nationally; most companies give 25 Dec, 24 Dec, 31 Dec additionally",keyLaw:"Ferieloven 2018 (concurrent holiday); Arbejdstidsloven 2003" },
    residence:{ eu:"Free movement; Statsforvaltningen registration for 3mo+",nonEu:"Pay Limit Scheme DKK 462,300/yr; Positive List; Fast-Track Certification for approved employers",keyLaw:"Udlændingeloven; Udl. BKG om arbejdstilladelse" },
    contract:{ forms:"Funktionær or non-funktionær; indefinite or fixed-term; Overenskomst-based for sector employees",probation:"Up to 3 months standard; Funktionærloven 9 months possible with sector agreement",written:"Ansættelsesbevisloven: written statement within 7 days (1 day since 2022 EU directive reform)",keyLaw:"Funktionærloven; Ansættelsesbevisloven 1993 (rev.2022)" },
    health_safety:{ framework:"Arbejdsmiljøloven: employer systematic APV (workplace assessment) mandatory every 3yr",occupationalDoctor:"Bedriftssundhedstjeneste: mandatory for defined sectors (manufacturing, construction, health); voluntary others",reporting:"Arbejdsulykker: via Easy-system (Arbejdstilsynet) within 9 days; fatal: phone within 24hr + written",keyLaw:"Arbejdsmiljøloven; Bkg. nr.1325/2020 (anmeldelse)" },
    industrial:{ tradeUnions:"FH (LO/FTF merged 2019), AC, Lederne; ~65% density; September-kompromis bipartite model",worksCouncil:"SU (Samarbejdsudvalg): 35+ employees under DA/LO Main Agreement; information and consultation",boardLevel:"Selskabsloven §140: 1/3 employee board reps for companies with 35+ employees (on employee request)",keyLaw:"Selskabsloven kap.8A; Samarbejdsaftalen DA/LO; Medbestemmelsesloven" },
  },
  PT: {
    pension:{ system:"Two-pillar: RGSS General Social Security (1st state) + Voluntary PPR/Fundos de Pensões (3rd/2nd hybrid)",type:"Earnings-related PAYG with sustainability factor; no mandatory occupational (only voluntary FPs)",retirementAge:"66yr 4mo (2024); adjusted annually by life expectancy increase (OVD formula)",earlyRetirement:"Flexible pension from 60 with 40yr contributions; penalty 0.5%/month before normal age",lateRetirement:"+0.33%/month deferred beyond normal age (majoração)",qualifyingPeriod:"15 calendar years with contributions; 144 months minimum",employerContrib:"23.75% TSU (Taxa Social Única) employer contribution",employeeContrib:"11% TSU employee contribution",ceiling:"No ceiling — full salary subject to contributions",formula:"Average career salary (valorized by CPI) × accrual rate (2.0–2.3%/yr) × sustainability factor SDG",indexation:"IPC (CPI); additional revalorização when GDP growth >2% for 2 years",minPension:"~€486/mo (15yr contribution); Complemento de Solidariedade top-up",maxPension:"12× IAS × 12/month; practical max ~€5,765/mo (2024)",pillar2:"Fundos de Pensões: voluntary occupational (mainly banks, utilities, public sector); limited private sector uptake",pillar3:"PPR (Planos Poupança Reforma): 20% tax deduction (age-based limits: €400/€350/€300); growing market",recentReforms:"SDG sustainability factor reduced penalty for long careers; 2023 Budget: above-inflation valorization; carreiras longas (long careers) flexibility; 2022 OVD formula adjustment",taxation:"EET; CIRS progressive rates on pension income; IRS deduction for pensioners",keyLaw:"Lei de Bases SS L.4/2007; DL 187/2007 (pension calculation); CRCSPSS" },
    social_security:{ overview:"ISS.IP (Instituto da Segurança Social) administration; CNP (Centros Nacionais de Pensões)",totalEmployee:"11% TSU + 0.5% ADSE (civil servants only)",totalEmployer:"23.75% TSU; reduced rates for youth employment, specific contract types",keyLaw:"CRCSPSS; Lei de Bases SS L.4/2007" },
    death:{ spousePension:"Pensão de sobrevivência: 60% (marriage ≥3yr); 70% with dependent children; income not tested",orphanPension:"20% per child; 40% full orphan; until 22 if studying",lumpSum:"Subsídio por morte: 3× IAS base = ~€1,488 (2024); subsídio de funeral €110",conditions:"Marriage or de facto union ≥2yr recognised; divorced with alimony also entitled" },
    disability:{ type:"Pensão de invalidez relativa (50–66.66% incapacity) or absoluta (≥66.66%); IP percentages",amount:"Relative: progressive formula; Absolute: enhanced formula; work accidents: INSS separate track",qualifying:"5yr contributions (3yr absolute work accident); SNS medical assessment",duration:"Until 65/66; annual medical review; vocational rehabilitation priority",keyLaw:"DL 187/2007; DL 220/2006 (work accidents)" },
    medical:{ system:"SNS (Serviço Nacional de Saúde): universal, mostly free; regional health administrations (ARS)",contribution:"0.5% ADSe for state civil servants; SNS funded via general taxation",private:"ADSE subsystem for civil servants; company health plans growing; seguro de saúde market",coverage:"Universal; taxas moderadoras (co-payments) apply with many exemptions; chronic disease free" },
    parental:{ maternity:"120 days initial parental (100% salary via SS) or 150 days at 83%; father takes 30 bonus days at 100%",paternity:"28 days (20 mandatory + 8 optional) at 100% salary via INSS",parentalLeave:"Licença parental complementar: up to 3 months unpaid; extended 30 days at 25%; adoption equivalent",childcare:"Rede de creches: income-adjusted fees (0–100% income); free creche for income <1×SMN since 2023",keyLaw:"CT Art.33–65; DL 91/2009; CT 2023 (maternidade reform)" },
    social:{ unemployment:"Subsídio de desemprego: 65% reference salary; base 12 months extended by age; 360 qualifying days in 2yr",socialAssistance:"RSI (Rendimento Social de Inserção): €247/mo (reference IAS); activation obligation",childBenefit:"Abono de família: €145/mo tier 1 (means-tested); universal for 0–3 since 2023" },
    perquisites:{ commonBenefits:"Viatura, telemóvel, subsídio de alimentação (€6.91/day cheque tax-free), plafond restauração",taxFree:"Meal allowance €6.91/day cheque; transport: public transport 100% IRS deductible; PPR bonus",companyPension:"Fundos de pensões contributions employer deductible; PPR 20% extra IRS deduction" },
    flexible:{ cafeteria:"Growing post-2020; no specific legislation; salary optimization within CT and IRS rules",commonModels:"PPR contributions; meal allowance maximisation; health insurance; teletrabalho expense allowance" },
    severance:{ notice:"CT: 15d (<1yr) → 90d (10yr+); employer must give written reasoned notice",severance:"Compensação: 20 days/yr base salary; cap at higher of 12× monthly or 240× daily salary (€200/d max 2024)",protection:"Extinção posto or disciplinary; CITE maternity/pregnancy protection; ACT inspection",keyLaw:"CT (Código do Trabalho) L.7/2009 (rev); DL 47/2023" },
    working_time:{ maxHours:"40hrs/week; 10hrs/day; 200hrs OT/yr; 4-day week pilot 2023 — formal evaluation underway",overtime:"25% premium first hr/day; 37.5% subsequent; 50% rest days/holidays",vacation:"22 working days minimum; up to 25 days with attendance record; non-replaceable by pay",publicHolidays:"13 national public holidays",keyLaw:"CT Art.197–229; DL 259/98" },
    residence:{ eu:"Free movement; Certificado de Registo for 3mo+ stays; AIMA replaces SEF (2023)",nonEu:"Visto D for work activity; Digital Nomad D8 visa since 2022 (Portaria 71/2022)",keyLaw:"Lei 23/2007 (Lei de Estrangeiros); Portaria 71/2022 (D8 visa)" },
    contract:{ forms:"Sem termo (indefinite), a termo certo (fixed, justified, max 3yr), temporário, trabalho temporário",probation:"90 days standard; 180 days management/trust roles; 240 days first-job seekers",written:"Fixed-term: written mandatory; indefinite: written strongly recommended; CT Art.110",keyLaw:"CT L.7/2009 (rev); DL 47/2023" },
    health_safety:{ framework:"Lei 102/2009 (RJPSS): employer prevention duty; SST (health & safety service) mandatory",occupationalDoctor:"Médico do trabalho mandatory; min 35–45hrs/250 workers/yr; health surveillance schedule",reporting:"Acidentes trabalho: insurer within 24h; fatal: ACT immediate phone notification + written",keyLaw:"Lei 102/2009; CT Art.281–284; ACT enforcement" },
    industrial:{ tradeUnions:"CGTP, UGT; ~17% density; sectoral CCT (Convenções Coletivas de Trabalho)",worksCouncil:"Comissão de Trabalhadores: right to information, consultation; CT Art.421–422",boardLevel:"CT Art.54: worker commission production oversight; no board-level representation generally",keyLaw:"CT Art.419–422; Lei 65/77 (direito à greve)" },
  },
};

// Simple markdown renderer
function renderMd(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(<h3 key={i} style={{fontSize:"14px",fontWeight:"700",color:"var(--text-primary)",margin:"16px 0 6px",borderBottom:"1px solid var(--border)",paddingBottom:"4px",fontFamily:"var(--font-sans)"}}>{line.slice(3)}</h3>);
    } else if (line.startsWith("### ")) {
      elements.push(<h4 key={i} style={{fontSize:"13px",fontWeight:"700",color:"var(--text-primary)",margin:"12px 0 4px"}}>{line.slice(4)}</h4>);
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(<p key={i} style={{margin:"8px 0 2px",fontWeight:"700",color:"var(--text-primary)",fontSize:"13px"}}>{line.slice(2,-2)}</p>);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.*?)\*\*/g);
      elements.push(<div key={i} style={{display:"flex",gap:"8px",margin:"3px 0",alignItems:"flex-start"}}>
        <span style={{color:"var(--accent)",fontWeight:"700",flexShrink:0,marginTop:"1px"}}>›</span>
        <span style={{fontSize:"13px",color:"var(--text-primary)",lineHeight:"1.6"}}>{parts.map((p,j)=>j%2===0?p:<strong key={j}>{p}</strong>)}</span>
      </div>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{height:"8px"}}/>);
    } else {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      if (parts.length > 1) {
        elements.push(<p key={i} style={{fontSize:"13px",color:"var(--text-primary)",lineHeight:"1.7",margin:"4px 0"}}>{parts.map((p,j)=>j%2===0?p:<strong key={j} style={{color:"var(--text-primary)"}}>{p}</strong>)}</p>);
      } else if (line.trim()) {
        elements.push(<p key={i} style={{fontSize:"13px",color:"var(--text-primary)",lineHeight:"1.7",margin:"4px 0"}}>{line}</p>);
      }
    }
    i++;
  }
  return elements;
}

const PENSION_SUB_TABS = [
  {id:"all",label:"All Fields"},
  {id:"overview",label:"Overview & Ages",keys:["system","type","retirementAge","earlyRetirement","lateRetirement"]},
  {id:"contributions",label:"Contributions",keys:["qualifyingPeriod","employerContrib","employeeContrib","ceiling"]},
  {id:"benefits",label:"Benefits & Formula",keys:["formula","indexation","minPension","maxPension"]},
  {id:"pillars",label:"Pillars 2 & 3",keys:["pillar2","pillar3"]},
  {id:"reforms",label:"Reforms & Tax",keys:["recentReforms","taxation","keyLaw"]},
];

const FIELD_LABELS_MAP = {
  system:"System Structure", type:"System Type", retirementAge:"Retirement Age",
  earlyRetirement:"Early Retirement", lateRetirement:"Late Retirement Incentive",
  qualifyingPeriod:"Qualifying Period", employerContrib:"Employer Contribution",
  employeeContrib:"Employee Contribution", ceiling:"Contribution Ceiling",
  formula:"Benefit Formula", indexation:"Indexation Mechanism",
  minPension:"Minimum Pension", maxPension:"Maximum Pension",
  pillar2:"2nd Pillar (Occupational)", pillar3:"3rd Pillar (Private)",
  recentReforms:"Recent Reforms (2020–2024)", taxation:"Taxation",
  keyLaw:"Key Legislation", overview:"Overview", branches:"Insurance Branches",
  totalEmployee:"Total Employee Contributions", totalEmployer:"Total Employer Contributions",
  spousePension:"Spouse / Survivor Pension", orphanPension:"Orphan Pension",
  lumpSum:"Lump Sum / Death Grant", conditions:"Eligibility Conditions",
  amount:"Benefit Amount", qualifying:"Qualifying Conditions",
  duration:"Duration", contribution:"Contribution Rate", private:"Private Insurance",
  coverage:"Coverage", maternity:"Maternity Leave", paternity:"Paternity Leave",
  parentalLeave:"Parental Leave", childcare:"Childcare Support",
  unemployment:"Unemployment Benefit", socialAssistance:"Social Assistance",
  childBenefit:"Child Benefit", commonBenefits:"Common Employer Benefits",
  taxFree:"Tax-Free Benefit Rules", companyPension:"Company Pension",
  cafeteria:"Cafeteria / Flexible Plan", commonModels:"Common Models Used",
  notice:"Notice Period", severance:"Severance Payment", protection:"Employment Protection",
  maxHours:"Maximum Working Hours", overtime:"Overtime Rules",
  vacation:"Annual Vacation", publicHolidays:"Public Holidays",
  eu:"EU Citizens", nonEu:"Non-EU Citizens", forms:"Contract Forms",
  probation:"Probation Period", written:"Written Form Requirements",
  framework:"Legal Framework", occupationalDoctor:"Occupational Doctor",
  reporting:"Accident Reporting", tradeUnions:"Trade Unions",
  worksCouncil:"Works Council", boardLevel:"Board-Level Representation",
};

export default function ToolPage() {
  const [activeCategory, setActiveCategory] = useState("pension");
  const [selectedCountries, setSelectedCountries] = useState(["DE","FR","GB","NL","SE"]);
  const [pensionTab, setPensionTab] = useState("all");
  const [detailPanel, setDetailPanel] = useState(null);
  const [aiCache, setAiCache] = useState({});
  const [loadingKey, setLoadingKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const streamRef = useRef({});

  const toggleCountry = (code) => {
    setSelectedCountries(prev =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(c => c !== code) : prev
        : prev.length < 6 ? [...prev, code] : prev
    );
  };

  const activeCountries = COUNTRIES.filter(c => selectedCountries.includes(c.code));

  const getCategoryFields = useCallback((cat) => {
    const sample = DATA["DE"][cat] || {};
    return Object.keys(sample);
  }, []);

  const categoryFields = getCategoryFields(activeCategory);

  const filteredFields = pensionTab !== "all" && activeCategory === "pension"
    ? (PENSION_SUB_TABS.find(t => t.id === pensionTab)?.keys || categoryFields)
    : categoryFields;

  const searchFiltered = searchTerm
    ? filteredFields.filter(f =>
        (FIELD_LABELS_MAP[f]||f).toLowerCase().includes(searchTerm.toLowerCase()) ||
        activeCountries.some(c => (DATA[c.code]?.[activeCategory]?.[f]||"").toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredFields;

  const openDetail = async (country, category, field) => {
    const key = `${country.code}-${category}-${field}`;
    const fieldLabel = FIELD_LABELS_MAP[field] || field;
    const summaryData = DATA[country.code]?.[category]?.[field] || "";
    const catLabel = CATEGORIES.find(c => c.id === category)?.label || category;

    setDetailPanel({ country, category, field, fieldLabel, catLabel, summaryData, key });

    if (aiCache[key] || loadingKey === key) return;

    setLoadingKey(key);
    setAiCache(prev => ({ ...prev, [key]: { loading: true, text: "" } }));

    try {
      const prompt = `You are a senior European HR and employment law expert writing for experienced HR professionals at multinational companies.

Provide a comprehensive, detailed explanation of **${fieldLabel}** in **${country.name}** under the category: ${catLabel}.

Official data summary: "${summaryData}"

Structure your response with these sections (use ## for headers):

## How It Works
Explain the detailed mechanics, calculation methods, and legal structure. Be specific with numbers, percentages, thresholds, formulas.

## Key Details for HR Professionals
Cover employer obligations, employee rights, practical implementation steps, deadlines, and common pitfalls.

## Recent Changes & Upcoming Reforms
Any significant changes since 2020, pending legislation, or expected reforms in the next 2–3 years.

## Comparison Context
Briefly note how this compares to 2–3 neighbouring European countries (e.g., higher/lower, more/less generous, different approach).

Use **bold** for key numbers and important terms. Be specific and practical — avoid generic statements. Write approximately 350–450 words total.`;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          stream: true,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                accumulated += parsed.delta.text;
                setAiCache(prev => ({ ...prev, [key]: { loading: false, text: accumulated, streaming: true } }));
              }
            } catch {}
          }
        }
      }
      setAiCache(prev => ({ ...prev, [key]: { loading: false, text: accumulated, streaming: false } }));
    } catch (err) {
      setAiCache(prev => ({ ...prev, [key]: { loading: false, text: "Error loading analysis. Please try again.", streaming: false } }));
    } finally {
      setLoadingKey(null);
    }
  };

  const currentCatDef = CATEGORIES.find(c => c.id === activeCategory);
  const panelSources = detailPanel ? (SOURCES[detailPanel.country.code]?.[detailPanel.category] || []) : [];
  const aiData = detailPanel ? aiCache[detailPanel.key] : null;

  const S = {
    app: { fontFamily:'var(--font-sans)', minHeight:"100vh", color:"var(--text-primary)", display:"flex", flexDirection:"column" },
    header: { background:"linear-gradient(180deg,var(--bg-1) 0%,var(--bg-0) 100%)", borderBottom:"1px solid var(--accent-border)", padding:"20px 28px 0", flexShrink:0 },
    title: { fontSize:"24px", fontWeight:"700", color:"var(--text-primary)", letterSpacing:"0.3px", marginBottom:"2px" },
    subtitle: { fontSize:"11px", color:"var(--text-secondary)", fontFamily:'var(--font-mono)', letterSpacing:"3px", textTransform:"uppercase", marginBottom:"16px" },
    layout: { display:"flex", flex:1, overflow:"hidden" },
    tableArea: { flex:1, overflow:"auto", padding:"20px 24px" },
    countryBtn: (sel) => ({ background:sel?"var(--accent-dim)":"transparent", border:sel?"1px solid var(--accent-dim)":"1px solid var(--bg-3)", color:sel?"var(--accent)":"var(--text-secondary)", padding:"5px 12px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", display:"flex", alignItems:"center", gap:"5px", transition:"all 0.15s", fontFamily:'var(--font-sans)' }),
    catTab: (act) => ({ padding:"10px 14px", cursor:"pointer", fontSize:"11px", color:act?"var(--accent)":"var(--text-secondary)", borderBottom:act?"2px solid var(--accent)":"2px solid transparent", whiteSpace:"nowrap", background:"none", border:"none", borderBottom: act?"2px solid var(--accent)":"2px solid transparent", fontFamily:'var(--font-sans)', letterSpacing:"0.3px", transition:"all 0.15s" }),
    table: { width:"100%", borderCollapse:"collapse", fontSize:"12.5px", fontFamily:'var(--font-sans)' },
    th: (i) => ({ padding:"10px 14px", background:i===0?"var(--bg-0)":"var(--bg-1)", color:"var(--accent)", fontSize:"11px", fontWeight:"700", letterSpacing:"1px", textTransform:"uppercase", borderBottom:"1px solid var(--accent-border)", position:"sticky", top:0, left:i===0?0:"auto", zIndex:i===0?4:2, minWidth:i===0?"150px":"200px", whiteSpace:"nowrap" }),
    tr: (i,hover) => ({ background:hover?"var(--bg-3)":(i%2===0?"var(--bg-0)":"var(--bg-1)"), cursor:"pointer", transition:"background 0.1s" }),
    td: (i,highlight) => ({ padding:"10px 14px", borderBottom:"1px solid var(--bg-1)", color:i===0?(highlight?"var(--accent)":"var(--accent)"):"var(--text-secondary)", fontWeight:i===0?"600":"400", lineHeight:"1.5", verticalAlign:"top", position:i===0?"sticky":"static", left:i===0?0:"auto", background:"inherit", zIndex:i===0?1:"auto", minWidth:i===0?"150px":"200px", fontSize:"12px", borderLeft:highlight&&i===0?"2px solid var(--accent)":"2px solid transparent" }),
    panel: { width:"480px", flexShrink:0, background:"var(--bg-2)", borderLeft:"1px solid var(--accent-border)", display:"flex", flexDirection:"column", overflow:"hidden", transition:"width 0.3s" },
    panelHeader: { background:"var(--bg-3)", padding:"20px", borderBottom:"1px solid var(--accent-border)" },
    panelBody: { flex:1, overflow:"auto", padding:"20px" },
    sourceLink: { display:"flex", alignItems:"flex-start", gap:"10px", padding:"10px 12px", background:"var(--bg-0)", border:"1px solid var(--border)", borderRadius:"4px", marginBottom:"8px", textDecoration:"none", transition:"all 0.15s", cursor:"pointer" },
    subTab: (act) => ({ padding:"6px 12px", background:act?"var(--accent)":"transparent", color:act?"var(--bg-0)":"var(--text-secondary)", border:"1px solid "+(act?"var(--accent)":"var(--bg-3)"), borderRadius:"3px", cursor:"pointer", fontSize:"11px", fontFamily:'var(--font-sans)', fontWeight:act?"700":"400", transition:"all 0.15s" }),
    appShell: {
      position: 'relative',
      isolation: 'isolate',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    appBgVideo: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: -1,
      pointerEvents: 'none',
    },
    appHeader: {
      background: 'var(--bg-0)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    headerLogoLink: {
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    headerLogoMark: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: -1,
      color: 'var(--text-primary)',
    },
    headerLogoBracket: { color: 'var(--accent)' },
    headerLogoCursor: {
      color: 'var(--accent)',
      animation: 'fp-blink 1.1s step-end infinite',
    },
    headerAppName: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
    },
    appContent: {
      flex: 1,
      background: 'oklch(0.04 0.01 240 / 0.85)',
      overflow: 'auto',
    },
  };

  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div style={S.appShell}>
      <video autoPlay muted loop playsInline style={S.appBgVideo}>
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <header style={S.appHeader}>
        <Link to="/" style={S.headerLogoLink}>
          <span style={S.headerLogoMark}>
            <span style={S.headerLogoBracket}>[</span>
            FP
            <span style={S.headerLogoBracket}>]</span>
            <span style={S.headerLogoCursor}>_</span>
          </span>
          <span style={S.headerAppName}>EU HR Navigator</span>
        </Link>
      </header>
      <div style={S.appContent}>
    <div style={S.app}>
      <div style={S.header}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"}}>
          <div>
            <div style={S.subtitle}>Western Europe · HR Legislation Navigator</div>
            <div style={S.title}>Employment Law Intelligence Platform</div>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <input
              placeholder="🔍 Search field or value..."
              value={searchTerm}
              onChange={e=>setSearchTerm(e.target.value)}
              style={{background:"var(--bg-3)",border:"1px solid var(--border)",borderRadius:"4px",padding:"7px 12px",color:"var(--text-primary)",fontSize:"12px",fontFamily:"var(--font-sans)",width:"220px",outline:"none"}}
            />
            <div style={{fontSize:"11px",color:"var(--text-secondary)",fontFamily:"var(--font-mono)"}}>Click any cell → Deep AI Analysis</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
          {COUNTRIES.map(c => (
            <button key={c.code} style={S.countryBtn(selectedCountries.includes(c.code))} onClick={()=>toggleCountry(c.code)}>
              <span>{c.flag}</span><span>{c.name}</span>
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:"0",overflowX:"auto",borderTop:"1px solid var(--border)"}}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} style={S.catTab(activeCategory===cat.id)} onClick={()=>{setActiveCategory(cat.id);setSearchTerm("");setPensionTab("all");}}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={S.layout}>
        <div style={S.tableArea}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <div>
              <div style={{fontSize:"11px",color:"var(--text-secondary)",fontFamily:"var(--font-mono)",letterSpacing:"2px",textTransform:"uppercase"}}>
                {currentCatDef?.icon} {currentCatDef?.label} · {activeCountries.length} countries
              </div>
              {activeCategory==="pension" && (
                <div style={{display:"flex",gap:"6px",marginTop:"8px",flexWrap:"wrap"}}>
                  {PENSION_SUB_TABS.map(t => (
                    <button key={t.id} style={S.subTab(pensionTab===t.id)} onClick={()=>setPensionTab(t.id)}>{t.label}</button>
                  ))}
                </div>
              )}
            </div>
            {detailPanel && (
              <button onClick={()=>setDetailPanel(null)} style={{background:"transparent",border:"1px solid var(--border)",color:"var(--text-secondary)",padding:"6px 12px",borderRadius:"3px",cursor:"pointer",fontSize:"11px",fontFamily:"var(--font-sans)"}}>
                ✕ Close Panel
              </button>
            )}
          </div>

          <div style={{overflowX:"auto",borderRadius:"6px",border:"1px solid var(--border)"}}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th(0)}>Field</th>
                  {activeCountries.map((c,i)=>(
                    <th key={c.code} style={S.th(i+1)}>{c.flag} {c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchFiltered.map((field, fi) => {
                  const label = FIELD_LABELS_MAP[field] || field;
                  const isActive = detailPanel?.field === field;
                  return (
                    <tr key={field} style={S.tr(fi, hoveredRow===field)}
                      onMouseEnter={()=>setHoveredRow(field)}
                      onMouseLeave={()=>setHoveredRow(null)}
                    >
                      <td style={S.td(0, isActive)}>
                        <div>{label}</div>
                        {isActive && <div style={{fontSize:"9px",color:"var(--accent-dim)",marginTop:"2px",fontFamily:"var(--font-mono)"}}>ANALYZING</div>}
                      </td>
                      {activeCountries.map((c)=>{
                        const val = DATA[c.code]?.[activeCategory]?.[field];
                        const isActiveCell = detailPanel?.field===field && detailPanel?.country?.code===c.code;
                        return (
                          <td key={c.code}
                            style={{...S.td(1), background:isActiveCell?"var(--bg-3)":undefined, borderLeft:isActiveCell?"2px solid var(--accent)":"2px solid transparent", cursor:"pointer"}}
                            onClick={()=>openDetail(c, activeCategory, field)}
                            title="Click for deep AI analysis + sources"
                          >
                            {val || <span style={{color:"var(--text-primary)",fontSize:"11px"}}>—</span>}
                            {isActiveCell && <div style={{fontSize:"9px",color:"var(--accent)",marginTop:"3px",fontFamily:"var(--font-mono)"}}>▶ VIEWING</div>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {searchFiltered.length===0 && (
            <div style={{textAlign:"center",padding:"48px",color:"var(--text-secondary)",fontFamily:"var(--font-sans)",fontSize:"13px"}}>No fields match "{searchTerm}"</div>
          )}
          <div style={{marginTop:"20px",fontSize:"10px",color:"var(--text-primary)",fontFamily:"var(--font-mono)",borderTop:"1px solid var(--border)",paddingTop:"12px"}}>
            Data reflects legislation and CLAs as of 2024 · Click any cell for AI-generated detailed analysis · Select up to 6 countries · Always verify with local counsel
          </div>
        </div>

        {detailPanel && (
          <div style={S.panel}>
            <div style={S.panelHeader}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:"11px",color:"var(--text-secondary)",fontFamily:"var(--font-mono)",letterSpacing:"2px",marginBottom:"4px"}}>
                    {detailPanel.catLabel.toUpperCase()}
                  </div>
                  <div style={{fontSize:"20px",marginBottom:"2px"}}>{detailPanel.country.flag}</div>
                  <div style={{fontSize:"16px",fontWeight:"700",color:"var(--text-primary)"}}>{detailPanel.country.name}</div>
                  <div style={{fontSize:"13px",color:"var(--accent)",marginTop:"2px"}}>{detailPanel.fieldLabel}</div>
                </div>
                <button onClick={()=>setDetailPanel(null)} style={{background:"transparent",border:"none",color:"var(--text-secondary)",cursor:"pointer",fontSize:"18px",padding:"0"}}>×</button>
              </div>
            </div>

            <div style={S.panelBody}>
              {/* Summary box */}
              <div style={{background:"var(--bg-0)",border:"1px solid var(--border)",borderRadius:"4px",padding:"12px 14px",marginBottom:"16px"}}>
                <div style={{fontSize:"10px",color:"var(--text-secondary)",fontFamily:"var(--font-mono)",letterSpacing:"2px",marginBottom:"6px"}}>OFFICIAL DATA SUMMARY</div>
                <div style={{fontSize:"12.5px",color:"var(--text-primary)",lineHeight:"1.6",fontFamily:"var(--font-sans)"}}>{detailPanel.summaryData}</div>
              </div>

              {/* AI Analysis */}
              <div style={{marginBottom:"20px"}}>
                <div style={{fontSize:"10px",color:"var(--text-secondary)",fontFamily:"var(--font-mono)",letterSpacing:"2px",marginBottom:"10px",display:"flex",alignItems:"center",gap:"8px"}}>
                  <span>✦ AI DEEP ANALYSIS</span>
                  {aiData?.streaming && <span style={{color:"var(--accent)",animation:"pulse 1s infinite"}}>● GENERATING</span>}
                </div>
                {aiData?.loading && !aiData?.text && (
                  <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                    {[100,85,92,70,88].map((w,i)=>(
                      <div key={i} style={{height:"12px",background:"var(--bg-2)",borderRadius:"2px",width:`${w}%`,animation:"pulse 1.5s ease-in-out infinite",animationDelay:`${i*0.1}s`}}/>
                    ))}
                    <div style={{fontSize:"11px",color:"var(--text-secondary)",fontFamily:"var(--font-sans)",marginTop:"4px"}}>Generating detailed analysis…</div>
                  </div>
                )}
                {aiData?.text && (
                  <div style={{fontSize:"13px",color:"var(--text-primary)",lineHeight:"1.7",fontFamily:"var(--font-sans)"}}>
                    {renderMd(aiData.text)}
                  </div>
                )}
                {!aiData && (
                  <div style={{fontSize:"12px",color:"var(--text-secondary)",fontFamily:"var(--font-sans)",fontStyle:"italic"}}>Loading analysis…</div>
                )}
              </div>

              {/* Official Sources */}
              {panelSources.length > 0 && (
                <div>
                  <div style={{fontSize:"10px",color:"var(--text-secondary)",fontFamily:"var(--font-mono)",letterSpacing:"2px",marginBottom:"10px"}}>⊕ OFFICIAL SOURCES & REFERENCES</div>
                  {panelSources.map((src, i) => (
                    <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" style={S.sourceLink}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.background="var(--bg-1)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--bg-0)";}}>
                      <div style={{flexShrink:0,width:"24px",height:"24px",background:"var(--bg-3)",borderRadius:"3px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"var(--accent)",fontWeight:"700"}}>↗</div>
                      <div>
                        <div style={{fontSize:"12px",fontWeight:"600",color:"var(--text-primary)",marginBottom:"2px",fontFamily:"var(--font-sans)"}}>{src.label}</div>
                        <div style={{fontSize:"11px",color:"var(--text-secondary)",lineHeight:"1.4",fontFamily:"var(--font-sans)"}}>{src.desc}</div>
                        <div style={{fontSize:"10px",color:"var(--text-secondary)",marginTop:"2px",fontFamily:"var(--font-mono)"}}>{src.url}</div>
                      </div>
                    </a>
                  ))}
                  <div style={{fontSize:"10px",color:"var(--text-secondary)",fontFamily:"var(--font-sans)",marginTop:"8px",fontStyle:"italic",lineHeight:"1.5"}}>
                    Sources verified as of 2024. Government portal URLs may change; always verify current URL via official search.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        *::-webkit-scrollbar{width:4px;height:4px}
        *::-webkit-scrollbar-track{background:var(--bg-0)}
        *::-webkit-scrollbar-thumb{background:var(--accent-dim);border-radius:2px}
      `}</style>
    </div>
      </div>
    </div>
  );
}
