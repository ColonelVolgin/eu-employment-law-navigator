import { useNavigate } from 'react-router-dom'

const S = {
  hero: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-end',
  },
  heroVideo: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    background: `
      linear-gradient(to top, var(--bg-0) 0%, oklch(0.04 0.01 240 / 0.65) 40%, oklch(0.04 0.01 240 / 0.15) 70%, transparent 100%),
      linear-gradient(to right, oklch(0.04 0.01 240 / 0.5) 0%, transparent 60%)
    `,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    padding: '0 80px 80px',
    maxWidth: 900,
  },
  logo: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: -1,
    color: 'var(--text-primary)',
    marginBottom: 32,
  },
  logoBracket: { color: 'var(--accent)' },
  logoCursor: {
    color: 'var(--accent)',
    animation: 'fp-blink 1.1s step-end infinite',
  },
  eyebrow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: 24,
  },
  eyebrowLine: {
    display: 'inline-block',
    width: 16,
    height: 1,
    background: 'var(--accent)',
    flexShrink: 0,
  },
  title: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'clamp(72px, 9vw, 120px)',
    fontWeight: 700,
    lineHeight: 0.92,
    letterSpacing: '-4px',
    color: 'var(--text-primary)',
    marginBottom: 24,
  },
  titleEm: {
    color: 'var(--accent)',
    fontStyle: 'normal',
  },
  sub: {
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
    maxWidth: 460,
    marginBottom: 40,
  },
  cta: {
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    fontWeight: 600,
    padding: '14px 30px',
    borderRadius: 5,
    border: 'none',
    background: 'var(--accent)',
    color: '#0a0800',
    cursor: 'pointer',
    transition: 'all 0.16s var(--ease)',
    letterSpacing: '-0.2px',
  },
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <section style={S.hero}>
      <video autoPlay muted loop playsInline style={S.heroVideo}>
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div style={S.heroOverlay} />
      <div style={S.heroContent}>
        <span style={S.logo}>
          <span style={S.logoBracket}>[</span>
          FP
          <span style={S.logoBracket}>]</span>
          <span style={S.logoCursor}>_</span>
        </span>
        <div style={S.eyebrow}>
          <span style={S.eyebrowLine} />
          EU Employment Law Intelligence
        </div>
        <h1 style={S.title}>
          Employment Law<br />
          <em style={S.titleEm}>Navigator</em>
        </h1>
        <p style={S.sub}>
          Western Europe · AI-powered analysis
        </p>
        <button
          type="button"
          style={S.cta}
          onClick={() => navigate('/app')}
          onMouseEnter={e => Object.assign(e.currentTarget.style, {
            filter: 'brightness(1.12)',
            transform: 'translateY(-1px)',
            boxShadow: 'var(--glow)',
          })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {
            filter: '',
            transform: '',
            boxShadow: '',
          })}
        >
          Navigate →
        </button>
      </div>
    </section>
  )
}
