"use client";
import { title } from "process";
import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
const courses = [
  {
    id: 1,
    title: "Giới thiệu",
    level: 1,
    lesson: [
      {
        title: "Lời khuyên trước khi bước vào khoá học",
        time: 4000,
        isSuccess: true,
        level: 1,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học",
        time: 4000,
        isSuccess: false,
        level: 2,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học",
        time: 4000,
        isSuccess: false,
        level: 3,
      },
    ],
  },
  {
    id: 2,
    title: "Giới thiệu 2",
    level: 2,
    lesson: [
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 4,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 5,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 6,
      },
    ],
  },
  {
    id: 3,
    title: "Giới thiệu 2",
    level: 2,
    lesson: [
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 4,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 5,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 6,
      },
    ],
  },
  {
    id: 4,
    title: "Giới thiệu 2",
    level: 2,
    lesson: [
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 4,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 5,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 6,
      },
    ],
  },
  {
    id: 5,
    title: "Giới thiệu 2",
    level: 2,
    lesson: [
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 4,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 5,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 6,
      },
    ],
  },
  {
    id: 6,
    title: "Giới thiệu 2",
    level: 2,
    lesson: [
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 4,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 5,
      },
      {
        title: "Lời khuyên trước khi bước vào khoá học 2",
        time: 4000,
        isSuccess: true,
        level: 6,
      },
    ],
  },
];
const SideBar = () => {
  const [showLesson, setShowLesson] = useState(courses);
  const [activeShowLesson, setActiveShowLesson] = useState<number[]>([]);
  console.log(activeShowLesson);
  console.log(showLesson);
  const handleShowLesson = (id: number) => {
    console.log(id);
    const value = activeShowLesson.find((value) => value === id);
    if (value) {
      const newarray = activeShowLesson.filter((v) => v !== value);
      setActiveShowLesson(newarray);
    } else {
      setActiveShowLesson([...activeShowLesson, id]);
    }
  };
  return (
    <div>
      <div className="text-[1.5rem] h-[50rem] bg-[#fff]">
        <div className="py-7  px-8 font-medium text-2xl">Nội dung khoá học</div>
        <div className="overflow-hidden">
          {showLesson.map((groupLesson, index) => (
            <div className="courses">
              <div
                key={index}
                onClick={() => handleShowLesson(groupLesson.id)}
                className="flex cursor-pointer justify-between px-8 py-5 bg-[#f7f8fa]"
              >
                <div className="">
                  <div className="font-medium pb-2">
                    {groupLesson.level}. {groupLesson.title}
                  </div>
                  <div className="text-[1rem]">3/3 | 07:28</div>
                </div>
                <button className="pe-3">
                  {activeShowLesson.find(
                    (value) => value === groupLesson.id
                  ) ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                </button>
              </div>
              <div
                className={`lesson ${
                  activeShowLesson.find((value) => value === groupLesson.id)
                    ? "block"
                    : "hidden"
                }`}
              >
                {groupLesson.lesson.map((item, index) => (
                  <div className="flex justify-between pr-10 ps-14 py-5 bg-[#fcdcd3] hover:bg-[#f7f8fa]">
                    <div className="">
                      <div className="font-medium pb-2">
                        {item.level}. {item.title}
                      </div>
                      <div className="text-[1rem] flex">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="compact-disc"
                          className="svg-inline--fa text-[#f26d46] w-4 mr-2 fa-compact-disc _lesson-icon_1seu0_69 _active_1seu0_11 _playing_1seu0_78"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="currentColor"
                            d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z"
                          ></path>
                        </svg>
                        04:28
                      </div>
                    </div>
                    {item.isSuccess && (
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

export default SideBar;
