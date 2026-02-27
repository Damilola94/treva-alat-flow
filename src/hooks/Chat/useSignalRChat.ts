import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalRChat = (
  chatId: string | undefined,
  token: string | undefined,
) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!chatId || !token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://treva-api.wemabank.com/treva-chat-service/chatHub?chatId=${chatId}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => console.log('SignalR connected'))
      .catch(console.error);

    connection.on('ReceiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    connection.on('UserTyping', ({ userId }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }, 2000); // remove typing indicator after 2s
    });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [chatId, token]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (payload: { chatId: string; content: string; attachments?: any[] }) => {
    connectionRef.current?.invoke('SendMessage', payload)
      .catch(console.error);
    setMessages((prev) => [...prev, { ...payload, temp: true }]);
  };

  const sendTyping = () => {
    connectionRef.current?.invoke('Typing', { chatId });
  };

  return { messages, sendMessage, sendTyping, typingUsers };
};