import { getLearningPathById } from '@/api/axios/api';
import LearningPathDetailClient from '@/components/client/learning-paths/LearningPathDetailClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const pathId = params.id;
        const response = await getLearningPathById(Number(pathId));

        if (response?.statusCode === 200 && response?.data?.learningPath) {
            const path = response.data.learningPath;
            return {
                title: `${path.title} | Lộ trình học F8`,
                description: path.description?.substring(0, 160),
            };
        }

        return {
            title: 'Lộ trình học | F8',
            description: 'Chi tiết lộ trình học tại F8',
        };
    } catch (error) {
        return {
            title: 'Lộ trình học | F8',
            description: 'Chi tiết lộ trình học tại F8',
        };
    }
}

export default async function LearningPathDetailPage({ params }: Props) {
    try {
        const pathId = params.id;
        const response = await getLearningPathById(Number(pathId));

        if (!response || response.statusCode !== 200) {
            return notFound();
        }

        return <LearningPathDetailClient pathId={pathId} initialData={response} />;
    } catch (error) {
        console.error('Lỗi khi tải thông tin lộ trình:', error);
        return notFound();
    }
} 