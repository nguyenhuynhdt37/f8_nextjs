'use client';
import { FaPlayCircle } from 'react-icons/fa';
import { CgPerformance } from 'react-icons/cg';
import { TbMovie } from 'react-icons/tb';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { IoIosBatteryFull } from 'react-icons/io';
import ButtonRegiterStudy from './ButtonRegiterStudy';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import ModalIntroduce from './ModalIntroduce';
import { log } from 'console';
const CourseInfo = ({
  data,
  timeCourse,
  totalLesson,
}: {
  data: any;
  timeCourse: string;
  totalLesson: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  console.log('data1', data);

  // Price details
  const price = data?.courseDetail?.price || 0;
  const oldPrice = data?.courseDetail?.priceOld;
  const discountPercent = oldPrice ? Math.round((oldPrice - price) / oldPrice * 100) : 0;

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
          {data?.courseDetail?.isFree ? (
            <div className="text-5xl font-extrabold text-green-600 text-center py-4 animate-pulse">
              Miễn phí
            </div>
          ) : (
            <div className="relative py-6 px-6 bg-gradient-to-r from-red-50 to-white rounded-2xl shadow-lg overflow-hidden">
              {oldPrice > price && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-sm font-bold px-2 py-1 rounded-bl-lg animate-bounce">
                  -{discountPercent}%
                </div>
              )}
              <div className="text-center">
                {oldPrice > price && (
                  <div className="text-lg text-gray-500 line-through mb-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(oldPrice)}
                  </div>
                )}
                <div className="text-5xl font-extrabold text-red-600 animate-fade-in">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Thanh toán ngay để nhận ưu đãi
                </div>
              </div>
            </div>
          )}
          <div className=" py-2 px-40">
            <ButtonRegiterStudy idCourse={data?.id} />
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
