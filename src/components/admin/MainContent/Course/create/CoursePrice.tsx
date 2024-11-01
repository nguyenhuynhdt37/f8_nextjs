import React, { useState } from "react";

const CoursePrice = () => {
  const [isChoise, setIsChoise] = useState<number>(1);
  return (
    <div className="mt-10 relative ps-4 ">
      <div className="p-10 bg-[#fff] rounded-lg shadow-lg">
        <div className="text-[1.6rem] font-medium">Giá cả</div>
        <div className="flex mt-10">
          <div
            onClick={() => setIsChoise(1)}
            className="mr-10 cursor-pointer text-[1.4rem]"
          >
            <input
              type="radio"
              className="mr-5 cursor-pointer"
              checked={isChoise === 1}
            />
            Miễn phí
          </div>
          <div
            className=" cursor-pointer text-[1.4rem]"
            onClick={() => setIsChoise(2)}
          >
            <input
              type="radio"
              className="mr-5 cursor-pointer"
              checked={isChoise === 2}
            />
            Trả phí
          </div>
        </div>
        {isChoise === 2 && (
          <>
            <div className="text-[1.6rem] font-medium">Giá</div>
            <input
              type="text"
              className="w-full mt-10 rounded-xl placeholder-[#908e8e] text-[1.4rem] py-4 px-10 border-[#edecec] border-2 focus:border-[#609fd6] text-[#000] focus:outline-none bg-[#fff]"
              placeholder="Giá tiền (VNĐ) ...."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CoursePrice;
