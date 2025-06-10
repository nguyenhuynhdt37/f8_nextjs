import { getCurrentMonthAndYear, getVideoIdFromUrl } from '@/Utils/functions';
import React, { useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import CommentLesson from '../CommentLesson';

const Lesson = ({
  data,
  courseSuggestion,
  isCompleteLesson,
  setIsCompletedLesson,
}: any) => {
  return (
    <>
      <div className="w-full">
        <VideoPlayer
          data={data}
          isCompleted={isCompleteLesson}
          setIsCompleted={setIsCompletedLesson}
        />
      </div>

      <div className="px-4 md:px-8 lg:px-16 xl:px-20 pt-8 md:pt-12 mx-auto container mb-16 text-gray-800 dark:text-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 text-gray-900 dark:text-white">
            {data?.title}
          </h1>
          <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Cập nhật {getCurrentMonthAndYear(data?.updatedAt)}
          </div>
        </div>

        {data?.lessonVideo?.description && (
          <div className="custom-textview prose md:prose-lg max-w-none dark:prose-invert mt-6 md:mt-8 p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div
              dangerouslySetInnerHTML={{
                __html: data?.lessonVideo?.description,
              }}
            />
          </div>
        )}

        {courseSuggestion?.courseSuggestions && (
          <div className="mb-5 custom-textview prose md:prose-lg max-w-none dark:prose-invert mt-8 md:mt-12 p-6 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
            <h3 className="text-xl font-medium mb-4 text-blue-700 dark:text-blue-300">
              Gợi ý học tập
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html: courseSuggestion?.courseSuggestions,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Lesson;
