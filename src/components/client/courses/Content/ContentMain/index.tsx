"use client";
import React, { useEffect, useState } from "react";
import PropTypes, { number } from "prop-types";
import { MdAdd, MdRemove } from "react-icons/md";
import { FaPlayCircle } from "react-icons/fa";
import { GoCodeReview } from "react-icons/go";
import { RiQuestionnaireFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { convertSecondsToYMDHMS } from "@/Utils/functions";

const ContentMain = ({ data }: { data: any }) => {
  const [isShowLesson, setIsShowLesson] = useState<number[]>([data[0]?.id]);
  const [isShowAllLesson, setIsShowAllLesson] = useState<number[]>(() => {
    let array: number[] = [];
    data?.forEach((group: any) => {
      if (group?.id) {
        array.push(group.id);
      }
    });

    return array;
  });
  const groupLessonCount = data?.length;
  const LessonCount = data.reduce((i: number, a: any) => {
    return (i += a?.lectureDetail?.length);
  }, 0);
  const totalSecconsCourse = data?.reduce((store: number, group: any) => {
    group?.lectureDetail?.forEach((item: any) => {
      if (item?.lesson?.duration) {
        store += item?.lesson?.duration;
      }
    });
    return store;
  }, 0);
  const handleToggleShowLessson = (groupId: number) => {
    if (groupId === -1) return;
    const arrayLesson = [...isShowLesson];
    const id = arrayLesson?.find((p) => p === groupId);
    if (id) {
      const newarrayLesson = arrayLesson.filter((p) => p !== id);
      setIsShowLesson(newarrayLesson);
    } else {
      setIsShowLesson([...arrayLesson, groupId]);
    }
  };
  const handleToggleShowAllLessson = () => {
    // const isShowAll = data?.
  };
  return (
    <div className="text-[1.4rem] pt-10">
      <div className="text-[2rem] font-bold">Nội dung khoá học</div>
      <div className="flex  items-center justify-between">
        <ul className="flex p-0 m-0 py-2 list-disc">
          <div className="mr-10">
            <span className="font-medium mr-2">{groupLessonCount}</span>chương
          </div>
          <li className="mr-10">
            <span className="font-medium mr-2 ">{LessonCount}</span>
            bài học
          </li>
          <li>
            Thời lượng
            <span className="font-medium ms-2">
              {convertSecondsToYMDHMS(totalSecconsCourse)}
            </span>
          </li>
        </ul>

        {isShowAllLesson.length === isShowLesson.length ? (
          <button
            className="font-medium text-[#f05123]"
            onClick={() => setIsShowLesson([])}
          >
            Thu gọn tất cả
          </button>
        ) : (
          <button
            className="font-medium text-[#f05123]"
            onClick={() => setIsShowLesson(isShowAllLesson)}
          >
            Mở rộng tất cả
          </button>
        )}
      </div>
      {data?.map((groupLesson: any, index: number) => (
        <div key={groupLesson?.id || index} className="my-5">
          <div
            onClick={() => handleToggleShowLessson(groupLesson?.id || -1)}
            className="flex justify-between  cursor-pointer bg-[#f5f5f5] rounded-xl border-[0.1rem] border-[#ebebeb] py-6 px-10"
          >
            <div className="flex font-medium text-[1.5rem] items-center">
              {isShowLesson.find((p) => p === groupLesson?.id) ? (
                <MdRemove className="text-[1.8rem] mr-5 text-[#f05123]" />
              ) : (
                <MdAdd className="text-[1.8rem] mr-5 text-[#f05123]" />
              )}
              {groupLesson?.level}. {groupLesson?.name}
            </div>
            <div className="">{groupLesson?.lectureDetail?.length} bài học</div>
          </div>
          {isShowLesson.find((p) => p === groupLesson?.id) &&
            groupLesson?.lectureDetail?.map((lectureDetail: any) => (
              <div
                key={lectureDetail?.id}
                className="flex px-10 border-b-[0.1rem] justify-between opacity-70 items-center py-5"
              >
                <div className="flex ps-5  items-center">
                  {lectureDetail?.lessonType?.id === 1 && (
                    <FaPlayCircle className="mr-5 opacity-70 text-[#f05123]" />
                  )}
                  {lectureDetail?.lessonType?.id === 4 && (
                    <CgNotes className="mr-5 opacity-70" />
                  )}
                  {lectureDetail?.lessonType?.id === 3 && (
                    <RiQuestionnaireFill className="mr-5 opacity-70 text-[#f05123]" />
                  )}
                  {lectureDetail?.lessonType?.id === 2 && (
                    <GoCodeReview className="mr-5 opacity-70  text-[#f05123]" />
                  )}
                  {lectureDetail?.level}. {lectureDetail?.title}
                </div>
                {lectureDetail?.lessonType?.id === 1 && (
                  <div className="">
                    {convertSecondsToYMDHMS(
                      lectureDetail?.lesson?.duration || 0
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

ContentMain.propTypes = {};

export default ContentMain;
