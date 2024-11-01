"use client";
import Progressbar from "@/components/client/learning/header/Progressbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa6";

const Header = ({ data }: { data: any }) => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <header>
      <div className="flex fixed top-0 left-0 right-0 h-[5rem] bg-[#29303b] items-center justify-between">
        <div className="flex text-[#fff] items-center">
          <button className="px-4 mx-5 py-5" onClick={handleGoBack}>
            <FaChevronLeft className="text-[1.6rem]" />
          </button>
          <Link href={"/"}>
            <img
              className="w-[3rem] rounded-xl mr-10 hidden md:block"
              src="/logo/logo1.png"
              alt=""
            />
          </Link>
          <div className="font-bold text-[1.4rem]">{data?.title}</div>
        </div>
        <Progressbar />
      </div>
    </header>
  );
};

export default Header;
