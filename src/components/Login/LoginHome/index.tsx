import GoogleAuth from '@/components/GoogleAuth';
import React, { Dispatch, SetStateAction } from 'react';

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
      `response_type=code&` + // Lấy Authorization Code
      `scope=openid%20email%20profile`;

    window.location.href = googleAuthURL;
  };
  const handleLoginGithub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=user:email`;

    window.location.href = githubAuthUrl;
  };
  return (
    <div className="flex justify-center flex-wrap">
      <button
        onClick={handleLoginGoogle}
        className="relative w-11/12 bg-[#fff] my-2 justify-center font-medium rounded-full border-2 hover:bg-[#dce0e3] flex items-center px-5 py-[0.8rem]"
      >
        <img
          src="data:image/svg+xml,%3csvg%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20transform=''%3e%3cg%20fill-rule='evenodd'%3e%3cpath%20d='m17.64%209.2a10.341%2010.341%200%200%200%20-.164-1.841h-8.476v3.481h4.844a4.14%204.14%200%200%201%20-1.8%202.716v2.264h2.909a8.777%208.777%200%200%200%202.687-6.62z'%20fill='%234285f4'/%3e%3cpath%20d='m9%2018a8.592%208.592%200%200%200%205.956-2.18l-2.909-2.258a5.43%205.43%200%200%201%20-8.083-2.852h-3.007v2.332a9%209%200%200%200%208.043%204.958z'%20fill='%2334a853'/%3e%3cpath%20d='m3.964%2010.71a5.321%205.321%200%200%201%200-3.42v-2.332h-3.007a9.011%209.011%200%200%200%200%208.084z'%20fill='%23fbbc05'/%3e%3cpath%20d='m9%203.58a4.862%204.862%200%200%201%203.44%201.346l2.581-2.581a8.649%208.649%200%200%200%20-6.021-2.345%209%209%200%200%200%20-8.043%204.958l3.007%202.332a5.364%205.364%200%200%201%205.036-3.71z'%20fill='%23ea4335'/%3e%3c/g%3e%3cpath%20d='m0%200h18v18h-18z'%20fill='none'/%3e%3c/g%3e%3c/svg%3e"
          alt=""
          className="absolute left-5 "
        />
        Đăng nhập với Google
      </button>
      <button
        onClick={handleLoginGithub}
        className="relative w-11/12 my-2 bg-[#fff] justify-center font-medium rounded-full border-2 hover:bg-[#dce0e3] flex items-center px-5 py-[0.8rem]"
      >
        <img
          src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10%200C4.476%200%200%204.477%200%2010c0%204.418%202.865%208.166%206.84%209.49.5.09.68-.218.68-.483%200-.237-.007-.866-.012-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.157-1.11-1.464-1.11-1.464-.907-.62.07-.608.07-.608%201.003.07%201.53%201.03%201.53%201.03.893%201.53%202.342%201.087%202.912.83.09-.645.35-1.085.634-1.335-2.22-.253-4.555-1.11-4.555-4.943%200-1.09.39-1.984%201.03-2.683-.105-.253-.448-1.27.096-2.647%200%200%20.84-.268%202.75%201.026A9.555%209.555%200%200110%204.836a9.59%209.59%200%20012.504.337c1.91-1.294%202.747-1.026%202.747-1.026.548%201.377.204%202.394.1%202.647.64.7%201.03%201.592%201.03%202.683%200%203.842-2.34%204.687-4.566%204.935.36.308.678.92.678%201.852%200%201.336-.01%202.415-.01%202.743%200%20.267.18.578.687.48A10%2010%200%200020%2010c0-5.522-4.478-10-10-10'%20fill='%23191717'%20fill-rule='evenodd'%3e%3c/path%3e%3c/svg%3e"
          alt=""
          className="absolute left-5 "
        />
        Đăng nhập với Github
      </button>
      <button
        onClick={() => setStep(1)}
        className="relative w-11/12 bg-[#fff]  my-2 justify-center font-medium rounded-full border-2 hover:bg-[#dce0e3] flex items-center px-5 py-[0.8rem]"
      >
        <img
          src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10%2011c-2.67%200-8%201.34-8%204v3h16v-3c0-2.66-5.33-4-8-4m0-9C7.79%202%206%203.79%206%206s1.79%204%204%204%204-1.79%204-4-1.79-4-4-4m0%2010.9c2.97%200%206.1%201.46%206.1%202.1v1.1H3.9V15c0-.64%203.13-2.1%206.1-2.1m0-9a2.1%202.1%200%20110%204.2%202.1%202.1%200%20010-4.2'%20fill-opacity='.54'%20fill-rule='evenodd'%3e%3c/path%3e%3c/svg%3e"
          alt=""
          className="absolute left-5 "
        />
        Sử dụng email / số điện thoại
      </button>
    </div>
  );
};

export default LoginHome;
