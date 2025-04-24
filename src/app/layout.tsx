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

// export const metadata: Metadata = {
//   title: 'IRM Web App',
//   description: ''
// }

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <style type="text/css">{generateColorsCss()}</style>
        <ToastContainer />

        <QueryClientProvider client={queryClient}>
          <CombinedProviders>{children}</CombinedProviders>
        </QueryClientProvider>
      </body>
    </html>
  );
}
