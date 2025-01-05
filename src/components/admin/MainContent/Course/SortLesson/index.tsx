'use client';
import Tippy from '@tippyjs/react';
import { useState } from 'react';
import { IoChevronUpCircleSharp } from 'react-icons/io5';
import { IoChevronDownCircleSharp } from 'react-icons/io5';
interface ISortLesson {
  courseId: number;
}
const datac = {
  courseId: 'course_01',
  courseName: 'Lập trình cơ bản',
  description:
    'Khóa học cung cấp nền tảng vững chắc về lập trình, dành cho người mới bắt đầu.',
  createdAt: '2025-01-03',
  updatedAt: '2025-01-03',
  chapters: [
    {
      chapterId: 'chapter_01',
      isActive: false,
      position: 1,
      chapterName: 'Giới thiệu lập trình',
      description: 'Khám phá các khái niệm cơ bản của lập trình và công nghệ.',
      lessons: [
        {
          lessonId: 'lesson_01',
          lessonName: 'Lập trình là gì?',
          content: 'Khái niệm cơ bản về lập trình và các ứng dụng.',
          videoUrl: 'https://example.com/videos/lesson_01',
          duration: '10:00',
          isActive: true,
          position: 1,
          resources: ['https://example.com/docs/intro'],
        },
        {
          lessonId: 'lesson_02',
          lessonName: 'Ngôn ngữ lập trình',
          content:
            'Các loại ngôn ngữ lập trình phổ biến và cách chọn ngôn ngữ phù hợp.',
          videoUrl: 'https://example.com/videos/lesson_02',
          duration: '15:00',
          isActive: true,
          position: 2,
          resources: ['https://example.com/docs/programming-languages'],
        },
        {
          lessonId: 'lesson_03',
          lessonName: 'Môi trường phát triển',
          content:
            'Hướng dẫn thiết lập môi trường phát triển và cài đặt công cụ.',
          videoUrl: 'https://example.com/videos/lesson_03',
          duration: '20:00',
          isActive: true,
          position: 3,
          resources: ['https://example.com/docs/setup-environment'],
        },
      ],
    },
    {
      chapterId: 'chapter_02',
      isActive: true,
      position: 2,
      chapterName: 'Cú pháp cơ bản',
      description: 'Học các cú pháp cơ bản trong lập trình.',
      lessons: [
        {
          lessonId: 'lesson_04',
          lessonName: 'Biến và kiểu dữ liệu',
          content: 'Cách khai báo biến và các loại kiểu dữ liệu.',
          videoUrl: 'https://example.com/videos/lesson_04',
          duration: '20:00',
          isActive: true,
          position: 1,
          resources: ['https://example.com/docs/variables'],
        },
        {
          lessonId: 'lesson_05',
          lessonName: 'Câu lệnh điều kiện',
          content: 'Sử dụng các câu lệnh điều kiện để xây dựng logic.',
          videoUrl: 'https://example.com/videos/lesson_05',
          duration: '15:00',
          isActive: true,
          position: 2,
          resources: ['https://example.com/docs/conditional-statements'],
        },
        {
          lessonId: 'lesson_06',
          lessonName: 'Vòng lặp',
          content: 'Cách sử dụng vòng lặp trong lập trình.',
          videoUrl: 'https://example.com/videos/lesson_06',
          duration: '18:00',
          isActive: true,
          position: 3,
          resources: ['https://example.com/docs/loops'],
        },
      ],
    },
    {
      chapterId: 'chapter_03',
      isActive: true,
      position: 3,
      chapterName: 'Lập trình hướng đối tượng',
      description:
        'Giới thiệu về lập trình hướng đối tượng và các khái niệm chính.',
      lessons: [
        {
          lessonId: 'lesson_07',
          lessonName: 'Lớp và đối tượng',
          content: 'Tìm hiểu lớp và đối tượng trong lập trình hướng đối tượng.',
          videoUrl: 'https://example.com/videos/lesson_07',
          duration: '25:00',
          isActive: false,
          position: 1,
          resources: ['https://example.com/docs/classes-objects'],
        },
        {
          lessonId: 'lesson_08',
          lessonName: 'Tính kế thừa',
          content: 'Cách áp dụng tính kế thừa để tái sử dụng mã.',
          videoUrl: 'https://example.com/videos/lesson_08',
          duration: '22:00',
          isActive: true,
          position: 2,
          resources: ['https://example.com/docs/inheritance'],
        },
        {
          lessonId: 'lesson_09',
          lessonName: 'Đóng gói và đa hình',
          content: 'Tìm hiểu cách đóng gói và sử dụng đa hình trong lập trình.',
          videoUrl: 'https://example.com/videos/lesson_09',
          duration: '30:00',
          isActive: true,
          position: 3,
          resources: ['https://example.com/docs/encapsulation-polymorphism'],
        },
      ],
    },
    {
      chapterId: 'chapter_04',
      isActive: false,
      position: 4,
      chapterName: 'Cấu trúc dữ liệu và giải thuật',
      description:
        'Nắm vững các cấu trúc dữ liệu cơ bản và cách áp dụng các giải thuật.',
      lessons: [
        {
          lessonId: 'lesson_10',
          lessonName: 'Mảng và danh sách',
          content: 'Khám phá cách sử dụng mảng và danh sách.',
          videoUrl: 'https://example.com/videos/lesson_10',
          duration: '25:00',
          isActive: true,
          position: 1,
          resources: ['https://example.com/docs/arrays-lists'],
        },
        {
          lessonId: 'lesson_11',
          lessonName: 'Sắp xếp và tìm kiếm',
          content: 'Học các thuật toán sắp xếp và tìm kiếm cơ bản.',
          videoUrl: 'https://example.com/videos/lesson_11',
          duration: '20:00',
          isActive: true,
          position: 2,
          resources: ['https://example.com/docs/sorting-searching'],
        },
        {
          lessonId: 'lesson_12',
          lessonName: 'Cây và đồ thị',
          content: 'Giới thiệu về cấu trúc dữ liệu cây và đồ thị.',
          videoUrl: 'https://example.com/videos/lesson_12',
          duration: '30:00',
          isActive: true,
          position: 3,
          resources: ['https://example.com/docs/trees-graphs'],
        },
      ],
    },
  ],
};

const SortLesson = ({ courseId }: ISortLesson) => {
  const [data, setData] = useState<any>(datac.chapters);
  const [activeShowLesson, setShowLesson] = useState<number>(-1);
  const [activeShowChapter, setShowChapter] = useState<number>(
    data[0].chapterId,
  );
  const key1 = 1;
  console.log('data', data);
  const handleShowChapter = (id: number) => {
    setShowChapter(id);
    setShowLesson(-1);
    console.log('id', id);
  };
  const handleShowLesson = (id: number) => {
    setShowLesson(id);
    setShowChapter(-1);
    console.log('id', id);
  };
  const handleUpPositionLesson = (id: number) => {
    console.log(id);
  };
  const handleDownPositionLesson = (id: number) => {
    console.log(id);
  };
  const handleUpPositionChapter = (id: number) => {
    console.log(id);
  };
  const handleDownPositionChapter = (id: number) => {
    console.log(id);
  };
  const setActiveChapter = (chapterId: number, isActive: boolean) => {
    let dataEdit = [...data];
    dataEdit?.map((chapter: any) => {
      if (chapter.chapterId === chapterId) {
        chapter.isActive = !isActive;
      }
    });
    setData(dataEdit);
  };
  const setActiveLesson = (
    lessonId: number,
    chapterId: number,
    isActive: boolean,
  ) => {
    let dataEdit = [...data];
    dataEdit?.map((chapter: any) => {
      if (chapter.chapterId === chapterId) {
        chapter.lessons?.map((lesson: any) => {
          if (lesson.lessonId === lessonId) {
            lesson.isActive = !isActive;
          }
        });
      }
    });
    setData(dataEdit);
  };
  return (
    <div className="text-[1.4rem] p-10">
      <div className="font-bold text-[2.5rem]">Sắp xếp chương học</div>
      <div className="grid grid-cols-3">
        <div className="pt-10">
          <div className="font-medium text-[1.6rem] pb-5 border-b-[0.1rem]">
            Thông tin khoá học
          </div>
        </div>
        <div className="pt-10 col-span-2">
          <div className="font-medium text-[1.6rem] pb-5">
            Danh sách chương và bài học
          </div>
          <div className="border-x-[0.1rem] scrollbar-custom">
            {data?.map((chapter: any) => {
              return (
                <div key={chapter.chapterId} className="">
                  <div
                    onClick={() => handleShowChapter(chapter.chapterId)}
                    className={`flex items-center ${activeShowChapter === chapter.chapterId && 'bg-[#3498db] text-[#fff]'}  font-medium py-5 cursor-pointer border-y-[0.1rem] px-5 text-[1.6rem]`}
                  >
                    <input
                      //   onChange={() => setIsAnswerSuccess(answer?.id)}
                      className={` scale-125 cursor-pointer outline-none border-[0.1rem] mr-5  border-[#fff]`}
                      checked={chapter?.isActive}
                      type="checkbox"
                    />
                    {chapter.chapterName} - (Chương)
                    {activeShowChapter === chapter.chapterId && (
                      <>
                        <button
                          className="pl-5"
                          onClick={() =>
                            handleUpPositionChapter(chapter.chapterId)
                          }
                        >
                          <IoChevronUpCircleSharp className="text-[2.7rem]" />
                        </button>
                        <button
                          className="px-2"
                          onClick={() =>
                            handleDownPositionChapter(chapter.chapterId)
                          }
                        >
                          <IoChevronDownCircleSharp className="text-[2.7rem]" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="">
                    {chapter.lessons?.map((lesson: any) => (
                      <div
                        key={lesson.lessonId}
                        onClick={() => handleShowLesson(lesson.lessonId)}
                        className={`flex px-10 py-4 cursor-pointer border-b-[0.1rem] items-center ${activeShowLesson === lesson.lessonId && 'bg-[#3498db] text-[#fff]'} `}
                      >
                        <input
                          onChange={() =>
                            setActiveLesson(
                              lesson?.lessonId,
                              chapter?.chapterId,
                              lesson?.isActive,
                            )
                          }
                          className={` scale-125 cursor-pointer outline-none border-[0.1rem] mr-5  border-[#fff]`}
                          checked={lesson?.isActive}
                          type="checkbox"
                        />
                        <div className="flex items-center">
                          <div className="font-medium flex items-center text-[1.4rem]">
                            {lesson.lessonName} - (Bài học)
                            {activeShowLesson === lesson.lessonId && (
                              <>
                                <button
                                  className="pl-5"
                                  onClick={() =>
                                    handleUpPositionLesson(lesson.lessonId)
                                  }
                                >
                                  <IoChevronUpCircleSharp className="text-[2.7rem]" />
                                </button>
                                <button
                                  className="px-2"
                                  onClick={() =>
                                    handleDownPositionLesson(lesson.lessonId)
                                  }
                                >
                                  <IoChevronDownCircleSharp className="text-[2.7rem]" />
                                </button>
                              </>
                            )}
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
