import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import StampFace from '@/features/services/StampFace';
import { STAMPS } from '@/features/services/stamps';
import { SERVICE_BRIEFS } from '@/features/services/inquirySchema';
import { stampFontVariables } from '@/features/services/fonts';
import InquiryForm from '@/features/services/InquiryForm';
import styles from '@/features/services/inquiry.module.css';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return SERVICE_BRIEFS.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const brief = SERVICE_BRIEFS.find(s => s.slug === slug);
  const stamp = STAMPS.find(s => s.id === brief?.stampId);
  return {
    title: stamp ? `${stamp.name} — Start a project` : 'Service not found',
    description: brief?.outcome,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title: stamp?.name, description: brief?.outcome, url: `/services/${slug}`, images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image' as const, title: stamp?.name, description: brief?.outcome, images: ['/opengraph-image'] },
  };
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICE_BRIEFS.find(s => s.slug === slug);
  const stamp = STAMPS.find(s => s.id === service?.stampId);
  if (!service || !stamp) notFound();
  return <main id="main-content" className={`${styles.page} ${stampFontVariables}`} style={{ '--accent': stamp.glow } as CSSProperties}>
    <header className={styles.header}><Link href="/#services">← The stamp collection</Link><Link href="/" className={styles.wordmark}>Sagittariuz<span>Thoughtful work, since 2026</span></Link><a href="#brief">Start an inquiry ↗</a></header>
    <section className={styles.hero}>
      <div className={styles.heroCopy}><p className={styles.eyebrow}>Commission notes / Nº {stamp.no}</p><h1>{stamp.name}</h1><p className={styles.tagline}>{stamp.tagline}</p><p className={styles.story}>{stamp.story}</p><a className={styles.primary} href="#brief">Reserve this stamp ↗</a><p className={styles.small}>Start a project inquiry. Scope, price and dates come next.</p></div>
      <div className={styles.exhibit}><div className={styles.exhibitLines} aria-hidden="true" /><div className={styles.heroStamp}><StampFace stamp={stamp} /></div><p className={styles.specimen}>SAGITTARIUZ / SERVICE COLLECTION<br /><span>One stamp. A possibility worth exploring.</span></p></div>
    </section>
    <div className={styles.paperBand}><span>01 — Understand</span><span>02 — Define together</span><span>03 — Agree a proposal</span><span>04 — Make it happen</span></div>
    <section className={styles.details} aria-label="Service details">
      <div><p className={styles.eyebrow}>The intention</p><h2>{service.outcome}</h2><div className={styles.example}><span>Illustrative use case / not a client claim</span><p>{service.example}</p></div><Link href="/projects">Explore our actual projects ↗</Link></div>
      <div><p className={styles.eyebrow}>What we can shape together</p><ul>{stamp.includes.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul><p className={styles.small}>The final deliverables depend on your agreed scope.</p><h3>How the work moves</h3><p>{stamp.how} We discuss requirements, define a focused scope, then agree review points and handover.</p><h3>A note on timing</h3><p>{service.timing} Any timing or availability printed on the stamp is indicative, not a reserved slot.</p></div>
    </section>
    <InquiryForm service={service} />
    <footer className={styles.footer}><span>Not quite the right stamp?</span><nav aria-label="Other services">{SERVICE_BRIEFS.filter(s => s.slug !== slug).map(s => <Link key={s.slug} href={`/services/${s.slug}`}>{STAMPS.find(stamp => stamp.id === s.stampId)?.name} ↗</Link>)}</nav><p>© Sagittariuz · Made for the work ahead.</p></footer>
  </main>;
}
