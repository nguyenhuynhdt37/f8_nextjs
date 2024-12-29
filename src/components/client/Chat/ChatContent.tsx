import React from 'react';
import { IoCall } from 'react-icons/io5';
import { FaVideo } from 'react-icons/fa6';
import HeaderChat from './Content/HeaderChat';
import { Content } from '@next/font/google';
import ContentChat from './Content/ContentChat';
import { Footer } from 'antd/es/layout/layout';
import FooterChat from './Content/FooterChat';
const ChatContent = () => {
  return (
    <div className=" text-[1.4rem] flex flex-col h-full">
      <div className="">
        <HeaderChat />
      </div>
      <div className="flex-1">
        <ContentChat />
      </div>
      <div className="">
        <FooterChat />
      </div>
    </div>
  );
};

export default ChatContent;
