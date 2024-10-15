"use client";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import ModalInfo from "./ModaInfo";
const ModalUser = () => {
  const [modal, showModal] = useState<number>(3);
  return (
    <div className="flex text-[1.4rem] items-center text-[#333333] ">
      <div className="font-medium hidden md:block mr-12 cursor-pointer">
        Khoá học của tôi
      </div>
      <div className="">
        <FaBell className="text-3xl mr-8 text-[#707070] hover:text-[#333333] cursor-pointer" />
      </div>
      <div className="pr-2 cursor-pointer relative">
        <img
          className="object-cover w-12 rounded-full"
          src="https://files.fullstack.edu.vn/f8-prod/user_photos/299093/63fc362173671.jpg"
          alt=""
        />
        <ModalInfo />
      </div>
    </div>
  );
};

export default ModalUser;
