"use client";
import { useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import "tippy.js/dist/tippy.css";
import ModalInfo from "./ModaInfo";
import { useOutsideClick } from "@/hook/useOutsideClick";

const ModalUser = ({ data }: any) => {
  const [visible, setVisible] = useState(false);
  const handleCloseMenu = () => {
    setVisible(false);
  };
  const menuRef = useOutsideClick(handleCloseMenu);
  const handleToggleMenu = () => {
    setVisible((prevVisible) => !prevVisible);
  };
  return (
    <div className="flex text-[1.4rem] items-center text-[#333333] ">
      <div className="font-medium hidden md:block mr-12 cursor-pointer">
        Khoá học của tôi
      </div>
      <div className="">
        <FaBell className="text-3xl mr-8 text-[#707070] hover:text-[#333333] cursor-pointer" />
      </div>
      <img
        onClick={handleToggleMenu}
        className="object-cover cursor-pointer h-12 w-12 rounded-full"
        src={
          data?.user?.avatar ||
          "https://i.pinimg.com/736x/89/80/03/898003800fdc5dac3c0ce7d3d4447f01.jpg"
        }
        alt=""
      />
      {visible && (
        <div ref={menuRef} className="transition ease-in-out duration-500">
          <ModalInfo data={data} />
        </div>
      )}
    </div>
  );
};

export default ModalUser;
