'use client';
import React from 'react';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Profession } from '@/components/shared/onboarding';

export default function Page () {
  const rt = useRouter();

  const onSubmit = () => {
    rt.push(routes.creatives.onboarding.emailVerification.path);
  };

  return <Profession onSubmit={onSubmit} />;
}
