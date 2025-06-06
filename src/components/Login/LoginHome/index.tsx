import React, { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';

const LoginHome = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const handleLoginGoogle = () => {
    const googleAuthURL =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!)}&` +
      `response_type=code&` +
      `scope=openid%20email%20profile`;

    window.location.href = googleAuthURL;
  };

  const handleLoginGithub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=user:email`;

    window.location.href = githubAuthUrl;
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="space-y-3">
      <motion.button
        onClick={handleLoginGoogle}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="relative w-full bg-white py-3 px-4 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="absolute left-4 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="evenodd">
              <path d="m17.64 9.2a10.341 10.341 0 0 0 -.164-1.841h-8.476v3.481h4.844a4.14 4.14 0 0 1 -1.8 2.716v2.264h2.909a8.777 8.777 0 0 0 2.687-6.62z" fill="#4285f4" />
              <path d="m9 18a8.592 8.592 0 0 0 5.956-2.18l-2.909-2.258a5.43 5.43 0 0 1 -8.083-2.852h-3.007v2.332a9 9 0 0 0 8.043 4.958z" fill="#34a853" />
              <path d="m3.964 10.71a5.321 5.321 0 0 1 0-3.42v-2.332h-3.007a9.011 9.011 0 0 0 0 8.084z" fill="#fbbc05" />
              <path d="m9 3.58a4.862 4.862 0 0 1 3.44 1.346l2.581-2.581a8.649 8.649 0 0 0 -6.021-2.345 9 9 0 0 0 -8.043 4.958l3.007 2.332a5.364 5.364 0 0 1 5.036-3.71z" fill="#ea4335" />
            </g>
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700">Đăng nhập với Google</span>
      </motion.button>

      <motion.button
        onClick={handleLoginGithub}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="relative w-full bg-white py-3 px-4 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="absolute left-4 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.476 0 0 4.477 0 10c0 4.418 2.865 8.166 6.84 9.49.5.09.68-.218.68-.483 0-.237-.007-.866-.012-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.157-1.11-1.464-1.11-1.464-.907-.62.07-.608.07-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.342 1.087 2.912.83.09-.645.35-1.085.634-1.335-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.683-.105-.253-.448-1.27.096-2.647 0 0 .84-.268 2.75 1.026A9.555 9.555 0 0110 4.836a9.59 9.59 0 012.504.337c1.91-1.294 2.747-1.026 2.747-1.026.548 1.377.204 2.394.1 2.647.64.7 1.03 1.592 1.03 2.683 0 3.842-2.34 4.687-4.566 4.935.36.308.678.92.678 1.852 0 1.336-.01 2.415-.01 2.743 0 .267.18.578.687.48A10 10 0 0020 10c0-5.522-4.478-10-10-10" fill="#191717" fillRule="evenodd"></path>
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700">Đăng nhập với Github</span>
      </motion.button>

      <motion.button
        onClick={() => setStep(1)}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="relative w-full bg-white py-3 px-4 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="absolute left-4 flex items-center justify-center text-gray-500">
          <FiMail size={18} />
        </div>
        <span className="text-sm font-medium text-gray-700">Sử dụng email / số điện thoại</span>
      </motion.button>

      <div className="pt-4">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 absolute w-full"></div>
          <span className="bg-white px-4 text-xs text-gray-500 relative">hoặc</span>
        </div>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all"
        >
          Tạo tài khoản mới
        </motion.button>
      </div>
    </div>
  );
};

export default LoginHome;
