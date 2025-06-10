
import ChapterCreate from '@/components/admin/Course/chapter/create';
import ChapterEdit from '@/components/admin/Course/chapter/edit';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';
const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Khoá học', link: '/admin/course' },
  { title: 'Chi tiết chương học', link: '/admin/course/chapter' },
];
interface Iprops {
  params: { id: string };
}
const ChapterCreatePage = async ({ params }: Iprops) => {
  const { id } = params;
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/chapter/${id}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );
  if (!res.ok) {
    redirect(`/404`);
  }
  const result = await res?.json();
  const data = result?.data;
  return (
    <>
      <div className="ps-10 pt-10">

        <ChapterEdit dataChapter={data} />
      </div>
    </>
  );
};

export default ChapterCreatePage;
