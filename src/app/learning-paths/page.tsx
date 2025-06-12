import { getLearningPaths } from '@/api/axios/api';
import LearningPathsClient from '@/components/client/learning-paths/LearningPathsClient';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lộ trình học tập | F8',
    description: 'Các lộ trình học tập phát triển kỹ năng lập trình tại F8',
};

export default async function LearningPathsPage() {
    try {
        const learningPaths = await getLearningPaths();
        console.log(learningPaths);
        return <LearningPathsClient initialData={learningPaths} />;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu lộ trình:', error);
        // Return client component with null data, it will handle loading state
        return <LearningPathsClient initialData={null} />;
    }
} 