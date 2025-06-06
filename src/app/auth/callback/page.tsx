import type { Metadata } from 'next';
import GoogleCallbackClient from '@/components/client/auth/GoogleCallbackClient';

export const metadata: Metadata = {
  title: 'Xác thực Google - F8',
  description: 'Đang xác thực đăng nhập với Google',
};

export default function GoogleCallbackPage() {
  return <GoogleCallbackClient />;
}
