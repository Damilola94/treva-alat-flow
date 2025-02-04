import React, { type ReactNode } from 'react';
import Layout from '../auth/layout';
import { FormProvider } from './context/onboard-context';
interface IProps {
  children: ReactNode
}

export default function LLayout (props: IProps) {
  const { children } = props;

  return (
    <FormProvider>
      <Layout>{children}</Layout>
    </FormProvider>
  );
}
