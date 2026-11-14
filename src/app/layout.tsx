import type { Metadata, Viewport } from "next";
import "./globals.css";
import CustomCursor from "@/features/home/CustomCursor";
import { remoteFont } from "@/features/fontDescriptor";

const epilogue = remoteFont({
  family: "Epilogue",
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["sans-serif"],
});

const manrope = remoteFont({
  family: "Manrope",
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["sans-serif"],
});

const firaCode = remoteFont({
  family: "Fira Code",
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  fallback: ["monospace"],
});

const caveat = remoteFont({
  family: "Caveat",
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "700"],
  fallback: ["cursive"],
});

const playfair = remoteFont({
  family: "Playfair Display",
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  fallback: ["serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sagittariuz.com'),
  title: {
    default: 'Sagittariuz | Thoughtful AI for research and everyday work',
    template: '%s | Sagittariuz',
  },
  description: 'Founded in 2026, Sagittariuz builds software and AI tools to reduce friction for researchers, students and teams. Explore our STEM projects and services.',
  keywords: ['Sagittariuz', 'AI for research', 'STEM software', 'AI agents', 'AI integration', 'web development'],
  authors: [{ name: 'Sagittariuz' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: 'https://www.sagittariuz.com',
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
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://www.sagittariuz.com/#organization",
          "name": "Sagittariuz",
          "url": "https://www.sagittariuz.com/",
          "description":
            "Sagittariuz is an AI and software development company building intelligent AI solutions, custom software and digital products.",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.sagittariuz.com/images/logo_image/logo.svg"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://www.sagittariuz.com/#website",
          "url": "https://www.sagittariuz.com/",
          "name": "Sagittariuz",
          "alternateName": "Sagittariuz Official Website",
          "publisher": {
            "@id": "https://www.sagittariuz.com/#organization"
          }
        }
      ]
    }).replace(/</g, '\\u003c'),
  }}
/>
        <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
    }}
  />
      </body>
    </html>
  );
}
