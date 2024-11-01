import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlinePlayLesson } from "react-icons/md";
const Button = ({ data, onButton }: any) => {
  return (
    <div
      onClick={() => onButton(data?.id)}
      className={`${
        data?.isActive ? "bg-[#edeae8]" : "hover:bg-[#edeae8]"
      } py-4 px-5 text-[1.25rem] text-[#3b3736] cursor-pointer rounded-lg flex items-center font-medium `}
    >
      <div className="mr-3 text-[1.7rem]">{data?.icon}</div>
      {data?.name}
    </div>
  );
};

export default Button;
