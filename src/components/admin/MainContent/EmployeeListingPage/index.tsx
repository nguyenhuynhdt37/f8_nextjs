'use client';
import Link from 'next/link';
import { Breadcrumbs } from '../Breadcrumbs';
import { IoIosAdd } from 'react-icons/io';
import TableEmployer from './TableEmployer';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import React from 'react';
import { FiUsers } from 'react-icons/fi';

const breadcrumbItems = [
  { title: 'Trang chủ', link: '/dashboard' },
  { title: 'Người dùng', link: '/dashboard/employee' },
];

export default function EmployeeListingPage({ }: any) {
  const router = useRouter();
  const ref = React.createRef<any>();

  const handleRedirectCreate = () => {
    ref.current.continuousStart();
    router.push('/admin/users/create');
  };

  return (
    <div className="p-4 bg-gray-50">
      <LoadingBar color="#4f46e5" ref={ref} height={2} />
      <div className="space-y-3">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-50 rounded-md">
              <FiUsers className="text-sm text-indigo-600" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-800">Quản lý người dùng</h1>
              <p className="text-xs text-gray-500">Quản lý và phân quyền người dùng trong hệ thống</p>
            </div>
          </div>
          <div onClick={handleRedirectCreate}>
            <button className="flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm">
              <IoIosAdd className="mr-0.5 text-xs" /> Thêm người dùng
            </button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <TableEmployer />
        </div>
      </div>
    </div>
  );
}
