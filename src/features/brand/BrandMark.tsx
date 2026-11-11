import Image from 'next/image';

/** Decorative alongside the written brand; use a light backing on dark surfaces. */
export default function BrandMark({ onDark = false }: { onDark?: boolean }) {
  return <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${onDark ? 'rounded-md bg-[#f1eadb] p-1.5' : ''}`}>
    <Image src="/images/logo_image/logo.svg" alt="" width={44} height={34} className="h-[34px] w-[44px]" />
  </span>;
}
