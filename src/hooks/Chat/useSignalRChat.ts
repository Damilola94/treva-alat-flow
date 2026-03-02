'use client';
import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { getCookie } from '@/utils';

export type Message = {
  id: string;
  chatId: string;
  userId: string;
  content?: string;
  attachments?: { id: string; fileName: string; filePathUrl?: string }[];
  sentAt: string;
};

export const useChatSignalR = (chatId: string | undefined, userId: string | undefined) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [seenBy, setSeenBy] = useState<{ [msgId: string]: string[] }>({});

  useEffect(() => {
    if (!chatId || !userId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_CHAT_SERVICE_API_URL}/chatHub`, {
        accessTokenFactory: () => getCookie('_tk') || '',
      })
      .withAutomaticReconnect()
      .build();

    connection.start().catch(console.error);
    connectionRef.current = connection;

    // Incoming message
    connection.on('ReceiveMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Typing indicator
    connection.on('UserTyping', (typingUserId: string) => {
      if (!typingUsers.includes(typingUserId)) {
        setTypingUsers((prev) => [...prev, typingUserId]);
        setTimeout(() => setTypingUsers((prev) => prev.filter((id) => id !== typingUserId)), 3000);
      }
    });

    // Seen indicator
    connection.on('MessageSeen', ({ messageId, seenUserId }: { messageId: string; seenUserId: string }) => {
      setSeenBy((prev) => ({
        ...prev,
        [messageId]: prev[messageId] ? [...prev[messageId], seenUserId] : [seenUserId],
      }));
    });

    // Join chat room
    connection.invoke('JoinChat', chatId, userId).catch(console.error);

    return () => {
      connection.stop();
    };
  }, [chatId, userId, typingUsers]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (msg: { content?: string; attachments?: any[] }) => {
    connectionRef.current?.invoke('SendMessage', { ...msg, chatId, userId });
  };

  const sendTyping = () => {
    connectionRef.current?.invoke('Typing', chatId, userId);
  };

  const markSeen = (messageId: string) => {
    connectionRef.current?.invoke('MarkAsSeen', chatId, messageId, userId);
  };

  return { messages, sendMessage, typingUsers, sendTyping, markSeen, seenBy };
};