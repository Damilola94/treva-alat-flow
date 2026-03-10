/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const SIGNALR_URL = "https://treva-api.wemabank.com/treva-chat-service/hubs/chat";

export function createChatHubConnection(accessToken?: string): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(SIGNALR_URL, {
      accessTokenFactory: () => accessToken || "",
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();
}

export function registerChatHubListeners(
  connection: HubConnection,
  listeners: {
    onUserOnline?: (payload: any) => void,
    onUserOffline?: (payload: any) => void,
    onTypingIndicator?: (payload: any) => void,
    onMessagesRead?: (payload: any) => void,
    onChatStarted?: (payload: any) => void,
    onChatUpdated?: (payload: any) => void,
  }
) {
  if (!connection) throw new Error('SignalR connection not initialized');
  if (listeners.onUserOnline) connection.on('UserOnline', listeners.onUserOnline);
  if (listeners.onUserOffline) connection.on('UserOffline', listeners.onUserOffline);
  if (listeners.onTypingIndicator) connection.on('TypingIndicator', listeners.onTypingIndicator);
  if (listeners.onMessagesRead) connection.on('MessagesRead', listeners.onMessagesRead);
  if (listeners.onChatStarted) connection.on('ChatStarted', listeners.onChatStarted);
  if (listeners.onChatUpdated) connection.on('ChatUpdated', listeners.onChatUpdated);
}

export async function sendTypingIndicator(connection: HubConnection, chatId: string, isTyping: boolean) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('SendTypingIndicator', chatId, isTyping);
}

export async function markMessagesAsRead(connection: HubConnection, chatId: string, messageIds: string[]) {
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