'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/shared/onboarding';

const ResetEmail = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail);
  }, []);

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title">Password reset email sent</h3>
            <div className="flex flex-col gap-8">
              <h3 className="app_auth_login__forgot_password_reset_link">
                A link has been sent to your email{' '}
                <span className="font-bold">{email ?? '...'}</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetEmail;
