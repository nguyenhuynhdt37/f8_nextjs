'use client';
import React from 'react';
import { ChatProvider } from '@/components/client/Chat/ChatContext';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
}
