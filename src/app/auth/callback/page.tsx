'use client';
import { useEffect } from 'react';
import { googleAuthAsync, login } from '@/api/api';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hook/hook';
import { getInfoRedux } from '@/redux/reducers/slices/AuthSlice';

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleGoogleAuth = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (!code) return;
      console.log('code', code);

      const res = await googleAuthAsync(code);
      dispatch(getInfoRedux());
      router.push('/');
    };

    handleGoogleAuth();
  }, []);

  return <p>Logging in...</p>;
}
