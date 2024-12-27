import { Breadcrumbs } from '@/components/admin/MainContent/Breadcrumbs';
import React from 'react';
import Chapter from '@/components/admin/MainContent/Course/chapter';
import Lesson from '@/components/admin/MainContent/Course/lesson';
interface Iprops {
  params: { id: string };
}
const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Khoá học', link: '/admin/course' },
  { title: 'Bài học', link: '/admin/course/lesson' },
];
const LessonPage = ({ params }: Iprops) => {
  const { id } = params;
  return (
    <>
      <div className="ps-10 pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <Lesson id={id} />
      </div>
    </>
  );
};

export default LessonPage;
