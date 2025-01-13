import React from 'react';
import { FaCheck } from 'react-icons/fa6';
const ResultCourse = ({ description }: any) => {
  return (
    <>
      <div className="text-[2rem] font-bold pb-2">Mô tả khoá học</div>
      {description ? (
        <div
          className="custom-textview"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <div className="font-medium">Chưa cập nhật</div>
      )}
    </>
  );
};

export default ResultCourse;
