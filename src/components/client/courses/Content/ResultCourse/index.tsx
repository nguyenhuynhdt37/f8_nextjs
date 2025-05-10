import React from 'react';
import { FaCheck } from 'react-icons/fa6';
const ResultCourse = ({ introduce }: any) => {
  return (
    <>
      <div className="text-[2rem] font-bold pb-2">Mô tả khoá học</div>
      {introduce ? (
        <div
          className="custom-textview leading-10 text-[#ccc]"
          dangerouslySetInnerHTML={{ __html: introduce }}
        />
      ) : (
        <div className="font-medium">Chưa cập nhật</div>
      )}
    </>
  );
};

export default ResultCourse;
