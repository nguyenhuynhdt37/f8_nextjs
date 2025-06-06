import LoginHome from '@/components/Login/LoginHome';
import LoginWithEmail from '@/components/Login/LoginWithEmail';
import SentEmail from '@/components/Login/SentEmail';
import { Modal } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Lexend } from '@next/font/google';

const lexend = Lexend({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
});

const Login = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [step, setStep] = useState<number>(0);

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={500}
      centered
      className="auth-modal"
      maskStyle={{ backdropFilter: 'blur(5px)', background: 'rgba(0, 0, 0, 0.4)' }}
      style={{ borderRadius: '16px', overflow: 'hidden' }}
    >
      <div className={`${lexend.className} relative overflow-hidden`}>
        {/* Background gradient elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-400/30 to-emerald-500/30 blur-xl"></div>

        {/* Header with back button */}
        <div className="relative h-16 flex items-center">
          {step !== 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors absolute left-0"
              onClick={() => setStep(prev => prev - 1)}
            >
              <FiChevronLeft className="text-2xl" />
              <span className="text-sm font-medium">Quay lại</span>
            </motion.button>
          )}
        </div>

        {/* Content area */}
        <div className="px-6 pb-8">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">F8</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-md flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </motion.div>
          </div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-center text-gray-800 mb-2"
          >
            Đăng nhập vào F8
          </motion.h1>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-center text-red-500 mb-6"
          >
            Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung sẽ bị khóa.
          </motion.p>

          {/* Content steps with animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {step === 0 && <LoginHome setStep={setStep} />}
              {step === 1 && <LoginWithEmail setOpen={setOpen} setStep={setStep} />}
              {step === 2 && <SentEmail setStep={setStep} />}
            </motion.div>
          </AnimatePresence>

          {/* Footer links */}
          <div className="mt-8 text-center">
            <div className="flex justify-center items-center space-x-1 text-sm">
              <span className="text-gray-600">Bạn chưa có tài khoản?</span>
              <button className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Đăng ký
              </button>
            </div>

            <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Quên mật khẩu?
            </button>

            <p className="mt-5 text-xs text-gray-500">
              Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với
              <a href="#" className="mx-1 text-blue-600 hover:underline">
                điều khoản sử dụng
              </a>
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Login;
