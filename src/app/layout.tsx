// app/layout.tsx  — NO 'use client'
import generateColorsCss from '@/lib/colors';
import { Space_Grotesk } from 'next/font/google';
import Providers from './providers';

import 'aos/dist/aos.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../../public/scss/main.scss';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} font-sans antialiased bg-slate-950 text-white`}
      >
        <style type="text/css">{generateColorsCss()}</style>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}