'use client';

import { useRef } from 'react';
import { STAMPS } from '@/features/services/stamps';
import styles from './contactBrief.module.css';

export const CONTACT_FIELDS = [
  { id: 'name', label: 'Your name', required: true, max: 100 },
  { id: 'email', label: 'Email address', required: true, max: 254 },
  { id: 'project', label: 'Project or organisation', required: false, max: 160 },
  { id: 'service', label: 'How can we help?', required: false, max: 100 },
  { id: 'website', label: 'Website or reference URL', required: false, max: 500 },
  { id: 'budget', label: 'Budget range and currency', required: false, max: 160 },
  { id: 'timeline', label: 'Preferred timeline', required: false, max: 160 },
  { id: 'description', label: 'The problem and the result you hope for', required: true, max: 4000 },
];

export default function ContactBrief({ answers, update, consent, setConsent, send, busy, message }: {
  answers: Record<string, string>; update: (id: string, value: string) => void;
  consent: boolean; setConsent: (value: boolean) => void; send: () => void; busy: boolean; message: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <div className={styles.launcher}>
    <button type="button" onClick={() => dialog.current?.showModal()}>Write your project brief ↗</button>
    <p>Name, email, and a little context. The rest can wait.</p>
    <dialog aria-labelledby="contact-brief-title" ref={dialog} className={styles.dialog} onKeyDown={e => e.stopPropagation()} onClick={e => { if (e.target === e.currentTarget && !busy) dialog.current?.close(); }}>
      <form onSubmit={e => { e.preventDefault(); send(); }}>
        <button type="button" className={styles.close} aria-label="Close project brief" onClick={() => dialog.current?.close()}>×</button>
        <p className={styles.eyebrow}>Sagittariuz / Correspondence</p><h2 id="contact-brief-title">Tell us what is<br /><em>worth making easier.</em></h2>
        <p>A project inquiry, not a booking. Required fields are marked *. Leave optional details blank if you are still exploring.</p>
        <fieldset disabled={busy} className={styles.fields}>{CONTACT_FIELDS.map(field => <label key={field.id} htmlFor={`contact-${field.id}`} className={field.id === 'description' ? styles.full : ''}>
          {field.label}{field.required ? ' *' : ' (optional)'}
          {field.id === 'description' ? <textarea id={`contact-${field.id}`} value={answers[field.id]} maxLength={field.max} required rows={4} onChange={e => update(field.id, e.target.value)} /> : field.id === 'service' ? <select id="contact-service" value={answers.service} onChange={e => update('service', e.target.value)}><option value="">Not sure yet</option>{STAMPS.map(s => <option key={s.id}>{s.name}</option>)}<option>Research collaboration</option><option>Something else</option></select> : <input id={`contact-${field.id}`} type={field.id === 'email' ? 'email' : field.id === 'website' ? 'url' : 'text'} autoComplete={field.id === 'name' ? 'name' : field.id === 'email' ? 'email' : field.id === 'project' ? 'organization' : 'off'} required={field.required} maxLength={field.max} value={answers[field.id]} onChange={e => update(field.id, e.target.value)} />}
        </label>)}</fieldset>
        <p className={styles.note}>No credentials or confidential research data, please. Your brief is emailed to our team using Resend and is not published.</p>
        <label className={styles.consent}><input type="checkbox" required checked={consent} disabled={busy} onChange={e => setConsent(e.target.checked)} />You may use these details to reply and discuss this inquiry.</label>
        <div role="status" className={styles.status}>{message}</div><button type="submit" className={styles.send} disabled={busy}>{busy ? 'Sending…' : 'Send inquiry ↗'}</button>
        <a className={styles.email} href="mailto:anbumalligarjunsri@gmail.com">Or email anbumalligarjunsri@gmail.com</a>
      </form>
    </dialog>
  </div>;
}
