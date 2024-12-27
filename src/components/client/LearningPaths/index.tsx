'use client';
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import React, { useEffect } from 'react';
const LearningPaths = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStateNav(2));
  }, []);
  return <div>LearningPaths</div>;
};

export default LearningPaths;
