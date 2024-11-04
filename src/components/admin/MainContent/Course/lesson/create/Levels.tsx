import React from "react";

const Levels = ({ level, levelChoise, onChoiseCourse }: any) => {
  return (
    <div
      onClick={() => onChoiseCourse(level?.id)}
      className={`shadow-sm bg-[#fff] border-2 ${
        level?.id === levelChoise ? "border-[#adc1e8]" : "border-[#bfc3c9]"
      }  flex py-5 px-5 rounded-xl`}
    >
      <input
        type="radio"
        checked={level?.id === levelChoise}
        className="scale-150 mr-10"
      />
      {level?.name}
    </div>
  );
};

export default Levels;
