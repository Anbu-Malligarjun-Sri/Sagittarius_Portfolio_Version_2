import type { Metadata, Viewport } from "next";
import { Epilogue, Manrope, Fira_Code, Caveat, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/features/home/CustomCursor";

const epilogue = Epilogue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["sans-serif"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["sans-serif"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  fallback: ["monospace"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "700"],
  fallback: ["cursive"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  fallback: ["serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sagittariuz.ai'),
  title: {
    default: 'Sagittariuz | Thoughtful AI for research and everyday work',
    template: '%s | Sagittariuz',
  },
  description: 'Founded in 2026, Sagittariuz builds software and AI tools to reduce friction for researchers, students and teams. Explore our STEM projects and services.',
  keywords: ['Sagittariuz', 'AI for research', 'STEM software', 'AI agents', 'AI integration', 'web development'],
  authors: [{ name: 'Sagittariuz' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://sagittariuz.ai',
    title: 'Sagittariuz',
    description: 'Thoughtful software and AI tools for researchers, students and the work ahead.',
    siteName: 'Sagittariuz',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Sagittariuz preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sagittariuz',
    description: 'Thoughtful software and AI tools for researchers, students and the work ahead.',
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = { themeColor: '#0a0a0a' };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${manrope.variable} ${firaCode.variable} ${caveat.variable} ${playfair.variable} h-full`}
    >
      <body className="h-full bg-[#0a0a0a] text-[#f5f0e8]">
        <div className="noise-overlay" />
        <CustomCursor />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-500 focus:bg-[#f5f0e8] focus:text-[#0a0a0a] focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Sagittariuz',
              foundingDate: '2026',
              description: 'Software and AI tools that reduce friction in research and everyday work.',
              url: 'https://sagittariuz.ai',
              sameAs: [
                'https://github.com/Anbu-Malligarjun-Sri',
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
