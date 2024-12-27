'use client';
import Login from '@/components/client/Login';
import { useEffect, useState } from 'react';

const ModalAuth = () => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  return (
    <>
      <div className="font-medium text-[1.4rem]">
        <button className="rounded-full px-7 py-3 text-[#000] mr-4">
          Đăng Ký
        </button>
        <button
          className="bg-[#ff6b1d] rounded-full px-7 py-3 text-[#fff] "
          onClick={() => setOpenLogin(true)}
        >
          Đăng nhập
        </button>
      </div>
      <Login open={openLogin} setOpen={setOpenLogin} />
    </>
  );
};

export default ModalAuth;
