"use client";
import Header from "@/layout/courseLayout/Header";
import {
  FooterBar,
  LessonContent,
  SideBar,
} from "@/components/client/learning";
import LoadingPage from "@/components/client/LoadingPage";
import { useAppSelector } from "@/redux/hook/hook";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { activeShowLesson } from "@/api/api";
import LoadingBar from "react-top-loading-bar";
import { group } from "console";
const Learning = ({ dataLearning }: any) => {
  console.log("data Learning", dataLearning);

  const [data, setData] = useState<any>(dataLearning);
  const [messageApi, contextHolder] = message.useMessage();
  const [lessonActive, setLessonActive] = useState<any>(
    data?.userActiveLessonByCourses[0]
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
      isCompleteLesson?.isCompleted === true &&
      isCompleteLesson?.groupId &&
      isCompleteLesson?.lessonId
    ) {
      var dataCopy = { ...data };
      dataCopy?.lessonGroups?.forEarch((lessonGroup: any) => {
        if (lessonGroup?.id === isCompleteLesson?.groupId) {
          lessonGroup?.lectureDetails?.forEarch((lesson: any) => {
            lesson?.userLessons?.push(lessonActive);
          });
        }
        setData(dataCopy);
      });
    }
  }, [isCompleteLesson]);
  const [isShowSideBar, setIsShowSideBar] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (lessonActive?.groupId && lessonActive?.lessonId) {
      setIsCompletedLesson({
        ...isCompleteLesson,
        groupId: lessonActive?.groupId,
        lessonId: lessonActive?.lessonId,
        isPostReq: false,
        isCompleted: false,
      });
    }
  }, [lessonActive]);

  const ref = useRef<any>(null);
  const handleShowLesson = useCallback(
    async (
      idLesson: number,
      groupId: number,
      isOldCompletedLesson: boolean
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
          type: "warning",
          content: "không thể lưu trạng thái lưu lịch sử bài học",
        });
      }
    },
    []
  );
  return (
    <>
      {contextHolder}
      <Header data={data} />
      <LoadingBar color="#b90021" ref={ref} />
      <div className="">
        {isLoading && <LoadingPage />}
        <div className="grid grid-cols-4 h-[100vh] overflow-hidden pt-[5rem]">
          <LessonContent
            isCompleteLesson={isCompleteLesson}
            setIsCompletedLesson={setIsCompletedLesson}
            courseSuggestion={data?.courseDetail}
            lessonActive={lessonActive}
            isShowSideBar={isShowSideBar}
          />
          <SideBar
            lessonActive={lessonActive}
            onShowLesson={handleShowLesson}
            lessonGroups={data?.lessonGroups}
            isShowSideBar={isShowSideBar}
          />
        </div>
        <FooterBar
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
