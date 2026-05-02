import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ToolPage from '../pages/ToolPage.jsx'

test('renders Retirement Benefits category tab', () => {
  render(<MemoryRouter><ToolPage /></MemoryRouter>)
  expect(screen.getAllByText(/Retirement Benefits/i).length).toBeGreaterThan(0)
})

test('renders FP logo in app header', () => {
  render(<MemoryRouter><ToolPage /></MemoryRouter>)
  expect(screen.getAllByText('FP').length).toBeGreaterThan(0)
})

test('renders Germany country toggle', () => {
  render(<MemoryRouter><ToolPage /></MemoryRouter>)
  expect(screen.getAllByText(/Germany/i).length).toBeGreaterThan(0)
})
