'use client';
import { useTheme } from '@/context/ThemeContext';
import React, { memo, useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiCheckCircle, FiBook } from 'react-icons/fi';

const Progressbar = ({ progress }: any) => {
  const [percentage, setPercentage] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { theme } = useTheme();
  console.log(theme);

  useEffect(() => {
    const percentage = Math.round(
      (progress?.userCompleteLessonCount / progress?.countLesson) * 100,
    ) || 0;
    setPercentage(percentage);
  }, [progress]);

  // Xác định màu dựa trên tiến độ
  const getProgressColor = () => {
    if (percentage >= 80) return '#10B981'; // Xanh lá - hoàn thành tốt
    if (percentage >= 50) return '#6366F1'; // Tím - đang tiến triển
    if (percentage >= 20) return '#F59E0B'; // Cam - mới bắt đầu
    return '#EF4444'; // Đỏ - chưa làm nhiều
  };

  const color = getProgressColor();

  // Xác định thông điệp dựa trên tiến độ
  const getProgressMessage = () => {
    if (percentage === 100) return "Chúc mừng! Bạn đã hoàn thành khóa học!";
    if (percentage >= 80) return "Tuyệt vời! Bạn sắp hoàn thành rồi!";
    if (percentage >= 50) return "Bạn đang tiến bộ rất tốt!";
    if (percentage >= 20) return "Hãy tiếp tục cố gắng nhé!";
    return "Hãy bắt đầu hành trình học tập!";
  };

  return (
    <div className="flex items-center">
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Main progress circle */}
        <div className="relative w-10 h-10">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            strokeWidth={12}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: 'round',
              textSize: '24px',
              pathTransitionDuration: 0.8,
              pathColor: color,
              textColor: isHovered ? color : theme === 'dark' ? '#ffffff' : '#374151',
              trailColor: 'var(--color-bg-secondary, #E5E7EB)',
            })}
          />

          {/* Center icon for completed courses */}
          {percentage === 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FiCheckCircle className="text-green-500 dark:text-green-400 text-xl" />
            </div>
          )}
        </div>

        {/* Detailed progress popup */}
        {showDetails && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
            <div className="text-center mb-3">
              <p className="font-medium text-gray-700 dark:text-gray-300">{getProgressMessage()}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Bài học đã hoàn thành</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{progress?.userCompleteLessonCount || 0}/{progress?.countLesson || 0}</span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(false);
                }}
                className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="ml-3 hidden sm:block">
        <div className="flex items-center">
          <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            Tiến độ học tập
          </div>
          <div className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-xs font-semibold rounded-md">
            {progress?.userCompleteLessonCount || 0}/{progress?.countLesson || 0}
          </div>
        </div>

        <div className="mt-1 relative h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Mobile version - only shows percentage */}
      <div className="ml-2 sm:hidden">
        <div className="flex items-center">
          <FiBook className="text-indigo-500 dark:text-indigo-400 mr-1" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {progress?.userCompleteLessonCount || 0}/{progress?.countLesson || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Progressbar);
