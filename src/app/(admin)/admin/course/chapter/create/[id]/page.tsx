
import ChapterCreate from '@/components/admin/Course/chapter/create';
import React from 'react';
const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Khoá học', link: '/admin/course' },
  { title: 'Chi tiết chương học', link: '/admin/course/chapter' },
];
interface Iprops {
  params: { id: string };
}
const ChapterCreatePage = ({ params }: Iprops) => {
  const { id } = params;
  return (
    <>
      <div className="ps-10 pt-10">

        <ChapterCreate id={+id} />
      </div>
    </>
  );
};

export default ChapterCreatePage;
