'use client';
import React from 'react';
import Header from './Header';
import Slidebar from './Slidebar';
import ChatContent from './ChatContent';

const Chat = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-4 w-full h-[100vh]">
        <Slidebar />
        <div className="col-span-3 pt-[5rem]">
          <ChatContent />
        </div>
      </div>
    </>
  );
};

export default Chat;
