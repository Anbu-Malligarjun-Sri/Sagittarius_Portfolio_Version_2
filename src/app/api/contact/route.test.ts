// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST } from './route';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  consent: true,
  requestId: '12345678-1234-4123-8123-123456789abc',
  message: 'Hello there',
};

let ipCounter = 0;
const call = (body: unknown, ip = `10.0.0.${++ipCounter}`, raw?: string) =>
  POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: raw ?? JSON.stringify(body),
    }),
  );

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: 'x' }, error: null });
  process.env.RESEND_API_KEY = 'test-key';
});

describe('POST /api/contact', () => {
  it('sends a valid message', async () => {
    const res = await call(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, reference: expect.stringMatching(/^SZ-/) });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('rejects missing fields, bad email, and oversized fields', async () => {
    expect((await call({ ...valid, name: '' })).status).toBe(400);
    expect((await call({ ...valid, email: 'not-an-email' })).status).toBe(400);
    expect((await call({ ...valid, name: 'x'.repeat(101) })).status).toBe(400);
    expect((await call({ ...valid, message: 12345 })).status).toBe(400); // wrong type, not a crash
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON and oversized bodies', async () => {
    expect((await call(null, undefined, '{nope')).status).toBe(400);
    expect((await call(null, undefined, JSON.stringify({ ...valid, message: 'x'.repeat(25_000) }))).status).toBe(413);
  });

  it('reports a mail-service failure as 502, not as a bad request', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await call(valid)).status).toBe(502);
    send.mockRejectedValue(new Error('network'));
    expect((await call(valid)).status).toBe(502);
    spy.mockRestore();
  });

  it('returns 503 when the mail service is not configured', async () => {
    delete process.env.RESEND_API_KEY;
    expect((await call(valid)).status).toBe(503);
  });

  it('rate-limits one address after 5 attempts, with Retry-After, without affecting others', async () => {
    const ip = '203.0.113.7';
    for (let i = 0; i < 5; i++) expect((await call(valid, ip)).status).toBe(200);
    const blocked = await call(valid, ip);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);
    expect(send).toHaveBeenCalledTimes(5); // the blocked one never reached the mail service
    expect((await call(valid, '203.0.113.8')).status).toBe(200);
  });

  it('keeps user input out of email headers and retries with the same key', async () => {
    await call({ ...valid, name: 'Eve\r\nBcc: evil@example.com' });
    expect(send.mock.calls[0][0].subject).not.toContain('Eve');
    await call(valid); await call(valid);
    expect(send.mock.calls[1][1].idempotencyKey).toBe(send.mock.calls[2][1].idempotencyKey);
    expect((await call({ ...valid, consent: false })).status).toBe(400);
    expect((await call({ ...valid, website: 'javascript:alert(1)' })).status).toBe(400);
  });
});
