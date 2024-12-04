"use client";
import Progressbar from "@/components/client/learning/header/Progressbar";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import LoadingBar from "react-top-loading-bar";
const Header = ({ data }: { data: any }) => {
  const router = useRouter();
  const ref = useRef<any>(null);
  const handleGoBack = () => {
    ref.current.continuousStart();
    router.back();
  };
  const handleBackHome = () => {
    router.push("/");
  };
  return (
    <header>
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex fixed top-0 left-0 right-0 h-[5rem] bg-[#29303b] items-center justify-between">
        <div className="flex text-[#fff] items-center">
          <button className="px-4 mx-5 py-5" onClick={handleGoBack}>
            <FaChevronLeft className="text-[1.6rem]" />
          </button>
          <div onClick={handleBackHome}>
            <img
              className="w-[3rem] rounded-xl mr-10 hidden md:block"
              src="/logo/logo1.png"
              alt=""
            />
          </div>
          <div className="font-bold text-[1.4rem]">{data?.title}</div>
        </div>
        <Progressbar />
      </div>
    </header>
  );
};

export default Header;
