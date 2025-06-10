'use client';
import { ViewNoteLesson } from '@/api/axios/api';
import confetti from 'canvas-confetti';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { GoHeartFill } from 'react-icons/go';

const Note = ({ id, isCompleteLesson, setIsCompletedLesson }: any) => {
  const [note, setNote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refTimeOut = React.useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const data = await ViewNoteLesson(id);
        if (data?.statusCode === 200) {
          setNote(data?.data);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error("Error fetching note data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCompletedLesson({
        ...isCompleteLesson,
        isCompleted: true,
      });
      if (!isCompleteLesson?.isOldCompleted) {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: {
            x: 0.5,
            y: 1,
          },
        });
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-800 dark:text-gray-200">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl">Đang tải ghi chú...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mb-12 mx-auto bg-white dark:bg-gray-900 px-4 md:px-8 lg:px-16 xl:px-[10rem] pt-8 md:pt-12 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="text-2xl md:text-3xl font-medium mb-2 text-gray-900 dark:text-white">
        {note?.title}
      </div>

      <div className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">
        Cập nhật tháng 11 năm 2023
      </div>

      <div className="rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-800 mb-12">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-blue-600 dark:text-blue-400">Ghi chú bài học</h3>
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50">
          {note?.tblnote?.description ? (
            <div
              className="custom-textview prose md:prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: note?.tblnote?.description }}
            />
          ) : (
            <div className="font-medium text-center py-12 text-gray-500 dark:text-gray-400">
              Chưa cập nhật nội dung ghi chú
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center py-6 text-center border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm md:text-base">Made with</span>
        <GoHeartFill className="mx-2 text-xl md:text-2xl text-red-500" />
        <span className="text-sm md:text-base">Powered by F8</span>
      </div>
    </div>
  );
};

export default Note;
