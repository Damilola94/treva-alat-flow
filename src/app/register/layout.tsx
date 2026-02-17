import React, { type ReactNode } from 'react';
import Layout from '../auth/layout';
interface IProps {
  children: ReactNode
}

export default function LLayout (props: IProps) {
  const { children } = props;

  return <Layout>{children}</Layout>;
}
