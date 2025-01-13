import React from 'react';
import Course from './Course';

const Category = ({ data }: any) => {
  return (
    <div className="">
      <div className="text-[2.5rem] font-bold">
        {data?.length > 0 && data[0]?.level?.name}
      </div>
      <div className="grid grid-cols-4 pt-10 gap-8 mb-10">
        {data &&
          data?.map((course: any, index: any) => (
            <Course key={index} data={course} />
          ))}
      </div>
    </div>
  );
};

export default Category;
