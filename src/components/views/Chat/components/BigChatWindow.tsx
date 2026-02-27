'use client';
import { SendMessageButton } from '@/app/assets/svgs';
import { Avatar } from '@/components/shared/avatar';
import { useChat, useMessages } from '@/hooks/Chat';
import { getAvatar, getFullName } from '@/lib/utils';
import { errorToast, usePostMessagesByChatIdMutation } from '@/services';
import { useAppSelector } from '@/store';
import { dayJs, getDateLabel, getErrorMessage } from '@/utils';
import Image from 'next/image';
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FiPaperclip, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { MiniLoader } from '@/components/shared';

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
};

const BigChatWindow = () => {
  const { userId } = useAppSelector((state) => state?.auth);
  // const userToken = useAppSelector((state) => state.auth);
  const [params, setParams] = useState({ searchKey: '' });
  // const [, setSelectedChatId] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatView, setShowChatView] = useState(false);

  const { chatData, refetch: refetchchatList } = useChat(params);
  const {
    chatByIdData,
    refetch,
    loading: messageLoading,
  } = useMessages({ chatId: selectedChat?.id || '' });

  const chatList = useMemo(() => chatData?.data || [], [chatData?.data]);
  const messageList = useMemo(() => {
    const unsorted = chatByIdData?.data || [];
    return [...unsorted].sort((a, b) => {
      const aTime = a?.sentAt ? new Date(a.sentAt).getTime() : 0;
      const bTime = b?.sentAt ? new Date(b.sentAt).getTime() : 0;
      return aTime - bTime;
    });
  }, [chatByIdData?.data]);

  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: typeof messageList } = {};

    messageList.forEach((message) => {
      if (message.sentAt) {
        const dateKey = dayJs(message.sentAt).format('YYYY-MM-DD');
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      } else {
        const dateKey = 'no-date';
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      }
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [messageList]);

  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null); // keep this

  const [triggerPost, { isLoading }] = usePostMessagesByChatIdMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleSendMessage = async () => {
    try {
      const payload = {
        chatId: selectedChat?.id,
        content: message,
        attachments: selectedFiles,
      };
      const response = await triggerPost(payload).unwrap();
      if (response?.isSuccess) {
        setMessage('');
        setSelectedFiles([]);
        refetch && refetch();
      } else {
        errorToast(response?.message || getErrorMessage(response));
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatView(true);
  };

  const handleBackToList = () => {
    setShowChatView(false);
    setSelectedChat(null);
  };

  // Scroll to latest message
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messageList]);

  useEffect(() => {
    refetchchatList && refetchchatList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatByIdData]);

  return (
    <div className="flex h-[calc(100vh-53px)] overflow-hidden">
      {/* Chat List - Hidden on mobile when chat is selected */}
      <aside
        className={`
        w-full md:max-w-[385px] bg-[#F6F6F6] border-r flex flex-col
        ${showChatView ? 'hidden md:flex' : 'flex'}
      `}
      >
        <div className="p-4 border-b font-semibold">All</div>
        <input
          name="searchKey"
          type="text"
          value={params.searchKey}
          onChange={(e) =>
            setParams((prev) => ({ ...prev, searchKey: e.target.value }))
          }
          placeholder="Search or start a new chat"
          className="m-4 px-3 py-2 rounded-md border text-sm"
        />

        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => (
            <div
              key={chat?.sender?.id}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                chat?.hasUnreadMessages ? 'bg-[#EDF4FB]' : 'bg-[#E7E7E7]'
              }`}
              //  onClick={() => {
              //   setSelectedChatId(chat?.sender?.id || '');
              //   setSelectedChat(chat);
              // }}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="relative">
                {chat?.sender?.profilePicture ? (
                  <Image
                    src={chat?.sender?.profilePicture}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <Avatar
                    src={getAvatar({
                      name: chat?.sender ? getFullName(chat.sender) : '',
                      length: 2,
                    })}
                    className="w-[40px] h-[40px] rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                    size="mds"
                  />
                )}
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {chat?.sender?.firstName} {chat?.sender?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0">
                    {chat?.lastMessageTime
                      ? dayJs.utc(chat?.lastMessageTime).local().format('h:mm A')
                      : '--'}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {chat?.lastMessagePreview || 'No messages yet'}
                  </p>
                  {chat?.hasUnreadMessages &&
                    (chat?.unreadMessagesCount as number) > 0 && (
                      <p className="text-[11px] text-right text-gray-400">
                        <span className="p-1 rounded-full bg-[#C4E0FF]">
                          {chat?.unreadMessagesCount}
                        </span>
                      </p>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat View - Full width on mobile when selected */}
      {/* Right chat window */}
      <main
        className={`
        flex-1 flex flex-col h-full bg-white shadow-sm
        ${!showChatView ? 'hidden md:flex' : 'flex'}
      `}
      >
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b gap-3 bg-white">
              {/* Back button - only visible on mobile */}
              <button
                onClick={handleBackToList}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>

              {selectedChat?.sender?.profilePicture ? (
                <Image
                  src={
                    selectedChat?.sender?.profilePicture || '/placeholder.svg'
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                selectedChat?.sender && (
                  <Avatar
                    src={getAvatar({
                      name: selectedChat?.sender
                        ? getFullName(selectedChat.sender)
                        : '',
                      length: 2,
                    })}
                    className="w-[40px] h-[40px] rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                    size="mds"
                  />
                )
              )}

              <h2 className="text-[16px] font-bold">
                {selectedChat?.sender?.firstName}{' '}
                {selectedChat?.sender?.lastName}
              </h2>
            </div>

            {/* Messages */}
            <div
              ref={scrollContainerRef}
              className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4"
              style={{ scrollBehavior: 'auto' }}
            >
              {messageLoading ? (
                <MiniLoader message="Loading" />
              ) : messageList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400">Start a conversation!</p>
                </div>
              ) : (
                <>
                  {groupedMessages.map(([dateKey, messages]) => (
                    <div key={dateKey}>
                      {/* Dynamic Date separator */}
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-xs text-gray-500">
                            {getDateLabel(messages[0].sentAt)}
                          </span>
                        </div>
                      </div>

                      {messages.map((chat) => {
                        const isSender = chat.userId !== userId;
                        const sentTime = dayJs.utc(chat.sentAt).local().format('HH:mm');
                        return (
                          <div key={chat.id} className="space-y-2 mb-4">
                            {chat.content && (
                              <div
                                className={`w-fit max-w-[85%] min-w-[60px] md:max-w-md break-words p-3 rounded-2xl text-sm relative ${
                                  isSender
                                    ? 'bg-[#C4E0FF] mr-auto self-start text-[#262626] rounded-tl-md'
                                    : 'bg-[#BDF7F6] ml-auto self-end text-[#262626] rounded-tr-md'
                                }`}
                              >
                                <p className="pb-4">{chat.content}</p>
                                <span className="absolute bottom-1 right-2 text-[10px] text-gray-500">
                                  {sentTime}
                                </span>
                              </div>
                            )}
                            {chat.attachments?.map((file) => (
                              <div
                                key={file?.id}
                                className={`flex items-center border-2 border-purple-200 bg-purple-50 p-3 rounded-2xl w-fit max-w-[85%] md:max-w-[80%] ${
                                  isSender ? 'mr-auto' : 'ml-auto'
                                }`}
                              >
                                <div className="bg-purple-600 text-white p-2 rounded-lg">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <path d="M14 2v6h6" />
                                  </svg>
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate">
                                    {file?.fileName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {file?.fileType} • {file?.fileSize}
                                  </p>
                                </div>
                                <div className="ml-2">
                                  <a
                                    href={file?.filePathUrl ?? '#'}
                                    download={file?.fileName}
                                    className="text-purple-600 p-2 hover:bg-purple-100 rounded-full inline-flex"
                                    title="Download"
                                  >
                                    <FiDownload className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                  <div style={{ height: '0px' }} />
                </>
              )}
            </div>

            {/* Input + File Preview */}
            <div className="bg-[#F6F6F6]">
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700"
                    >
                      <span className="truncate max-w-[120px]">
                        {file.name}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="ml-2 text-red-500 hover:text-red-700 text-lg"
                        title="Remove file"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedChat && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const hasContent =
                          message.trim().length > 0 || selectedFiles.length > 0;
                        if (hasContent) handleSendMessage();
                      }
                    }}
                    placeholder="Type a message"
                    className="flex-1 px-4 py-4 bg-[#F6F6F6] outline-none text-sm"
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                  <FiPaperclip
                    className="text-xl text-gray-500 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <button onClick={handleSendMessage} disabled={isLoading}>
                    <SendMessageButton />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Empty state when no chat is selected
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a chat
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BigChatWindow;
