"use client";
import Login from "@/components/common/Login";
import { useEffect, useState } from "react";

const ModalAuth = () => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  useEffect(() => {
    setOpenLogin(true);
  }, []);
  return (
    <>
      <div className="font-medium text-[1.4rem]">
        <button className="rounded-full px-7 py-3 text-[#000] mr-4">
          Đăng Ký
        </button>
        <button className="bg-[#ff6b1d] rounded-full px-7 py-3 text-[#fff] ">
          Đăng nhập
        </button>
      </div>
      <Login open={openLogin} setOpen={setOpenLogin} />
    </>
  );
};

export default ModalAuth;
