'use client';
import { getAllPost } from '@/api/axios/api';
import Pagination from './Pagination';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import { IpageEdit } from '@/types/next-auth';
import React, { useEffect, useRef, useState } from 'react';
import { MdEmail, MdOutlineMoreHoriz } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import {
  FaCircleCheck,
  FaFacebook,
  FaLink,
  FaPencil,
  FaTwitter,
} from 'react-icons/fa6';
import { TruncateMarkdown } from '@/Utils/functions';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import { IoIosMore } from 'react-icons/io';
import { message } from 'antd';
const PostList = ({ types }: any) => {
  const router = useRouter();
  const ref = useRef<any>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStateNav(3));
  }, []);
  const user = useAppSelector(state => state.auth?.user?.user);
  const [messageApi, contextHolder] = message.useMessage();
  const handleRedirectById = (name: string) => {
    ref.current.continuousStart();
    router.push(`/post/${name}`);
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
  console.log('params', user);

  useEffect(() => {
    const handleGetData = async () => {
      ref.current.continuousStart();
      const res = await getAllPost({ config: params });
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
  const handleEdit = (id: number) => {
    ref.current.continuousStart();
    router.push('/post/edit/' + id);
  };

  const handleShareFacebook = () => {
    // Chia sẻ lên Facebook
    const url = window.location.href; // Lấy URL hiện tại của trang
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const handleShareTwitter = () => {
    // Chia sẻ lên Twitter
    const url = window.location.href; // Lấy URL hiện tại của trang
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        'Xem bài viết này! ' + url,
      )}`,
      '_blank',
    );
  };

  const handleShareEmail = () => {
    const url = window.location.href; // Lấy URL hiện tại của trang
    window.open(
      `mailto:?subject=${encodeURIComponent(
        'Xem bài viết này',
      )}&body=${encodeURIComponent(
        'Tôi muốn chia sẻ bài viết này với bạn: ' + url,
      )}`,
    );
  };

  const handleCopyLink = (id: number) => {
    const url = window.location.href + `/${id}`; // Lấy URL hiện tại của trang
    navigator.clipboard.writeText(url).then(() => {
      messageApi.success('Copy thành công');
    });
  };

  return (
    <div className="container text-[1.4rem] px-28 pb-32 pt-10">
      {contextHolder}
      <LoadingBar color="#0066df" ref={ref} />
      <div className="text-[2.5rem] font-bold">Bài viết mới nhất</div>
      <div className="text-[#868686] py-[1rem]">
        Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và
        các kỹ thuật lập trình web.
      </div>
      <div className="grid grid-cols-8 mt-10 gap-10">
        <div className="col-span-6">
          {data?.posts?.map((post: any) => (
            <div className="p-10 my-10 border-2 rounded-2xl">
              <div className="flex items-center pt-4 cursor-pointer justify-between">
                <div
                  className="flex items-center"
                  onClick={() => handleRedirectProfile(post?.user?.id)}
                >
                  <img
                    className="w-12 mr-5 border-2 border-[#c7a829] h-12 object-cover rounded-full"
                    src={data?.user?.avatar || '/images/avatar-empty.png'}
                    alt=""
                  />
                  <div className="flex items-center">
                    {post?.user?.name}
                    {post?.user?.role === 2 && (
                      <FaCircleCheck className="ms-5 text-[#1b74e4]" />
                    )}
                  </div>
                </div>
                <Tippy
                  className="tippy-custom right-36"
                  arrow={false}
                  trigger="click"
                  placement="bottom"
                  interactive
                  content={
                    <div className="px-5 shadow-2xl rounded-xl text-[#111] z-20 bg-[#fff]">
                      {/* Sửa bài viết */}
                      {user?.id === post?.user?.id && (
                        <div
                          className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                          onClick={() => handleEdit(post?.blog?.id)}
                        >
                          <FaPencil className="mr-5" /> Sửa bài viết
                        </div>
                      )}

                      {/* Chia sẻ lên Facebook */}
                      <div
                        className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                        onClick={handleShareFacebook}
                      >
                        <FaFacebook className="mr-5" /> Chia sẻ lên Facebook
                      </div>

                      {/* Chia sẻ lên Twitter */}
                      <div
                        className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                        onClick={handleShareTwitter}
                      >
                        <FaTwitter className="mr-5" /> Chia sẻ lên Twitter
                      </div>

                      {/* Chia sẻ qua Email */}
                      <div
                        className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                        onClick={handleShareEmail}
                      >
                        <MdEmail className="mr-5" /> Chia sẻ với Email
                      </div>

                      {/* Sao chép liên kết */}
                      <div
                        className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                        onClick={() => handleCopyLink(post?.blog?.id)}
                      >
                        <FaLink className="mr-5" /> Sao chép liên kết
                      </div>
                    </div>
                  }
                >
                  <div className="text-[2rem] cursor-pointer">
                    <IoIosMore />
                  </div>
                </Tippy>
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
                  <div className="flex items-center pt-5">
                    <button
                      onClick={() => handleRedirectByBlogId(post?.blogType?.id)}
                      className="px-4 rounded-3xl mr-5 bg-[#ececec] py-[0.2rem]"
                    >
                      {post?.blogType?.type}
                    </button>
                    <div className="">2 tháng trước</div>
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
                      onClick={() => handleRedirectById(type?.name)}
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

export default PostList;
