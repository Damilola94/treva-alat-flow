'use client';

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

const CHAT_HUB_URL = 'https://treva-api.wemabank.com/hubs/chat';

let connection: HubConnection | null = null;
let starting: Promise<void> | null = null;

export function getOrCreateChatHub(getJwt: () => string | null) {
  if (connection) return connection;

  console.log('🔗 SignalR hub url:', CHAT_HUB_URL);
  console.log('🔗 negotiate url:', `${CHAT_HUB_URL}/negotiate?negotiateVersion=1`);

  connection = new HubConnectionBuilder()
    .withUrl(CHAT_HUB_URL, {
      accessTokenFactory: () => getJwt() ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.onreconnecting((err) => {
    console.log('🔁 SignalR: reconnecting...', err?.message ?? err);
  });

  connection.onreconnected((connectionId) => {
    console.log('✅ SignalR: reconnected. connectionId=', connectionId);
  });

  connection.onclose((err) => {
    console.log('❌ SignalR: closed.', err?.message ?? err);
  });

  return connection;
}

export async function startChatHub(getJwt: () => string | null) {
  const conn = getOrCreateChatHub(getJwt);

  if (conn.state === HubConnectionState.Connected) {
    console.log('✅ SignalR: already connected');
    return;
  }

  if (!starting) {
    console.log('⏳ SignalR: starting connection...');
    starting = conn
      .start()
      .then(() => console.log('✅ SignalR: connected'))
      .catch((err) => {
        console.log('❌ SignalR: start failed', err);
        throw err;
      })
      .finally(() => {
        starting = null;
      });
  }

  await starting;
}

export function registerChatHubListeners() {
  if (!connection) throw new Error('SignalR not initialized. Call startChatHub() first.');

  console.log('🧩 SignalR: registering listeners');

  connection.on('ChatStarted', (payload) => console.log('📩 ChatStarted', payload));
  connection.on('UserOnline', (payload) => console.log('🟢 UserOnline', payload));
  connection.on('UserOffline', (payload) => console.log('⚫ UserOffline', payload));
  connection.on('TypingIndicator', (payload) => console.log('✍️ TypingIndicator', payload));
  connection.on('MessagesRead', (payload) => console.log('✅ MessagesRead', payload));
}

export async function sendTypingIndicator(chatId: string, isTyping: boolean) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('SendTypingIndicator', chatId, isTyping);
}

export async function markMessagesAsRead(chatId: string, messageIds: string[]) {
  if (!connection) throw new Error('SignalR not initialized');
  return connection.invoke('MarkMessagesAsRead', chatId, messageIds);
}