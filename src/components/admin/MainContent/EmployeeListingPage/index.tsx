'use client';
import Link from 'next/link';
import { Breadcrumbs } from '../Breadcrumbs';
import { IoIosAdd } from 'react-icons/io';
import TableEmployer from './TableEmployer';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import React from 'react';
const breadcrumbItems = [
  { title: 'Trang chủ', link: '/dashboard' },
  { title: 'Người dùng', link: '/dashboard/employee' },
];

type TEmployeeListingPage = {};

export default function EmployeeListingPage({}: any) {
  const router = useRouter();
  const ref = React.createRef<any>();
  const handleRedirectCreate = () => {
    ref.current.continuousStart();
    router.push('/admin/users/create');
  };
  return (
    <div className="p-10">
      <LoadingBar color="#0066df" ref={ref} />
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex text-[1.3rem] items-start justify-between">
          <div className="text-[3rem] font-bold">Quản lý người dùng</div>
          <div onClick={handleRedirectCreate}>
            <button className="mr-2 flex items-center px-5 py-3 font-medium rounded-xl text-[#fff] bg-[#daac95]">
              <IoIosAdd className="mr-2 text-3xl" /> Thêm mới
            </button>
          </div>
        </div>
        {/* {/* <Separator/ /> /*} */}
        <TableEmployer />
      </div>
    </div>
  );
}
