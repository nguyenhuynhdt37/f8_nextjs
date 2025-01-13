'use client';
import {
  getChapterAndLesson,
  getCourseInfoAsync,
  MoveDownChapterPosition,
  MoveDownLessonPositionAsync,
  MoveUpChapterPosition,
  MoveUpLessonPositionAsync,
  ToggleChapterActive,
  ToggleLessonActiveAsync,
} from '@/api/api';
import { timeAgo } from '@/Utils/functions';
import Tippy from '@tippyjs/react';
import { message } from 'antd';
import { log } from 'console';
import { useEffect, useState } from 'react';
import { IoChevronUpCircleSharp } from 'react-icons/io5';
import { IoChevronDownCircleSharp } from 'react-icons/io5';
interface ISortLesson {
  courseId: number;
}
const SortLesson = ({ courseId }: ISortLesson) => {
  const [refetch, setRefetch] = useState<number>(-1);
  useEffect(() => {
    const handleGetRequest = async () => {
      if (courseId) {
        const res = await getCourseInfoAsync(courseId);
        if (res?.statusCode === 200) {
          setDataCourse(res.data);
        } else {
          console.log('error');
        }
      }
    };
    handleGetRequest();
  });
  useEffect(() => {
    const handleGetRequest = async () => {
      if (courseId) {
        const res = await getChapterAndLesson(courseId);
        if (res?.statusCode === 200) {
          setData(res.data);
          if (refetch === -1) setShowChapter(res.data[0]?.id);
        } else {
          console.log('error');
        }
      }
    };
    handleGetRequest();
  }, [refetch]);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataCourse, setDataCourse] = useState<any>();
  const [data, setData] = useState<any>();
  const [activeShowLesson, setShowLesson] = useState<number>(-1);
  const [activeShowChapter, setShowChapter] = useState<number>();
  console.log('data', data);
  const handleShowChapter = (id: number) => {
    setShowChapter(id);
    setShowLesson(-1);
  };
  const handleShowLesson = (id: number) => {
    setShowLesson(id);
    setShowChapter(-1);
  };
  const handleUpPositionLesson = async (id: number) => {
    const res = await MoveUpLessonPositionAsync(id);
    if (res && res?.statusCode === 200) {
      setRefetch(refetch + 1);
    } else {
      messageApi.error('Có lỗi xảy ra');
    }
  };
  const handleDownPositionLesson = async (id: number) => {
    const res = await MoveDownLessonPositionAsync(id);
    if (res && res?.statusCode === 200) {
      setRefetch(refetch + 1);
    } else {
      messageApi.error('Có lỗi xảy ra');
    }
  };
  const handleDownPositionChapter = async (id: number, positon: number) => {
    if (id && positon) {
      positon = positon + 1;
      console.log({
        courseid: courseId,
        chapterId: id,
        position: positon,
      });
      const res = await MoveDownChapterPosition({
        courseid: courseId,
        chapterId: id,
        position: positon,
      });
      if (res && res?.statusCode === 200) {
        const dataClone = [...data];
        const updatedData = dataClone.map((chapter: any) => {
          if (chapter?.id === id) {
            return { ...chapter, level: positon };
          } else if (chapter.level === positon) {
            return { ...chapter, level: chapter.level - 1 };
          } else {
            return chapter;
          }
        });
        updatedData.sort((a: any, b: any) => a.level - b.level);
        setData(updatedData);
      } else {
        messageApi.error('Có lỗi xảy ra');
      }
    }
  };
  const handleUpPositionChapter = async (id: number, positon: number) => {
    if (id && positon) {
      positon = positon - 1;
      console.log({
        courseid: courseId,
        chapterId: id,
        position: positon,
      });
      const res = await MoveUpChapterPosition({
        courseid: courseId,
        chapterId: id,
        position: positon,
      });
      if (res && res?.statusCode === 200) {
        const dataClone = [...data];
        const updatedData = dataClone.map((chapter: any) => {
          if (chapter?.id === id) {
            return { ...chapter, level: positon };
          } else if (chapter.level === positon) {
            return { ...chapter, level: chapter.level + 1 };
          } else {
            return chapter;
          }
        });
        updatedData.sort((a: any, b: any) => a.level - b.level);
        setData(updatedData);
      } else {
        messageApi.error('Có lỗi xảy ra');
      }
    }
  };
  const ToggerChapterActive = async (chapterId: number, isActive: boolean) => {
    const res = await ToggleChapterActive(chapterId);
    if (res && res?.statusCode === 200) {
      const updatedData = data.map((chapter: any) =>
        chapter?.id === chapterId
          ? { ...chapter, isActive: !isActive }
          : chapter,
      );
      setData(updatedData);
    } else {
      messageApi.error('Có lỗi xảy ra');
    }
  };
  const ToggleLessonActive = async (
    lessonId: number,
    chapterId: number,
    isActive: boolean,
  ) => {
    const res = await ToggleLessonActiveAsync(lessonId);
    if (res?.statusCode === 200) {
      let dataEdit = [...data];
      dataEdit = dataEdit?.map((chapter: any) =>
        chapter?.id === chapterId
          ? {
              ...chapter,
              tblLectureDetails: chapter.tblLectureDetails.map((lesson: any) =>
                lesson.id === lessonId
                  ? { ...lesson, isActive: !isActive }
                  : lesson,
              ),
            }
          : chapter,
      );
      setData(dataEdit);
    } else {
      messageApi.error('Có lỗi xảy ra');
    }
  };
  const [totalLesson, setTotalLesson] = useState<number>(0);
  const [totalChapter, setTotalChapter] = useState<number>(0);
  useEffect(() => {
    if (data) {
      const totalLesson = data.reduce((total: number, chapter: any) => {
        return total + chapter.tblLectureDetails.length;
      }, 0);
      setTotalLesson(totalLesson);
      setTotalChapter(data.length);
    }
  }, [data]);
  return (
    <div className="text-[1.4rem] p-10">
      {contextHolder}
      <div className="font-bold text-[2.5rem]">Sắp xếp chương học</div>
      <div className="grid grid-cols-3 gap-10">
        <div className="pt-10 ">
          <div className="font-medium text-[1.6rem]  pb-5">
            Thông tin khoá học
            <div className="font-medium text-[1.6rem] mt-4 me-6 pb-5">
              <img
                className="w-full object-cover rounded-2xl"
                src={dataCourse?.banner}
                alt=""
              />
            </div>
            <div className="text-center text-[3rem] text-[#6a6a6a] font-bold">
              HTML & CSS PRO
            </div>
            <div className="mt-4">Số bài học: {totalLesson} bài</div>
            <div className="mt-4">Số chương: {totalChapter} chương</div>
            <div className="mt-4">Cấp độ: {dataCourse?.level?.name}</div>
          </div>
        </div>
        <div className="pt-10 col-span-2">
          <div className="font-medium text-[1.6rem] flex justify-between pb-5">
            Danh sách chương và bài học
            <div className="">Thời gian cập nhật</div>
          </div>
          <div className="border-x-[0.1rem] h-[50vh] scrollbar-custom">
            {data?.map((chapter: any) => {
              return (
                <div key={chapter?.id || null} className="">
                  <div
                    onClick={() => handleShowChapter(chapter?.id)}
                    className={` rounded-xl flex items-center ${activeShowChapter === chapter?.id ? 'bg-[#3a27e9] ' : 'bg-[#5184b0]'} text-[#fff]  font-medium py-5 cursor-pointer border-y-[0.1rem] px-5 text-[1.6rem]`}
                  >
                    <input
                      onChange={() =>
                        ToggerChapterActive(chapter?.id, chapter?.isActive)
                      }
                      className={` scale-125 cursor-pointer outline-none border-[0.1rem] mr-5  border-[#fff]`}
                      checked={chapter?.isActive}
                      type="checkbox"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      {chapter?.name} - (Chương)
                      <div className="flex items-center">
                        <span className="ml-2">
                          {timeAgo(chapter?.updatedAt)}
                        </span>
                      </div>
                    </div>
                    {activeShowChapter === chapter?.id && (
                      <>
                        <button
                          disabled={chapter.level === 1}
                          className="pl-5"
                          onClick={() =>
                            handleUpPositionChapter(chapter?.id, chapter.level)
                          }
                        >
                          <IoChevronUpCircleSharp
                            className={`text-[2.7rem] ${chapter.level === 1 && 'text-[#ccc]'}`}
                          />
                        </button>
                        <button
                          disabled={chapter?.id === data[data.length - 1]?.id}
                          className="px-2"
                          onClick={() =>
                            handleDownPositionChapter(
                              chapter?.id,
                              chapter.level,
                            )
                          }
                        >
                          <IoChevronDownCircleSharp
                            className={`text-[2.7rem] ${chapter?.id === data[data.length - 1]?.id && 'text-[#ccc]'}`}
                          />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="">
                    {chapter?.tblLectureDetails?.map((lesson: any) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleShowLesson(lesson.id)}
                        className={`rounded-xl flex px-10 py-4 cursor-pointer items-center ${activeShowLesson === lesson.id && 'bg-[#a631f0] text-[#fff]'} `}
                      >
                        <input
                          onChange={() =>
                            ToggleLessonActive(
                              lesson.id,
                              chapter?.id,
                              lesson.isActive,
                            )
                          }
                          className={` scale-125 cursor-pointer outline-none border-[0.1rem] mr-5  border-[#fff]`}
                          checked={lesson?.isActive}
                          type="checkbox"
                        />
                        <div className="flex flex-1 justify-between items-center">
                          <div className="font-medium flex items-center text-[1.4rem]">
                            {lesson.title} - (Bài học)
                            {activeShowLesson === lesson.id && (
                              <>
                                <button
                                  className="pl-5"
                                  disabled={
                                    chapter?.id === data[0]?.id &&
                                    lesson?.level === 1
                                  }
                                  onClick={() =>
                                    handleUpPositionLesson(lesson.id)
                                  }
                                >
                                  <IoChevronUpCircleSharp
                                    className={`text-[2.7rem] ${
                                      chapter?.id === data[0]?.id &&
                                      lesson?.level === 1 &&
                                      'text-[#ccc]'
                                    }`}
                                  />
                                </button>
                                <button
                                  className="px-2"
                                  disabled={
                                    chapter?.id ===
                                      data[data?.length - 1]?.id &&
                                    lesson?.level === 1
                                  }
                                  onClick={() =>
                                    handleDownPositionLesson(lesson.id)
                                  }
                                >
                                  <IoChevronDownCircleSharp
                                    className={`text-[2.7rem] ${
                                      chapter?.id ===
                                        data[data?.length - 1]?.id &&
                                      lesson?.level === 1 &&
                                      'text-[#ccc]'
                                    }`}
                                  />
                                </button>
                              </>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="ml-2">
                              {timeAgo(lesson?.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortLesson;
