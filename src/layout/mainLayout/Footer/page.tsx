'use client';

import { FaFacebook, FaGithub } from 'react-icons/fa';
import { BsYoutube } from 'react-icons/bs';
import { FaTiktok, FaDiscord } from 'react-icons/fa6';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const FooterLink = ({ children, href = "#", className = "" }) => (
  <li className={`leading-7 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200 ${className}`}>
    <a href={href}>{children}</a>
  </li>
);

const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-sm pt-14 pb-10 px-6 md:px-12 lg:px-16 text-gray-700 dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center text-base font-semibold">
            <img
              src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
              alt="F8 Logo"
              className="rounded-md mr-3 w-10"
            />
            Học Lập Trình Để Đi Làm
          </div>
          <div className="text-gray-600 dark:text-gray-400 pt-5 text-sm">
            <span className="font-medium">Điện thoại:</span>
            <a className="ml-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" href="tel:365043804">
              0365 043 804
            </a>
          </div>
          <div className="text-gray-400 pt-2 text-sm">
            <span className="font-medium">Email:</span>
            <a className="ml-1" href="mailto:nguyenhuynhdt37@gmail.com">
              nguyenhuynhdt37@gmail.com
            </a>
          </div>
          <div className="text-gray-400 pt-2 text-sm">
            <b className="font-medium">Địa chỉ</b>: Số 1, ngõ 41, Trần Duy Hưng,
            Cầu Giấy, Hà Nội
          </div>
          <div>
            <a
              href="https://www.dmca.com/Protection/Status.aspx?id=1b325c69-aeb7-4e32-8784-a0009613323a&amp;refurl=https%3a%2f%2ffullstack.edu.vn%2f&amp;rlo=true"
              target="_blank"
              rel="noreferrer"
              title="DMCA Protected"
            >
              <img
                className="mt-5"
                src="data:image/png;base64,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"
                alt="DMCA"
              />
            </a>
          </div>
        </div>
        <div className="">
          <div className="py-1 font-semibold text-base">Về F8</div>
          <ul className="p-0 m-0 pt-4 text-gray-400">
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Giới thiệu
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">Liên hệ</li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Điều khoản
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">Bảo mật</li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Cơ hội việc làm
            </li>
          </ul>
        </div>
        <div className="">
          <div className="py-1 font-semibold text-base">Sản phẩm</div>
          <ul className="p-0 m-0 pt-4 text-gray-400">
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Game Nester
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Game CSS Diner
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Game Froggy Pro
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Game CSS Selectors
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Game Froggy
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Game Scoops
            </li>
          </ul>
        </div>
        <div className="">
          <div className="py-1 font-semibold text-base">Công cụ</div>
          <ul className="p-0 m-0 pt-4 text-gray-400">
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Tạo CV xin việc
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Rút gọn liên kết
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Clip-path maker
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Snippet generator
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              CSS Grid generator
            </li>
            <li className="leading-7 hover:text-gray-300 cursor-pointer">
              Cảnh báo sờ tay lên mặt
            </li>
          </ul>
        </div>
        <div className="col-span-2">
          <div className="py-1 font-semibold text-base">
            CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC F8
          </div>
          <ul className="p-0 m-0 pt-4 text-gray-400">
            <li className="leading-7">
              <span className="font-medium">Mã số thuế:</span>
              <a className="ml-1" href="tel:365043804">
                0109922901
              </a>
            </li>
            <li className="leading-7">
              <span className="font-medium">Ngày thành lập:</span>
              <a className="ml-1" href="tel:365043804">
                04/03/2022
              </a>
            </li>
            <li className="leading-7">
              <span className="font-medium">Lĩnh vực hoạt động:</span>
              <a className="ml-1 block text-sm mt-1" href="tel:365043804">
                Giáo dục, công nghệ - lập trình. Chúng tôi tập trung xây dựng và
                phát triển các sản phẩm mang lại giá trị cho cộng đồng lập trình
                viên Việt Nam.
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between pt-12 text-gray-400 text-sm">
        <div className="">
          © 2018 - 2024 F8. Nền tảng học lập trình hàng đầu Việt Nam
        </div>
        <div className="flex items-center mt-3 md:mt-0">
          <FaFacebook className="text-xl text-blue-600 mr-4" />
          <BsYoutube className="mr-4 text-xl text-red-500" />
          {/* <FaApplePay className="text-xl text-white" /> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
