// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import { CombinedProviders } from '@/store';
import { NotificationProvider } from '@/contexts/NotificationProvider';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CombinedProviders>
        <NotificationProvider>
          {children}
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
        </NotificationProvider>
      </CombinedProviders>
    </QueryClientProvider>
  );
}