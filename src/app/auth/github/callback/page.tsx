'use client';
import { useEffect } from 'react';
import { githubAuthAsync, googleAuthAsync, login } from '@/api/api';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hook/hook';
import { getInfoRedux } from '@/redux/reducers/slices/AuthSlice';

export default function GithubCallback() {
  const router = useRouter();
  const dispatch: any = useAppDispatch();
  useEffect(() => {
    const handleGithubAuth = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (!code) return;
      console.log('code', code);

      const res = await githubAuthAsync(code);
      dispatch(getInfoRedux());
      router.push('/');
    };

    handleGithubAuth();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src="https://i.pinimg.com/originals/07/44/76/074476209bb41a39913981195e17e363.gif"
        alt=""
      />
    </div>
  );
}
