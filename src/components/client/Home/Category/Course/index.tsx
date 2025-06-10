import React, { useRef } from 'react';
import { PiFinnTheHumanFill } from 'react-icons/pi';
import { FaPlayCircle, FaFire } from 'react-icons/fa';
import { MdAccessTimeFilled } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import { message } from 'antd';
import { motion } from 'framer-motion';
import { convertSecondsToYMDHM, formatCurrency2 } from '@/Utils/functions';
import { generateSlug } from '@/Utils/functions/slugify';

const Course = ({ data }: any) => {
  const router = useRouter();
  const refLoading = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const isPaidCourse = !data?.course?.details?.isFree;

  const handleClick = () => {
    refLoading.current.continuousStart();
    const courseId = data?.course?.id;
    const courseTitle = data?.course?.title;

    // Generate SEO-friendly URL with slug if title is available
    if (courseId && courseTitle) {
      const slug = generateSlug(courseTitle, courseId);
      router.push(`/courses/${slug}`);
    } else {
      // Fallback to ID-only URL
      router.push(`/courses/${courseId}`);
    }
  };

  return (
    <>
      {contextHolder}
      <LoadingBar color="#0ea5e9" ref={refLoading} />
      <div
        onClick={handleClick}
        className="h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
      >
        {/* Course Image */}
        <div className="relative overflow-hidden h-40">
          <img
            src={data?.course?.banner}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={data?.course?.title}
          />

          {/* Window Controls Overlay - Computer UI Style */}
          <div className="absolute top-0 left-0 right-0 bg-gray-800/70 h-6 flex items-center px-2">
            <div className="flex items-center space-x-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
            >
              <FaPlayCircle className="text-white text-3xl" />
            </motion.div>
          </div>

          {/* Price tag */}
          {isPaidCourse ? (
            <div className="absolute top-8 right-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold py-1 px-2 rounded shadow-lg">
                {formatCurrency2(data?.course?.details?.price || 0)}
              </div>
            </div>
          ) : (
            <div className="absolute top-8 right-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-1 px-2 rounded shadow-lg">
                Miễn phí
              </div>
            </div>
          )}

          {/* Hot badge */}
          {isPaidCourse && (
            <div className="absolute top-8 left-2">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold py-1 px-2 rounded shadow-lg flex items-center"
              >
                <FaFire className="mr-1 text-yellow-300" />
                <span>HOT</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-4">
          <h3 className="font-medium dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {data?.course?.title}
          </h3>

          {/* Course stats */}
          <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-2 gap-x-3 gap-y-1">
            <div className="flex items-center">
              <PiFinnTheHumanFill className="mr-1 text-blue-500" />
              <span>{data?.course?.userCourseCounts} học viên</span>
            </div>
            <div className="flex items-center">
              <FaPlayCircle className="mr-1 text-blue-500" />
              <span>{data?.course?.lessonCount} bài học</span>
            </div>
            <div className="flex items-center">
              <MdAccessTimeFilled className="mr-1 text-blue-500" />
              <span>{convertSecondsToYMDHM(data?.course?.totalDuration)}</span>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-3">
            <button className="w-full py-1.5 px-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-medium hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all flex items-center justify-center">
              <span className="mr-1">Xem khóa học</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Course;
