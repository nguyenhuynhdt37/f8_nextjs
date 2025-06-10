import React, { memo, useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import Lesson from './Lessson';
import { AddCourseComplete, getdataLesson } from '@/api/axios/api';
import Note from './Note';
import Question from './Question';
import QuessonCode from './QuestionCode';
import { FaComments } from 'react-icons/fa6';
import CommentLesson from './CommentLesson';
import { playSound } from '@/Utils/functions/SoundNumber';
import { message } from 'antd';

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
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (
      isCompleteLesson?.lessonId &&
      isCompleteLesson.isCompleted &&
      !isCompleteLesson?.isOldCompleted &&
      isCompleteLesson?.groupId &&
      !isCompleteLesson?.isPostReq
    ) {
      const completeData = async () => {
        try {
          playSound('/sounds/success.mp3');
          const res = await AddCourseComplete(data?.lesson?.id, courseId);
          if (res?.statusCode === 200 || res?.statusCode === 201) {
            setIsCompletedLesson({
              ...isCompleteLesson,
              isPostReq: true,
            });
          }
        } catch (error) {
          messageApi.error('Lỗi khi hoàn thành bài học, vui lòng thử lại sau');
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
    <>
      {contextHolder}
      <div
        className={`${isShowSideBar ? 'lg:col-span-3' : 'col-span-full'}
        relative overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
        bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 
        transition-colors duration-300`}
      >
        {data?.lesson.lessontype?.id === 1 && (
          <Lesson
            isCompleteLesson={isCompleteLesson}
            setIsCompletedLesson={setIsCompletedLesson}
            courseSuggestion={courseSuggestion}
            data={data?.lesson}
          />
        )}

        {data?.lesson.lessontype?.id === 3 && (
          <Question
            id={data?.lesson?.id}
            isCompleteLesson={isCompleteLesson}
            setIsCompletedLesson={setIsCompletedLesson}
          />
        )}

        {data?.lesson.lessontype?.id === 4 && (
          <Note
            id={data?.lesson?.id}
            isCompleteLesson={isCompleteLesson}
            setIsCompletedLesson={setIsCompletedLesson}
          />
        )}

        {data?.lesson.lessontype?.id === 2 && (
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
          className="flex items-center fixed bottom-20 left-10 md:left-16 z-10 px-4 md:px-6 py-3 md:py-4 rounded-full shadow-lg
          bg-white text-orange-500 border-2 border-orange-500 hover:bg-orange-50
          dark:bg-gray-800 dark:text-orange-400 dark:border-orange-500 dark:hover:bg-gray-700
          transition-all duration-300 font-medium"
        >
          <FaComments className="mr-2 text-xl md:text-2xl" />
          <span className="text-sm md:text-base">Hỏi đáp</span>
        </button>
      </div>
    </>
  );
};

export default memo(LessonContent);
