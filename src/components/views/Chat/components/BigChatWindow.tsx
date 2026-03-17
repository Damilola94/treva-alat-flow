/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  createChatHubConnection,
  joinChat,
  leaveChat,
  markMessagesAsRead,
  registerChatHubListeners,
  sendTypingIndicator,
} from '@/lib/signalr/chatHub';
import { SendMessageButton } from '@/app/assets/svgs';
import { Avatar } from '@/components/shared/avatar';
import { useChat, useMessages } from '@/hooks/Chat';
import {
  CheckIcon,
  DownloadIcon,
  MiniLoader,
  SendIcon,
} from '@/components/shared';
import { getAvatar, getFullName } from '@/lib/utils';
import { errorToast, usePostMessagesByChatIdMutation } from '@/services';
import { useAppSelector } from '@/store';
import { dayJs, getCookie, getDateLabel, getErrorMessage } from '@/utils';
import Image from 'next/image';
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowLeft, FiPaperclip, FiSearch } from 'react-icons/fi';

export type UserPreview = {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePicture?: string | null;
  actorId?: string;
};

export type Chat = {
  id?: string;
  sender?: UserPreview;
  receiver?: UserPreview;
  lastMessageTime?: string | null | undefined;
  lastMessagePreview?: string | null;
  hasUnreadMessages?: boolean;
  unreadMessagesCount?: number;
};

type MessageAttachment = {
  id?: string;
  fileName?: string | null;
  filePathUrl?: string | null;
  fileType?: string | null;
  fileSize?: string | null;
};

type MessageItem = {
  id?: string;
  chatId?: string;
  userId?: string;
  content?: string | null;
  sentAt?: string;
  isRead?: boolean;
  attachments?: MessageAttachment[];
};

const isImageFile = (url?: string | null, fileType?: string | null) => {
  if (!url && !fileType) return false;

  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.bmp',
  ];

  const imageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
  ];

  if (url) {
    const lower = url.toLowerCase().split('?')[0];
    if (imageExtensions.some((ext) => lower.endsWith(ext))) return true;
  }

  if (fileType && imageTypes.includes(fileType.toLowerCase())) return true;

  return false;
};

const BigChatWindow = () => {
  const { userId } = useAppSelector((state) => state?.auth);

  const [connection, setConnection] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [readMessages, setReadMessages] = useState<Record<string, string[]>>(
    {},
  );
  const [params, setParams] = useState({ searchKey: '' });
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatView, setShowChatView] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [liveMessages, setLiveMessages] = useState<MessageItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { chatData, refetch: refetchchatList } = useChat(params);
  const { chatByIdData, loading: messageLoading } = useMessages({
    chatId: selectedChat?.id || '',
  });

  const [triggerPost, { isLoading }] = usePostMessagesByChatIdMutation();

  const chatList = useMemo(() => chatData?.data || [], [chatData?.data]);

  useEffect(() => {
    const apiMessages = (chatByIdData?.data || []) as MessageItem[];
    const sorted = [...apiMessages].sort((a, b) => {
      const aTime = a?.sentAt ? new Date(a.sentAt).getTime() : 0;
      const bTime = b?.sentAt ? new Date(b.sentAt).getTime() : 0;
      return aTime - bTime;
    });

    setLiveMessages(sorted);
  }, [chatByIdData?.data, selectedChat?.id]);

  const messageList = useMemo(() => {
    return [...liveMessages].sort((a, b) => {
      const aTime = a?.sentAt ? new Date(a.sentAt).getTime() : 0;
      const bTime = b?.sentAt ? new Date(b.sentAt).getTime() : 0;
      return aTime - bTime;
    });
  }, [liveMessages]);

  const groupedMessages = useMemo(() => {
    const groups: Record<string, MessageItem[]> = {};

    messageList.forEach((messageItem) => {
      const dateKey = messageItem.sentAt
        ? dayJs(messageItem.sentAt).format('YYYY-MM-DD')
        : 'no-date';

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(messageItem);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [messageList]);

  const selectedChatDisplayName = useMemo(() => {
    if (!selectedChat?.sender) return '';
    return `${selectedChat.sender.firstName ?? ''} ${selectedChat.sender.lastName ?? ''}`.trim();
  }, [selectedChat]);

  const selectedChatIsOnline = useMemo(() => {
    return onlineUsers.includes(selectedChat?.sender?.id || '');
  }, [onlineUsers, selectedChat]);

  const lastOwnMessageId = useMemo(() => {
    const ownMessages = [...messageList].filter((msg) => msg.userId === userId);
    if (ownMessages.length === 0) return null;

    return ownMessages[ownMessages.length - 1]?.id ?? null;
  }, [messageList, userId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (!connection || !selectedChat?.id) return;

    sendTypingIndicator(connection, selectedChat.id, true).catch(() => null);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(connection, selectedChat.id!, false).catch(
        () => null,
      );
    }, 1200);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    const hasContent = trimmedMessage.length > 0 || selectedFiles.length > 0;

    if (!hasContent || !selectedChat?.id) return;

    try {
      const payload = {
        chatId: selectedChat.id,
        content: trimmedMessage,
        attachments: selectedFiles,
      };

      const response = await triggerPost(payload).unwrap();

      if (response?.isSuccess) {
        setMessage('');
        setSelectedFiles([]);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        if (connection) {
          sendTypingIndicator(connection, selectedChat.id, false).catch(
            () => null,
          );
        }
      } else {
        errorToast(response?.message || getErrorMessage(response));
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!selectedChat?.id) return;

    const token = getCookie('_tk');
    const conn = createChatHubConnection(token ?? undefined);
    setConnection(conn);

    conn
      .start()
      .then(async () => {
        await joinChat(conn, selectedChat.id || '');

        registerChatHubListeners(conn, {
          onUserOnline: (payload) => {
            setOnlineUsers((prev) =>
              Array.from(new Set([...prev, payload.userId])),
            );
          },

          onUserOffline: (payload) => {
            setOnlineUsers((prev) =>
              prev.filter((id) => id !== payload.userId),
            );
          },

          onTypingIndicator: (payload) => {
            if (payload.chatId !== selectedChat.id) return;
            if (payload.userId === userId) return;

            setTypingUsers((prev) => ({
              ...prev,
              [payload.chatId]: payload.isTyping
                ? Array.from(
                    new Set([...(prev[payload.chatId] || []), payload.userId]),
                  )
                : (prev[payload.chatId] || []).filter(
                    (id) => id !== payload.userId,
                  ),
            }));
          },

          onMessagesRead: (payload) => {
            setReadMessages((prev) => ({
              ...prev,
              [payload.chatId]: Array.from(
                new Set([
                  ...(prev[payload.chatId] || []),
                  ...payload.messageIds,
                ]),
              ),
            }));

            setLiveMessages((prev) =>
              prev.map((msg) =>
                payload.messageIds.includes(msg.id)
                  ? { ...msg, isRead: true }
                  : msg,
              ),
            );
          },

          onChatStarted: () => {
            refetchchatList?.();
          },

          onChatUpdated: () => {
            refetchchatList?.();
          },

          onMessageCreated: (payload) => {
            if (!payload?.chatId) return;

            if (payload.chatId !== selectedChat.id) {
              refetchchatList?.();
              return;
            }

            setTypingUsers((prev) => ({
              ...prev,
              [payload.chatId]: (prev[payload.chatId] || []).filter(
                (id) => id !== payload.userId,
              ),
            }));

            setLiveMessages((prev) => {
              const alreadyExists = prev.some(
                (msg) => msg.id === payload.messageId,
              );
              if (alreadyExists) return prev;

              const newMessage: MessageItem = {
                id: payload.messageId,
                chatId: payload.chatId,
                userId: payload.userId,
                content: payload.content,
                sentAt: payload.sentAt,
                isRead: false,
                attachments: payload.attachments?.map(
                  (attachment: any, index: number) => ({
                    id: `${payload.messageId}-attachment-${index}`,
                    fileName: attachment.fileName,
                    filePathUrl: attachment.filePathUrl,
                    fileType: attachment.fileType,
                    fileSize: attachment.fileSize,
                  }),
                ),
              };

              return [...prev, newMessage];
            });

            refetchchatList?.();
          },
        });
      })
      .catch(() => {
        errorToast('SignalR connection failed');
      });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      leaveChat(conn, selectedChat.id || '').catch(() => null);
      conn.stop().catch(() => null);
    };
  }, [selectedChat?.id, refetchchatList, userId]);

  useEffect(() => {
    if (connection && selectedChat?.id && messageList.length > 0) {
      const unreadIds = messageList
        .filter(
          (msg) =>
            msg.userId !== userId &&
            !(readMessages[selectedChat.id || ''] || []).includes(msg.id || ''),
        )
        .map((msg) => msg.id)
        .filter((id): id is string => typeof id === 'string');

      if (unreadIds.length > 0) {
        markMessagesAsRead(connection, selectedChat.id, unreadIds).catch(
          () => null,
        );
      }
    }
  }, [messageList, connection, selectedChat?.id, readMessages, userId]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messageList, typingUsers, selectedChat?.id]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatView(true);
    setTypingUsers((prev) => ({
      ...prev,
      [chat.id || '']: [],
    }));
  };

  const handleBackToList = () => {
    setShowChatView(false);
    setSelectedChat(null);
    setLiveMessages([]);
  };

  return (
    <div>
      <div className="flex h-[calc(100dvh-110px)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <aside
          className={`
            flex-shrink-0 flex flex-col bg-[#F8F9FA] border-r border-gray-200
            w-full md:w-[260px] lg:w-[300px] xl:w-[320px]
            ${showChatView ? 'hidden md:flex' : 'flex'}
          `}
        >
          <div className="px-4 pt-5 pb-3">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Messages</h2>

            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="searchKey"
                type="text"
                value={params.searchKey}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    searchKey: e.target.value,
                  }))
                }
                placeholder="Search conversations…"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
            {chatList.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-400">
                No conversations yet
              </p>
            )}

            {chatList.map((chat) => {
              const isOnline = onlineUsers.includes(chat?.sender?.id || '');

              return (
                <button
                  key={chat?.id}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition hover:bg-gray-100 ${
                    selectedChat?.id === chat?.id
                      ? 'bg-blue-50'
                      : chat?.hasUnreadMessages
                        ? 'bg-[#EDF4FB]'
                        : ''
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="relative flex-shrink-0">
                    {chat?.sender?.profilePicture ? (
                      <Image
                        src={chat.sender.profilePicture}
                        alt="avatar"
                        className="h-11 w-11 rounded-full object-cover"
                        width={44}
                        height={44}
                      />
                    ) : (
                      <Avatar
                        src={getAvatar({
                          name: chat?.sender ? getFullName(chat.sender) : '',
                          length: 2,
                        })}
                        className="h-11 w-11 rounded-full border-2 border-[#A5A6F6] object-cover"
                        size="mds"
                      />
                    )}

                    {isOnline && (
                      <span className="absolute bottom-0 right-0">
                        <CheckIcon />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {chat?.sender?.firstName} {chat?.sender?.lastName}
                      </p>
                      <p className="ml-1 flex-shrink-0 text-[11px] text-gray-400">
                        {chat?.lastMessageTime
                          ? dayJs
                              .utc(chat.lastMessageTime)
                              .local()
                              .format('h:mm A')
                          : ''}
                      </p>
                    </div>

                    <div className="mt-0.5 flex items-center justify-between">
                      <p className="max-w-[160px] truncate text-xs text-gray-500">
                        {chat?.lastMessagePreview || 'No messages yet'}
                      </p>

                      {chat?.hasUnreadMessages &&
                        (chat?.unreadMessagesCount as number) > 0 && (
                          <span className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                            {chat.unreadMessagesCount}
                          </span>
                        )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main
          className={`
            flex-1 flex flex-col h-full min-w-0 bg-white
            ${!showChatView ? 'hidden md:flex' : 'flex'}
          `}
        >
          {selectedChat ? (
            <>
              <div className="flex flex-shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 py-3.5 shadow-sm">
                <button
                  onClick={handleBackToList}
                  className="rounded-full p-2 transition hover:bg-gray-100 md:hidden"
                >
                  <FiArrowLeft className="h-5 w-5 text-gray-600" />
                </button>

                <div className="relative flex-shrink-0">
                  {selectedChat?.sender?.profilePicture ? (
                    <Image
                      src={selectedChat.sender.profilePicture}
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    selectedChat?.sender && (
                      <Avatar
                        src={getAvatar({
                          name: getFullName(selectedChat.sender),
                          length: 2,
                        })}
                        className="h-10 w-10 rounded-full border-2 border-[#A5A6F6] object-cover"
                        size="mds"
                      />
                    )
                  )}

                  {selectedChatIsOnline && (
                    <span className="absolute bottom-0 right-0">
                      <CheckIcon />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[15px] font-bold text-gray-900">
                    {selectedChat?.sender?.firstName}{' '}
                    {selectedChat?.sender?.lastName}
                  </h2>
                </div>
              </div>

              <div
                ref={scrollContainerRef}
                className="flex-1 min-h-0 overflow-y-auto bg-[#F0F2F5] px-4 py-4"
                style={{ scrollBehavior: 'auto' }}
              >
                {messageLoading ? (
                  <MiniLoader message="Loading" />
                ) : messageList.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
                      <svg
                        className="h-10 w-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-500">No messages yet</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Only clients can begin a chat
                    </p>
                  </div>
                ) : (
                  <>
                    {groupedMessages.map(([dateKey, messages]) => (
                      <div key={dateKey}>
                        <div className="my-4 flex items-center justify-center">
                          <div className="rounded-full px-3 py-1">
                            <span className="text-[11px] font-medium text-gray-500">
                              {getDateLabel(messages[0].sentAt)}
                            </span>
                          </div>
                        </div>

                        {messages.map((chatItem) => {
                          const isOwnMessage = chatItem.userId === userId;
                          const sentTime = dayJs
                            .utc(chatItem.sentAt)
                            .local()
                            .format('h:mm A');
                          const isLastOwnMessage =
                            isOwnMessage && chatItem.id === lastOwnMessageId;

                          return (
                            <div
                              key={chatItem.id}
                              className={`mb-3 flex flex-col gap-1 ${
                                isOwnMessage ? 'items-end' : 'items-start'
                              }`}
                            >
                              {chatItem.content && (
                                <div
                                  className={`
                                    relative max-w-[75%] rounded-2xl px-4 py-6 text-sm leading-relaxed shadow-sm
                                    sm:max-w-[65%] md:max-w-[55%] lg:max-w-[50%]
                                    ${
                                      isOwnMessage
                                        ? 'rounded-tr-sm bg-[#BDF7F6] text-gray-800'
                                        : 'rounded-tl-sm bg-[#C4E0FF] text-gray-800'
                                    }
                                  `}
                                >
                                  <p className="break-words pr-12 text-justify">
                                    {chatItem.content}
                                  </p>

                                  <span className="absolute bottom-1 right-3 flex items-center gap-2 whitespace-nowrap text-[10px] text-[#3D3D3D]">
                                    {sentTime}
                                    {isOwnMessage &&
                                      (isLastOwnMessage ? (
                                        <span className="text-[10px] font-medium">
                                          {chatItem.isRead ? 'Seen' : 'Sent'}
                                        </span>
                                      ) : (
                                        <SendIcon />
                                      ))}
                                  </span>
                                </div>
                              )}

                              {chatItem.attachments?.map((file) => (
                                <div
                                  key={file?.id}
                                  className={`max-w-[75%] sm:max-w-[65%] md:max-w-[55%] ${
                                    isOwnMessage ? 'ml-auto' : 'mr-auto'
                                  }`}
                                >
                                  {isImageFile(
                                    file?.filePathUrl,
                                    file?.fileType,
                                  ) ? (
                                    <div className="group relative overflow-hidden rounded-xl shadow-sm">
                                      <Image
                                        src={file.filePathUrl!}
                                        alt={file?.fileName || 'image'}
                                        width={250}
                                        height={200}
                                        className="h-auto max-h-[200px] w-auto max-w-[250px] rounded-xl object-cover"
                                      />

                                      <a
                                        href={file?.filePathUrl ?? '#'}
                                        download={file?.fileName || undefined}
                                        onClick={(e) => {
                                          if (file?.filePathUrl) {
                                            e.preventDefault();
                                            fetch(file.filePathUrl)
                                              .then((res) => res.blob())
                                              .then((blob) => {
                                                const url =
                                                  URL.createObjectURL(blob);
                                                const a =
                                                  document.createElement('a');
                                                a.href = url;
                                                a.download =
                                                  file.fileName || 'image';
                                                a.click();
                                                URL.revokeObjectURL(url);
                                              })
                                              .catch(() => {
                                                window.open(
                                                  file.filePathUrl!,
                                                  '_blank',
                                                );
                                              });
                                          }
                                        }}
                                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 shadow backdrop-blur-sm transition group-hover:opacity-100"
                                        title="Download"
                                      >
                                        <DownloadIcon />
                                      </a>

                                      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                                        {sentTime}
                                        {isOwnMessage &&
                                          (isLastOwnMessage ? (
                                            <span className="font-medium">
                                              {chatItem.isRead ? 'Seen' : 'Sent'}
                                            </span>
                                          ) : (
                                            <SendIcon />
                                          ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
                                      <div className="flex-shrink-0 rounded-lg bg-purple-100 p-2">
                                        <svg
                                          className="h-5 w-5 text-purple-600"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                          <path
                                            d="M14 2v6h6"
                                            fill="white"
                                            opacity="0.5"
                                          />
                                        </svg>
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <p className="max-w-[140px] truncate text-sm font-medium text-gray-800">
                                          {file?.fileName}
                                        </p>
                                      </div>

                                      <a
                                        href={file?.filePathUrl ?? '#'}
                                        download={file?.fileName || undefined}
                                        onClick={(e) => {
                                          if (file?.filePathUrl) {
                                            e.preventDefault();
                                            fetch(file.filePathUrl)
                                              .then((res) => res.blob())
                                              .then((blob) => {
                                                const url =
                                                  URL.createObjectURL(blob);
                                                const a =
                                                  document.createElement('a');
                                                a.href = url;
                                                a.download =
                                                  file.fileName || 'file';
                                                a.click();
                                                URL.revokeObjectURL(url);
                                              })
                                              .catch(() => {
                                                window.open(
                                                  file.filePathUrl!,
                                                  '_blank',
                                                );
                                              });
                                          }
                                        }}
                                        className="flex-shrink-0 rounded-full p-1.5 text-purple-600 transition hover:bg-purple-50"
                                        title="Download"
                                      >
                                        <DownloadIcon />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {selectedChat &&
                      typingUsers[selectedChat.id || '']?.length > 0 && (
                        <div className="mb-3 flex items-start">
                          <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-xs italic text-gray-500 shadow-sm sm:max-w-[65%] md:max-w-[55%] lg:max-w-[50%]">
                            {selectedChatDisplayName} is typing...
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>

              <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 pt-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-gray-700"
                      >
                        <span className="max-w-[120px] truncate text-xs">
                          {file.name}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="ml-2 text-sm font-bold text-red-400 hover:text-red-600"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    title="Attach file"
                  >
                    <FiPaperclip className="h-5 w-5" />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />

                  <input
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message…"
                    className="min-w-0 flex-1 rounded-full bg-[#F0F2F5] px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-200"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={
                      isLoading ||
                      (message.trim().length === 0 &&
                        selectedFiles.length === 0)
                    }
                    className="flex-shrink-0 transition disabled:opacity-40"
                    title="Send"
                  >
                    <SendMessageButton />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden flex-1 items-center justify-center bg-[#F0F2F5] md:flex">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-md">
                  <svg
                    className="h-14 w-14 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">
                  Select a conversation
                </h3>
                <p className="text-sm text-gray-400">
                  Choose from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BigChatWindow;