/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

const SIGNALR_URL =
  'https://treva-api.wemabank.com/treva-chat-service/hubs/chat';

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

  if (listeners.onUserOnline) {
    connection.on('UserOnline', listeners.onUserOnline);
  }

  if (listeners.onUserOffline) {
    connection.on('UserOffline', listeners.onUserOffline);
  }

  if (listeners.onTypingIndicator) {
    connection.on('TypingIndicator', listeners.onTypingIndicator);
  }

  if (listeners.onMessagesRead) {
    connection.on('MessagesRead', listeners.onMessagesRead);
  }

  if (listeners.onChatStarted) {
    connection.on('ChatStarted', listeners.onChatStarted);
  }

  if (listeners.onChatUpdated) {
    connection.on('ChatUpdated', listeners.onChatUpdated);
  }

  if (listeners.onMessageCreated) {
    connection.on('MessageCreated', listeners.onMessageCreated);
  }

  if (listeners.onReceiveNotification) {
    connection.on('ReceiveNotification', listeners.onReceiveNotification);
  }
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
  connection: any,
  chatId: string,
  isTyping: boolean,
) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('SendTypingIndicator', chatId, isTyping);
}

export async function markMessagesAsRead(
  connection: any,
  chatId: string,
  messageIds: string[],
) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('MarkMessagesAsRead', chatId, messageIds);
}

export async function joinChat(connection: any, chatId: string) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('JoinChat', chatId);
}

export async function leaveChat(connection: any, chatId: string) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('LeaveChat', chatId);
}