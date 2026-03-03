'use client';

// import type { Metadata } from 'next'

import generateColorsCss from '@/lib/colors';
import { ToastContainer } from 'react-toastify';

import 'aos/dist/aos.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../../public/scss/main.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CombinedProviders } from '@/store';
import { Space_Grotesk } from 'next/font/google';
// import "./globals.css";
import "../../public/scss/main.scss";
import { useState } from 'react';

// export const metadata: Metadata = {
//   title: 'Geegs',
//   description: 'Empowering Creativity, Connecting Talent'
// }

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
})

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: false,
//     },
//     mutations: {
//       retry: false,
//     },
//   },
// });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }));
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} font-sans antialiased bg-slate-950 text-white`}>
        <style type="text/css">{generateColorsCss()}</style>
        <QueryClientProvider client={queryClient}>
          <CombinedProviders>{children}

                 <ToastContainer
          position="top-right"
          newestOnTop
          pauseOnFocusLoss={false}
          autoClose={5000}
          limit={3}
          theme="colored"
          toastClassName={(context) =>
            context?.type === 'success'
              ? 'toast toast--success'
              : context?.type === 'error'
              ? 'toast toast--error'
              : 'toast'
          }
          bodyClassName="toast-body"
          progressClassName="toast-progress"
          style={{ zIndex: 99999, pointerEvents: 'auto' }}
        />
          </CombinedProviders>
        </QueryClientProvider>
   
      </body>
    </html>
  );
}
