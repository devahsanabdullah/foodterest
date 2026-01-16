import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { defaultMetadata } from '@/config/seo';
import { Toaster } from 'react-hot-toast';
import PWAInstallPrompt from '@/components/pwa/Pwa';


const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});


// export const metadata: Metadata = defaultMetadata;
export const metadata = {
  title: "foodterest",
  description: "Food Terest is designed for the pins of your favorite restaurants.",
  manifest: '/manifest.webmanifest',
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const isRTL = ['ar'].includes(locale);

  return (
    <html lang="en" dir={isRTL ? 'rtl' : 'ltr'}>
      <body suppressHydrationWarning className={`${inter.variable} antialiased dark:bg-dark`}>
        <NextIntlClientProvider>
          <Toaster />
          <PWAInstallPrompt />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
