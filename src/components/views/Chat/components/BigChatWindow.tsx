// 'use client';
// import { SendMessageButton } from '@/app/assets/svgs';
// import { Avatar } from '@/components/shared/avatar';
// import { useChat, useMessages } from '@/hooks/Chat';
// import { getAvatar, getFullName } from '@/lib/utils';
// import { errorToast, usePostMessagesByChatIdMutation } from '@/services';
// import { useAppSelector } from '@/store';
// import { dayJs, getDateLabel, getErrorMessage } from '@/utils';
// import Image from 'next/image';
// import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
// import { FiPaperclip, FiDownload, FiArrowLeft, FiSearch } from 'react-icons/fi';
// import { MiniLoader } from '@/components/shared';

// /**
//  * Force-downloads a file from a URL without opening a new tab.
//  * Works for both same-origin and cross-origin (S3/CDN) URLs by
//  * proxying through a blob URL so the browser treats it as a download.
//  */
// const forceDownload = async (url: string, filename: string) => {
//   try {
//     const response = await fetch(url, { mode: 'cors' });
//     if (!response.ok) throw new Error('Network response was not ok');
//     const blob = await response.blob();
//     const blobUrl = URL.createObjectURL(blob);
//     const anchor = document.createElement('a');
//     anchor.href = blobUrl;
//     anchor.download = filename;
//     anchor.style.display = 'none';
//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//     // Revoke after a short delay to ensure the download starts
//     setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
//   } catch {
//     // Fallback: set Content-Disposition hint via anchor — still avoids _blank
//     const anchor = document.createElement('a');
//     anchor.href = url;
//     anchor.download = filename;
//     anchor.rel = 'noopener noreferrer';
//     anchor.style.display = 'none';
//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//   }
// };

// export type UserPreview = {
//   id: string | null;
//   firstName: string | null;
//   lastName: string | null;
//   profilePicture?: string | null;
//   actorId?: string;
// };

// export type Chat = {
//   id?: string;
//   sender?: UserPreview;
//   receiver?: UserPreview;
//   lastMessageTime?: string | null | undefined;
// };

// // Tick icon for sent messages (double tick / read receipt style)
// const SentIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 16 16"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     className="inline-block ml-1 text-[#34B7F1]"
//   >
//     <path
//       d="M2.5 8L6 11.5L13.5 4"
//       stroke="currentColor"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M5.5 8L9 11.5"
//       stroke="currentColor"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       opacity="0.5"
//     />
//   </svg>
// );

// const isImageFile = (url?: string | null, fileType?: string | null) => {
//   if (!url && !fileType) return false;
//   const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
//   const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
//   if (url) {
//     const lower = url.toLowerCase().split('?')[0]; // strip query params
//     if (imageExtensions.some((ext) => lower.endsWith(ext))) return true;
//   }
//   if (fileType && imageTypes.includes(fileType.toLowerCase())) return true;
//   return false;
// };

// const BigChatWindow = () => {
//   const { userId } = useAppSelector((state) => state?.auth);
//   const [params, setParams] = useState({ searchKey: '' });
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [showChatView, setShowChatView] = useState(false);

//   const { chatData, refetch: refetchchatList } = useChat(params);
//   const {
//     chatByIdData,
//     refetch,
//     loading: messageLoading,
//   } = useMessages({ chatId: selectedChat?.id || '' });

//   const chatList = useMemo(() => chatData?.data || [], [chatData?.data]);
//   const messageList = useMemo(() => {
//     const unsorted = chatByIdData?.data || [];
//     return [...unsorted].sort((a, b) => {
//       const aTime = a?.sentAt ? new Date(a.sentAt).getTime() : 0;
//       const bTime = b?.sentAt ? new Date(b.sentAt).getTime() : 0;
//       return aTime - bTime;
//     });
//   }, [chatByIdData?.data]);

//   const groupedMessages = useMemo(() => {
//     const groups: { [key: string]: typeof messageList } = {};
//     messageList.forEach((message) => {
//       const dateKey = message.sentAt
//         ? dayJs(message.sentAt).format('YYYY-MM-DD')
//         : 'no-date';
//       if (!groups[dateKey]) groups[dateKey] = [];
//       groups[dateKey].push(message);
//     });
//     return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
//   }, [messageList]);

//   const [message, setMessage] = useState('');
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   const [triggerPost, { isLoading }] = usePostMessagesByChatIdMutation();

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setSelectedFiles((prev) => [...prev, ...files]);
//   };

//   const handleSendMessage = async () => {
//     const hasContent = message.trim().length > 0 || selectedFiles.length > 0;
//     if (!hasContent) return;
//     try {
//       const payload = {
//         chatId: selectedChat?.id,
//         content: message,
//         attachments: selectedFiles,
//       };
//       const response = await triggerPost(payload).unwrap();
//       if (response?.isSuccess) {
//         setMessage('');
//         setSelectedFiles([]);
//         refetch && refetch();
//       } else {
//         errorToast(response?.message || getErrorMessage(response));
//       }
//     } catch (error) {
//       errorToast(getErrorMessage(error));
//     }
//   };

//   const handleChatSelect = (chat: Chat) => {
//     setSelectedChat(chat);
//     setShowChatView(true);
//   };

//   const handleBackToList = () => {
//     setShowChatView(false);
//     setSelectedChat(null);
//   };

//   useEffect(() => {
//     const el = scrollContainerRef.current;
//     if (el) {
//       requestAnimationFrame(() => {
//         el.scrollTop = el.scrollHeight;
//       });
//     }
//   }, [messageList]);

//   useEffect(() => {
//     refetchchatList && refetchchatList();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [chatByIdData]);

//   return (
//     <div className="flex h-[calc(100dvh-110px)] overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
//       {/* ── Sidebar ── */}
//       <aside
//         className={`
//           flex-shrink-0 flex flex-col bg-[#F8F9FA] border-r border-gray-200
//           w-full md:w-[260px] lg:w-[300px] xl:w-[320px]
//           ${showChatView ? 'hidden md:flex' : 'flex'}
//         `}
//       >
//         {/* Sidebar header */}
//         <div className="px-4 pt-5 pb-3">
//           <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
//           {/* Search */}
//           <div className="relative">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               name="searchKey"
//               type="text"
//               value={params.searchKey}
//               onChange={(e) =>
//                 setParams((prev) => ({ ...prev, searchKey: e.target.value }))
//               }
//               placeholder="Search conversations…"
//               className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
//             />
//           </div>
//         </div>

//         {/* Chat list */}
//         <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
//           {chatList.length === 0 && (
//             <p className="text-center text-sm text-gray-400 py-10">No conversations yet</p>
//           )}
//           {chatList.map((chat) => (
//             <button
//               key={chat?.sender?.id}
//               className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-100 transition text-left
//                 ${selectedChat?.id === chat?.id ? 'bg-blue-50' : chat?.hasUnreadMessages ? 'bg-[#EDF4FB]' : ''}
//               `}
//               onClick={() => handleChatSelect(chat)}
//             >
//               {/* Avatar */}
//               <div className="relative flex-shrink-0">
//                 {chat?.sender?.profilePicture ? (
//                   <Image
//                     src={chat.sender.profilePicture}
//                     alt="avatar"
//                     className="w-11 h-11 rounded-full object-cover"
//                     width={44}
//                     height={44}
//                   />
//                 ) : (
//                   <Avatar
//                     src={getAvatar({ name: chat?.sender ? getFullName(chat.sender) : '', length: 2 })}
//                     className="w-11 h-11 rounded-full border-2 border-[#A5A6F6] object-cover"
//                     size="mds"
//                   />
//                 )}
//                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
//               </div>

//               {/* Info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <p className="font-semibold text-sm text-gray-900 truncate">
//                     {chat?.sender?.firstName} {chat?.sender?.lastName}
//                   </p>
//                   <p className="text-[11px] text-gray-400 flex-shrink-0 ml-1">
//                     {chat?.lastMessageTime
//                       ? dayJs.utc(chat.lastMessageTime).local().format('h:mm A')
//                       : ''}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-between mt-0.5">
//                   <p className="text-xs text-gray-500 truncate max-w-[160px]">
//                     {chat?.lastMessagePreview || 'No messages yet'}
//                   </p>
//                   {chat?.hasUnreadMessages && (chat?.unreadMessagesCount as number) > 0 && (
//                     <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {chat.unreadMessagesCount}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </aside>

//       {/* ── Main chat area ── */}
//       <main
//         className={`
//           flex-1 flex flex-col h-full bg-white min-w-0
//           ${!showChatView ? 'hidden md:flex' : 'flex'}
//         `}
//       >
//         {selectedChat ? (
//           <>
//             {/* Chat header */}
//             <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
//               <button
//                 onClick={handleBackToList}
//                 className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
//               >
//                 <FiArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>

//               <div className="relative flex-shrink-0">
//                 {selectedChat?.sender?.profilePicture ? (
//                   <Image
//                     src={selectedChat.sender.profilePicture}
//                     alt="avatar"
//                     className="w-10 h-10 rounded-full object-cover"
//                     width={40}
//                     height={40}
//                   />
//                 ) : (
//                   selectedChat?.sender && (
//                     <Avatar
//                       src={getAvatar({ name: getFullName(selectedChat.sender), length: 2 })}
//                       className="w-10 h-10 rounded-full border-2 border-[#A5A6F6] object-cover"
//                       size="mds"
//                     />
//                   )
//                 )}
//                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <h2 className="text-[15px] font-bold text-gray-900 truncate">
//                   {selectedChat?.sender?.firstName} {selectedChat?.sender?.lastName}
//                 </h2>
//                 <p className="text-xs text-green-500 font-medium">Online</p>
//               </div>
//             </div>

//             {/* Messages scroll area */}
//             <div
//               ref={scrollContainerRef}
//               className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-[#F0F2F5]"
//               style={{ scrollBehavior: 'auto' }}
//             >
//               {messageLoading ? (
//                 <MiniLoader message="Loading" />
//               ) : messageList.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center">
//                   <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
//                     <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                         d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                       />
//                     </svg>
//                   </div>
//                   <p className="text-gray-500 font-medium">No messages yet</p>
//                   <p className="text-sm text-gray-400 mt-1">Say hello to start the conversation!</p>
//                 </div>
//               ) : (
//                 <>
//                   {groupedMessages.map(([dateKey, messages]) => (
//                     <div key={dateKey}>
//                       {/* Date separator */}
//                       <div className="flex items-center justify-center my-4">
//                         <div className="bg-white shadow-sm px-3 py-1 rounded-full">
//                           <span className="text-[11px] text-gray-500 font-medium">
//                             {getDateLabel(messages[0].sentAt)}
//                           </span>
//                         </div>
//                       </div>

//                       {messages.map((chat) => {
//                         const isSender = chat.userId !== userId;
//                         const sentTime = dayJs.utc(chat.sentAt).local().format('h:mm A');

//                         return (
//                           <div
//                             key={chat.id}
//                             className={`flex flex-col gap-1 mb-3 ${isSender ? 'items-start' : 'items-end'}`}
//                           >
//                             {/* Text bubble */}
//                             {chat.content && (
//                               <div
//                                 className={`
//                                   relative max-w-[75%] sm:max-w-[65%] md:max-w-[55%] lg:max-w-[50%]
//                                   px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
//                                   ${isSender
//                                     ? 'bg-white text-gray-800 rounded-tl-sm'
//                                     : 'bg-[#BDF7F6] text-gray-800 rounded-tr-sm'
//                                   }
//                                 `}
//                               >
//                                 <p className="pr-12 break-words">{chat.content}</p>
//                                 <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 flex items-center gap-0.5 whitespace-nowrap">
//                                   {sentTime}
//                                   {!isSender && <SentIcon />}
//                                 </span>
//                               </div>
//                             )}

//                             {/* Attachments */}
//                             {chat.attachments?.map((file) => (
//                               <div
//                                 key={file?.id}
//                                 className={`max-w-[75%] sm:max-w-[65%] md:max-w-[55%] ${isSender ? 'mr-auto' : 'ml-auto'}`}
//                               >
//                                 {isImageFile(file?.filePathUrl, file?.fileType) ? (
//                                   /* Image attachment */
//                                   <div className="relative group rounded-xl overflow-hidden shadow-sm">
//                                     <Image
//                                       src={file?.filePathUrl!}
//                                       alt={file?.fileName || 'image'}
//                                       width={250}
//                                       height={200}
//                                       className="rounded-xl object-cover max-w-[250px] max-h-[200px] w-auto h-auto"
//                                     />
//                                     <button
//                                       type="button"
//                                       onClick={() => file?.filePathUrl && forceDownload(file.filePathUrl, file.fileName || 'image')}
//                                       className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition"
//                                       title="Download"
//                                     >
//                                       <FiDownload className="w-3.5 h-3.5 text-gray-700" />
//                                     </button>
//                                     {/* Time on image */}
//                                     <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
//                                       {sentTime}
//                                       {!isSender && (
//                                         <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
//                                           <path d="M2.5 8L6 11.5L13.5 4" stroke="#34B7F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//                                         </svg>
//                                       )}
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   /* File attachment */
//                                   <div
//                                     className={`flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-3 py-2.5 shadow-sm
//                                       ${isSender ? '' : ''}
//                                     `}
//                                   >
//                                     <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
//                                       <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
//                                         <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                                         <path d="M14 2v6h6" fill="white" opacity="0.5" />
//                                       </svg>
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
//                                         {file?.fileName}
//                                       </p>
//                                       <p className="text-xs text-gray-400">
//                                         {file?.fileType} {file?.fileSize ? `• ${file.fileSize}` : ''}
//                                       </p>
//                                     </div>
//                                     <button
//                                       type="button"
//                                       onClick={() => file?.filePathUrl && forceDownload(file.filePathUrl, file.fileName || 'file')}
//                                       className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-full transition flex-shrink-0"
//                                       title="Download"
//                                     >
//                                       <FiDownload className="w-4 h-4" />
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ))}
//                   <div ref={bottomRef} />
//                 </>
//               )}
//             </div>

//             {/* ── Input area ── */}
//             <div className="flex-shrink-0 border-t border-gray-200 bg-white">
//               {/* File previews */}
//               {selectedFiles.length > 0 && (
//                 <div className="flex flex-wrap gap-2 px-4 pt-3">
//                   {selectedFiles.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-sm text-gray-700"
//                     >
//                       <span className="truncate max-w-[120px] text-xs">{file.name}</span>
//                       <button
//                         onClick={() =>
//                           setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
//                         }
//                         className="ml-2 text-red-400 hover:text-red-600 text-sm font-bold"
//                         title="Remove"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="flex items-center gap-2 px-4 py-3">
//                 {/* Paperclip */}
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition flex-shrink-0"
//                   title="Attach file"
//                 >
//                   <FiPaperclip className="w-5 h-5" />
//                 </button>

//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="hidden"
//                   onChange={handleFileChange}
//                   multiple
//                 />

//                 {/* Text input */}
//                 <input
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                   placeholder="Type a message…"
//                   className="flex-1 min-w-0 bg-[#F0F2F5] rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition"
//                 />

//                 {/* Send button */}
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={isLoading || (message.trim().length === 0 && selectedFiles.length === 0)}
//                   className="flex-shrink-0 disabled:opacity-40 transition"
//                   title="Send"
//                 >
//                   <SendMessageButton />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           /* Empty state */
//           <div className="hidden md:flex flex-1 items-center justify-center bg-[#F0F2F5]">
//             <div className="text-center">
//               <div className="w-28 h-28 bg-white rounded-full shadow-md flex items-center justify-center mb-5 mx-auto">
//                 <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                     d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-1">Select a conversation</h3>
//               <p className="text-sm text-gray-400">Choose from the sidebar to start messaging</p>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default BigChatWindow;

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
import { FiPaperclip, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { CheckIcon, DownloadIcon, MiniLoader, SendIcon } from '@/components/shared';

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
  ];
  if (url) {
    const lower = url.toLowerCase().split('?')[0]; // strip query params
    if (imageExtensions.some((ext) => lower.endsWith(ext))) return true;
  }
  if (fileType && imageTypes.includes(fileType.toLowerCase())) return true;
  return false;
};

const BigChatWindow = () => {
  const { userId } = useAppSelector((state) => state?.auth);
  const [params, setParams] = useState({ searchKey: '' });
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
      const dateKey = message.sentAt
        ? dayJs(message.sentAt).format('YYYY-MM-DD')
        : 'no-date';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(message);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [messageList]);

  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [triggerPost, { isLoading }] = usePostMessagesByChatIdMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleSendMessage = async () => {
    const hasContent = message.trim().length > 0 || selectedFiles.length > 0;
    if (!hasContent) return;
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
    <div className="flex h-[calc(100dvh-110px)] overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      {/* ── Sidebar ── */}
      <aside
        className={`
          flex-shrink-0 flex flex-col bg-[#F8F9FA] border-r border-gray-200
          w-full md:w-[260px] lg:w-[300px] xl:w-[320px]
          ${showChatView ? 'hidden md:flex' : 'flex'}
        `}
      >
        {/* Sidebar header */}
        <div className="px-4 pt-5 pb-3">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              name="searchKey"
              type="text"
              value={params.searchKey}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, searchKey: e.target.value }))
              }
              placeholder="Search conversations…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {chatList.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">
              No conversations yet
            </p>
          )}
          {chatList.map((chat) => (
            <button
              key={chat?.sender?.id}
              className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-100 transition text-left
                ${selectedChat?.id === chat?.id ? 'bg-blue-50' : chat?.hasUnreadMessages ? 'bg-[#EDF4FB]' : ''}
              `}
              onClick={() => handleChatSelect(chat)}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {chat?.sender?.profilePicture ? (
                  <Image
                    src={chat.sender.profilePicture}
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover"
                    width={44}
                    height={44}
                  />
                ) : (
                  <Avatar
                    src={getAvatar({
                      name: chat?.sender ? getFullName(chat.sender) : '',
                      length: 2,
                    })}
                    className="w-11 h-11 rounded-full border-2 border-[#A5A6F6] object-cover"
                    size="mds"
                  />
                )}
                <span className="absolute bottom-0 -right-1">
                  <CheckIcon />
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {chat?.sender?.firstName} {chat?.sender?.lastName}
                  </p>
                  <p className="text-[11px] text-gray-400 flex-shrink-0 ml-1">
                    {chat?.lastMessageTime
                      ? dayJs.utc(chat.lastMessageTime).local().format('h:mm A')
                      : ''}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-gray-500 truncate max-w-[160px]">
                    {chat?.lastMessagePreview || 'No messages yet'}
                  </p>
                  {chat?.hasUnreadMessages &&
                    (chat?.unreadMessagesCount as number) > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadMessagesCount}
                      </span>
                    )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <main
        className={`
          flex-1 flex flex-col h-full bg-white min-w-0
          ${!showChatView ? 'hidden md:flex' : 'flex'}
        `}
      >
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
              <button
                onClick={handleBackToList}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative flex-shrink-0">
                {selectedChat?.sender?.profilePicture ? (
                  <Image
                    src={selectedChat.sender.profilePicture}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
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
                      className="w-10 h-10 rounded-full border-2 border-[#A5A6F6] object-cover"
                      size="mds"
                    />
                  )
                )}
                <span className="absolute bottom-0 -right-1">
                  <CheckIcon />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-bold text-gray-900 truncate">
                  {selectedChat?.sender?.firstName}{' '}
                  {selectedChat?.sender?.lastName}
                </h2>
                {/* <p className="text-xs text-green-500 font-medium">Online</p> */}
              </div>
            </div>

            {/* Messages scroll area */}
            <div
              ref={scrollContainerRef}
              className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-[#F0F2F5]"
              style={{ scrollBehavior: 'auto' }}
            >
              {messageLoading ? (
                <MiniLoader message="Loading" />
              ) : messageList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-gray-300"
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
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Say hello to start the conversation!
                  </p>
                </div>
              ) : (
                <>
                  {groupedMessages.map(([dateKey, messages]) => (
                    <div key={dateKey}>
                      {/* Date separator */}
                      <div className="flex items-center justify-center my-4">
                        <div className="px-3 py-1 rounded-full">
                          <span className="text-[11px] text-gray-500 font-medium">
                            {getDateLabel(messages[0].sentAt)}
                          </span>
                        </div>
                      </div>

                      {messages.map((chat) => {
                        const isSender = chat.userId !== userId;
                        const sentTime = dayJs
                          .utc(chat.sentAt)
                          .local()
                          .format('h:mm A');

                        return (
                          <div
                            key={chat.id}
                            className={`flex flex-col gap-1 mb-3 ${isSender ? 'items-start' : 'items-end'}`}
                          >
                            {/* Text bubble */}
                            {chat.content && (
                              <div
                                className={`
                                  relative max-w-[75%] sm:max-w-[65%] md:max-w-[55%] lg:max-w-[50%]
                                  px-4 py-6 rounded-2xl text-sm leading-relaxed shadow-sm
                                  ${
                                    isSender
                                      ? 'bg-[#C4E0FF] text-gray-800 rounded-tl-sm'
                                      : 'bg-[#BDF7F6] text-gray-800 rounded-tr-sm'
                                  }
                                `}
                              >
                                <p className="pr-12 break-words text-justify">
                                  {chat.content}
                                </p>
                                <span className="absolute bottom-1 right-3 text-[10px] text-[#3D3D3D] flex items-center gap-2 whitespace-nowrap">
                                  {sentTime}
                                  {!isSender && <SendIcon />}
                                </span>
                              </div>
                            )}

                            {/* Attachments */}
                            {chat.attachments?.map((file) => (
                              <div
                                key={file?.id}
                                className={`max-w-[75%] sm:max-w-[65%] md:max-w-[55%] ${isSender ? 'mr-auto' : 'ml-auto'}`}
                              >
                                {isImageFile(
                                  file?.filePathUrl,
                                  file?.fileType,
                                ) ? (
                                  /* Image attachment */
                                  <div className="relative group rounded-xl overflow-hidden shadow-sm">
                                    <Image
                                      src={file.filePathUrl!}
                                      alt={file?.fileName || 'image'}
                                      width={250}
                                      height={200}
                                      className="rounded-xl object-cover max-w-[250px] max-h-[200px] w-auto h-auto"
                                    />
                                    <a
                                      href={file?.filePathUrl ?? '#'}
                                      download={file?.fileName}
                                      onClick={(e) => {
                                        // Force download instead of opening in new tab
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
                                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition"
                                      title="Download"
                                    >
                                      <DownloadIcon />
                                    </a>
                                    {/* Time on image */}
                                    <div className="absolute bottom-2 right-2 bg-black/40 text-[#3D3D3D] text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                      {sentTime}
                                      {!isSender && (
                                       <SendIcon />
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  /* File attachment */
                                  <div
                                    className={`flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-3 py-2.5 shadow-sm
                                      ${isSender ? '' : ''}
                                    `}
                                  >
                                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                                      <svg
                                        className="w-5 h-5 text-purple-600"
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
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
                                        {file?.fileName}
                                      </p>
                                      {/* <p className="text-xs text-gray-400">
                                        {file?.fileType}{' '}
                                        {file?.fileSize
                                          ? `• ${file.fileSize}`
                                          : ''}
                                      </p> */}
                                    </div>
                                    <a
                                      href={file?.filePathUrl ?? '#'}
                                      download={file?.fileName}
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
                                      className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-full transition flex-shrink-0"
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
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* ── Input area ── */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white">
              {/* File previews */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pt-3">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-sm text-gray-700"
                    >
                      <span className="truncate max-w-[120px] text-xs">
                        {file.name}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="ml-2 text-red-400 hover:text-red-600 text-sm font-bold"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 px-4 py-3">
                {/* Paperclip */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition flex-shrink-0"
                  title="Attach file"
                >
                  <FiPaperclip className="w-5 h-5" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />

                {/* Text input */}
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message…"
                  className="flex-1 min-w-0 bg-[#F0F2F5] rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition"
                />

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={
                    isLoading ||
                    (message.trim().length === 0 && selectedFiles.length === 0)
                  }
                  className="flex-shrink-0 disabled:opacity-40 transition"
                  title="Send"
                >
                  <SendMessageButton />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="hidden md:flex flex-1 items-center justify-center bg-[#F0F2F5]">
            <div className="text-center">
              <div className="w-28 h-28 bg-white rounded-full shadow-md flex items-center justify-center mb-5 mx-auto">
                <svg
                  className="w-14 h-14 text-gray-300"
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
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
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
  );
};

export default BigChatWindow;
