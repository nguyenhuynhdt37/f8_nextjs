"use client";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaNoteSticky } from "react-icons/fa6";
const App = () => {
  const percentage = 75;

  return (
    <div className="flex text-[#fff] text-[1.2rem] px-10 items-center">
      <div className="w-[3.5rem] h-[3.5rem] mr-5">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
            textColor: "#fff",
            trailColor: "#d6d6d6",
            backgroundColor: "#3498db",
            textSize: "2.5rem",
          })}
        />
      </div>
      <button className="text-[#64a8cb] hidden md:block">Xem chứng chỉ</button>
      <button className="ps-8">
        <FaNoteSticky className="text-3xl" />
      </button>
    </div>
  );
};

export default App;
