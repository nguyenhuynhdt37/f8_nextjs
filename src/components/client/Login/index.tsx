import LoginHome from '@/components/Login/LoginHome';
import LoginWithEmail from '@/components/Login/LoginWithEmail';
import SentEmail from '@/components/Login/SentEmail';
import { Modal } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { Lexend } from '@next/font/google';
const lexend = Lexend({
  weight: ['400', '100', '200', '300', '500', '600', '700'], // Thêm các trọng số bạn cần
  subsets: ['latin', 'vietnamese'], // Thêm subset "vietnamese" nếu cần
});
const Login = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [step, setStep] = useState<number>(0);
  return (
    <Modal
      loading={false}
      footer={null}
      open={open}
      onCancel={() => setOpen(false)}
      className="custom-modal"
    >
      <div className={lexend.className}>
        <div className="h-[7rem] ">
          {step !== 0 && (
            <button
              className="flex items-center text-2xl relative top-5 left-0"
              onClick={() => setStep(prev => prev - 1)}
            >
              <FiChevronLeft className="text-[2.5rem]" />
              Quay lại
            </button>
          )}
        </div>
        <div className="text-center px-[4rem] pb-10">
          <div className=" flex justify-center">
            <img
              src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
              alt=""
              className="w-[3.8rem] rounded-xl"
            />
          </div>
          <h1 className="font-bold text-[2.8rem] pt-7 pb-4">
            Đăng nhập vào F8
          </h1>
          <p className="text-[#f33a58] pb-4 ">
            Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử
            dụng chung sẽ bị khóa.
          </p>
          {step === 0 && <LoginHome setStep={setStep} />}
          {step === 1 && <LoginWithEmail setOpen={setOpen} setStep={setStep} />}
          {step === 2 && <SentEmail setStep={setStep} />}
          <div className="flex justify-center pt-7 font-medium">
            <div className="mr-2">Bạn chưa có tài khoản?</div>
            <div className="cursor-pointer text-[#f05a30] underline">
              Đăng ký
            </div>
          </div>
          <div className="pt-5 font-medium cursor-pointer text-[#f05a30] underline">
            Quên mật khẩu?
          </div>
          <div className="pt-5 text-[1.1rem]">
            Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với
            <a href="" target="_blank" className="mx-1 underline">
              điều khoản sử dụng
            </a>
            của chúng tôi.
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Login;
