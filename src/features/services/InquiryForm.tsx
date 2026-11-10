'use client';

import { useRef, useState } from 'react';
import { COMMON_FIELDS, fieldLimit, validateAnswers, type Answers, type ServiceBrief } from './inquirySchema';
import styles from './inquiry.module.css';

export default function InquiryForm({ service }: { service: ServiceBrief }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const requestId = useRef('');
  const storageKey = `sagittariuz:brief:v1:${service.slug}`;
  const allFields = [...COMMON_FIELDS, ...service.questions];
  const fields = step === 0 ? COMMON_FIELDS : service.questions;
  const getId = () => requestId.current || (requestId.current = crypto.randomUUID());
  const focusHeading = () => requestAnimationFrame(() => heading.current?.focus());
  const go = (next: number) => { setStep(next); setErrors({}); setNotice(''); focusHeading(); };
  const showErrors = (next: Record<string, string>) => { setErrors(next); requestAnimationFrame(() => errorBox.current?.focus()); };
  const next = () => { const found = validateAnswers(answers, fields); if (Object.keys(found).length) showErrors(found); else go(step + 1); };
  const forget = () => { try { localStorage.removeItem(storageKey); return true; } catch { return false; } };
  const saveDraft = () => {
    try { localStorage.setItem(storageKey, JSON.stringify({ answers, requestId: getId(), expires: Date.now() + 7 * 86400_000 })); setNotice('Draft saved on this device for 7 days. Changes after this point are not saved automatically.'); }
    catch { setNotice('This browser could not save the draft. Download a copy instead.'); }
  };
  const restoreDraft = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) { setNotice('No saved draft for this service on this device.'); return; }
      const draft = JSON.parse(raw);
      if (!draft || typeof draft.expires !== 'number' || draft.expires < Date.now() || !draft.answers || typeof draft.answers !== 'object' || typeof draft.requestId !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(draft.requestId)) throw new Error();
      const restored: Answers = {};
      for (const f of allFields) { const value = draft.answers[f.key]; if (value !== undefined && (typeof value !== 'string' || value.length > fieldLimit(f.key))) throw new Error(); restored[f.key] = value ?? ''; }
      requestId.current = draft.requestId; setAnswers(restored); setConsent(false); setErrors({}); setStep(0); setNotice('Saved draft restored. Review it before sending.');
    } catch { forget(); setNotice('The saved draft has expired or cannot be read. Your current answers have not been changed.'); }
  };
  const download = () => {
    const content = ['SAGITTARIUZ / PROJECT BRIEF', `Service: ${service.slug}`, receipt ? `Delivery reference: ${receipt}` : 'Draft — not submitted', ...allFields.map(f => `${f.label}\n${answers[f.key]?.trim() || 'Not provided'}`)].join('\n\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `sagittariuz-${service.slug}-brief.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const submit = async () => {
    if (locked.current) return;
    const found = validateAnswers(answers, allFields);
    if (Object.keys(found).length) { setStep(COMMON_FIELDS.some(f => found[f.key]) ? 0 : 1); showErrors(found); return; }
    if (!consent) { showErrors({ consent: 'Please confirm we may use these details to discuss your inquiry.' }); return; }
    locked.current = true; setBusy(true); setNotice(''); setErrors({});
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service: service.slug, requestId: getId(), answers, consent }), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.ok !== true || typeof result.reference !== 'string') {
        if (result.errors) { setStep(COMMON_FIELDS.some(f => result.errors[f.key]) ? 0 : 1); showErrors(result.errors); }
        throw new Error(typeof result.error === 'string' ? result.error : 'Delivery could not be confirmed. Please retry or download your brief.');
      }
      setReceipt(result.reference);
      if (!forget()) setNotice('Your saved draft could not be cleared. You can remove it in your browser’s site storage settings.');
      focusHeading();
    } catch (error) {
      setNotice(error instanceof Error && error.name !== 'AbortError' && error.message !== 'Failed to fetch' ? error.message : 'Delivery could not be confirmed. Your answers are still here. Retry unchanged within 24 hours to avoid a duplicate, or download the brief and contact us.');
    } finally { clearTimeout(timer); locked.current = false; setBusy(false); }
  };
  return <section id="brief" className={styles.brief} aria-labelledby="brief-heading">
    <div className={styles.briefIntro}><p className={styles.eyebrow}>The first conversation</p><h2 id="brief-heading">A little context.<br /><em>A better beginning.</em></h2><p>Tell us what you have in mind. We will review the brief, discuss what is feasible, and agree a proposal before any work is booked.</p><p className={styles.small}>No payment. No commitment. No need to have every answer.</p><a href="mailto:anbumalligarjunsri@gmail.com">Prefer email? Write to us ↗</a></div>
    <div className={styles.formPaper}>
      {receipt ? <div className={styles.receipt}>
        <p className={styles.eyebrow}>Sent for review / not a booking</p><h3 ref={heading} tabIndex={-1}>Your next chapter<br /><em>starts here.</em></h3>
        <p>Your brief has been accepted by our email service for delivery to the team. Keep this reference:</p><strong className={styles.reference}>{receipt}</strong>
        <p>We will review your requirements and reply at <strong>{answers.email}</strong> to discuss scope. Price, dates and availability are agreed in a proposal, not by this receipt.</p>
        <p>If you need to follow up, email us with the reference above.</p><button type="button" onClick={download}>Download your brief ↓</button>
      </div> : <form noValidate onSubmit={event => { event.preventDefault(); if (step < 2) next(); else void submit(); }} aria-busy={busy}>
        <p className={styles.progress}>{['01 / About your project', '02 / The service brief', 'Review / Before you send'][step]}</p>
        <h3 ref={heading} tabIndex={-1}>{['Begin with the essentials.', 'Make it your own.', 'Everything in order?'][step]}</h3>
        <p className={styles.small}>{step === 2 ? 'Check your email and answers. You can go back without losing anything.' : 'Required fields are marked *. Everything else can wait for our conversation.'}</p>
        {Object.keys(errors).length > 0 && <div className={styles.errors} ref={errorBox} tabIndex={-1} role="alert"><strong>Please check your brief</strong>{Object.entries(errors).map(([key, value]) => <a key={key} href={`#inquiry-${key}`}>{value}</a>)}</div>}
        <fieldset disabled={busy}>
          {step < 2 ? <div className={styles.fields}>{fields.map(field => <div key={field.key} className={styles.field}>
            <label htmlFor={`inquiry-${field.key}`}>{field.label}{field.required ? ' *' : ''}</label>
            {field.hint && <p id={`hint-${field.key}`}>{field.hint}</p>}
            {fieldLimit(field.key) > 300 && field.type !== 'url' ? <textarea id={`inquiry-${field.key}`} rows={3} maxLength={fieldLimit(field.key)} required={field.required} value={answers[field.key] ?? ''} onChange={event => setAnswers(a => ({ ...a, [field.key]: event.target.value }))} aria-invalid={!!errors[field.key]} aria-describedby={`hint-${field.key} error-${field.key}`} /> : <input id={`inquiry-${field.key}`} type={field.key === 'email' ? 'email' : field.type ?? 'text'} autoComplete={field.key === 'name' ? 'name' : field.key === 'email' ? 'email' : 'off'} maxLength={fieldLimit(field.key)} required={field.required} value={answers[field.key] ?? ''} onChange={event => setAnswers(a => ({ ...a, [field.key]: event.target.value }))} aria-invalid={!!errors[field.key]} aria-describedby={`hint-${field.key} error-${field.key}`} />}
            {errors[field.key] && <p id={`error-${field.key}`} className={styles.fieldError}>{errors[field.key]}</p>}
          </div>)}</div> : <><dl className={styles.review}>{allFields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{answers[field.key]?.trim() || 'Not provided'}</dd></div>)}</dl><label className={styles.consent}><input id="inquiry-consent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />I understand this is an inquiry, not a booking. Sagittariuz may use these details to reply and discuss this project.</label></>}
          <p className={styles.small}>Please do not include passwords, API keys, or confidential research data. Your submitted brief is emailed to the team using Resend; it is not published.</p>
          <div className={styles.actions}>{step > 0 && <button type="button" className={styles.secondary} onClick={() => go(step - 1)}>← Back</button>}<button type="submit" className={styles.primary}>{busy ? 'Sending…' : step === 0 ? 'Continue to your brief →' : step === 1 ? 'Review your answers →' : 'Send project inquiry ↗'}</button></div>
        </fieldset>
      </form>}
      <p className={styles.notice} role="status" aria-live="polite">{notice}</p>
      {!receipt && <div className={styles.draftTools}><p>Leaving for now? Saving is optional and stores personal details on this device for up to 7 days. Avoid shared devices. Downloaded files remain until you delete them.</p><div><button disabled={busy} onClick={saveDraft} type="button">Save draft</button><button disabled={busy} onClick={restoreDraft} type="button">Restore draft</button><button disabled={busy} onClick={() => setNotice(forget() ? 'Saved draft cleared. Current answers are unchanged.' : 'Could not clear browser storage.')} type="button">Clear saved draft</button><button onClick={download} type="button">Download brief ↓</button></div></div>}
      <noscript>This form needs JavaScript. You can email your project brief to anbumalligarjunsri@gmail.com instead.</noscript>
    </div>
  </section>;
}
