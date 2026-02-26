'use client';
import { ArrowRight } from '@/components/shared';
import { useState } from 'react';
import SetPassword from './setPassword';
import SetPin from './setPin';

type SecurityView = 'default' | 'password' | 'pin';

export default function Security() {
  const [view, setView] = useState<SecurityView>('default');

  return <div>
    {view === 'default' && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <p className='font-medium text-[14px]'>Set new password</p>
      <button        
      className="font-bold text-[#7B37F0] flex items-center gap-1"
        onClick={() => setView('password')}
      >
        Set Password <ArrowRight stroke='#7B37F0'/>
      </button>
    </div>

    <div className='flex justify-between items-center text-center'>
      <p className='font-medium text-[14px]'>Rest PIN code</p>
        <button        
      className="font-bold text-[#7B37F0] flex items-center gap-1"
        onClick={() => setView('pin')}
      >
        Set PIN <ArrowRight stroke='#7B37F0'/>
      </button>
    </div>
    </div>
    )}
    {view === 'password' && <SetPassword onBack={() => setView('default')} />}
    {view === 'pin' && <SetPin onBack={() => setView('default')} />}
    </div>;
}
