import { getVideoIdFromUrl } from "@/Utils/functions";
import React, { memo, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Lesson from "./Lessson";
import { getdataLesson } from "@/api/api";
const LessonContent = ({
  isShowSideBar,
  lessonActive,
  courseSuggestion,
}: {
  isShowSideBar: boolean;
  lessonActive: any;
  courseSuggestion: any;
}) => {
  console.log("couse", courseSuggestion);

  const [data, setdata] = useState<any>();
  console.log("data lesson", data);

  useEffect(() => {
    const handleGetLesson = async () => {
      if (lessonActive) {
        const result = await getdataLesson({
          courseId: lessonActive?.courseId,
          lessonId: lessonActive?.lessonId,
        });
        setdata(result?.data);
      }
    };
    handleGetLesson();
  }, [lessonActive]);
  // const videoId = getVideoIdFromUrl(
  //   "https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5"
  // );
  return (
    <div
      className={`${
        isShowSideBar ? "col-span-3" : "col-span-full"
      } mb-[5rem] overflow-y-scroll scrollbar-custom`}
    >
      {data?.lessonType?.id === 1 && (
        <Lesson courseSuggestion={courseSuggestion} data={data} />
      )}
    </div>
  );
};

export default memo(LessonContent);
