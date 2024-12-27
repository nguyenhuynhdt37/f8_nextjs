import Link from 'next/link';
import { Breadcrumbs } from '../Breadcrumbs';
import { IoIosAdd } from 'react-icons/io';
import TableEmployer from './TableEmployer';
const breadcrumbItems = [
  { title: 'Trang chủ', link: '/dashboard' },
  { title: 'Người dùng', link: '/dashboard/employee' },
];

type TEmployeeListingPage = {};

export default async function EmployeeListingPage({}: any) {
  return (
    <div className="p-10">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex text-[1.3rem] items-start justify-between">
          <div className="text-[3rem] font-bold">Quản lý người dùng</div>
          <Link href={'/admin/users/create'}>
            <button className="mr-2 flex items-center px-5 py-3 font-medium rounded-xl text-[#fff] bg-[#daac95]">
              <IoIosAdd className="mr-2 text-3xl" /> Thêm mới
            </button>
          </Link>
        </div>
        {/* {/* <Separator/ /> /*} */}
        <TableEmployer />
      </div>
    </div>
  );
}
