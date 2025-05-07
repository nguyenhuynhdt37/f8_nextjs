import React, { useState } from 'react';
import { IoCall, IoVideocam, IoSearch, IoInformationCircle, IoNotifications, IoEllipsisVertical, IoArrowBack } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface HeaderChatProps {
  conversation: any;
}

const HeaderChat = ({ conversation }: HeaderChatProps) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!conversation) return null;

  const goBack = () => {
    router.push('/chat');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchQuery('');
    }
  };

  return (
    <div className="relative backdrop-blur-md bg-gradient-to-r from-purple-500 to-indigo-600 py-5 px-6 flex items-center justify-between z-10 shadow-lg">
      <div className="flex items-center">
        <button
          onClick={goBack}
          className="p-3 mr-4 md:hidden rounded-full hover:bg-gray-100 text-gray-600 transition"
        >
          <IoArrowBack className="text-[2rem]" />
        </button>

        <div className="flex items-center">
          <div className="relative">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            {conversation.isOnline && !conversation.isGroup && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>

          <div className="ml-3">
            <h2 className="text-[1.8rem] font-bold text-white flex items-center space-x-2">
              {conversation.name}
              {conversation.isVerified && (
                <svg className="w-5 h-5 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              )}
            </h2>
            <p className="text-[1.2rem] text-white/75">
              {conversation.isOnline && !conversation.isGroup
                ? 'Đang hoạt động'
                : conversation.isGroup
                  ? `${conversation.members} thành viên`
                  : 'Hoạt động 2 giờ trước'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
          <IoCall className="text-[1.8rem]" />
        </button>
        <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
          <IoVideocam className="text-[1.8rem]" />
        </button>
        <button
          onClick={toggleSearch}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
        >
          <IoSearch className="text-[1.8rem]" />
        </button>
        <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
          <IoNotifications className="text-[1.8rem]" />
        </button>
        <button
          onClick={toggleMenu}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
        >
          <IoEllipsisVertical className="text-[1.8rem]" />
        </button>
      </div>

      {/* Quick menu */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-24 right-6 bg-white rounded-lg shadow-xl w-64 z-50 overflow-hidden"
        >
          <div className="py-2">
            {[
              { label: 'Thông tin cuộc trò chuyện', icon: <IoInformationCircle className="text-blue-500" /> },
              { label: 'Tắt thông báo', icon: <IoNotifications className="text-purple-500" /> },
              { label: 'Tạo cuộc trò chuyện nhóm', icon: <IoVideocam className="text-green-500" /> },
              { label: 'Xóa cuộc trò chuyện', icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> },
              { label: 'Chặn', icon: <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg> },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={toggleMenu}
              >
                <span className="mr-3 text-[1.6rem]">{item.icon}</span>
                <span className="text-[1.4rem] text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HeaderChat;
