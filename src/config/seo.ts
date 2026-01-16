import type { Metadata } from 'next';

// Base SEO configuration
export const siteConfig = {
  name: 'Food Terest',
  description:
    'Food Terest is desingned for the pins of your favorite restaurants.',
  url: 'https://foodterest.com/',
  ogImage: '/images/bg-hero-contact.webp',
  links: {
    twitter: 'https://foodterest.com/',
  },
};

// Default metadata for all pages
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest:'/manifest.webmanifest',
  keywords: [
    'Food',
  ],
  authors: [{ name: 'Food Terest' }],
  creator: 'Food Terest',
  publisher: 'Food Terest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@devdecorators',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  // manifest: '/manifest.json',
  verification: {
    // google: 'your-google-verification-code',
  },
};
