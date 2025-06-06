import type { Metadata } from 'next';
import MyCoursesClient from '@/components/client/courses/MyCoursesClient';

export const metadata: Metadata = {
    title: 'Khóa học của tôi - F8',
    description: 'Theo dõi và tiếp tục học tập với các khóa học bạn đã đăng ký tại F8',
    openGraph: {
        title: 'Khóa học của tôi - F8',
        description: 'Theo dõi và tiếp tục học tập với các khóa học bạn đã đăng ký tại F8',
        images: ['https://fullstack.edu.vn/assets/icon/f8_icon.png'],
    },
};

export default function MyCoursesPage() {
    return <MyCoursesClient />;
}
