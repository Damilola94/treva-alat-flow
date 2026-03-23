/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

const SIGNALR_URL =
  'https://treva-api.wemabank.com/treva-chat-service/hubs/chat';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (_payload?: any) => undefined;

export function createChatHubConnection(accessToken?: string): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(SIGNALR_URL, {
      accessTokenFactory: () => accessToken || '',
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();
}

export function registerChatHubListeners(
  connection: HubConnection,
  listeners: {
    onUserOnline?: (payload: any) => void;
    onUserOffline?: (payload: any) => void;
    onTypingIndicator?: (payload: any) => void;
    onMessagesRead?: (payload: any) => void;
    onChatStarted?: (payload: any) => void;
    onChatUpdated?: (payload: any) => void;
    onMessageCreated?: (payload: any) => void;
    onReceiveNotification?: (payload: any) => void;
  },
) {
  if (!connection) throw new Error('SignalR connection not initialized');

  connection.off('UserOnline');
  connection.off('UserOffline');
  connection.off('TypingIndicator');
  connection.off('MessagesRead');
  connection.off('ChatStarted');
  connection.off('ChatUpdated');
  connection.off('MessageCreated');
  connection.off('ReceiveNotification');

  connection.on('UserOnline', listeners.onUserOnline ?? noop);
  connection.on('UserOffline', listeners.onUserOffline ?? noop);
  connection.on('TypingIndicator', listeners.onTypingIndicator ?? noop);
  connection.on('MessagesRead', listeners.onMessagesRead ?? noop);
  connection.on('ChatStarted', listeners.onChatStarted ?? noop);
  connection.on('ChatUpdated', listeners.onChatUpdated ?? noop);
  connection.on('MessageCreated', listeners.onMessageCreated ?? noop);
  connection.on(
    'ReceiveNotification',
    listeners.onReceiveNotification ?? noop,
  );
}

export function unregisterChatHubListeners(connection: HubConnection) {
  if (!connection) return;

  connection.off('UserOnline');
  connection.off('UserOffline');
  connection.off('TypingIndicator');
  connection.off('MessagesRead');
  connection.off('ChatStarted');
  connection.off('ChatUpdated');
  connection.off('MessageCreated');
  connection.off('ReceiveNotification');
}

export async function sendTypingIndicator(
  connection: HubConnection,
  chatId: string,
  isTyping: boolean,
) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('SendTypingIndicator', chatId, isTyping);
}

export async function markMessagesAsRead(
  connection: HubConnection,
  chatId: string,
  messageIds: string[],
) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('MarkMessagesAsRead', chatId, messageIds);
}

export async function joinChat(connection: HubConnection, chatId: string) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('JoinChat', chatId);
}

export async function leaveChat(connection: HubConnection, chatId: string) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('LeaveChat', chatId);
}