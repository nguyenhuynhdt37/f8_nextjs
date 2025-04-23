import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LearningPathById from '@/components/client/LearningPaths/byId';
import { getCourseLearningById } from '@/api/axios/api';
import { redirect } from 'next/dist/server/api-utils';
import { getNoteByLearningId } from '@/api/featch/learing-path';
import { useCookie } from '@/hook/useCookie';

async function LearningPathDetail({ params }: { params: { id: string } }) {
    try {
        const cookieHeader = useCookie();
        const learningPathData = await getNoteByLearningId(params.id, cookieHeader);
        return (
            <LearningPathById
                initialData={learningPathData}
            />
        );
    } catch (error) {

    }
}

export default LearningPathDetail; 