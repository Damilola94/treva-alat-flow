'use client';
import { SendMessageButton } from '@/app/assets/svgs';
import { errorToast, usePostMessagesByChatIdMutation } from '@/services';
import { useAppSelector } from '@/store';
import { dayJs, getErrorMessage } from '@/utils';
import { useRef, useState, ChangeEvent, useEffect } from 'react';
import { FiPaperclip, FiDownload } from 'react-icons/fi';

interface IChat {
  id?: string;
  content?: string | null;
  userId?: string | null;
  sentAt?: string;
  isRead?: boolean;
  createdDate?: string;
  attachments?:
    | {
        id?: string;
        fileName?: string | null;
        filePathUrl?: string | null;
        fileType?: string | null;
        fileSize?: string | null;
        createdDate?: string | null;
      }[]
    | null;
}

interface ChatWindowProps {
  chats: IChat[];
  chatId: string | null | undefined;
  refetch: () => void;
}

const ChatWindow = ({
  chats,
  chatId,
  refetch,
}: ChatWindowProps): JSX.Element => {
  const { userId } = useAppSelector((state) => state?.auth);

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
        chatId,
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
  }, [chats]);

  return (
    <div className="flex flex-col h-[89vh] max-w-md mx-auto bg-white shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {chats.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No messages yet</p>
        ) : (
          <>
            {chats?.map((chat) => {
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

      {/* Input & File Upload */}
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
    </div>
  );
};

export default ChatWindow;
