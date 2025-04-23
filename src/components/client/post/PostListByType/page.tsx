'use client';
import { getAllPost, getAllPostByType } from '@/api/axios/api';
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import { IpageEdit } from '@/types/next-auth';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineMoreHoriz } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import { FaCircleCheck } from 'react-icons/fa6';
import { TruncateMarkdown } from '@/Utils/functions';
import { useRouter } from 'next/navigation';
import Pagination from '../PostList/Pagination';
const PostListByType = ({ types, id }: any) => {
  const router = useRouter();
  const ref = useRef<any>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStateNav(3));
  }, []);
  const handleRedirectById = (id: number) => {
    ref.current.continuousStart();
    router.push(`/profle/${id}`);
  };
  const [loadData, setLoadData] = useState<number>(0);
  const [data, setData] = useState<any>();
  const [params, setParams] = useState<IpageEdit>({
    pageSize: 10,
    pageNumber: 1,
    totalPage: 1,
    totalCount: 0,
    searchTerm: '',
    sortField: '',
    sortOrder: '',
  });
  useEffect(() => {
    const handleGetData = async () => {
      ref.current.continuousStart();
      const res = await getAllPostByType({ config: params, id });
      ref.current.complete();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setData(res?.data);
        setParams({
          ...params,
          totalCount: res?.data?.totalCount,
          totalPage: res?.data?.totalPage,
        });
      } else {
        setData(undefined);
      }
    };
    handleGetData();
  }, [loadData]);
  const handleRedirectProfile = (id: number) => {
    ref.current.continuousStart();
    router.push(`/profile/${id}`);
  };
  const handleRedirectByBlogId = (id: number) => { };
  const handleRedirectByPostId = (id: number) => {
    ref.current.continuousStart();
    router.push(`/post/${id}`);
  };
  return (
    <div className="container text-[1.4rem] px-28 pt-10 pb-32">
      <LoadingBar color="#0066df" ref={ref} />
      <div className="text-[2.5rem] font-bold">
        Chủ đề {data?.posts?.length > 0 && data[0]?.posts?.blogType?.type}
      </div>
      <div className="text-[#868686] py-[1rem]">
        Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và
        các kỹ thuật lập trình web.
      </div>
      <div className="grid grid-cols-8 mt-10 gap-10">
        <div className="col-span-6">
          {data?.posts?.map((post: any) => (
            <div className="p-10 my-10 border-2 rounded-2xl">
              <div
                className="flex items-center pt-4 cursor-pointer justify-between"
                onClick={() => handleRedirectProfile(post?.user?.id)}
              >
                <div className="flex items-center">
                  <img
                    className="w-12 mr-5 h-12 object-cover rounded-full"
                    src="https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/468977220_564916422807164_6425151126870756605_n.jpg?stp=dst-jpg_p526x296&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG8TzQrzH_SA2BHnR-a4SGNwRBo5TAL6sjBEGjlMAvqyD2Xzgy9yVCUnNMufq8S-tznyDzMrb21X-AjDmPagyxi&_nc_ohc=Sw70VhE53sAQ7kNvgE25JVT&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=AQ9d5-L5fdLFtihHOrxJF0h&oh=00_AYCj_qqz0EP98v7scNa_2zGsVEpVMw4eoAYuhDDEwnSTnA&oe=67546FDC"
                    alt=""
                  />
                  <div className="flex items-center">
                    {post?.user?.name}
                    {post?.user?.role === 2 && (
                      <FaCircleCheck className="ms-5 text-[#1b74e4]" />
                    )}
                  </div>
                </div>
                <div className="">
                  <MdOutlineMoreHoriz className="text-[2rem] text-[#a3a3a3] cursor-pointer" />
                </div>
              </div>
              <div className=" flex justify-between">
                <div className="flex-1">
                  <div
                    onClick={() => handleRedirectByPostId(post?.blog?.id)}
                    className="cursor-pointer mt-8 mb-5 font-medium text-[1.6rem]"
                  >
                    {post?.blog?.title}
                  </div>
                  <div className="text-[#636363]">
                    <TruncateMarkdown
                      content={post?.blog?.content || ''}
                      limit={50}
                    />
                  </div>
                </div>
                {post?.blog?.banner && (
                  <div className="">
                    <img
                      className="h-[012rem] w-[20rem] rounded-3xl object-cover"
                      src={post?.blog?.banner}
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <Pagination
            pageEdit={params}
            setLoadData={setLoadData}
            setPageEdit={setParams}
          />
        </div>
        <div className="col-span-2">
          <div className="sticky">
            <div className="flex flex-wrap pb-10">
              {types?.map((type: any, index: number) => {
                if (type?.bloggerCount >= 1) {
                  return (
                    <button
                      onClick={() => handleRedirectById(type?.id)}
                      key={type?.id || index}
                      className="px-10 py-3 rounded-3xl my-3 mr-5 bg-[#e8e8e8]"
                    >
                      {type?.name}
                    </button>
                  );
                }
              })}
            </div>
            <div className="mb-10">
              <a href="https://www.youtube.com/@F8VNOfficial" target="_blank">
                <img
                  className="w-full rounded-2xl"
                  src="https://files.fullstack.edu.vn/f8-prod/banners/26/63dc61f2a061e.png"
                  alt=""
                />
              </a>
            </div>
            <div>
              <a href="https://www.youtube.com/@F8VNOfficial" target="_blank">
                <img
                  className="w-full rounded-2xl"
                  src="https://files.fullstack.edu.vn/f8-prod/banners/32/6421144f7b504.png"
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListByType;
