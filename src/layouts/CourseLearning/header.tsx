import Progressbar from "@/components/learning/header/Progressbar";
import { FaChevronLeft } from "react-icons/fa6";

const Header = () => {
  return (
    <header>
      <div className="flex fixed top-0 left-0 right-0 h-[5rem] bg-[#29303b] items-center justify-between">
        <div className="flex text-[#fff] items-center">
          <button className="px-4 mx-5 py-5">
            <FaChevronLeft className="text-[1.6rem]" />
          </button>
          <img
            className="w-[3rem] rounded-xl mr-10 hidden md:block"
            src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
            alt=""
          />
          <div className="font-bold text-[1.4rem]">
            Lập trình JavaScipt Cơ bản
          </div>
        </div>
        <Progressbar />
      </div>
    </header>
  );
};

export default Header;
