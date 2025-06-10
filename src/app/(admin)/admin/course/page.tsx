
import Course from '@/components/admin/Course/AllCourse';
import { useCookie } from '@/hook/useCookie';
import { cookies } from 'next/headers';
import React from 'react';

const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Khoá học', link: '/admin/users' },
];

const CoursePage = async () => {
  return (
    <>

      <Course />
    </>
  );
};

export default CoursePage;
