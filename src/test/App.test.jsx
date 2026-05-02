import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('renders landing page at root route', () => {
  window.history.pushState({}, '', '/')
  render(<App />)
  expect(screen.getByText(/Navigate/i)).toBeInTheDocument()
})

test('renders tool page at /app route', () => {
  window.history.pushState({}, '', '/app')
  render(<App />)
  expect(screen.getByText(/Employment Law/i)).toBeInTheDocument()
})
