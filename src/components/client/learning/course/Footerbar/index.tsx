'use client';
import React, { memo, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiMenu, FiX } from 'react-icons/fi';
import { getNextLesson, getPrevLesson } from '@/api/axios/api';
import { message } from 'antd';
import { motion, AnimatePresence } from '@/lib/motion';

const FooterBar = ({
  isShowSideBar,
  setIsShowSideBar,
  data,
  lessonActive,
  onShowLesson,
}: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isAnimating, setIsAnimating] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [currentLessonTitle, setCurrentLessonTitle] = useState('');

  // Tìm thông tin về bài học hiện tại
  useEffect(() => {
    if (data?.lessonGroups && lessonActive?.lessonId) {
      let totalLessons = 0;
      let currentLessonIndex = -1;
      let foundTitle = '';

      // Tính tổng số bài học và vị trí hiện tại
      for (const group of data.lessonGroups) {
        if (group.lectureDetails) {
          for (let i = 0; i < group.lectureDetails.length; i++) {
            const lesson = group.lectureDetails[i];
            totalLessons++;

            if (lesson.id === lessonActive.lessonId) {
              currentLessonIndex = totalLessons;
              foundTitle = lesson.title || '';
            }
          }
        }
      }

      // Tính phần trăm tiến độ
      if (totalLessons > 0 && currentLessonIndex > 0) {
        setLessonProgress(Math.round((currentLessonIndex / totalLessons) * 100));
        setCurrentLessonTitle(foundTitle);
      }
    }
  }, [data, lessonActive]);

  const handleNextLesson = async () => {
    if (lessonActive?.lessonId) {
      setIsAnimating(true);
      try {
        const res = await getNextLesson(lessonActive?.lessonId);
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          const dataCopy = res?.data;
          onShowLesson(dataCopy?.id, dataCopy?.lessonGroup, false);
        } else {
          messageApi.warning('Bạn đã hoàn thành tất cả bài học!');
        }
      } finally {
        setTimeout(() => setIsAnimating(false), 500);
      }
    }
  };

  const handlePrevLesson = async () => {
    if (lessonActive?.lessonId) {
      setIsAnimating(true);
      try {
        const res = await getPrevLesson(lessonActive?.lessonId);
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          const dataCopy = res?.data;
          onShowLesson(dataCopy?.id, dataCopy?.lessonGroup, false);
        } else {
          messageApi.warning('Đây là bài học đầu tiên!');
        }
      } finally {
        setTimeout(() => setIsAnimating(false), 500);
      }
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      className="fixed h-16 bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50"
    >
      {contextHolder}

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${lessonProgress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Left section - Previous button */}
        <motion.button
          onClick={handlePrevLesson}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <FiChevronLeft className="text-xl" />
          <span className="font-medium hidden sm:inline">Bài trước</span>
        </motion.button>

        {/* Center section - Current lesson info */}
        <div className="flex-1 mx-4 hidden md:block">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Bài học hiện tại</p>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-lg mx-auto">
              {currentLessonTitle || 'Đang tải...'}
            </h3>
          </div>
        </div>

        {/* Right section - Next button and sidebar toggle */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleNextLesson}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg"
          >
            <span className="font-medium hidden sm:inline">Bài tiếp theo</span>
            <FiChevronRight className="text-xl" />
          </motion.button>

          <motion.button
            onClick={() => setIsShowSideBar(!isShowSideBar)}
            whileHover={{ rotate: isShowSideBar ? -180 : 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isShowSideBar ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile lesson title - only visible on small screens */}
      <AnimatePresence>
        {currentLessonTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute left-0 right-0 bottom-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 md:hidden"
          >
            <p className="text-sm text-center font-medium text-gray-800 dark:text-gray-200 truncate">
              {currentLessonTitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(FooterBar);
