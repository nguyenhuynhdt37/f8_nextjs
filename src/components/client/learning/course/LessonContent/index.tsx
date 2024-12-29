import React, { memo, useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import Lesson from './Lessson';
import { AddCourseComplete, getdataLesson } from '@/api/api';
import Note from './Note';
import Question from './Question';
import QuessonCode from './QuestionCode';
import { FaComments } from 'react-icons/fa6';
import CommentLesson from './CommentLesson';
import { playSound } from '@/Utils/functions/SoundNumber';
const LessonContent = ({
  isShowSideBar,
  lessonActive,
  courseSuggestion,
  isCompleteLesson,
  setIsCompletedLesson,
  courseId,
}: any) => {
  const [data, setdata] = useState<any>();
  const [isShowComment, setIsShowComment] = useState<boolean>(false);

  useEffect(() => {
    if (
      isCompleteLesson?.lessonId &&
      isCompleteLesson.isCompleted &&
      !isCompleteLesson?.isOldCompleted &&
      isCompleteLesson?.groupId &&
      !isCompleteLesson?.isPostReq
    ) {
      const completeData = async () => {
        playSound('/sounds/success.mp3');
        const res = await AddCourseComplete(data?.lesson?.id, courseId);
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

  return (
    <div
      className={`${
        isShowSideBar ? 'col-span-3' : 'col-span-full'
      } scrollbar-custom text-[1.4rem] relative mb-[5rem] overflow-y-scroll`}
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
      {data?.lesson?.lessonType?.id === 2 && (
        <QuessonCode
          courseId={courseId}
          isCompleteLesson={isCompleteLesson}
          setIsCompletedLesson={setIsCompletedLesson}
          id={data?.lesson?.id}
        />
      )}
      <CommentLesson
        title={data?.lesson?.title}
        idLesson={data?.lesson?.id}
        isShowComment={isShowComment}
        setIsShowComment={setIsShowComment}
      />
      <button
        onClick={() => setIsShowComment(true)}
        className="flex rounded-full border-[0.2rem] border-[#f05123] px-10 py-4  fixed top-[88vh] right-[47rem] z-10 bg-[#fff] items-center text-[#f05123]"
      >
        <FaComments className="mr-2 text-[2rem]" />
        Hỏi đáp
      </button>
    </div>
  );
};

export default memo(LessonContent);
