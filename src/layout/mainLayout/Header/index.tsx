'use client';
import ModalAuth from '@/components/client/Header/ModalAuth';
import ModalUser from '@/components/client/Header/ModalUser';
import Search from '@/components/client/Header/Search';
import { useAppSelector } from '@/redux/hook/hook';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
const Header = () => {
  const user = useAppSelector(state => state.auth.user);
  const router = useRouter();
  const ref = React.createRef<any>();
  const handleRedirectHome = () => {
    ref.current.continuousStart();
    router.push('/');
    ref.current.complete();
  };
  return (
    <header>
      <LoadingBar color="#0066df" ref={ref} />
      <div className="px-[2.8rem] z-50 fixed top-0 left-0 right-0 h-[6.6rem] border border-bottom-[0.1rem] bg-[#fff] flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-6">
            <div onClick={handleRedirectHome}>
              <img
                src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                alt=""
                className="w-[3.8rem] rounded-xl"
              />
            </div>
          </div>
          <div className="font-bold text-[1.4rem] hidden lg:block">
            Học Lập Trình Để Đi Làm
            {/* <div className="flex cursor-pointer mr-2 font-medium text-[#777d82] text-[1.2rem] items-center">
              <FiChevronLeft className="text-[1.5rem]" />
              QUAY LẠI
            </div> */}
          </div>
        </div>
        <Search />
        {!user ? <ModalAuth /> : <ModalUser data={user} />}
      </div>
    </header>
  );
};

export default Header;
