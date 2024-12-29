import React from 'react';
import { FaVideo } from 'react-icons/fa6';
import { IoCall } from 'react-icons/io5';

const HeaderChat = () => {
  return (
    <div className="h-[6.614rem] bg-[#fff] justify-between  p-5 flex border-b-[0.1rem] flex items-center">
      <div className="flex items-center">
        <img
          className="w-16 h-16 object-cover border-2 border-[#ceae30] mr-5 rounded-full"
          src="https://i.pinimg.com/originals/c9/22/3f/c9223f86147db5129229a2866d540ea4.jpg"
          alt=""
        />
        <div className="">Xuân định</div>
      </div>
      <div className="flex items-center pr-10">
        <IoCall className="text-[2.2rem] cursor-pointer mr-10" />
        <FaVideo className="text-[2.2rem] cursor-pointer" />
      </div>
    </div>
  );
};

export default HeaderChat;
