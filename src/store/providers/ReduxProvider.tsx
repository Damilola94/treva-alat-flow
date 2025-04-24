'use client';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Provider } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { store } from '../store';

interface Props {
  children: ReactNode
}

const ReduxProvider = (props: Props) => {
  return (
    <Provider store={store}>
      <>{props.children}</>
    </Provider>
  );
};

export default ReduxProvider;
