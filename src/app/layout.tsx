import type { Metadata } from "next";
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
  metadataBase: new URL('https://sagittarius.ai'),
  title: {
    default: 'Sagittarius',
    template: '%s | Sagittarius',
  },
  description: 'Sagittarius is a premium startup studio building software, brands, and product systems that ship with rigor.',
  keywords: ['Sagittarius', 'startup studio', 'product design', 'engineering', 'branding'],
  authors: [{ name: 'Sagittarius Studio' }],
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#0a0a0a' },
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://sagittarius.ai',
    title: 'Sagittarius',
    description: 'Premium startup systems for ambitious teams.',
    siteName: 'Sagittarius',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Sagittarius preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sagittarius',
    description: 'Premium startup systems for ambitious teams.',
    images: ['/opengraph-image'],
  },
};

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
              name: 'Sagittarius',
              url: 'https://sagittarius.ai',
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
