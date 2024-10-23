"use client";

import Login from "@/components/common/Login";
import { useAppSelector } from "@/redux/hook/hook";
import { useState } from "react";

const ButtonRegiterStudy = () => {
  const { accessToken } = useAppSelector((p) => p.auth);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const handleSubmit = () => {
    if (!accessToken) {
      setIsLoginOpen(true);
      return;
    } else {
      alert();
    }
  };
  return (
    <div className="px-5 py-5">
      <button
        onClick={handleSubmit}
        className="w-full bg-[#0093fc] py-3 text-[1.4rem] rounded-3xl text-[#fff]"
      >
        Đăng ký học
      </button>
      <Login open={isLoginOpen} setOpen={setIsLoginOpen} />
    </div>
  );
};

export default ButtonRegiterStudy;
