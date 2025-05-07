import React, { useEffect } from 'react';
import HeaderChat from './Content/HeaderChat';
import ContentChat from './Content/ContentChat';
import FooterChat from './Content/FooterChat';
import { useParams } from 'next/navigation';
import { useChat } from './ChatContext';

const ChatContent = () => {
  const { currentConversation, conversations, loading } = useChat();
  const { id: conversationId } = useParams();

  // Tìm cuộc trò chuyện hiện tại từ ID trong URL
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      // Logic tải cuộc trò chuyện hiện tại được xử lý trong ChatContext
    }
  }, [conversationId, conversations]);

  if (!currentConversation && !loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-[1.8rem] mb-4">Chọn một cuộc trò chuyện để bắt đầu</p>
          <img
            src="/images/logo.png"
            alt="Chat logo"
            className="w-32 h-32 mx-auto opacity-50"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-[1.4rem] flex flex-col h-full bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <img src="/images/Loading.gif" alt="Loading" className="w-16 h-16" />
        </div>
      ) : (
        <>
          <div className="sticky top-0 z-10 shadow-sm">
            <HeaderChat conversation={currentConversation} />
          </div>
          <div className="flex-1 overflow-hidden">
            <ContentChat conversation={currentConversation} />
          </div>
          <div className="sticky bottom-0 z-10 bg-white border-t">
            <FooterChat conversation={currentConversation} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContent;
