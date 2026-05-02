import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
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

test('Navigate button routes to /app', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<div>App Page</div>} />
      </Routes>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /navigate/i }))
  expect(screen.getByText('App Page')).toBeInTheDocument()
})
