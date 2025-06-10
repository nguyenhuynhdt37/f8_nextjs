'use client';
import { convertSecondsToYMDHMS } from '@/Utils/functions';
import { memo, useRef, useState } from 'react';
import { FaAngleDown, FaCode } from 'react-icons/fa';
import { FaCircleCheck, FaCirclePlay } from 'react-icons/fa6';
import { MdEventNote, MdQuiz } from 'react-icons/md';
import { motion, AnimatePresence } from '@/lib/motion';
import LoadingBar from 'react-top-loading-bar';
import { FiClock, FiBook, FiCheck, FiLock } from 'react-icons/fi';

interface IProps {
  isShowSideBar: boolean;
  data: any;
  lessonActive: any;
  onShowLesson: any;
}

const SideBar = ({
  data,
  isShowSideBar,
  lessonActive,
  onShowLesson,
}: IProps) => {
  const ref = useRef<any>(null);
  const [activeShowGroupLesson, setActiveShowGroupLesson] = useState<number[]>([
    lessonActive?.groupId ||
    (data && data?.lessonGroups && data?.lessonGroups[0]?.id) ||
    null,
  ]);
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  const handleShowLesson = (id: number) => {
    const value = activeShowGroupLesson.find(value => value === id);
    if (value) {
      const newarray = activeShowGroupLesson.filter(v => v !== value);
      setActiveShowGroupLesson(newarray);
    } else {
      setActiveShowGroupLesson([...activeShowGroupLesson, id]);
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!data?.lessonGroups) return 0;

    let totalLessons = 0;
    let completedLessons = 0;

    data.lessonGroups.forEach((group: any) => {
      if (group.lectureDetails) {
        totalLessons += group.lectureDetails.length;
        group.lectureDetails.forEach((lesson: any) => {
          if (lesson.userLessons && lesson.userLessons.length > 0) {
            completedLessons++;
          }
        });
      }
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isShowSideBar ? 'col-span-1' : 'hidden'} 
        h-[86vh] w-[27rem] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        overflow-hidden flex flex-col`}
    >
      <LoadingBar color="#6366f1" ref={ref} height={3} />

      {/* Header */}
      <div className="py-5 px-6 sticky top-0 left-0 bg-white dark:bg-gray-800 z-20 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200">Nội dung khoá học</h2>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Tiến độ học tập</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="py-3">
          {data?.lessonGroups?.map((groupLesson: any, groupIndex: number) => (
            <motion.div
              key={groupLesson?.id}
              className="mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * groupIndex }}
            >
              <motion.div
                onClick={() => handleShowLesson(groupLesson?.id)}
                className="flex cursor-pointer justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200 text-base">
                    {groupLesson?.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiBook className="mr-1.5 text-indigo-500 dark:text-indigo-400" />
                    <span>{groupLesson?.lectureDetails?.length} bài học</span>
                    <span className="mx-2">•</span>
                    <FiClock className="mr-1.5 text-indigo-500 dark:text-indigo-400" />
                    <span>
                      {convertSecondsToYMDHMS(
                        groupLesson?.lectureDetails?.reduce(
                          (data: number, item: any) => {
                            if (item?.lessontype?.id === 1) {
                              data += item?.lessonVideo?.duration || 0;
                            }
                            return data;
                          },
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700"
                  animate={{
                    rotate: activeShowGroupLesson.find(value => value === groupLesson?.id) ? 180 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <FaAngleDown className="text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {activeShowGroupLesson.find(value => value === groupLesson?.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {groupLesson?.lectureDetails?.map((lesson: any, lessonIndex: number) => {
                      const isActive = lessonActive?.lessonId === lesson?.id;
                      const isCompleted = lesson?.userLessons?.length > 0;

                      return (
                        <motion.div
                          key={lesson?.id}
                          onClick={() => onShowLesson(
                            lesson?.id,
                            groupLesson?.id,
                            isCompleted
                          )}
                          className={`flex items-center px-6 py-3 cursor-pointer relative
                            ${isActive
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500 dark:border-indigo-400'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-transparent'
                            }
                            transition-all duration-200`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 * lessonIndex }}
                          whileHover={{ x: 3 }}
                          onMouseEnter={() => setHoveredLesson(lesson?.id)}
                          onMouseLeave={() => setHoveredLesson(null)}
                        >
                          {/* Lesson icon */}
                          <div className={`
                            flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mr-3
                            ${isActive
                              ? 'bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-400'
                              : isCompleted
                                ? 'bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400'
                                : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                            }
                            transition-all duration-200
                          `}>
                            {isCompleted && !isActive && (
                              <FiCheck className="text-lg" />
                            )}
                            {!isCompleted && !isActive && lesson?.lessontype?.id === 1 && (
                              <FaCirclePlay className="text-lg" />
                            )}
                            {!isCompleted && !isActive && lesson?.lessontype?.id === 2 && (
                              <FaCode className="text-lg" />
                            )}
                            {!isCompleted && !isActive && lesson?.lessontype?.id === 3 && (
                              <MdQuiz className="text-lg" />
                            )}
                            {!isCompleted && !isActive && lesson?.lessontype?.id === 4 && (
                              <MdEventNote className="text-lg" />
                            )}
                            {isActive && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                {lesson?.lessontype?.id === 1 && <FaCirclePlay className="text-lg" />}
                                {lesson?.lessontype?.id === 2 && <FaCode className="text-lg" />}
                                {lesson?.lessontype?.id === 3 && <MdQuiz className="text-lg" />}
                                {lesson?.lessontype?.id === 4 && <MdEventNote className="text-lg" />}
                              </motion.div>
                            )}
                          </div>

                          {/* Lesson content */}
                          <div className="flex-1 min-w-0 dark:hover:bg-gray-750">
                            <h3 className={`font-medium text-sm truncate
                              ${isActive
                                ? 'text-indigo-700 dark:text-indigo-300'
                                : 'text-gray-700 dark:text-gray-300'
                              }
                            `}>
                              {lesson?.title}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {lesson?.lessontype?.id === 1 && (
                                <>
                                  <FiClock className="mr-1" />
                                  <span>{convertSecondsToYMDHMS(lesson?.lessonVideo?.duration)}</span>
                                </>
                              )}
                              {lesson?.lessontype?.id === 2 && <span>Bài tập</span>}
                              {lesson?.lessontype?.id === 3 && <span>Câu hỏi</span>}
                              {lesson?.lessontype?.id === 4 && <span>Ghi chú</span>}
                            </div>
                          </div>

                          {/* Completion status */}
                          {isCompleted ? (
                            <motion.div
                              className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center"
                              whileHover={{ scale: 1.2 }}
                            >
                              <FaCircleCheck className="text-emerald-500 dark:text-emerald-400 text-sm" />
                            </motion.div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                              <FiLock className="text-gray-400 dark:text-gray-500 text-xs" />
                            </div>
                          )}

                          {/* Hover indicator */}
                          {hoveredLesson === lesson?.id && !isActive && (
                            <motion.div
                              className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 dark:bg-indigo-400"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(SideBar);
