import { getVideoIdFromUrl } from "@/Utils/functions";
import React, { memo, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Lesson from "./Lessson";
import { getdataLesson } from "@/api/api";
import Note from "./Note";
const LessonContent = ({
  isShowSideBar,
  lessonActive,
  courseSuggestion,
}: {
  isShowSideBar: boolean;
  lessonActive: any;
  courseSuggestion: any;
}) => {
  const [data, setdata] = useState<any>();

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
  return (
    <div
      className={`${
        isShowSideBar ? "col-span-3" : "col-span-full"
      } scrollbar-custom mb-[5rem] overflow-y-scroll`}
    >
      {data?.lessonType?.id === 1 && (
        <Lesson courseSuggestion={courseSuggestion} data={data} />
      )}
      {data?.lessonType?.id === 4 && <Note id={data?.id} />}
    </div>
  );
};

export default memo(LessonContent);
