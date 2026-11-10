// Shared by the browser and API. Keep this module independent of UI and font imports.
export type Question = { key: string; label: string; hint: string; required?: boolean; type?: 'url' };
export type ServiceBrief = { slug: string; stampId: string; example: string; outcome: string; timing: string; questions: Question[] };
const q = (key: string, label: string, hint: string, required = false): Question => ({ key, label, hint, required });
export const SERVICE_BRIEFS: ServiceBrief[] = [
  { slug: 'ui-ux-design', stampId: 'ui-ux', example: 'A research dashboard that makes the next action clear.', outcome: 'A considered interface, from the first user journey to the handoff.', timing: 'A focused design scope may take 2–4 weeks. Research, screen count and review rounds affect the schedule.', questions: [
    q('platform', 'Where will people use it?', 'Web, mobile, desktop, or not sure.', true),
    q('screens', 'Which journeys or screens matter most?', 'An approximate screen count is useful; a rough idea is enough.'),
    q('style', 'What should it feel like?', 'Describe the style and any existing brand guidelines.'),
    q('references', 'Any references or existing designs?', 'Public Figma or inspiration links only. Do not share private access tokens.'),
  ] },
  { slug: 'web-development', stampId: 'web', example: 'A product website with a clear story and a useful, accessible interface.', outcome: 'A website shaped around what its visitors need to do.', timing: 'A focused build may take 4–8 weeks. Content, integrations and review cycles can change that.', questions: [
    q('type', 'What kind of website do you need?', 'Product site, portfolio, platform, or something else.', true),
    q('pages', 'Which pages and features matter?', 'Include forms, accounts, search or other interactions.'),
    q('integrations', 'What does it need to connect to?', 'Payments, CMS, analytics or other tools; no credentials.'),
    q('readiness', 'What is already in place?', 'Domain, hosting, copy, images and existing code. Not sure is fine.'),
  ] },
  { slug: 'mobile-apps', stampId: 'mobile', example: 'A fieldwork companion for collecting observations away from a desk.', outcome: 'A practical first release, built around the people using it.', timing: 'A focused first release may take 6–12 weeks. Backend scope and app-store review add variability.', questions: [
    q('platform', 'Android, iOS, or both?', 'Tell us your preferred platform, or say not sure.', true),
    q('audience', 'Who is it for, and what should it do?', 'Your audience and the most important features.'),
    q('accounts', 'How should people sign in or pay?', 'Include login methods, subscriptions or payments if needed.'),
    q('backend', 'What needs to happen behind the screens?', 'Notifications, offline access, data storage and any existing backend.'),
  ] },
  { slug: 'ai-agents', stampId: 'ai-agents', example: 'An assistant that gathers evidence and prepares a draft for a person to approve.', outcome: 'One useful workflow, with clear boundaries and human oversight.', timing: 'We estimate after mapping the task, tool permissions and evaluation requirements. A bounded pilot comes first.', questions: [
    q('task', 'What job should the agent do?', 'Describe one task and what starts it: a message, a schedule, or an event.', true),
    q('tools', 'Which tools may it use?', 'Name systems and permitted actions, without passwords or keys.'),
    q('approvals', 'Where must a person approve the action?', 'For example: sending messages, changing records, or spending money.'),
    q('success', 'How will you know it is useful?', 'Success criteria, failure cases and actions it must never take.'),
  ] },
  { slug: 'ai-integration', stampId: 'ai', example: 'Evidence-linked search inside an existing research workspace.', outcome: 'AI that fits the workflow you already have.', timing: 'A focused integration may take 4–6 weeks. Data readiness, access and evaluation can extend the scope.', questions: [
    q('product', 'Which existing product or workflow needs AI?', 'Describe the product and the slow or difficult step.', true),
    q('capability', 'What should AI help people do?', 'Search, summarise, classify, draft, or something else.'),
    q('data', 'What data is available?', 'Describe its type, volume and sensitivity. Do not paste the data itself.'),
    q('systems', 'Which systems or APIs are involved?', 'Include hosting constraints, privacy needs and evaluation goals.'),
  ] },
  { slug: 'seo-optimization', stampId: 'seo', example: 'A technical and content audit that turns search barriers into a prioritised action plan.', outcome: 'Clearer foundations for being found by the right people.', timing: 'An initial audit and implementation scope may take 3–5 weeks. Search results take longer; rankings cannot be guaranteed.', questions: [
    { key: 'website', label: 'What is your website URL?', hint: 'A public https:// address. Leave blank if the site is not live yet.', type: 'url' },
    q('audience', 'Who do you want to reach?', 'Audience, locations and languages.', true),
    q('goals', 'What would better search visibility achieve?', 'Include competitors and priority topics or keywords, if known.'),
    q('traffic', 'What do you know about current performance?', 'Approximate traffic or Search Console observations. No account access needed.'),
  ] },
];
export const COMMON_FIELDS: Question[] = [
  q('name', 'Your name', '', true), q('email', 'Email address', 'We will reply here.', true),
  q('project', 'Business or project name', 'A working title is fine.', true),
  q('budget', 'Budget range, including currency', 'Optional. “Not sure yet” is a useful answer.'),
  q('timeline', 'Preferred timeline', 'Optional. A target month, a deadline, or “flexible”.'),
  q('description', 'What would you like to make easier?', 'A short description of the problem and the result you hope for.', true),
];
export type Answers = Record<string, string>;
export type Inquiry = { service: string; requestId: string; answers: Answers; consent: true };
export const fieldLimit = (key: string) => key === 'email' ? 254 : ['name', 'project', 'budget', 'timeline'].includes(key) ? 160 : 2000;
export function validateAnswers(answers: Answers, fields: Question[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = answers[field.key]?.trim() ?? '';
    if (field.required && !value) errors[field.key] = `Please complete: ${field.label}`;
    else if (value.length > fieldLimit(field.key)) errors[field.key] = `Keep this answer under ${fieldLimit(field.key)} characters.`;
    else if (value && field.key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) errors[field.key] = 'Enter a valid email address.';
    else if (value && field.type === 'url') {
      try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(); }
      catch { errors[field.key] = 'Use a public http:// or https:// URL without credentials.'; }
    }
  }
  return errors;
}
export function parseInquiry(input: unknown): { data: Inquiry; fields: Question[] } | { error: string; errors?: Record<string, string> } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Invalid brief.' };
  const raw = input as Record<string, unknown>;
  const service = SERVICE_BRIEFS.find(s => s.slug === raw.service);
  if (!service) return { error: 'Please choose a current service.' };
  if (typeof raw.requestId !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(raw.requestId)) return { error: 'Invalid request reference. Refresh the page and try again.' };
  if (raw.consent !== true) return { error: 'Please confirm we may use this brief to discuss your inquiry.' };
  if (!raw.answers || typeof raw.answers !== 'object' || Array.isArray(raw.answers)) return { error: 'Invalid answers.' };
  const source = raw.answers as Record<string, unknown>;
  const fields = [...COMMON_FIELDS, ...service.questions];
  if (Object.keys(source).some(key => !fields.some(f => f.key === key))) return { error: 'This brief contains an unexpected field.' };
  const answers: Answers = {};
  for (const field of fields) {
    if (source[field.key] !== undefined && typeof source[field.key] !== 'string') return { error: 'Answers must be text.' };
    answers[field.key] = ((source[field.key] as string | undefined) ?? '').trim();
  }
  const errors = validateAnswers(answers, fields);
  if (Object.keys(errors).length) return { error: 'Please check the highlighted answers.', errors };
  return { data: { service: service.slug, requestId: raw.requestId, answers, consent: true }, fields };
}
