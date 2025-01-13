'use client';
import { logoutApi } from '@/api/api';
import { useAppDispatch } from '@/redux/hook/hook';
import { getInfoRedux } from '@/redux/reducers/slices/AuthSlice';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CheckIsLogin = ({ cookie }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (cookie?.length === 0) {
      return;
    } else {
      dispatch(getInfoRedux())
        .unwrap()
        .then((data: any) => {})
        .catch(() => {});
    }
  }, [cookie]);

  const [messageApi, contextHolder] = message.useMessage();
  return <>{contextHolder}</>;
};

export default CheckIsLogin;
