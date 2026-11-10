// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SERVICE_BRIEFS } from '@/features/services/inquirySchema';
const send = vi.fn();
vi.mock('resend', () => ({ Resend: class { emails = { send }; } }));
import { POST } from './route';
let ip = 0;
const valid = (slug = 'ai-agents') => ({ service: slug, requestId: '12345678-1234-4123-8123-123456789abc', consent: true, answers: { name: 'Ada', email: 'ada@example.com', project: 'Research tool', description: 'Reduce repeated work', ...Object.fromEntries(SERVICE_BRIEFS.find(s => s.slug === slug)!.questions.filter(f => f.required).map(f => [f.key, 'Not sure yet'])) } });
const call = (body: unknown, headers = {}, raw?: string) => POST(new Request('http://localhost/api/inquiries', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': `192.0.2.${++ip}`, ...headers }, body: raw ?? JSON.stringify(body) }));
beforeEach(() => { send.mockReset(); send.mockResolvedValue({ data: { id: 'mail-id' }, error: null }); process.env.RESEND_API_KEY = 'test'; });
describe('project inquiries', () => {
  it.each(SERVICE_BRIEFS.map(s => s.slug))('accepts the %s brief and returns a delivery reference', async slug => {
    const result = await call(valid(slug)); expect(result.status).toBe(200); expect(await result.json()).toMatchObject({ ok: true, reference: expect.stringMatching(/^SZ-/) });
  });
  it('validates service, consent, answer types, essential fields and URLs', async () => {
    for (const body of [null, [], { ...valid(), service: 'retired' }, { ...valid(), consent: false }, { ...valid(), requestId: 'wrong' }, { ...valid(), answers: { ...valid().answers, email: 'bad' } }, { ...valid(), answers: { ...valid().answers, task: 123 } }, { ...valid('seo-optimization'), answers: { ...valid('seo-optimization').answers, website: 'javascript:alert(1)' } }]) expect((await call(body)).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });
  it('limits actual bytes and rejects malformed JSON', async () => {
    expect((await call(null, {}, '{')).status).toBe(400);
    expect((await call(null, {}, JSON.stringify({ text: '海'.repeat(9000) }))).status).toBe(413);
  });
  it('uses a stable key for identical retries and a different one for edited briefs', async () => {
    await call(valid()); await call(valid()); await call({ ...valid(), answers: { ...valid().answers, project: 'Changed' } });
    expect(send.mock.calls[0][1]).toEqual(send.mock.calls[1][1]); expect(send.mock.calls[2][1]).not.toEqual(send.mock.calls[0][1]);
  });
  it('never reports success for provider errors, exceptions, or missing configuration', async () => {
    send.mockResolvedValue({ error: { message: 'error' } }); expect((await call(valid())).status).toBe(502);
    send.mockRejectedValue(new Error()); expect((await call(valid())).status).toBe(502);
    delete process.env.RESEND_API_KEY; expect((await call(valid())).status).toBe(503);
  });
  it('blocks cross-origin posts and bursts with a retry delay', async () => {
    expect((await call(valid(), { origin: 'https://other.example' })).status).toBe(403);
    const headers = { 'x-forwarded-for': '198.51.100.1' };
    for (let n = 0; n < 5; n++) expect((await call(valid(), headers)).status).toBe(200);
    const blocked = await call(valid(), headers); expect(blocked.status).toBe(429); expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);
  });
});
