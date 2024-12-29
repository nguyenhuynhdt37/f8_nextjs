import React from 'react';
import { BiSolidLike } from 'react-icons/bi';
import { FaFileArrowUp } from 'react-icons/fa6';
const FooterChat = () => {
  return (
    <div className="h-[6rem] border-t-[0.1rem] text-[#0866ff] flex items-center justify-between px-10">
      <div className="pr-10">
        <FaFileArrowUp className="text-[3rem]" />
      </div>
      <div className="flex-1">
        <input
          type="text"
          className="px-10 py-3 w-full rounded-full focus:outline-none text-[#191919] font-light bg-[#f0f2f5]"
        />
      </div>
      <div className="pl-10">
        <BiSolidLike className="text-[3rem]" />
      </div>
    </div>
  );
};

export default FooterChat;
