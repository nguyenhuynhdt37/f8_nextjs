"use client";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import ModalInfo from "./ModaInfo";
import { Modal } from "antd";
import Tippy from "@tippyjs/react";

import "tippy.js/dist/tippy.css";
const ModalUser = () => {
  const [visible, setVisible] = useState(false);

  const handleShowModal = () => {
    setVisible(!visible);
  };
  const hideTooltip = () => {
    setVisible(false);
  };
  return (
    <div className="flex text-[1.4rem] items-center text-[#333333] ">
      <div className="font-medium hidden md:block mr-12 cursor-pointer">
        Khoá học của tôi
      </div>
      <div className="">
        <FaBell className="text-3xl mr-8 text-[#707070] hover:text-[#333333] cursor-pointer" />
      </div>
      <div className="pr-2 cursor-pointer relative">
        <Tippy
          content={<ModalInfo />}
          className="hello"
          arrow={false}
          interactive={true}
          trigger="click"
          placement="bottom"
          theme="light"
        >
          <img
            className="object-cover w-12 rounded-full"
            src="https://files.fullstack.edu.vn/f8-prod/user_photos/299093/63fc362173671.jpg"
            alt=""
          />
        </Tippy>
      </div>
    </div>
  );
};

export default ModalUser;
