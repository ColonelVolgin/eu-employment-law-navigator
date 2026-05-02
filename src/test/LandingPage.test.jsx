import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage.jsx'

test('renders [FP]_ logo mark', () => {
  render(<MemoryRouter><LandingPage /></MemoryRouter>)
  expect(screen.getByText('FP')).toBeInTheDocument()
})

test('renders Navigate CTA button', () => {
  render(<MemoryRouter><LandingPage /></MemoryRouter>)
  expect(screen.getByRole('button', { name: /navigate/i })).toBeInTheDocument()
})

test('renders eyebrow tag', () => {
  render(<MemoryRouter><LandingPage /></MemoryRouter>)
  expect(screen.getByText(/EU Employment Law Intelligence/i)).toBeInTheDocument()
})
