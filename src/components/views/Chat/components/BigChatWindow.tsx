'use client';
import { Avatar } from '@/components/shared/avatar';
import { useChat, useMessages } from '@/hooks/Chat';
import { getAvatar, getFullName } from '@/lib/utils';
import { errorToast, usePostMessagesByChatIdMutation } from '@/services';
import { useAppSelector } from '@/store';
import { dayJs, getErrorMessage } from '@/utils';
import Image from 'next/image';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
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
  const [params, setParams] = useState({
    // pageNumber?: number,
    // pageSize?: number,
    searchKey: '',
  });
  const [, setSelectedChatId] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { chatData } = useChat(params);
  const {
    chatByIdData,
    refetch,
    loading: messageLoading,
  } = useMessages({
    chatId: selectedChat?.id || '',
  });

  const chatList = useMemo(() => chatData?.data || [], [chatData?.data]);
  const messageList = useMemo(
    () => chatByIdData?.data || [],
    [chatByIdData?.data],
  );

  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [triggerPost, { isLoading }] = usePostMessagesByChatIdMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async () => {
    try {
      const payload = {
        chatId: selectedChat?.id,
        content: message,
        attachments: selectedFile ? [selectedFile] : [],
      };
      const response = await triggerPost(payload).unwrap();
      if (response?.isSuccess) {
        setMessage('');
        setSelectedFile(null);
        refetch && refetch();
      } else {
        errorToast(response?.message || getErrorMessage(response));
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

  console.log(selectedChat);

  return (
    <div className="flex min-h-[93vh] overflow-scroll">
      {/* Left chat list section */}
      <aside className="max-w-[385px]  bg-[#F6F6F6] border-r flex flex-col">
        <div className="p-4 border-b font-semibold">All</div>
        <input
          name="searchKey"
          type="text"
          value={params?.searchKey}
          onChange={(e) =>
            setParams((prev) => ({ ...prev, searchKey: e.target.value }))
          }
          placeholder="Search or start a new chat"
          className="m-4 px-3 py-2 rounded-md border text-sm"
        />
        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => (
            <div
              key={chat?.receiver?.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedChatId(chat?.receiver?.id || '');
                setSelectedChat(chat);
              }}
            >
              {chat?.receiver?.profilePicture ? (
                <Image
                  src={chat?.receiver?.profilePicture}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <>
                  <Avatar
                    src={getAvatar({
                      name: chat?.receiver ? getFullName(chat?.receiver) : '',
                      length: 2,
                    })}
                    className="w-[40px] h-[40px] rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                    size="mds"
                  />
                </>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {chat?.receiver?.firstName} {chat?.receiver?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {/* {chat?.receiver?.message} */}
                  Click to view contents
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

      {/* Right chat window section */}
      <main className="flex-1 flex flex-col justify-between bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b gap-3">
          {selectedChat?.receiver?.profilePicture ? (
            <Image
              src={selectedChat?.receiver?.profilePicture}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
          ) : (
            <>
              {selectedChat?.receiver && (
                <Avatar
                  src={getAvatar({
                    name: selectedChat?.receiver
                      ? getFullName(selectedChat?.receiver)
                      : '',
                    length: 2,
                  })}
                  className="w-[40px] h-[40px] rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                  size="mds"
                />
              )}
            </>
          )}
          <h2 className="text-[16px] font-bold">
            {selectedChat?.receiver?.firstName}{' '}
            {selectedChat?.receiver?.lastName}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messageLoading ? (
            <>
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex  gap-12">
                  <div
                    className="flex justify-center items-center"
                    style={{ minHeight: 200 }}
                  >
                    <span className="txxx_loader" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {messageList?.length === 0 ? (
                <p className="text-center text-gray-400 mt-10">
                  No messages yet
                </p>
              ) : (
                messageList?.map((chat) => {
                  const isSender = chat.userId !== userId;
                  return (
                    <div key={chat.id} className="space-y-2">
                      {chat.content && (
                        <div
                          className={`max-w-[60%] p-3 rounded-xl text-sm ${
                            isSender
                              ? 'bg-blue-100 mr-auto self-start text-gray-800'
                              : 'bg-teal-100 ml-auto self-end text-gray-800'
                          }`}
                        >
                          {chat.content}
                        </div>
                      )}
                      {chat.attachments?.map((file) => (
                        <div
                          key={file?.id}
                          className={`flex items-center border border-purple-500 p-4 rounded-xl max-w-[80%] ${
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
                            <FiDownload className="text-purple-600 text-xl" />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Input & File Upload */}
        <div className="border-t px-4 py-3 flex items-center gap-2 bg-white">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-md bg-[#F6F6F6] outline-none text-sm"
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <FiPaperclip
            className="text-xl text-gray-500 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />

          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={isLoading}
          >
            Send
          </button>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="text-sm text-gray-700 px-4 pb-3">
            Attached: {selectedFile.name}
          </div>
        )}
      </main>
    </div>
  );
};

export default BigChatWindow;
