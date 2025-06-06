import AdminLayoutClient from '@/components/admin/layout/AdminLayoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'F8 Admin Dashboard',
  description: 'Quản lý hệ thống F8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
