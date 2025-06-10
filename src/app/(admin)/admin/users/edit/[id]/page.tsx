import EditUserForm from '@/components/admin/Users/EditUserForm';
import { Metadata } from 'next';


interface Props {
    params: {
        id: string;
    };
}

export const metadata: Metadata = {
    title: 'Chỉnh sửa người dùng | F8 Admin',
    description: 'Quản lý và cập nhật thông tin người dùng trên hệ thống F8',
};

export default function EditUserPage({ params }: Props) {
    return <EditUserForm userId={parseInt(params.id)} />;
} 