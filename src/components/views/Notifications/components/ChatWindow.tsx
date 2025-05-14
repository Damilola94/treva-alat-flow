'use client';
import { useState } from 'react';
import { FiPaperclip, FiDownload } from 'react-icons/fi';

type Message = {
  id: string;
  text?: string;
  type: string;
  from: string;
  dayGroup?: string;
  fileName?: string;
  fileSize?: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'text',
    text: 'Hello Olema, can I get updates on everything you worked on today?',
    from: 'sender',
    dayGroup: 'Yesterday',
  },
  {
    id: '2',
    type: 'text',
    text: 'Need it asap. Thanks',
    from: 'sender',
  },
  {
    id: '3',
    type: 'text',
    text: 'Alright. Will get it done. Asap',
    from: 'receiver',
  },
  {
    id: '4',
    type: 'text',
    text: 'Need it asap. Thanks',
    from: 'sender',
  },
  {
    id: '5',
    type: 'text',
    text: 'Noted. Just wrapping up my tasks.',
    from: 'receiver',
  },
  {
    id: '6',
    type: 'file',
    fileName: 'Progress_Report.pdf',
    fileSize: '3.2 MB',
    from: 'receiver',
  },
  {
    id: '7',
    type: 'text',
    text: 'Thanks. Got it.',
    from: 'sender',
    dayGroup: 'Today',
  },
  {
    id: '8',
    type: 'text',
    text: 'Also, please check the new designs.',
    from: 'sender',
  },
  {
    id: '9',
    type: 'file',
    fileName: 'UX_Wireframes.fig',
    fileSize: '12.5 MB',
    from: 'sender',
  },
  {
    id: '10',
    type: 'text',
    text: 'Nice. Looks clean.',
    from: 'receiver',
  },
  {
    id: '11',
    type: 'file',
    fileName: 'Product PRD',
    fileSize: '5 MB',
    from: 'receiver',
  },
  {
    id: '12',
    type: 'text',
    text: 'Thank you for sharing.',
    from: 'receiver',
  },
];


const ChatWindow = () => {
  const [messages] = useState(initialMessages);

  return (
    <div className="flex flex-col justify-between max-h-[85vh] max-w-md mx-auto bg-white shadow-sm">
      <div className="overflow-y-auto space-y-4">
        {messages.map((msg, i) => {
          const showDay =
            msg.dayGroup &&
            (i === 0 || messages[i - 1]?.dayGroup !== msg.dayGroup);

          return (
            <div key={msg.id}>
              {showDay && (
                <div className="text-center text-xs text-gray-400 mb-2">
                  {msg.dayGroup}
                </div>
              )}

              {msg.type === 'file' ? (
                <div
                  className={`flex items-center border border-purple-500 p-4 rounded-xl max-w-[80%] ${
                    msg.from === 'sender' ? 'mr-auto' : 'ml-auto'
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
                    <p className="font-semibold">{msg.fileName}</p>
                    <p className="text-sm text-gray-500">
                      PDF • {msg.fileSize}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <FiDownload className="text-purple-600 text-xl" />
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[60%] p-3 rounded-xl text-sm ${
                    msg.from === 'sender'
                      ? 'bg-blue-100 mr-auto self-start text-gray-800'
                      : 'bg-teal-100 ml-auto self-end text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 mt-5">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-4 border-none bg-[#F6F6F6] outline-none text-sm"
        />
        <FiPaperclip className="text-xl text-gray-500 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatWindow;
