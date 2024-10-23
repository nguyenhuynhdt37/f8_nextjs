"use client";
import { FaPlayCircle } from "react-icons/fa";
import { CgPerformance } from "react-icons/cg";
import { TbMovie } from "react-icons/tb";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoIosBatteryFull } from "react-icons/io";
import ButtonRegiterStudy from "./ButtonRegiterStudy";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import ModalIntroduce from "./ModalIntroduce";
const CourseInfo = ({
  data,
  timeCourse,
  totalLesson,
}: {
  data: any;
  timeCourse: string;
  totalLesson: number;
}) => {
  console.log("data", data);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="sticky top-[10.5rem] px-10">
        <div
          className="cursor-pointer relative"
          onClick={() => setIsModalOpen(true)}
        >
          <img className="rounded-3xl" alt="" src={data?.banner} />
          <FaPlayCircle className="z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 text-[#fff] text-[6rem]" />
          <div className="font-medium left-1/2 -translate-x-1/2 bottom-7 text-2xl text-[#fff] absolute z-30">
            Xem giới thiệu khoá học
          </div>
          <div className="rounded-3xl bg-gradient-to-b opacity-70 top-0 left-0 from-transparent to-[#000] absolute w-full h-full"></div>
        </div>
        <div className="pt-5 text-[#494949]">
          {data?.courseDetail.isFree && (
            <div className="text-[3rem] text-[#f05123] text-center">
              Miễn phí
            </div>
          )}
          <div className=" py-2 px-40">
            <ButtonRegiterStudy />
            <div className="py-2 flex text-[1.4rem] items-center">
              <CgPerformance className="mr-5 text-[1.7rem]" />
              {data?.level?.name}
            </div>
            <div className="py-2 flex text-[1.4rem] items-center">
              <TbMovie className="mr-5 text-[1.7rem]" />
              Tổng số <span className="mx-2 font-medium">{totalLesson}</span>
              bài học
            </div>

            <div className="py-2 flex text-[1.4rem] items-center">
              <MdOutlineAccessTimeFilled className="mr-5 text-[1.7rem]" />
              Thời lượng: <span className="mx-2 font-medium">{timeCourse}</span>
            </div>

            <div className="py-2 flex text-[1.4rem] items-center">
              <IoIosBatteryFull className="mr-5 text-[1.7rem]" />
              {data?.courseDetail?.slogan}
            </div>
          </div>
        </div>
      </div>
      <ModalIntroduce
        id={data?.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default CourseInfo;
