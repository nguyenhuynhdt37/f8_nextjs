import React, { useRef } from 'react';
import { PiFinnTheHumanFill } from 'react-icons/pi';
import { FaPlayCircle } from 'react-icons/fa';
import { MdAccessTimeFilled } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import { message } from 'antd';
import { FaCircleCheck } from 'react-icons/fa6';
import { timeAgo } from '@/Utils/functions';
const Post = ({ data }: any) => {
  const router = useRouter();
  const refLoading = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const handleClick = () => {
    refLoading.current.continuousStart();
    router.push('/post/' + data?.id);
  };
  console.log('data', data);

  return (
    <>
      {contextHolder}
      <LoadingBar color="#0066df" ref={refLoading} />
      <div
        onClick={handleClick}
        className="bg-[#f7f7f7] transform transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg cursor-pointer rounded-3xl overflow-hidden"
      >
        <img
          src={data?.banner}
          className="w-full object-cover h-[20rem]"
          alt=""
        />
        <div className="p-7 text-[1.4rem]">
          <div className="text-[1.6rem] h-[6rem] font-medium">
            {data?.title}
          </div>
          <div className="flex py-2 text-[#666666] justify-between">
            <div className="flex items-center ">
              <img
                src={data?.user?.avatar}
                className="w-12 rounded-full object-cover h-12"
                alt=""
              />
              <div className="flex items-center ml-5 text-[#000]">
                {data?.user?.name}
                {data?.user?.roleId === 2 && (
                  <FaCircleCheck className="text-[#46a8ff] ml-2 text-[1.4rem]" />
                )}
              </div>
            </div>
            <div className="">{timeAgo(data?.createdAt)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
