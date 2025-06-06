'use client';

import React, { useEffect, useState } from 'react';
import PageLoading from './PageLoading';
import PageLoadingSkeleton from './PageLoadingSkeleton';
import Learning from '@/components/client/Learning';

interface LearningWrapperProps {
    courseId: string;
    dataLearning: any;
}

const LearningWrapper: React.FC<LearningWrapperProps> = ({ courseId, dataLearning }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingPhase, setLoadingPhase] = useState<'initial' | 'skeleton' | 'complete'>('initial');

    useEffect(() => {
        // Hiển thị loading ban đầu
        setLoadingPhase('initial');

        // Sau 500ms, chuyển sang hiển thị skeleton để người dùng cảm thấy có tiến triển
        const skeletonTimer = setTimeout(() => {
            setLoadingPhase('skeleton');
        }, 500);

        // Sau 1.5s tổng cộng, hoàn tất quá trình loading
        const completeTimer = setTimeout(() => {
            setLoadingPhase('complete');
            setIsLoading(false);
        }, 1500);

        return () => {
            clearTimeout(skeletonTimer);
            clearTimeout(completeTimer);
        };
    }, []);

    if (isLoading) {
        return loadingPhase === 'initial' ? <PageLoading /> : <PageLoadingSkeleton />;
    }

    return <Learning courseId={courseId} dataLearning={dataLearning} />;
};

export default LearningWrapper;

