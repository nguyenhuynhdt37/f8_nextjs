import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../ChatContext';
import { BsCheckAll, BsCheck, BsClockHistory, BsEmojiSmile, BsHeartFill } from 'react-icons/bs';
import { IoMdImages, IoIosShareAlt, IoMdMore } from 'react-icons/io';
import { FaRegCopy, FaRegTrashAlt, FaReply } from 'react-icons/fa';

interface ContentChatProps {
  conversation: any;
}

const ContentChat = ({ conversation }: ContentChatProps) => {
  const { messages, loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [reactionHover, setReactionHover] = useState<string | null>(null);
  const [reactionEmojis, setReactionEmojis] = useState<Record<string, string>>({});
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'HH:mm');
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Hôm qua, ${format(messageDate, 'HH:mm')}`;
    }

    const daysDiff = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return format(messageDate, 'EEEE, HH:mm', { locale: vi });
    }

    return format(messageDate, 'dd/MM/yyyy, HH:mm');
  };

  // Nhóm tin nhắn theo ngày
  const groupedMessages: { [key: string]: any[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();

    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }

    groupedMessages[dateKey].push(message);
  });

  // Xử lý tin nhắn (thêm vào danh sách chọn, xóa, reacts)
  const handleSelectMessage = (messageId: string) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(prev => prev.filter(id => id !== messageId));
    } else {
      setSelectedMessages(prev => [...prev, messageId]);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setReactionEmojis(prev => ({
      ...prev,
      [messageId]: emoji
    }));
    setReactionHover(null);
  };

  if (!conversation) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 rounded-full border-blue-200 border-t-blue-500 animate-spin"></div>
          <p className="mt-4 text-gray-500 text-[1.4rem]">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-20rem)] bg-gradient-to-b from-gray-100 to-white">
      {selectedMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 mb-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <span className="text-[1.4rem] font-medium text-gray-800 dark:text-white">
              {selectedMessages.length} tin nhắn được chọn
            </span>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <FaReply className="text-[1.8rem]" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <FaRegCopy className="text-[1.8rem]" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <IoIosShareAlt className="text-[1.8rem]" />
            </button>
            <button className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500">
              <FaRegTrashAlt className="text-[1.8rem]" />
            </button>
          </div>
        </motion.div>
      )}

      {Object.entries(groupedMessages).length > 0 ? (
        Object.entries(groupedMessages).map(([dateKey, msgs]) => (
          <div key={dateKey} className="mb-6">
            <div className="text-center mb-4">
              <span className="inline-block bg-gray-200 dark:bg-gray-700 bg-opacity-70 backdrop-blur-sm rounded-full px-4 py-1 text-[1.2rem] text-gray-600 dark:text-gray-300 font-medium shadow-sm">
                {formatMessageDate(new Date(dateKey))}
              </span>
            </div>

            {msgs.map((message, index) => {
              const isMe = message.senderId === 'me';
              const showAvatar = !isMe && (!msgs[index - 1] || msgs[index - 1].senderId !== message.senderId);
              const showTime = !msgs[index + 1] || msgs[index + 1].senderId !== message.senderId;
              const isSelected = selectedMessages.includes(message.id);
              const hasReaction = reactionEmojis[message.id];

              return (
                <motion.div
                  key={message.id}
                  className={`mb-3 flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {!isMe && showAvatar && (
                    <div className="mr-2 mt-1">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}

                  {!isMe && !showAvatar && <div className="w-10 mr-2"></div>}

                  <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`relative group ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleSelectMessage(message.id);
                      }}
                      onDoubleClick={() => handleSelectMessage(message.id)}
                    >
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-sm ${isMe
                          ? 'bg-gradient-to-r from-pink-500 to-red-400 text-white rounded-br-lg shadow-lg'
                          : 'bg-white text-gray-800 rounded-bl-lg shadow-lg'
                          }`}
                      >
                        <p className="text-[1.5rem] whitespace-pre-line">{message.content}</p>
                      </div>

                      {/* Reaction hiện tại */}
                      {hasReaction && (
                        <div className={`absolute ${isMe ? 'left-0' : 'right-0'} -bottom-3 bg-white rounded-full shadow-lg px-2 py-1`}>
                          <span className="text-[1.4rem]">{hasReaction}</span>
                        </div>
                      )}

                      {/* Menu reactions */}
                      <AnimatePresence>
                        {reactionHover === message.id && (
                          <motion.div
                            className={`absolute ${isMe ? 'right-0' : 'left-0'} -top-12 bg-white rounded-full shadow-xl px-2 py-1 flex space-x-2 z-10`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            {['❤️', '😂', '😮', '😢', '👍', '🔥'].map(emoji => (
                              <button
                                key={emoji}
                                className="w-8 h-8 flex items-center justify-center text-[1.6rem] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transform transition-transform hover:scale-125"
                                onClick={() => handleReaction(message.id, emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Menu actions */}
                      <div className={`absolute ${isMe ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'} top-0 hidden group-hover:flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full shadow-md px-1 py-1`}>
                        <button
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                          onClick={() => setReactionHover(reactionHover === message.id ? null : message.id)}
                        >
                          <BsEmojiSmile className="text-[1.4rem]" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                          <FaReply className="text-[1.4rem]" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                          <IoMdMore className="text-[1.4rem]" />
                        </button>
                      </div>
                    </div>

                    {showTime && (
                      <div className={`flex items-center mt-1 text-[1.1rem] text-gray-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {format(new Date(message.timestamp), 'HH:mm')}
                        {isMe && (
                          <span className="ml-1">
                            {message.status === 'sent' && <BsCheck className="inline text-[1.2rem]" />}
                            {message.status === 'delivered' && <BsCheckAll className="inline text-[1.2rem]" />}
                            {message.status === 'read' && <BsCheckAll className="inline text-[1.2rem] text-blue-500" />}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-32 h-32 rounded-full bg-pink-100 flex items-center justify-center mb-6">
            <IoMdImages className="text-red-400 text-[5rem]" />
          </div>
          <p className="text-[1.8rem] text-gray-700 font-semibold mb-2">Chưa có tin nhắn</p>
          <p className="text-[1.5rem] text-gray-500 text-center max-w-md">
            Bắt đầu cuộc trò chuyện với <span className="font-semibold text-red-500">{conversation.name}</span>
          </p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ContentChat;
