
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
// Header and Footer are removed here as they might not be needed on every page (e.g. login)
// They will be imported into specific layouts or pages that require them.
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BiyoHox | Teknoloji ve Biyoloji Makaleleri',
  description: 'Teknoloji ve biyoloji alanlarındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Google AdSense Ana Script Kodu Buraya Eklenecek */}
        {/* 
          AdSense hesabınız onaylandıktan sonra Google'ın size vereceği 
          ana <script>...</script> etiketini bu yorum satırının yerine yapıştırın.
          Örnek: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" crossorigin="anonymous"></script>
        */}
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*
            Removed fixed structure <div className="flex flex-col min-h-screen">
            This allows pages like the login page to define their own full-screen layout.
            Pages that need Header/Footer will use a specific layout component (e.g., MainLayout.tsx)
          */}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

