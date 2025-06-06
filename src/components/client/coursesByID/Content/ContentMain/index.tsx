'use client';
import React, { useEffect, useState } from 'react';
import PropTypes, { number } from 'prop-types';
import { MdAdd, MdRemove, MdLock, MdPlayCircle } from 'react-icons/md';
import { FaPlayCircle, FaLock, FaUnlock } from 'react-icons/fa';
import { GoCodeReview } from 'react-icons/go';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { CgNotes } from 'react-icons/cg';
import { convertSecondsToYMDHMS } from '@/Utils/functions';
import { motion, AnimatePresence } from '@/lib/motion';
import { FiClock, FiBook, FiLayers, FiCheck, FiAward } from 'react-icons/fi';

const ContentMain = ({ data }: { data: any }) => {
  const [isShowLesson, setIsShowLesson] = useState<number[]>([data[0]?.id]);
  const [isShowAllLesson, setIsShowAllLesson] = useState<number[]>(() => {
    let array: number[] = [];
    data?.forEach((group: any) => {
      if (group?.id) {
        array.push(group.id);
      }
    });

    return array;
  });
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  const groupLessonCount = data?.length;
  const LessonCount = data.reduce((i: number, a: any) => {
    return (i += a?.lectureDetail?.length);
  }, 0);

  const totalSecconsCourse = data?.reduce((store: number, group: any) => {
    group?.lectureDetail?.forEach((item: any) => {
      if (item?.lesson?.duration) {
        store += item?.lesson?.duration;
      }
    });
    return store;
  }, 0);

  const handleToggleShowLessson = (groupId: number) => {
    if (groupId === -1) return;
    const arrayLesson = [...isShowLesson];
    const id = arrayLesson?.find(p => p === groupId);
    if (id) {
      const newarrayLesson = arrayLesson.filter(p => p !== id);
      setIsShowLesson(newarrayLesson);
    } else {
      setIsShowLesson([...arrayLesson, groupId]);
    }
  };

  return (
    <motion.div
      className="pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FiAward className="mr-2 text-indigo-500" />
        Nội dung khoá học
      </motion.div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl shadow-md mb-8 border border-indigo-100 dark:border-indigo-800 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto mb-4 sm:mb-0">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full mr-3 transform transition-transform duration-300 group-hover:rotate-12">
              <FiLayers className="text-indigo-600 dark:text-indigo-400 text-lg" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Chương</div>
              <div className="font-medium text-indigo-600 dark:text-indigo-400">{groupLessonCount}</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full mr-3">
              <FiBook className="text-indigo-600 dark:text-indigo-400 text-lg" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Bài học</div>
              <div className="font-medium text-indigo-600 dark:text-indigo-400">{LessonCount}</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full mr-3">
              <FiClock className="text-indigo-600 dark:text-indigo-400 text-lg" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Thời lượng</div>
              <div className="font-medium text-indigo-600 dark:text-indigo-400">
                {convertSecondsToYMDHMS(totalSecconsCourse)}
              </div>
            </div>
          </motion.div>
        </div>

        {isShowAllLesson.length === isShowLesson.length ? (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-5 py-3 rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/30 text-sm shadow-sm"
            onClick={() => setIsShowLesson([])}
          >
            Thu gọn tất cả
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-5 py-3 rounded-lg transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-sm shadow-sm"
            onClick={() => setIsShowLesson(isShowAllLesson)}
          >
            Mở rộng tất cả
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        {data?.map((groupLesson: any, index: number) => (
          <motion.div
            key={groupLesson?.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700"
          >
            <motion.div
              onClick={() => handleToggleShowLessson(groupLesson?.id || -1)}
              className="flex justify-between cursor-pointer bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 py-5 px-6 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300"
              whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex font-medium items-center">
                <div className="bg-indigo-100 dark:bg-indigo-800/70 p-2 rounded-lg mr-4 text-indigo-600 dark:text-indigo-400 transform transition-transform duration-300 group-hover:rotate-180">
                  {isShowLesson.find(p => p === groupLesson?.id) ? (
                    <motion.div
                      animate={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MdRemove size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MdAdd size={20} />
                    </motion.div>
                  )}
                </div>
                <span className="text-gray-800 dark:text-gray-200 text-base">
                  <span className="font-bold">{groupLesson?.level}.</span> {groupLesson?.name}
                </span>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 px-4 py-1 rounded-full text-sm whitespace-nowrap font-medium">
                {groupLesson?.lectureDetail?.length} bài học
              </div>
            </motion.div>

            <AnimatePresence>
              {isShowLesson.find(p => p === groupLesson?.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-white dark:bg-gray-800/50"
                >
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {groupLesson?.lectureDetail?.map((lectureDetail: any, lectureIndex: number) => (
                      <motion.div
                        key={lectureDetail?.id}
                        className="flex px-6 justify-between items-center py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors relative group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 * lectureIndex }}
                        whileHover={{ x: 5 }}
                        onMouseEnter={() => setHoveredLesson(lectureDetail?.id)}
                        onMouseLeave={() => setHoveredLesson(null)}
                      >
                        {/* Hover effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-900/10 dark:to-transparent opacity-0 transition-opacity duration-300 ${hoveredLesson === lectureDetail?.id ? 'opacity-100' : ''}`}
                        />

                        <div className="flex items-center overflow-hidden relative z-10">
                          <div className={`min-w-[40px] h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110
                            ${lectureDetail?.lessonType?.id === 1
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                              : lectureDetail?.lessonType?.id === 4
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                : lectureDetail?.lessonType?.id === 3
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {lectureDetail?.lessonType?.id === 1 && <MdPlayCircle size={20} />}
                            {lectureDetail?.lessonType?.id === 4 && <CgNotes size={20} />}
                            {lectureDetail?.lessonType?.id === 3 && <RiQuestionnaireFill size={20} />}
                            {lectureDetail?.lessonType?.id === 2 && <GoCodeReview size={20} />}
                          </div>
                          <div>
                            <span className="text-gray-800 dark:text-gray-200 text-sm truncate font-medium block">
                              {lectureDetail?.level}. {lectureDetail?.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {lectureDetail?.lessonType?.id === 1 ? 'Video' :
                                lectureDetail?.lessonType?.id === 4 ? 'Ghi chú' :
                                  lectureDetail?.lessonType?.id === 3 ? 'Câu hỏi' : 'Bài tập'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center relative z-10">
                          {lectureDetail?.lessonType?.id === 1 && (
                            <div className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium mr-2">
                              {convertSecondsToYMDHMS(
                                lectureDetail?.lesson?.duration || 0,
                              )}
                            </div>
                          )}
                          <motion.div
                            className="text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full"
                            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <FaLock size={12} />
                          </motion.div>
                        </div>

                        {/* Progress indicator - only visible on hover */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: hoveredLesson === lectureDetail?.id ? '100%' : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Course completion status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/30 shadow-md"
      >
        <div className="flex items-center mb-4">
          <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full mr-3">
            <FiCheck className="text-indigo-600 dark:text-indigo-400 text-lg" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Hoàn thành khóa học</h3>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" style={{ width: '0%' }}></div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">0% hoàn thành</span>
          <span className="text-gray-600 dark:text-gray-400">0/{LessonCount} bài học</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContentMain;
