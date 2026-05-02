// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import handler from './analyze.js'

afterEach(() => vi.unstubAllGlobals())

describe('analyze handler', () => {
  it('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET', body: {} }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
  })

  it('returns 500 when ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY
    const req = { method: 'POST', body: {} }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'ANTHROPIC_API_KEY not configured' })
  })

  it('forwards request and pipes stream back', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key-123'
    const chunk = new TextEncoder().encode('data: {"type":"content_block_delta"}\n\n')
    let callCount = 0
    const mockReader = {
      read: vi.fn().mockImplementation(() =>
        callCount++ === 0
          ? Promise.resolve({ done: false, value: chunk })
          : Promise.resolve({ done: true, value: undefined })
      ),
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => mockReader },
    }))

    const req = { method: 'POST', body: { messages: [{ role: 'user', content: 'test' }] } }
    const res = { setHeader: vi.fn(), write: vi.fn(), end: vi.fn() }
    await handler(req, res)

    const [url, opts] = fetch.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    expect(opts.headers['x-api-key']).toBe('test-key-123')
    expect(res.write).toHaveBeenCalled()
    expect(res.end).toHaveBeenCalled()
  })
})
