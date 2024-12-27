'use client';
import Link from 'next/link';
import { MdOutlineDashboard } from 'react-icons/md';
import { LuUser } from 'react-icons/lu';
import { AiOutlineCopyright } from 'react-icons/ai';
import { RiUser3Line } from 'react-icons/ri';
import Button from './Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const item = [
  {
    id: 1,
    url: '/admin',
    name: 'Tổng quan',
    icon: <MdOutlineDashboard />,
    isActive: true,
  },
  {
    id: 2,
    url: '/admin/users',
    name: 'Người dùng',
    icon: <LuUser />,
    isActive: false,
  },
  {
    id: 3,
    url: '/admin/course',
    name: 'Khoá học',
    icon: <AiOutlineCopyright />,
    isActive: false,
  },
  {
    id: 4,
    url: '/admin/profile',
    name: 'Tài khoản',
    icon: <RiUser3Line />,
    isActive: false,
  },
];
export default function Sidebar() {
  const router = useRouter();
  const [dataButton, setDataButton] = useState<any>(item);
  const handleButton = (id: number) => {
    const updateActiveButton = dataButton?.map((item: any) => {
      if (item?.id === id) {
        router.push(item?.url);
      }
      return {
        ...item,
        isActive: item?.id === id,
      };
    });
    setDataButton(updateActiveButton);
  };
  return (
    <aside
      className={` p-5 bg-[#fdf9f7] hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`}
    >
      <div className="hidden pt-10 lg:block">
        <Link href={'/dashboard'}>
          <img
            src="/images/logo.png"
            alt="F8 Icon"
            className="w-[4.5rem] cursor-pointer rounded-3xl"
          />
        </Link>
      </div>
      <div className="space-y-2 pt-20">
        {dataButton?.map((data: any) => (
          <Button key={data?.id} onButton={handleButton} data={data} />
        ))}
      </div>
    </aside>
  );
}
