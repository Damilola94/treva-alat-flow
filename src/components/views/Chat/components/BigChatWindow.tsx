'use client';
import { SendMessageButton } from '@/app/assets/svgs';
import { Avatar } from '@/components/shared/avatar';
import { useChat, useMessages } from '@/hooks/Chat';
import { getAvatar, getFullName } from '@/lib/utils';
import { errorToast, usePostMessagesByChatIdMutation } from '@/services';
import { useAppSelector } from '@/store';
import { dayJs, getErrorMessage } from '@/utils';
import Image from 'next/image';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FiPaperclip, FiDownload } from 'react-icons/fi';

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
  const [params, setParams] = useState({ searchKey: '' });
  const [, setSelectedChatId] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { chatData } = useChat(params);
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

  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
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

  // 🔽 Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  return (
    <div className="flex h-[calc(100vh-53px)] overflow-hidden">
      {/* Left chat list */}
      <aside className="max-w-[385px] bg-[#F6F6F6] border-r flex flex-col">
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
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedChatId(chat?.sender?.id || '');
                setSelectedChat(chat);
              }}
            >
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
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {chat?.sender?.firstName} {chat?.sender?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {chat?.lastMessagePreview}
                </p>
              </div>
              <p className="text-[11px] text-gray-400">
                {chat?.lastMessageTime
                  ? dayJs(chat?.lastMessageTime).format('h:mm A')
                  : '--'}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Right chat window */}
      <main className="flex-1 flex flex-col h-full bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b gap-3">
          {selectedChat?.sender?.profilePicture ? (
            <Image
              src={selectedChat?.sender?.profilePicture}
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
            {selectedChat?.sender?.firstName} {selectedChat?.sender?.lastName}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-4">
          {messageLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="txxx_loader" />
            </div>
          ) : messageList?.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              {chatList?.length > 0
                ? 'Click a chat to load messages'
                : 'No messages yet'}
            </p>
          ) : (
            <>
              {messageList.map((chat) => {
                const isSender = chat.userId !== userId;
                const sentTime = dayJs(chat.sentAt).format('HH:mm');
                return (
                  <div key={chat.id} className="space-y-2">
                    {chat.content && (
                      <div
                        className={`w-fit max-w-md break-words p-3 rounded-xl text-sm relative ${
                          isSender
                            ? 'bg-blue-100 mr-auto self-start text-gray-800'
                            : 'bg-teal-100 ml-auto self-end text-gray-800'
                        }`}
                      >
                        <p className="pb-2">{chat.content}</p>
                        <span className="absolute mt-2 bottom-1 right-2 text-[10px] text-gray-500">
                          {sentTime}
                        </span>
                      </div>
                    )}
                    {chat.attachments?.map((file) => (
                      <div
                        key={file?.id}
                        className={`flex items-center border border-purple-500 p-4 rounded-xl w-fit max-w-[80%] ${
                          isSender ? 'mr-auto' : 'ml-auto'
                        }`}
                      >
                        <div className="bg-purple-600 text-white p-2 rounded-md">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold">{file?.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {file?.fileType} • {file?.fileSize}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <a
                            href={file?.filePathUrl ?? '#'}
                            download={file?.fileName}
                            className="text-purple-600 text-xl"
                            title="Download"
                          >
                            <FiDownload />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input + File Preview */}
        <div className="bg-[#F6F6F6]">
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-md text-sm text-gray-700"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Remove file"
                  >
                    ✕
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
      </main>
    </div>
  );
};

export default BigChatWindow;
