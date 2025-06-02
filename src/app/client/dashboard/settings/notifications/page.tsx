'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Notifications() {
   const [inApp, setInApp] = useState(false);
  const [email, setEmail] = useState(false);
  const [push, setPush] = useState(false);

  return (
    <div>
      <h2 className="font-bold">Notifications</h2>
      <div className="flex items-center justify-between mb-8 mt-12">
        <p className='flex flex-col font-bold text-[#262626]'>
          In-App Notifications{' '}
          <span className='text-[#939393] text-sm font-normal'>Show alerts in the Treva app interface</span>
        </p>
        <button
          onClick={() => setInApp(!inApp)}
          className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${
            inApp ? 'bg-[#4BA8E6] justify-end' : 'bg-[#C8C8C8] justify-start'
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>
      <div className="flex items-center justify-between mb-8">
        <p className='flex flex-col font-bold text-[#262626]'>
          Email Notifications <span className='text-[#939393] text-sm font-normal'>Get updates via email</span>
        </p>
         <button
          onClick={() => setEmail(!email)}
          className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${
            email ? 'bg-[#4BA8E6] justify-end' : 'bg-[#C8C8C8] justify-start'
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>
      <div className='flex items-center justify-between'>
        <p className='flex flex-col font-bold text-[#262626]'>
          Push Notifications <span className='text-[#939393] text-sm font-normal'>Real-time pop-up notifications</span>
        </p>
         <button
          onClick={() => setPush(!push)}
          className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${
            push ? 'bg-[#4BA8E6] justify-end' : 'bg-[#C8C8C8] justify-start'
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>
      <div className="flex justify-end mt-14">
        <Button
          className="app_auth_login__btn"
          size="md"
          backgroundColor="primary-blue-500"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
