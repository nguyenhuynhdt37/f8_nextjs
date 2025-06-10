'use client';
import { ViewNoteLesson } from '@/api/axios/api';
import confetti from 'canvas-confetti';
import { getCurrentMonthAndYear } from '@/Utils/functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const Note = ({ id, isCompleteLesson, setIsCompletedLesson }: any) => {
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await ViewNoteLesson(id);
        if (data?.statusCode === 200) {
          setNote(data?.data);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id, router]);

  useEffect(() => {
    // Đánh dấu hoàn thành sau 10 giây
    const timeout = setTimeout(() => {
      if (!isCompleteLesson?.isCompleted && !isCompleteLesson?.isOldCompleted) {
        setIsCompletedLesson({
          lessonId: id,
          isCompleted: true,
          isPostReq: false,
          isOldCompleted: false,
        });

        // Hiệu ứng confetti khi hoàn thành
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { x: 0.7, y: 0.8 }
        });
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [id, isCompleteLesson, setIsCompletedLesson]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-4">
            <FiBookOpen className="text-indigo-600 dark:text-indigo-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{note?.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cập nhật {getCurrentMonthAndYear(note?.updatedAt)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 mb-6"></div>

        {/* Content */}
        {note?.tblnote?.description ? (
          <div
            className="prose dark:prose-invert max-w-none custom-textview"
            dangerouslySetInnerHTML={{ __html: note?.tblnote?.description }}
          />
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Nội dung đang được cập nhật...
          </div>
        )}

        {/* Status */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Powered by F8
          </div>

          {(isCompleteLesson?.isCompleted || isCompleteLesson?.isOldCompleted) && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <FiCheckCircle className="mr-2" />
              <span className="text-sm font-medium">Đã hoàn thành</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
