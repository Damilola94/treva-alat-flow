'use client';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ReduxProvider from './ReduxProvider';
import {
  ClientOnboardingProvider,
  CreativesOnboardingProvider,
} from '../context';

function CombinedProviders ({ children }: { children: ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <CreativesOnboardingProvider>
          <ClientOnboardingProvider>{children}</ClientOnboardingProvider>
        </CreativesOnboardingProvider>
      </ReduxProvider>
    </>
  );
}

export { CombinedProviders };
