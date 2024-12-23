import React, { memo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PiListBold } from "react-icons/pi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import { getNextLesson, getPrevLesson } from "@/api/api";
import { message } from "antd";
import { log } from "node:console";
const FooterBar = ({
  isShowSideBar,
  setIsShowSideBar,
  data,
  lessonActive,
  onShowLesson,
}: any) => {
  const [is, setIs] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleNextLesson = async () => {
    if (lessonActive?.lessonId) {
      const res = await getNextLesson(lessonActive?.lessonId);
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        const dataCopy = res?.data;
        onShowLesson(dataCopy?.id, dataCopy?.lessonGroup, false);
      } else {
        messageApi.warning("Bài giảng của khoá học này đã hết!!");
      }
    }
  };
  const handlePrevLesson = async () => {
    if (lessonActive?.lessonId) {
      const res = await getPrevLesson(lessonActive?.lessonId);
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        const dataCopy = res?.data;
        onShowLesson(dataCopy?.id, dataCopy?.lessonGroup, false);
      } else {
        messageApi.warning("Bài giảng của khoá học này đã hết!!");
      }
    }
  };
  return (
    <div className="fixed h-[5rem] bg-[#f0f0f0] bottom-0 left-0 right-0">
      {contextHolder}
      <div className="flex h-full justify-center items-center">
        <button
          onClick={handlePrevLesson}
          className="px-5 flex items-center py-3 font-medium border-[0.2rem] mr-5
         text-2xl text-[#0093fc] border-[#52b1f4] rounded-2xl"
        >
          <FiChevronLeft className="text-3xl text-[#0093fc] text mr-2" />
          Bài trước
        </button>
        <div className="" onClick={handleNextLesson}>
          <motion.button
            initial={{ scale: 1 }}
            animate={is ? { scale: [1, 1.1, 1] } : {}} // Chỉ chạy hiệu ứng khi `is` là true
            transition={{
              duration: 0.5,
              ease: "easeOut",
              repeat: Infinity, // Lặp vô hạn
            }}
            className="px-2 justify-center font-medium flex items-center py-3 border-[0.1rem] text-[#fff] text-2xl bg-[#0093fc] border-[#0093fc] rounded-2xl"
            onClick={() => {}}
          >
            <span className="mr-4"></span> Bài tiếp theo
            <FiChevronRight className="text-3xl text-[#fff] text mr-2" />
          </motion.button>
        </div>
      </div>
      {isShowSideBar && (
        <div
          onClick={() => setIsShowSideBar(false)}
          className="cursor-pointer text-end text-[1.4rem] font-medium flex items-center h-full absolute top-0 right-0 text-[#000]"
        >
          <div className="">Thu gọn</div>
          <div className="">
            <button className="mx-5 w-[3rem] bg-[#fff] flex items-center justify-center rounded-full h-[3rem]">
              <FaArrowRight className="text-2xl" />
            </button>
          </div>
        </div>
      )}
      {!isShowSideBar && (
        <div
          onClick={() => setIsShowSideBar(true)}
          className="cursor-pointer text-end text-[1.4rem] font-medium flex items-center h-full absolute top-0 right-0 text-[#000]"
        >
          <div className="">Mở rộng</div>
          <div className="">
            <button className="mx-5 w-[3rem] bg-[#fff] flex items-center justify-center rounded-full h-[3rem]">
              <FaArrowLeft className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(FooterBar);
