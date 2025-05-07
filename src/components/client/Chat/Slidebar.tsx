import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoSearchOutline, IoAddCircle, IoFilterSharp, IoArchive } from "react-icons/io5";
import { BsChatSquareDotsFill, BsFillPersonFill, BsStars } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import { motion } from "framer-motion";
import NewChatModal from './NewChatModal';
import { useChat } from './ChatContext';

const Slidebar = () => {
  const { conversations, searchConversations, createConversation, markAsRead, loading } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();
  const { id: conversationId } = useParams();

  const filteredConversations = searchConversations(searchTerm).filter(conv => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'direct') return !conv.isGroup;
    if (activeFilter === 'groups') return conv.isGroup;
    if (activeFilter === 'unread') return conv.unread > 0;
    return true;
  });

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId as string);
    }
  }, [conversationId, markAsRead]);

  const handleSelectConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleCreateNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleCloseModal = () => {
    setShowNewChatModal(false);
  };

  const handleCreateChat = async (userIds: string[]) => {
    if (userIds.length === 0) return;
    const newConversationId = await createConversation(userIds);
    router.push(`/chat/${newConversationId}`);
  };

  return (
    <div className="h-full pt-[5rem] border-r bg-white">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[1.8rem] font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Tin nhắn
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNewChat}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-blue-200 transition-all"
          >
            <IoAddCircle className="text-[2rem]" />
          </motion.button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện"
            className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-[1.4rem] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[1.8rem]" />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center px-4 py-2 rounded-full text-[1.3rem] font-medium whitespace-nowrap transition-all ${activeFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <BsChatSquareDotsFill className="mr-2" />
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter('direct')}
            className={`flex items-center px-4 py-2 rounded-full text-[1.3rem] font-medium whitespace-nowrap transition-all ${activeFilter === 'direct'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <BsFillPersonFill className="mr-2" />
            Cá nhân
          </button>
          <button
            onClick={() => setActiveFilter('groups')}
            className={`flex items-center px-4 py-2 rounded-full text-[1.3rem] font-medium whitespace-nowrap transition-all ${activeFilter === 'groups'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <HiUserGroup className="mr-2" />
            Nhóm
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`flex items-center px-4 py-2 rounded-full text-[1.3rem] font-medium whitespace-nowrap transition-all ${activeFilter === 'unread'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <BsStars className="mr-2" />
            Chưa đọc
          </button>
          <button
            onClick={() => setActiveFilter('archived')}
            className={`flex items-center px-4 py-2 rounded-full text-[1.3rem] font-medium whitespace-nowrap transition-all ${activeFilter === 'archived'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <IoArchive className="mr-2" />
            Đã lưu trữ
          </button>
        </div>
      </div>

      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent h-[calc(100vh-20rem)]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conversation: any) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0.8, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 0.99 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center p-4 cursor-pointer transition-all hover:bg-gray-50 ${conversationId === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              onClick={() => handleSelectConversation(conversation.id)}
            >
              <div className="relative mr-4">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />
                {conversation.isOnline && !conversation.isGroup && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
                {conversation.isGroup && (
                  <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-[1rem] font-medium border-2 border-white">
                    {conversation.members}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-[1.5rem] font-semibold truncate">{conversation.name}</h3>
                  <span className="text-[1.2rem] text-gray-500">{conversation.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[1.3rem] text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <span className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full min-w-6 h-6 px-2 text-[1.1rem] animate-pulse">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center p-10">
            <div className="mb-4 text-gray-400">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <p className="text-[1.6rem] text-gray-500 font-medium mb-2">
              {searchTerm ? 'Không tìm thấy kết quả nào' : 'Chưa có cuộc trò chuyện nào'}
            </p>
            <p className="text-[1.4rem] text-gray-400">
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu trò chuyện mới với bạn bè'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNewChat}
                className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[1.4rem] font-medium transition-all shadow-md hover:shadow-blue-200"
              >
                Tạo cuộc trò chuyện mới
              </button>
            )}
          </div>
        )}
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={handleCloseModal}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
};

export default Slidebar;
