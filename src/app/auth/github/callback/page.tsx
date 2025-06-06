import type { Metadata } from 'next';
import GithubCallbackClient from '@/components/client/auth/GithubCallbackClient';

export const metadata: Metadata = {
  title: 'Xác thực GitHub - F8',
  description: 'Đang xác thực đăng nhập với GitHub',
};

export default function GithubCallbackPage() {
  return <GithubCallbackClient />;
}
