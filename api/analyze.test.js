// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import handler from './analyze.js'

afterEach(() => vi.unstubAllGlobals())

describe('analyze handler', () => {
  it('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET', body: {}, on: vi.fn() }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
  })

  it('returns 500 when ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY
    const req = { method: 'POST', body: {}, on: vi.fn() }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'ANTHROPIC_API_KEY not configured' })
  })

  it('forwards request and pipes stream back with SSE headers', async () => {
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

    const req = { method: 'POST', body: { messages: [{ role: 'user', content: 'test' }] }, on: vi.fn() }
    const res = { setHeader: vi.fn(), write: vi.fn(), end: vi.fn() }
    await handler(req, res)

    const [url, opts] = fetch.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    expect(opts.headers['x-api-key']).toBe('test-key-123')
    expect(JSON.parse(opts.body).messages[0].content).toBe('test')
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream')
    expect(res.write).toHaveBeenCalledWith('data: {"type":"content_block_delta"}\n\n')
    expect(res.end).toHaveBeenCalled()
  })

  it('returns upstream error status when Anthropic responds with error', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key-123'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => 'rate limited',
    }))
    const req = { method: 'POST', body: {}, on: vi.fn() }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith({ error: 'rate limited' })
  })

  it('returns 502 when fetch throws a network error', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key-123'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network failure')))
    const req = { method: 'POST', body: {}, on: vi.fn() }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.json).toHaveBeenCalledWith({ error: 'upstream_unreachable' })
  })
})
