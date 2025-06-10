'use client';
import React, { memo, useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import Lesson from './Lessson';
import { AddCourseComplete, getdataLesson } from '@/api/axios/api';
import Note from './Note';
import Question from './Question';
import QuessonCode from './QuestionCode';
import CommentLesson from './CommentLesson';
import { playSound } from '@/Utils/functions/SoundNumber';
import { FiMessageSquare, FiCheckCircle } from 'react-icons/fi';

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
  const [loading, setLoading] = useState<boolean>(true);

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
      setLoading(true);
      if (lessonActive) {
        try {
          const result = await getdataLesson({
            courseId: lessonActive?.courseId,
            lessonId: lessonActive?.lessonId,
          });
          if (result?.data) {
            setdata(result.data);
          }
        } catch (error) {
          console.error('Error fetching lesson data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    handleGetLesson();
  }, [lessonActive]);

  // Xử lý hiển thị bình luận
  const handleToggleComments = () => {
    setIsShowComment(prev => !prev);
  };

  return (
    <div
      className={`${isShowSideBar ? 'col-span-3' : 'col-span-full'} 
        relative mb-20 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800 
        min-h-[calc(100vh-64px)] rounded-lg shadow-sm`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải nội dung bài học...</p>
        </div>
      ) : (
        <div>
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
        </div>
      )}

      {/* Comment section */}
      {data?.lesson?.id && (
        <CommentLesson
          courseId={courseId}
          title={data?.lesson?.title}
          idLesson={data?.lesson?.id}
          isShowComment={isShowComment}
          setIsShowComment={setIsShowComment}
        />
      )}

      {/* Floating buttons */}
      <div className="fixed bottom-20 left-5 z-50 flex space-x-3">
        {/* Comment button */}
        <button
          onClick={handleToggleComments}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg transition-colors ${isShowComment
            ? 'bg-gray-600 hover:bg-gray-700 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
        >
          <FiMessageSquare size={20} />
          <span className="font-medium">{isShowComment ? 'Đóng hỏi đáp' : 'Hỏi đáp'}</span>
        </button>

        {/* Complete button - only show if not completed */}
        {!isCompleteLesson?.isOldCompleted && !isCompleteLesson?.isCompleted && data?.lesson?.id && (
          <button
            onClick={() => {
              setIsCompletedLesson({
                lessonId: data.lesson.id,
                groupId: lessonActive?.groupId,
                isCompleted: true,
                isPostReq: false,
                isOldCompleted: false,
              });
            }}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          >
            <FiCheckCircle size={20} />
            <span className="font-medium">Đánh dấu hoàn thành</span>
          </button>
        )}
      </div>

      {/* Lesson completion notification */}
      {isCompleteLesson?.isCompleted && !isCompleteLesson?.isOldCompleted && !isCompleteLesson?.isPostReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-6">
              <FiCheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Bài học hoàn thành!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Chúc mừng bạn đã hoàn thành bài học. Hãy tiếp tục để hoàn thành khóa học!
            </p>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-green-500 animate-pulse" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(LessonContent);
