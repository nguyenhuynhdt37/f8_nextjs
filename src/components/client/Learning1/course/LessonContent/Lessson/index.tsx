'use client';
import { getCurrentMonthAndYear, getVideoIdFromUrl } from '@/Utils/functions';
import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { motion } from '@/lib/motion';
import { FiCalendar, FiClock, FiBookmark, FiDownload, FiShare2 } from 'react-icons/fi';

const Lesson = ({
  data,
  courseSuggestion,
  isCompleteLesson,
  setIsCompletedLesson,
}: any) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Video player */}
      <div className="relative w-full aspect-video bg-black">
        <VideoPlayer
          data={data}
          isCompleted={isCompleteLesson}
          setIsCompleted={setIsCompletedLesson}
        />
      </div>

      {/* Lesson content */}
      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="space-y-6">
          {/* Lesson header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {data?.title}
              </h1>

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full ${isBookmarked
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    } transition-colors`}
                >
                  <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
                </button>

                <button
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center mt-3 text-sm text-gray-600 dark:text-gray-400 gap-4">
              <div className="flex items-center">
                <FiCalendar className="mr-1.5" />
                <span>Cập nhật {getCurrentMonthAndYear(data?.updatedAt)}</span>
              </div>

              {data?.lessonVideo?.duration && (
                <div className="flex items-center">
                  <FiClock className="mr-1.5" />
                  <span>{Math.floor(data?.lessonVideo?.duration / 60)} phút</span>
                </div>
              )}

              {data?.lessonVideo?.fileDownload && (
                <a
                  href={data?.lessonVideo?.fileDownload}
                  download
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <FiDownload className="mr-1.5" />
                  <span>Tài liệu bài học</span>
                </a>
              )}
            </div>
          </div>

          {/* Lesson description */}
          {data?.lessonVideo?.description && (
            <div className="prose dark:prose-invert max-w-none">
              <div
                className="custom-textview text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: data?.lessonVideo?.description,
                }}
              />
            </div>
          )}

          {/* Course suggestions */}
          {courseSuggestion?.courseSuggestions && (
            <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-4">
                Gợi ý học tập
              </h3>
              <div
                className="custom-textview text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: courseSuggestion?.courseSuggestions,
                }}
              />
            </div>
          )}

          {/* Next lesson button - if needed */}
          <div className="mt-8 flex justify-end">
            <button
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg"
            >
              <span className="mr-2">Bài tiếp theo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
