'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Code2, Layers, Mail } from 'lucide-react';

type ContactStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to send your message right now.');
      }

      form.reset();
      setStatus('success');
      setErrorMessage('');
    } catch (error: unknown) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message.');
    }
  };

  return (
    <section id="contact" className="py-32 px-8 md:px-16 border-t border-white/5 z-10 relative bg-linear-to-b from-transparent to-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="flex-1">
          <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">Let's Build<br />The Future.</h2>
          <p className="text-white/50 text-lg mb-12 max-w-md font-light">Whether you're a researcher, investor, collaborator, or fellow builder - Sagittarius is listening.</p>

          <div className="space-y-6 font-mono text-sm">
            <a href="mailto:init@sagittarius.ai" className="flex items-center gap-4 hover:text-cyan-400 transition-colors w-fit"><Mail size={18} /> init@sagittarius.ai</a>
            <a href="https://github.com/Anbu-Malligarjun-Sri" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-cyan-400 transition-colors w-fit"><Code2 size={18} /> github.com/Anbu-Malligarjun-Sri</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-cyan-400 transition-colors w-fit"><Layers size={18} /> linkedin.com</a>
          </div>

          <div className="mt-12 inline-block px-4 py-2 border border-white/10 bg-white/5 rounded font-mono text-xs text-orange-400">⚡ RESPONDS WITHIN 24H</div>
        </div>

        <div className="flex-1">
          {status === 'success' ? (
            <div className="glass-panel h-full min-h-100 p-8 flex flex-col items-center justify-center text-center border-green-500/30">
              <CheckCircle2 size={48} className="text-green-500 mb-6" />
              <div className="font-mono text-green-400 mb-2">{'>'} MESSAGE TRANSMITTED</div>
              <div className="font-mono text-white/50 text-sm">Sagittarius system will respond shortly.</div>
              <button onClick={() => setStatus('idle')} className="mt-8 font-mono text-xs text-white/40 hover:text-white underline">Send another sequence</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2"><label htmlFor="contact-name" className="font-mono text-xs text-white/50">NAME SEQUENCE</label><input id="contact-name" name="name" required type="text" className="bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-cyan-400 font-mono text-sm transition-colors" /></div>
              <div className="flex flex-col gap-2"><label htmlFor="contact-email" className="font-mono text-xs text-white/50">COMMUNICATION VECTOR (EMAIL)</label><input id="contact-email" name="email" required type="email" className="bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-cyan-400 font-mono text-sm transition-colors" /></div>
              <div className="flex flex-col gap-2"><label htmlFor="contact-message" className="font-mono text-xs text-white/50">DATA PAYLOAD (MESSAGE)</label><textarea id="contact-message" name="message" required rows={4} className="bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-cyan-400 font-mono text-sm resize-none transition-colors" /></div>
              {status === 'error' && <p className="font-mono text-xs text-red-400">{errorMessage}</p>}
              <button disabled={status === 'sending'} className="mt-4 bg-white/10 hover:bg-orange-500 text-white font-mono text-sm py-4 border border-white/20 hover:border-orange-500 transition-all duration-300 disabled:opacity-50">{status === 'sending' ? 'TRANSMITTING...' : 'INITIALIZE UPLOAD →'}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
