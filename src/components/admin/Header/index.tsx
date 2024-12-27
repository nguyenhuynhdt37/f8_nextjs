import React from 'react';

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
              src="https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg"
              alt=""
            />
          </div>
        </span>
      </div>
    </nav>
  );
};

export default Header;
