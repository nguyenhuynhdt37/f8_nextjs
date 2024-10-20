import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PiListBold } from "react-icons/pi";
import { FaArrowRight } from "react-icons/fa6";
const FooterBar = () => {
  return (
    <div className="fixed h-[5rem] bg-[#f0f0f0] bottom-0 left-0 right-0">
      <div className="flex h-full justify-center items-center">
        <button
          className="px-5 flex items-center py-3 font-bold border-[0.1rem] mr-2 text-2xl text-[#0093fc] border-[#0093fc] rounded-full
        "
        >
          <FiChevronLeft className="text-3xl text-[#0093fc] text mr-2" />
          Bài trước
        </button>
        <button
          className=" px-2 justify-center font-bold flex items-center py-3 border-[0.1rem] text-[#fff] text-2xl bg-[#0093fc] border-[#0093fc] rounded-full
        "
        >
          <span className="mr-4"></span> Bài tiếp theo
          <FiChevronRight className="text-3xl text-[#fff] text mr-2" />
        </button>
      </div>
      <div className="text-end text-[1.4rem] font-medium flex items-center h-full absolute top-0 right-0 text-[#000]">
        <div className="">1. Giới thiệu</div>
        <div className="">
          {/* <button className="mx-5 w-[3rem] bg-[#fff] flex items-center justify-center rounded-full h-[3rem]">
            <PiListBold className="text-3xl" />
          </button> */}
          <button className="mx-5 w-[3rem] bg-[#fff] flex items-center justify-center rounded-full h-[3rem]">
            <FaArrowRight className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterBar;
