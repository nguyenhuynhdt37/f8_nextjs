import React from 'react';

interface LineChatProps {
  content: string;
  isMe: boolean;
}

const LineChat = ({ content, isMe }: LineChatProps) => {
  return (
    <div
      className={`p-3 rounded-xl shadow-sm mb-1 break-words ${isMe
          ? 'bg-blue-500 text-white rounded-tr-none'
          : 'bg-white text-gray-800 rounded-tl-none'
        }`}
    >
      {content}
    </div>
  );
};

export default LineChat;
