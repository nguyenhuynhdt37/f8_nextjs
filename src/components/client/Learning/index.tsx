"use client";
import Header from "@/layout/courseLayout/Header";
import {
  FooterBar,
  LessonContent,
  SideBar,
} from "@/components/client/learning";
import LoadingPage from "@/components/client/LoadingPage";
import { useAppSelector } from "@/redux/hook/hook";
import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { activeShowLesson } from "@/api/api";
const Learning = ({ data }: { data: any }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [lessonActive, setLessonActive] = useState<any>(
    data?.userActiveLessonByCourses[0]
  );
  const [isShowSideBar, setIsShowSideBar] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("data dsjhfdshfks", data);

  const handleShowLesson = useCallback(
    async (idLesson: number, groupId: number) => {
      if (idLesson && data?.id) {
        const result = await activeShowLesson({
          courseId: Number(data?.id),
          lessonId: idLesson,
          groupId: groupId,
        });

        if (result?.statusCode === 200 || result?.statusCode === 201) {
          setLessonActive(result?.data || null);
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
      <div className="">
        {isLoading && <LoadingPage />}
        <div className="grid grid-cols-4 h-[100vh] overflow-hidden pt-[5rem]">
          <LessonContent
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
          isShowSideBar={isShowSideBar}
          setIsShowSideBar={setIsShowSideBar}
        />
      </div>
    </>
  );
};

export default Learning;
