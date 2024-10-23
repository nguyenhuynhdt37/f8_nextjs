"use client";
import MyContext from "@/hook/context";
import { useContext, useState } from "react";
import { HiHome } from "react-icons/hi";
const Slider = () => {
  const context = useContext(MyContext);
  const { state, setState }: any = context;
  console.log("state", state);

  return (
    <div className="w-[9.6rem] items-center flex text-[1.15rem] text-[#404040] font-medium flex-col">
      <button
        className={`${
          state === 1
            ? "bg-[#e8ebed] text-[#252525]"
            : "hover:bg-[#f2f0f0] hover:text-[#252525]"
        } flex w-[7.2rem] h-[7.2rem]  my-1 justify-center items-center  rounded-[1.8rem] py-2 flex-col`}
        onClick={() => setState(1)}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="house"
          className="svg-inline--fa fa-house w-8 pb-1"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            fill="currentColor"
            d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
          ></path>
        </svg>
        <div className="pt-1"> Trang chủ</div>
      </button>
      <button
        className={`${
          state === 2
            ? "bg-[#e8ebed] text-[#252525]"
            : "hover:bg-[#f2f0f0] hover:text-[#252525]"
        } flex w-[7.2rem] h-[7.2rem] hover:bg-[#f2f0f0] hover:text-[#252525] my-1 justify-center items-center  rounded-[1.8rem] py-2 flex-col`}
        onClick={() => setState(2)}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="road"
          className="svg-inline--fa fa-road w-8 pb-1"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            fill="currentColor"
            d="M256 32H181.2c-27.1 0-51.3 17.1-60.3 42.6L3.1 407.2C1.1 413 0 419.2 0 425.4C0 455.5 24.5 480 54.6 480H256V416c0-17.7 14.3-32 32-32s32 14.3 32 32v64H521.4c30.2 0 54.6-24.5 54.6-54.6c0-6.2-1.1-12.4-3.1-18.2L455.1 74.6C446 49.1 421.9 32 394.8 32H320V96c0 17.7-14.3 32-32 32s-32-14.3-32-32V32zm64 192v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32s32 14.3 32 32z"
          ></path>
        </svg>
        <div className="pt-1">Lộ trình</div>
      </button>
      <button
        className={`${
          state === 3
            ? "bg-[#e8ebed] text-[#252525]"
            : "hover:bg-[#f2f0f0] hover:text-[#252525]"
        } flex w-[7.2rem] h-[7.2rem] hover:bg-[#f2f0f0] hover:text-[#252525] my-1 justify-center items-center  rounded-[1.8rem] py-2 flex-col`}
        onClick={() => setState(3)}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="newspaper"
          className="svg-inline--fa fa-newspaper w-8 pb-1"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M96 96c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H80c-44.2 0-80-35.8-80-80V128c0-17.7 14.3-32 32-32s32 14.3 32 32V400c0 8.8 7.2 16 16 16s16-7.2 16-16V96zm64 24v80c0 13.3 10.7 24 24 24H296c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24H184c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z"
          ></path>
        </svg>
        <div className="pt-1">Bài viết</div>
      </button>
    </div>
  );
};

export default Slider;
