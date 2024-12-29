'use server';
import React from 'react';
import { AiOutlinePushpin } from 'react-icons/ai';
import { RiAdminLine } from 'react-icons/ri';
import { MdOutlineEmail } from 'react-icons/md';
import { RiContactsLine } from 'react-icons/ri';
import { FaFontAwesomeFlag } from 'react-icons/fa';
import { Breadcrumbs } from '@/components/admin/MainContent/Breadcrumbs';
import { redirect } from 'next/navigation';
import { getUserByID } from '@/api/api';
import { cookies } from 'next/headers';
import Link from 'next/link';
const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Người dùng', link: '/admin/users' },
  { title: 'Chi tiết người dùng', link: '/admin/details' },
];
interface CoursePageProps {
  params: { id: string };
}
const DetailPage = async (context: CoursePageProps) => {
  const { id } = (await context.params) || {};
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
  if (!id) redirect('/404');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${id}`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );
  if (!res.ok) redirect('/404');

  const { data } = await res?.json();
  return (
    <>
      <div className="ps-10 pt-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div className="h-full text-[1.6rem] p-10">
        <div className="h-[20rem] relative rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
          <div className="absolute inline-flex left-24 -bottom-24 bg-[#fefcfb] p-3 rounded-full">
            <img
              className="w-[10rem] h-[10rem] rounded-full object-cover"
              src={
                data?.avatar ||
                'https://khoinguonsangtao.vn/wp-content/uploads/2022/08/hinh-nen-gai-xinh.jpg'
              }
              alt=""
            />
          </div>
        </div>
        <div className="pt-28 relative">
          <div className="absolute right-0">
            <Link href={`/admin/users/edit/${id}`}>
              {' '}
              <button className="bg-[#3084d6] px-4 py-3 text-[#fff] rounded-2xl flex items-center">
                <AiOutlinePushpin className="mr-2 text-3xl" />
                Chỉnh sửa
              </button>
            </Link>
          </div>
          <div className="pb-10">
            <div className="">{data?.fullName}</div>
            <div className="flex text-[1.2rem] py-2 text-[#888] items-center">
              <div className="">
                <img className="w-10 mr-2" src="/images/vietnam.png" alt="" />
              </div>
              <div className="icon">@{data?.userName || 'Noname'}</div>
            </div>
            <div className="flex">
              <div className="mr-2 ">Tuổi: 20</div>
              <div className="mr-2 ">| Giới tính: Male</div>
              <div className="mr-2 flex">
                | Trạng thái:{' '}
                {data?.isActive ? (
                  <p className="text-[#3cb43c] ml-2">Đã kích hoạt</p>
                ) : (
                  <p className="text-[#be3434] ml-2">Chưa kích hoạt</p>
                )}
              </div>
            </div>
            <div className="flex mt-10 border-b-2">
              <div className="flex-col mr-56 text-[#7a7a7a]">
                <ul>
                  <li className="flex mb-10 items-center">
                    <RiAdminLine className="mr-2" />
                    Quyền hạn:
                  </li>
                  <li className="flex mb-10 items-center">
                    <MdOutlineEmail className="mr-2" />
                    Email:
                  </li>
                  <li className="flex mb-10 items-center">
                    <RiContactsLine className="mr-2" />
                    Youtube:
                  </li>
                  <li className="flex mb-10 items-center">
                    <FaFontAwesomeFlag className="mr-2" />
                    Github:
                  </li>
                  <li className="flex mb-10 items-center">
                    <FaFontAwesomeFlag className="mr-2" />
                    FaceBook:
                  </li>
                </ul>
              </div>
              <div className="flex-col">
                <ul>
                  <li className="mb-10">{'Người dùng '}</li>
                  <li className="mb-10">{data?.email || 'Chưa cập nhật'}</li>
                  <li className="mb-10">
                    {data?.youtubeLink || 'Chưa cập nhật'}
                  </li>
                  <li className="mb-10">
                    {data?.githubLink || 'Chưa cập nhật'}
                  </li>
                  <li className="mb-10">
                    {data?.facebookLink || 'Chưa cập nhật'}
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 p-10 rounded-2xl border-2 border-[#888]">
              <h2 className="font-semibold text-4xl pb-10">
                Thông tin cá nhân
              </h2>
              <div className="content pt-10 border-t-2">
                {data?.bio ? (
                  <div
                    className="custom-textview"
                    dangerouslySetInnerHTML={{ __html: data?.bio }}
                  />
                ) : (
                  <div className="font-medium text-center">Chưa cập nhật</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;
