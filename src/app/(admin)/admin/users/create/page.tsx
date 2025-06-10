import { Button, Card, Form, Input, Select, Switch, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { CreateUserDto } from '@/types/user';
import userApi from '@/api/users';
import { Metadata } from 'next';
import CreateUserForm from '@/components/admin/Users/CreateUserForm';


export const metadata: Metadata = {
    title: 'Tạo người dùng mới | F8 Admin',
    description: 'Tạo tài khoản người dùng mới trên hệ thống F8',
};

export default function CreateUserPage() {
    return <CreateUserForm />;
} 