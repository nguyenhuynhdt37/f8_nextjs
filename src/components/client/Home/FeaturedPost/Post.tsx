import React, { useRef } from 'react';
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

  return (
    <>
      {contextHolder}
      <LoadingBar color="#0066df" ref={refLoading} />

      <div
        onClick={handleClick}
        className="bg-[#f7f7f7] transition-all duration-300 hover:shadow-md cursor-pointer rounded-xl overflow-hidden"
      >
        <img
          src={data?.banner}
          className="w-full object-cover h-40 md:h-48"
          alt=""
        />
        <div className="p-4 text-sm md:text-base">
          <div className="font-medium h-12 mb-2 line-clamp-2 relative">
            {data?.title}
          </div>
          <div className="flex text-[#666666] justify-between items-center">
            <div className="flex items-center">
              <img
                src={data?.user?.avatar}
                className="w-8 h-8 rounded-full object-cover mr-2"
                alt=""
              />
              <div className="flex items-center text-[#000]">
                <span className="text-sm truncate max-w-[80px]">
                  {data?.user?.name}
                </span>
                {data?.user?.roleId === 2 && (
                  <FaCircleCheck className="text-[#46a8ff] ml-1 text-sm" />
                )}
              </div>
            </div>
            <div className="text-xs">{timeAgo(data?.createdAt)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;

