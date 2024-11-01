import React from "react";
import { PiFinnTheHumanFill } from "react-icons/pi";
import { FaPlayCircle } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
const Course = () => {
  return (
    <div className="bg-[#f7f7f7] transform transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg cursor-pointer rounded-3xl overflow-hidden">
      <img
        src="https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png"
        alt=""
      />
      <div className="p-7 text-[1.4rem]">
        <div className="text-[1.6rem] font-medium">HTML CSS Pro</div>
        <div
          className="py-2 font-medium
        text-[1.4rem] text-[#f05123]"
        >
          Miễn Phí
        </div>
        <div className="flex py-2 text-[#666666] justify-between">
          <div className=" flex items-center">
            <PiFinnTheHumanFill className="text-2xl mr-2" /> 111.222
          </div>
          <div className=" flex items-center">
            <FaPlayCircle className="text-2xl mr-2" /> 112
          </div>
          <div className=" flex items-center">
            <MdAccessTimeFilled className="text-2xl mr-2" /> 111.222
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
