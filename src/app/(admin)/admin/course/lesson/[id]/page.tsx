
import React from 'react';
import Chapter from '@/components/admin/Course/chapter';
import Lesson from '@/components/admin/Course/lesson';
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

        <Lesson id={id} />
      </div>
    </>
  );
};

export default LessonPage;
