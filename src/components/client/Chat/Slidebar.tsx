import React from 'react';

const Slidebar = () => {
  return (
    <div className="pt-[5rem] flex flex-col text-[1.4rem] h-full border-r-[0.2rem]">
      <div className="flex h-[6.614rem] sticky border-[0.1rem] top-[5rem] bg-[#fff] z-10 items-center p-5">
        <img
          className="w-16 h-16 object-cover border-2 border-[#ceae30] mr-5 rounded-full"
          src="https://i.pinimg.com/originals/c9/22/3f/c9223f86147db5129229a2866d540ea4.jpg"
          alt=""
        />
        <input
          type="text"
          placeholder="Search"
          className="px-5 py-3 flex-1 placeholder:font-light rounded-full bg-[#ebebeb] focus:outline-none"
        />
      </div>
      <div className="overflow-y-scroll py-3 pl-3 scrollbar-custom flex-1 w-full">
        <div className="p-5 flex rounded-xl items-center hover:bg-[#f6f6f6] cursor-pointer">
          <div className="">
            <img
              className="w-16 h-16 object-cover border-2 border-[#ceae30] mr-5 rounded-full"
              src="https://i.pinimg.com/originals/c9/22/3f/c9223f86147db5129229a2866d540ea4.jpg"
              alt=""
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="font-medium">Nguyễn Xuân Huỳnh</div>
              <div className="font-light text-[#ccc]">6/12/2024</div>
            </div>
            <div className="text-[#666] pt-2 overflow-x-auto text-ellipsis whitespace-nowrap">
              Xin chào bạn tôi là hướng dẫn viên du lịch việt nam
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slidebar;
