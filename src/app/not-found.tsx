import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const ErrorPage = () => {
  return (
    <div className="h-[100vh]">
      <Link href={'/'}>
        <div className="flex fixed cursor-pointer text-2xl font-bold items-center p-10">
          <img
            src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
            alt=""
            className="w-16 rounded-xl mr-5"
          />
          Học lập trình để đi làm
        </div>
      </Link>
      <div className="w-full h-full flex items-center  justify-center top-0 bottom-0 right-0 left-0">
        <div>
          <div className="text-center font-extrabold text-[#ff6f70] text-[15rem]">
            404
          </div>
          <div className="text-[5rem] font-bold">
            Không tìm thấy nội dung 🥲
          </div>
          <div className="text-center pt-8 text-[1.4rem] font-medium pb-10">
            <div className="text-clip">
              URL của nội dung này đã bị thay đổi hoặc không còn tồn tại.
            </div>
            <div className="py-2">
              Nếu bạn đang lưu URL này, hãy thử truy cập lại từ trang chủ thay
              vì dùng URL đã lưu.
            </div>
            <div className="text-center pt-10">
              <Link href={'/'}>
                <button className="text-[1.7rem] py-2 px-10 text-[#fff] rounded-full bg-[#0093fc]">
                  Về trang chủ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
