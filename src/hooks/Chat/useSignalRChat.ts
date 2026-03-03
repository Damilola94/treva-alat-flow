/* ========================================================================
   FILE: src/lib/signalr/chatHub.ts
   ======================================================================== */


/* ========================================================================
   FILE: src/hooks/useSignalRChat.ts
   ======================================================================== */
'use client';

import { useEffect, useRef } from 'react';
import config from '@/lib/config';
import { getLocalStorage } from '@/services';
import { registerChatHubListeners, startChatHub } from '@/lib/signalr/chatHub';

export function useSignalRChat() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const getJwt = () => {
      const token = getLocalStorage(config.tokenKey);
      return (token?.jwToken || token?.accessToken || null) as string | null;
    };

    (async () => {
      // logs will show in console
      await startChatHub(getJwt);
      registerChatHubListeners();
    })().catch((e) => {
      console.log('❌ SignalR: init failed', e);
    });
  }, []);
}

/* ========================================================================
   FILE: (your component) BigChatWindow.tsx
   Add ONE line near the top of component body:
   ======================================================================== */
// import { useSignalRChat } from '@/hooks/useSignalRChat';

// inside BigChatWindow component:
 // useSignalRChat();