import React from 'react';
import Friends from '@/components/client/friends';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bạn bè - F8',
    description: 'Kết nối với bạn bè và học hỏi cùng nhau tại F8 - Nền tảng học lập trình hàng đầu Việt Nam',
    openGraph: {
        title: 'Bạn bè - F8',
        description: 'Kết nối với bạn bè và học hỏi cùng nhau tại F8 - Nền tảng học lập trình hàng đầu Việt Nam',
        images: ['https://fullstack.edu.vn/assets/icon/f8_icon.png'],
    },
};

const FriendsPage = () => {
    return (
        <div className="">
            <Friends />
        </div>
    );
};

export default FriendsPage;