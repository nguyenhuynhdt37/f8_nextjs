import ModalAuth from "@/components/Header/ModalAuth";
import ModalUser from "@/components/Header/ModalUser";
import Search from "@/components/Header/Search";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="px-[2.8rem] h-[6.6rem] border border-bottom-[0.1rem] bg-[#fff] flex items-center justify-between">
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
            Học Lập Trình Để Đi Làm
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
