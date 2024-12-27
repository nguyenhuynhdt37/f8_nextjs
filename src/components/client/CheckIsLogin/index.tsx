'use client';
import { logoutApi } from '@/api/api';
import { useAppDispatch } from '@/redux/hook/hook';
import { getInfoRedux } from '@/redux/reducers/slices/AuthSlice';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

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
        .catch(() => {
          logoutApi();
          Swal.fire({
            icon: 'info',
            title: 'Thông tin!',
            text: 'Hết phiên đăng nhập.',
            confirmButtonText: 'Đóng',
          });
          return;
        });
    }
  }, [cookie]);

  const [messageApi, contextHolder] = message.useMessage();
  return <>{contextHolder}</>;
};

export default CheckIsLogin;
