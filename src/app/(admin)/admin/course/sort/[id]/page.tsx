import { Breadcrumbs } from '@/components/admin/MainContent/Breadcrumbs';
import SortLesson from '@/components/admin/MainContent/Course/SortLesson';
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
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <SortLesson courseId={+id} />
    </>
  );
};

export default CoursePage;
