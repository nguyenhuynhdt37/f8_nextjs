import { Metadata } from 'next';
import SavedPostsClient from '@/components/client/post/SavedPosts';

export const metadata: Metadata = {
    title: 'Bài viết đã lưu | F8',
    description: 'Danh sách các bài viết bạn đã lưu trên F8',
};

export default function SavedPostsPage() {
    return <SavedPostsClient />;
} 