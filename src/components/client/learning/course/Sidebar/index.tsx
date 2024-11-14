"use client";
import { convertSecondsToYMDHMS } from "@/Utils/functions";
import { memo, useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCirclePlay } from "react-icons/fa6";
import { GiBeastEye } from "react-icons/gi";
import { FaCode } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FaBluesky } from "react-icons/fa6";

interface IProps {
  isShowSideBar: boolean;
  lessonGroups: any;
  lessonActive: any;
  onShowLesson: any;
}
const SideBar = ({
  lessonGroups,
  isShowSideBar,
  lessonActive,
  onShowLesson,
}: IProps) => {
  const [activeShowGroupLesson, setActiveShowGroupLesson] = useState<number[]>([
    lessonActive?.groupId || lessonGroups[0]?.id,
  ]);
  console.log("lessonactive", lessonActive);

  const handleShowLesson = (id: number) => {
    const value = activeShowGroupLesson.find((value) => value === id);
    if (value) {
      const newarray = activeShowGroupLesson.filter((v) => v !== value);
      setActiveShowGroupLesson(newarray);
    } else {
      setActiveShowGroupLesson([...activeShowGroupLesson, id]);
    }
  };
  return (
    <div
      className={`${
        isShowSideBar ? "col-span-1" : "hidden"
      }  scrollbar-custom mb-[5rem] relative overflow-y-scroll`}
    >
      <div className="py-7 sticky bg-[#fff] z-20 top-0 left-0 px-8 font-medium text-2xl">
        Nội dung khoá học
      </div>
      <div className="text-[1.5rem] pt-[2rem] bg-[#fff]">
        <div className="">
          {lessonGroups?.map((groupLesson: any, index: number) => (
            <div key={groupLesson?.id} className="courses border-b-[0.1rem]">
              <div
                onClick={() => handleShowLesson(groupLesson?.id)}
                className="flex cursor-pointer justify-between px-8 py-5 bg-[#f7f8fa]"
              >
                <div className="">
                  <div className="font-medium text-[1.4rem] pb-2">
                    {groupLesson?.level}. {groupLesson?.name}
                  </div>
                  <div className="text-[1.3rem] text-[#29303b]">
                    {groupLesson?.length || 0} |{" "}
                    {convertSecondsToYMDHMS(
                      groupLesson?.lectureDetails?.reduce(
                        (data: number, item: any) => {
                          if (item?.lessonType?.id === 1) {
                            data += item?.lessonVideo?.duration || 0;
                          }
                          return data;
                        },
                        0
                      )
                    )}
                  </div>
                </div>
                <button className="pe-3">
                  {activeShowGroupLesson.find(
                    (value) => value === groupLesson?.id
                  ) ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                </button>
              </div>
              <div
                className={`lesson ${
                  activeShowGroupLesson.find(
                    (value) => value === groupLesson?.id
                  )
                    ? "block"
                    : "hidden"
                }`}
              >
                {groupLesson?.lectureDetails?.map((lesson: any) => (
                  <div
                    onClick={() => onShowLesson(lesson?.id, groupLesson?.id)}
                    key={lesson?.id}
                    className={`flex justify-between cursor-pointer pr-10 ps-14 py-4 ${
                      lessonActive?.lessonId === lesson?.id
                        ? "bg-[#fcdcd3]"
                        : "hover:bg-[#f7f8fa]"
                    }`}
                  >
                    <div className="">
                      <div className="font-medium pb-2">
                        {lesson?.level}. {lesson?.title}
                      </div>
                      <div className="text-[1.3rem] text-[#29303] items-center flex">
                        {lessonActive?.lessonId === lesson?.id && (
                          <GiBeastEye className="mr-2 text-[#f26d46]" />
                        )}
                        {lessonActive?.lessonId !== lesson?.id &&
                          lesson?.lessonType?.id === 1 && (
                            <FaCirclePlay className="mr-2 text-[#888]" />
                          )}
                        {lessonActive?.lessonId !== lesson?.id &&
                          lesson?.lessonType?.id === 2 && (
                            <FaCode className="mr-2 text-[#888]" />
                          )}
                        {lessonActive?.lessonId !== lesson?.id &&
                          lesson?.lessonType?.id === 3 && (
                            <FaBluesky className="mr-2 text-[#888]" />
                          )}
                        {lessonActive?.lessonId !== lesson?.id &&
                          lesson?.lessonType?.id === 4 && (
                            <MdEventNote className="mr-2 text-[#888]" />
                          )}
                        {lesson?.lessonType?.id === 1 &&
                          convertSecondsToYMDHMS(lesson?.lessonVideo?.duration)}
                      </div>
                    </div>
                    {lesson?.userLessons?.length > 0 && (
                      <button className="pe-1">
                        <FaCircleCheck className="text-[#5db85c]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(SideBar);
