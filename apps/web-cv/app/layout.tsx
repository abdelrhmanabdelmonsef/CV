import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import cvData from 'cv-data';
import { LightboxProvider } from '../contexts/LightboxContext';
import { MatrixProvider } from '../contexts/MatrixContext';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: cvData.seo.title,
  description: cvData.seo.description,
  keywords: cvData.seo.keywords,
  authors: [{ name: cvData.personal.name }],
  openGraph: {
    type: 'website',
    url: cvData.seo.ogUrl,
    title: cvData.seo.title,
    description: cvData.seo.description,
    images: [cvData.seo.ogImage]
  },
  twitter: {
    card: 'summary_large_image',
    title: cvData.seo.title,
    description: cvData.seo.description,
    images: [cvData.seo.ogImage]
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: cvData.personal.name,
  jobTitle: cvData.personal.title,
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Al-Azhar University, Faculty of Computers and Systems Engineering'
  },
  url: cvData.personal.github,
  sameAs: [cvData.personal.linkedIn, cvData.personal.github],
  knowsAbout: cvData.seo.knowsAbout,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cairo',
    addressCountry: 'Egypt'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ErrorBoundary>
          <MatrixProvider>
            <LightboxProvider>{children}</LightboxProvider>
          </MatrixProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
