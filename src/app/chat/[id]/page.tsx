import Chat from '@/components/client/Chat';
import React from 'react';

// Trang chat cho một cuộc trò chuyện cụ thể dựa trên conversationId
const ChatDetailPage = ({ params }: { params: { id: string } }) => {
    // params.id là conversationId
    return <Chat />;
};

export default ChatDetailPage;