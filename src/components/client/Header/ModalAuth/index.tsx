'use client';
import Login from '@/components/client/Login';
import { useEffect, useState } from 'react';
import { IoLogInOutline } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';

const ModalAuth = () => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          className="hidden md:flex items-center px-4 py-1.5 text-indigo-100 hover:text-white rounded-full border border-indigo-300/30 hover:border-indigo-300/50 transition-all hover:bg-indigo-700/30"
          onClick={() => setOpenLogin(true)}
        >
          <IoLogInOutline className="mr-1.5 text-lg" />
          <span className="text-sm font-medium">Đăng nhập</span>
        </button>

        <button
          className="flex items-center px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105"
        >
          <FaUserPlus className="mr-1.5" />
          <span className="text-sm font-medium">Đăng Ký</span>
        </button>

        {/* Mobile login button */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 text-indigo-100 hover:text-white rounded-full border border-indigo-300/30 hover:border-indigo-300/50 transition-all hover:bg-indigo-700/30"
          onClick={() => setOpenLogin(true)}
        >
          <IoLogInOutline className="text-lg" />
        </button>
      </div>

      <Login open={openLogin} setOpen={setOpenLogin} />
    </>
  );
};

export default ModalAuth;
