'use client';
import { logoutApi } from '@/api/axios/api';
import { useAppDispatch } from '@/redux/hook/hook';
import { getInfoRedux } from '@/redux/reducers/slices/AuthSlice';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppDispatch } from '@/redux/store';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface CheckIsLoginProps {
  cookie: ReadonlyRequestCookies;
}

const CheckIsLogin = ({ cookie }: CheckIsLoginProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!cookie) {
      return;
    } else {
      // @ts-ignore
      dispatch(getInfoRedux())
        .unwrap()
        .then((data: any) => { })
        .catch(() => { });
    }
  }, [cookie]);

  const [messageApi, contextHolder] = message.useMessage();
  return <>{contextHolder}</>;
};

export default CheckIsLogin;
