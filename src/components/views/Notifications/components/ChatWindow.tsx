'use client';
import { errorToast, usePostMessagesByChatIdMutation } from '@/services';
import { useAppSelector } from '@/store';
import { getErrorMessage } from '@/utils';
import { useRef, useState, ChangeEvent } from 'react';
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
        chatId,
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

  return (
    <div className="flex flex-col h-[85vh] max-w-md mx-auto bg-white shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {chats.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No messages yet</p>
        ) : (
          chats.map((chat) => {
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
    </div>
  );
};

export default ChatWindow;
