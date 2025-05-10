'use client'
import React, { useEffect } from 'react';
import ResultCourse from './ResultCourse';
import ContentMain from './ContentMain';
import { CheckIsCourseRegister } from '@/api/axios/api';
import { id } from 'date-fns/locale';

const Content = ({ data, courseId }: any) => {
  useEffect(() => {
    const checkIsRegister = async () => {
      const result = await CheckIsCourseRegister({ idCourse: courseId });
      console.log('result', result);

    }
    checkIsRegister();
  }, [id]);
  console.log('data', data);

  return (
    <div className="col-span-2 text-[1.4rem] pe-20">
      {data?.title && <div className="title font-bold text-[3rem]">{data?.title}</div>}

      {/* <div className="py-2">{data?.courseDetail?.description}</div> */}
      {data?.courseDetail?.introduce &&
        <div
          className="custom-textview py-2"
          dangerouslySetInnerHTML={{ __html: data?.introduce }}
        />
      }
      <div className="pt-10">
        <ResultCourse introduce={data?.introduce} />
        <ContentMain data={data?.lessonGroups} />
      </div>
    </div>
  );
};

export default Content;
