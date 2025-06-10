
import CreateCourse from '@/components/admin/Course/create';
import CourseEdit from '@/components/admin/Course/EditCourse';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';

const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Khoá học', link: '/admin/course' },
  { title: 'Chi tiết khoá học', link: '/admin/course/create' },
];

interface Iprops {
  params: { id: string };
}

const CourseEditPage = async ({ params }: Iprops) => {
  const { id } = params;
  const cookieHeader = useCookie();

  const resLevel = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/get-level`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );

  if (!resLevel.ok) {
    redirect(`/404`);
  }

  const levelbase = await resLevel.json();
  const levels = levelbase.data;

  const resCourse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/admin/course/${id}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );

  if (!resCourse.ok) {
    redirect(`/404`);
  }

  const coursebase = await resCourse.json();
  const course = coursebase.data;

  return (
    <>
      <div className="ps-10 pt-10">

      </div>
      <CourseEdit course={course} levels={levels} />
    </>
  );
};

export default CourseEditPage;
