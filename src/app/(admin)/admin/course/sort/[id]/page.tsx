
import SortLesson from '@/components/admin/Course/SortLesson';
import React from 'react';

const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Khoá học', link: '/admin/users' },
  { title: 'Sắp xếp', link: '/admin/users' },
];
interface Iprops {
  params: { id: string };
}
const CoursePage = async ({ params }: Iprops) => {
  const { id } = params;
  return (
    <>
      <div className="ps-10 pt-10">

      </div>
      <SortLesson courseId={+id} />
    </>
  );
};

export default CoursePage;
