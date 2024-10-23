import ModalAuth from "@/components/Header/ModalAuth";
import ModalUser from "@/components/Header/ModalUser";
import Search from "@/components/Header/Search";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
const Header = () => {
  return (
    <header>
      <div className="px-[2.8rem] z-50 fixed top-0 left-0 right-0 h-[6.6rem] border border-bottom-[0.1rem] bg-[#fff] flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-6">
            <Link href={"/"}>
              <img
                src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                alt=""
                className="w-[3.8rem] rounded-xl"
              />
            </Link>
          </div>
          <div className="font-bold text-[1.4rem] hidden lg:block">
            {/* Học Lập Trình Để Đi Làm */}
            <div className="flex cursor-pointer mr-2 font-medium text-[#777d82] text-[1.2rem] items-center">
              <FiChevronLeft className="text-[1.5rem]" />
              QUAY LẠI
            </div>
          </div>
        </div>
        <Search />
        <ModalAuth />
        {/* <ModalUser /> */}
      </div>
    </header>
  );
};

export default Header;
