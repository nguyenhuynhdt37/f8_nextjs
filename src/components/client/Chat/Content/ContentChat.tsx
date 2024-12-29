import React from 'react';
import LineChat from './LineChat';

const ContentChat = () => {
  return (
    <div className="p-5 overflow-y-scroll scrollbar-custom">
      <div className="text-start flex items-end">
        <img
          className="w-16 h-16 object-cover border-2 border-[#ceae30] mr-5 rounded-full"
          src="https://i.pinimg.com/originals/c9/22/3f/c9223f86147db5129229a2866d540ea4.jpg"
          alt=""
        />
        <div className="">
          <LineChat placement="right" />
          <LineChat placement="right" />
          <LineChat placement="right" />
          <div className="font-light text-end text-[#888] pr-5">16:24</div>
        </div>
      </div>
      <div className="text-end">
        <div className="inline-block">
          <LineChat placement="left" />
          <LineChat placement="left" />
          <LineChat placement="left" />
          <div className="font-light text-end text-[#888] pr-5">16:24</div>
        </div>
      </div>
    </div>
  );
};

export default ContentChat;
