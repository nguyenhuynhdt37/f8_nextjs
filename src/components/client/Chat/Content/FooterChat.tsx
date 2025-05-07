import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoMic, IoAttach, IoImage, IoHappy, IoEllipsisVertical } from 'react-icons/io5';
import { BsEmojiSmile, BsCamera, BsFileEarmarkText, BsFiletypeGif, BsStickies, BsThreeDots } from 'react-icons/bs';
import { FiPaperclip } from 'react-icons/fi';
import { MdKeyboardVoice, MdOutlineVideoCall } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { useChat } from '../ChatContext';

interface FooterChatProps {
  conversation: any;
}

const FooterChat = ({ conversation }: FooterChatProps) => {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
        setRecordingTime(0);
      }
    }

    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [isRecording]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachMenu(false);
  };

  const toggleAttachMenu = () => {
    setShowAttachMenu(!showAttachMenu);
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!conversation) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 p-4 relative">
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            ref={emojiPickerRef}
            className="absolute bottom-20 left-4 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attach Menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div
            ref={attachMenuRef}
            className="absolute bottom-20 left-14 z-20 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-4 gap-6">
              {[
                { icon: <IoImage className="text-green-500 text-[2.4rem]" />, label: 'Hình ảnh' },
                { icon: <BsFileEarmarkText className="text-blue-500 text-[2.4rem]" />, label: 'Tài liệu' },
                { icon: <BsCamera className="text-purple-500 text-[2.4rem]" />, label: 'Camera' },
                { icon: <BsFiletypeGif className="text-pink-500 text-[2.4rem]" />, label: 'GIFs' },
                { icon: <BsStickies className="text-yellow-500 text-[2.4rem]" />, label: 'Sticker' },
                { icon: <MdOutlineVideoCall className="text-red-500 text-[2.4rem]" />, label: 'Video' },
                { icon: <IoMdSettings className="text-gray-500 text-[2.4rem]" />, label: 'Cài đặt' },
                { icon: <BsThreeDots className="text-gray-500 text-[2.4rem]" />, label: 'Khác' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-xl transition-all">
                  <div className="mb-2">{item.icon}</div>
                  <span className="text-[1.2rem] text-gray-600 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isRecording ? (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-full p-3 shadow-inner">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-3"></div>
            <span className="text-[1.4rem] text-red-600 dark:text-red-400 font-medium">
              Đang ghi âm... {formatRecordingTime()}
            </span>
          </div>
          <div className="flex">
            <button
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 text-red-500"
              onClick={toggleRecording}
            >
              <IoSend className="text-[2rem]" />
            </button>
            <button
              className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              onClick={toggleRecording}
            >
              <IoEllipsisVertical className="text-[2rem]" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-end space-x-2">
          <div className="flex-none">
            <button
              onClick={toggleEmojiPicker}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <BsEmojiSmile className="text-[1.8rem]" />
            </button>
          </div>

          <div className="flex-none">
            <button
              onClick={toggleAttachMenu}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <FiPaperclip className="text-[1.8rem]" />
            </button>
          </div>

          <div className="relative flex-grow">
            <textarea
              ref={textareaRef}
              placeholder="Nhắn tin..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[1.5rem] text-gray-700 dark:text-gray-300 transition-all min-h-[48px] max-h-[120px]"
              style={{ paddingRight: '50px' }}
            />
          </div>

          <div className="flex-none">
            {message.trim() ? (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleSendMessage}
                className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-all"
              >
                <IoSend className="text-[1.8rem]" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={toggleRecording}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                <MdKeyboardVoice className="text-[1.8rem]" />
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterChat;
