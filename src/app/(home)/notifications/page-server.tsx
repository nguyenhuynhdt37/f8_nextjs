import type { Metadata } from 'next';
import NotificationsClient from '@/components/client/notifications/NotificationsClient';

export const metadata: Metadata = {
    title: 'Thông báo - F8',
    description: 'Xem tất cả thông báo của bạn tại F8 - Nền tảng học lập trình hàng đầu Việt Nam',
    openGraph: {
        title: 'Thông báo - F8',
        description: 'Xem tất cả thông báo của bạn tại F8 - Nền tảng học lập trình hàng đầu Việt Nam',
        images: ['https://fullstack.edu.vn/assets/icon/f8_icon.png'],
    },
};

export default function NotificationsPage() {
    return <NotificationsClient />;
}
