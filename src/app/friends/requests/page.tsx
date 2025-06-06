import type { Metadata } from 'next';
import FriendRequestsClient from '@/components/client/friends/FriendRequestsClient';

export const metadata: Metadata = {
    title: 'Lời mời kết bạn - F8',
    description: 'Xem và quản lý các lời mời kết bạn trên nền tảng F8',
    openGraph: {
        title: 'Lời mời kết bạn - F8',
        description: 'Xem và quản lý các lời mời kết bạn trên nền tảng F8',
        images: ['https://fullstack.edu.vn/assets/icon/f8_icon.png'],
    },
};

export default function FriendRequestsPage() {
    return <FriendRequestsClient />;
}
