import React, { useRef } from 'react';
import { PiFinnTheHumanFill } from 'react-icons/pi';
import { FaPlayCircle } from 'react-icons/fa';
import { MdAccessTimeFilled } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import { message } from 'antd';
import { formatCurrency2 } from '@/Utils/functions';
const Course = ({ data }: any) => {
  const router = useRouter();
  const refLoading = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const handleClick = () => {
    refLoading.current.continuousStart();
    router.push('/courses/' + data?.course?.id);
  };
  return (
    <>
      {contextHolder}
      <LoadingBar color="#0066df" ref={refLoading} />
      <div
        onClick={handleClick}
        className="bg-[#f7f7f7] transform transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg cursor-pointer rounded-3xl overflow-hidden"
      >
        <img src={data?.course?.banner} className='max-h-[19.6rem] object-cover w-full' alt="" />
        <div className="p-7 text-[1.4rem]">
          <div className="text-[1.6rem] font-medium">{data?.course?.title}</div>
          {data?.detail?.isFree && (
            <div
              className="py-2 font-medium
            text-[1.4rem] text-[#f05123]"
            >
              Miễn phí
            </div>
          )}
          {!data?.detail?.isFree && (
            <div
              className="py-2 font-medium
     text-[1.4rem] flex items-center"
            >
              <div className="mr-5 line-through">
                {formatCurrency2(data?.detail?.priceOld || 0)}
              </div>
              <div className="text-[#f05123]">
                {formatCurrency2(data?.detail?.price || 0)}
              </div>
            </div>
          )}
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
    </>
  );
};

export default Course;
