'use client';
import Header from '@/layout/courseLayout/Header';
import LoadingPage from '@/components/client/LoadingPage';
import { useAppSelector } from '@/redux/hook/hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { activeShowLesson, CheckLessonComplete } from '@/api/axios/api';
import LoadingBar from 'react-top-loading-bar';
import { group } from 'console';
import { FooterBar, LessonContent, SideBar } from './course';

const Learning = ({ dataLearning, courseId }: any) => {
  const [data, setData] = useState<any>(dataLearning);
  const [messageApi, contextHolder] = message.useMessage();
  const [lessonActive, setLessonActive] = useState<any>(
    data?.userActiveLessonByCourses[0],
  );
  // console.log('data', data);
  const [isCompleteLesson, setIsCompletedLesson] = useState<any>({
    isCompleted: false,
    lessonId: null,
    groupId: null,
    isPostReq: false,
    isOldCompleted: false,
  });

  useEffect(() => {
    if (
      isCompleteLesson?.isCompleted &&
      isCompleteLesson?.groupId &&
      isCompleteLesson?.lessonId
    ) {
      var dataCopy = { ...data };
      dataCopy?.lessonGroups?.map((lessonGroup: any) => {
        if (lessonGroup?.id === isCompleteLesson?.groupId) {
          lessonGroup?.lectureDetails?.map((lesson: any) => {
            if (lesson?.id === isCompleteLesson?.lessonId) {
              lesson?.userLessons?.push(lessonActive);
            }
          });
        }
      });
      setData(dataCopy);
    }
  }, [isCompleteLesson]);

  const [isShowSideBar, setIsShowSideBar] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkCompleteLesson = async () => {
      try {
        const res = await CheckLessonComplete(lessonActive?.lessonId);

        setIsCompletedLesson({
          ...isCompleteLesson,
          groupId: lessonActive?.groupId,
          lessonId: lessonActive?.lessonId,
          isPostReq: false,
          isCompleted: false,
          isOldCompleted: true,
        });

      } catch (error) {

        if (lessonActive?.groupId && lessonActive?.lessonId) {
          setIsCompletedLesson({
            ...isCompleteLesson,
            groupId: lessonActive?.groupId,
            lessonId: lessonActive?.lessonId,
            isPostReq: false,
            isCompleted: false,
            isOldCompleted: false,
          });
        }
      }
    };
    checkCompleteLesson();
  }, [lessonActive]);

  const ref = useRef<any>(null);
  const handleShowLesson = useCallback(
    async (
      idLesson: number,
      groupId: number,
      isOldCompletedLesson: boolean,
    ) => {
      if (idLesson && data?.id) {
        ref.current.continuousStart();
        try {
          const result = await activeShowLesson({
            courseId: Number(data?.id),
            lessonId: idLesson,
            groupId: groupId,
          });
          ref.current.complete();
          if (result?.statusCode === 200 || result?.statusCode === 201) {
            const dataActive = result?.data || {};
            setLessonActive({
              ...dataActive,
              isOldCompletedLesson,
            });
          }
        } catch (error) {
          messageApi.error('Lỗi khi lưu trạng thái lưu lịch sử bài học, vui lòng thử lại sau');
        }
      } else {
        messageApi.open({
          type: 'warning',
          content: 'không thể lưu trạng thái lưu lịch sử bài học',
        });
      }
    },
    [],
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {contextHolder}
      <Header data={data} courseId={courseId} />
      <LoadingBar color="#b90021" shadow={true} ref={ref} />

      <div className="flex-grow relative">
        {isLoading && <LoadingPage />}

        <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-5rem)] overflow-hidden">
          <LessonContent
            courseId={courseId}
            isCompleteLesson={isCompleteLesson}
            setIsCompletedLesson={setIsCompletedLesson}
            courseSuggestion={data?.courseDetail}
            lessonActive={lessonActive}
            isShowSideBar={isShowSideBar}
          />
          <SideBar
            lessonActive={lessonActive}
            onShowLesson={handleShowLesson}
            data={data}
            isShowSideBar={isShowSideBar}
          />
        </div>

        <FooterBar
          data={data}
          lessonActive={lessonActive}
          onShowLesson={handleShowLesson}
          isCompleteLesson={isCompleteLesson}
          setIsCompletedLesson={setIsCompletedLesson}
          isShowSideBar={isShowSideBar}
          setIsShowSideBar={setIsShowSideBar}
        />
      </div>
    </div>
  );
};

export default Learning;
