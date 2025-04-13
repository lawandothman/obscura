import localFont from 'next/font/local';

import '@workspace/ui/globals.css';
import { Providers } from '@/components/providers';
import type { Metadata } from 'next';

const elza = localFont({
  src: [
    {
      path: './fonts/elza_400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/elza_500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/elza_600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/elza_700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/elza_900.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: 'Lottie Capture the Flag',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${elza.className} font-sans antialiased `}>
        <Providers>
          <div className="min-h-[calc(100vh-4rem)] relative bg-gradient-to-b from-background to-background/50 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-lottie-pink rounded-full opacity-10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-lottie-pink rounded-full opacity-10 blur-3xl" />

            <div className="container mx-auto px-4 py-16 max-w-3xl relative">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
