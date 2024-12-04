import React from "react";
import ResultCourse from "./ResultCourse";
import ContentMain from "./ContentMain";

const Content = ({ data }: any) => {
  return (
    <div className="col-span-2 text-[1.4rem] pe-20">
      <div className="title font-bold text-[3rem]">{data?.title}</div>
      <div className="py-2">{data?.courseDetail?.description}</div>
      <div className="pt-10">
        <ResultCourse />
        <ContentMain data={data?.lessonGroups} />
      </div>
    </div>
  );
};

export default Content;
