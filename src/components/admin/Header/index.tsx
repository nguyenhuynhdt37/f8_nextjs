import React from "react";

const Header = () => {
  return (
    <nav className="h-[7rem] fixed w-full border-b-[0.1rem] z-50 bg-[#fefcfb]">
      <div className="relative w-full h-full">
        <span className="absolute -translate-y-1/2 top-1/2 flex items-center right-[30rem] cursor-pointer">
          <div className="mr-4 text-[1.4rem] font-medium">
            <span className="mr-2 text-[#dd9b7b]">Hi!</span>Nguyễn Xuân Huỳnh
          </div>
          <div className="p-[0.1rem] inline-flex bg-[#e1b199] rounded-full">
            <img
              className="w-14 rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD3UIdzHGPJCrzSQnmHJpla9wMzEQONgAxbcDlXYQBlYk5VYt5sxBdj-_JvzTdk-pARe4&usqp=CAU"
              alt=""
            />
          </div>
        </span>
      </div>
    </nav>
  );
};

export default Header;
