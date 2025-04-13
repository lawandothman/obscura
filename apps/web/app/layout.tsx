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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
