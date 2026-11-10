'use client';

import PlushTile from './PlushTile';
import { SOCIALS } from './socials';

/** Footer row of plush social tiles. */
export default function PlushSocials() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8c547]">Find us out there</p>
          <h3 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#f5f0e8]">
            Soft on the outside. Say hello.
          </h3>
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {SOCIALS.map((social) => (
          <li key={social.id} className="mx-auto w-full max-w-[230px]">
            <PlushTile social={social} />
            <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5f0e8]/55">{social.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
