'use client';
import Header from '@/layout/courseLayout/Header';
import LoadingPage from '@/components/client/LoadingPage';
import { useAppSelector } from '@/redux/hook/hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { activeShowLesson, CheckLessonComplete } from '@/api/api';
import LoadingBar from 'react-top-loading-bar';
import { group } from 'console';
import { FooterBar, LessonContent, SideBar } from './course';
const Learning = ({ dataLearning, courseId }: any) => {
  const [data, setData] = useState<any>(dataLearning);
  const [messageApi, contextHolder] = message.useMessage();
  const [lessonActive, setLessonActive] = useState<any>(
    data?.userActiveLessonByCourses[0],
  );

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
      const res = await CheckLessonComplete(lessonActive?.lessonId);
      if (res?.statusCode === 200) {
        setIsCompletedLesson({
          ...isCompleteLesson,
          groupId: lessonActive?.groupId,
          lessonId: lessonActive?.lessonId,
          isPostReq: false,
          isCompleted: false,
          isOldCompleted: true,
        });
      } else {
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
    <>
      {contextHolder}
      <Header data={data} courseId={courseId} />
      <LoadingBar color="#b90021" ref={ref} />
      <div className="">
        {isLoading && <LoadingPage />}
        <div className="grid grid-cols-4 h-[100vh] overflow-hidden pt-[5rem]">
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
    </>
  );
};

export default Learning;
