import UserTable from '@/components/admin/Users/UserTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý người dùng | F8 Admin',
    description: 'Quản lý thông tin và phân quyền người dùng trên hệ thống F8',
};

export default function UsersPage() {
    return (
        <div className="p-4 min-h-screen bg-gray-50 dark:bg-slate-900">
            <UserTable />
        </div>
    );
}