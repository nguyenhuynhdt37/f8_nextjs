'use client';
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaNoteSticky } from 'react-icons/fa6';
const App = ({ progress }: any) => {
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    var percentage = Math.round(
      (progress?.userCompleteLessonCount / progress?.countLesson) * 100,
    );
    setPercentage(percentage);
  }, [progress]);
  return (
    <div className="flex text-[#fff] text-[1.2rem] px-10 items-center">
      <div className="w-[3.5rem] h-[3.5rem] mr-5">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: '#c65e5e', // Màu đường cong (progress)
            textColor: '#fff', // Màu văn bản
            trailColor: '#fff', // Màu đường nền (phần chưa progress)
            backgroundColor: '#c65e5e', // Màu nền (nếu có background)
            textSize: '2.8rem', // Kích thước chữ
          })}
        />
      </div>
      <div className="text-[#fff]">
        Đã hoàn thành
        <span className="mx-2 text-[#c65e5e]">
          {progress?.userCompleteLessonCount}/{progress?.countLesson}
        </span>
        bài học
      </div>
    </div>
  );
};

export default App;
