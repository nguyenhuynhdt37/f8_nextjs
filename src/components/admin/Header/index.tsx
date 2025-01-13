'use client';

import { useAppSelector } from '@/redux/hook/hook';
import { useRouter } from 'next/navigation';
import { createRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

const Header = () => {
  const ref = createRef<any>();
  const user = useAppSelector(state => state.auth.user?.user);
  const router = useRouter();
  const handleRedirectHome = () => {
    ref.current.continuousStart();
    router.push('/');
  };
  return (
    <>
      <LoadingBar color="#0066df" ref={ref} />
      <nav className="h-[7rem] text-[1.4rem] fixed w-[83.25vw] border-b-[0.1rem] z-50 bg-[#fefcfb]">
        <div className="w-full h-full flex justify-between items-center px-10">
          <span className="flex items-center right-[30rem] cursor-pointer">
            <div className="mr-4 text-[1.4rem] font-medium">
              <span className="mr-2 text-[#dd9b7b]">Chào quản trị viên!</span>
              {user?.fullName}
            </div>
            <div className="p-[0.1rem] inline-flex bg-[#e1b199] rounded-full">
              <img
                className="w-12 rounded-full"
                src={
                  user?.avatar ||
                  'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'
                }
                alt=""
              />
            </div>
          </span>
          <button
            onClick={handleRedirectHome}
            className="px-5 py-3 text-[#fff] rounded-xl bg-[#3084d6]"
          >
            Quay Về trang chủ
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
