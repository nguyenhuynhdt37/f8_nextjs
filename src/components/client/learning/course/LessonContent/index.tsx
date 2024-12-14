import { getVideoIdFromUrl } from "@/Utils/functions";
import React, { memo, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Lesson from "./Lessson";
import { AddCourseComplete, getdataLesson } from "@/api/api";
import Note from "./Note";
import Question from "./Question";
import MyEditor from "./QuestionCode";
const LessonContent = ({
  isShowSideBar,
  lessonActive,
  courseSuggestion,
  isCompleteLesson,
  setIsCompletedLesson,
}: any) => {
  const [data, setdata] = useState<any>();
  console.log("data", data);

  useEffect(() => {
    if (
      isCompleteLesson?.lessonId &&
      isCompleteLesson.isCompleted &&
      !isCompleteLesson?.isOldCompleted &&
      isCompleteLesson?.groupId &&
      !isCompleteLesson?.isPostReq
    ) {
      const completeData = async () => {
        alert();
        const res = await AddCourseComplete(data?.lesson?.id);
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          setIsCompletedLesson({
            ...isCompleteLesson,
            isPostReq: true,
          });
        }
      };
      completeData();
    }
  }, [isCompleteLesson]);
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
  console.log("data lesson type", data?.lesson?.lessonType);

  return (
    <div
      className={`${
        isShowSideBar ? "col-span-3" : "col-span-full"
      } scrollbar-custom mb-[5rem] overflow-y-scroll`}
    >
      {data?.lesson?.lessonType?.id === 1 && (
        <Lesson
          isCompleteLesson={isCompleteLesson}
          setIsCompletedLesson={setIsCompletedLesson}
          courseSuggestion={courseSuggestion}
          data={data?.lesson}
        />
      )}
      {data?.lesson?.lessonType?.id === 3 && (
        <Question
          id={data?.lesson?.id}
          isCompleteLesson={isCompleteLesson}
          setIsCompletedLesson={setIsCompletedLesson}
        />
      )}
      {data?.lesson?.lessonType?.id === 4 && (
        <Note
          id={data?.lesson?.id}
          isCompleteLesson={isCompleteLesson}
          setIsCompletedLesson={setIsCompletedLesson}
        />
      )}
      {/* {data?.lesson?.lessonType === 4 && <MyEditor />} */}
    </div>
  );
};

export default memo(LessonContent);
