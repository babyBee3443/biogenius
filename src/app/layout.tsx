
"use client"; // Make this a client component to access localStorage

import type { Metadata } from 'next'; // Metadata can still be used for static parts
import { Geist } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import * as React from 'react'; // Import React for useEffect and useState

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Static metadata object
export const metadataObject: Metadata = {
  title: 'BiyoHox | Teknoloji ve Biyoloji Makaleleri',
  description: 'Teknoloji ve biyoloji alanlarındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [adsenseEnabled, setAdsenseEnabled] = React.useState(false);
  const [adsensePublisherId, setAdsensePublisherId] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true); // Indicate that the component has mounted on the client
    if (typeof window !== 'undefined') {
      const storedAdsenseEnabled = localStorage.getItem('biyohox_adsenseEnabled');
      setAdsenseEnabled(storedAdsenseEnabled === null ? true : storedAdsenseEnabled === 'true');

      const storedPublisherId = localStorage.getItem('biyohox_adsensePublisherId');
      setAdsensePublisherId(storedPublisherId);

      // Listen for AdSense settings updates from the admin panel
      const handleAdsenseSettingsUpdate = () => {
        const updatedEnabled = localStorage.getItem('biyohox_adsenseEnabled');
        setAdsenseEnabled(updatedEnabled === null ? true : updatedEnabled === 'true');
        setAdsensePublisherId(localStorage.getItem('biyohox_adsensePublisherId'));
      };
      window.addEventListener('adsenseSettingsUpdated', handleAdsenseSettingsUpdate);
      return () => {
        window.removeEventListener('adsenseSettingsUpdated', handleAdsenseSettingsUpdate);
      };
    }
  }, []);


  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/*
          The <title> and <meta name="description"> tags are typically handled by Next.js's Metadata API.
          For a client component layout, you might need to set them differently if dynamic,
          or ensure the static metadata object is sufficient.
          For now, assuming static metadata is handled by Next.js based on `metadataObject`.
        */}
        {isMounted && adsenseEnabled && adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${adsensePublisherId}`}
            crossOrigin="anonymous"
          ></script>
        )}
         {isMounted && !adsenseEnabled && (
            <meta name="adsense-disabled" content="true" />
         )}
         {isMounted && adsenseEnabled && !adsensePublisherId && (
            <meta name="adsense-misconfigured" content="Publisher ID missing" />
         )}
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

    