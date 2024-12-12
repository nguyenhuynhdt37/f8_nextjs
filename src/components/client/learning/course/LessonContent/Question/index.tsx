"use client";
import { ViewNoteLesson, ViewQuestionLesson } from "@/api/api";
import { getCurrentMonthAndYear } from "@/Utils/functions";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { GoHeartFill } from "react-icons/go";
import CodeBlock from "./CodeBlock";
import confetti from "canvas-confetti";
const Question = ({ id }: any) => {
  const [quesstion, setQuestion] = useState<any>(null);
  const [isAnswer, setAnswer] = useState<any>();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const getData = async () => {
      const data = await ViewQuestionLesson(id);
      if (data?.statusCode === 200) {
        setQuestion(data?.data);
      } else {
        router.push("/404");
      }
    };
    getData();
  }, []);
  console.log(quesstion);
  const handleClick = (answer: any) => {
    setAnswer(answer);
  };
  const handleSubmit = () => {
    if (isAnswer?.isTrue) {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 100,
          origin: {
            x: 0.5,
            y: 1,
          },
        });
        
      }
      setAnswer({ ...isAnswer, error: false });
    } else {
      setAnswer({ ...isAnswer, error: true });
    }
  };
  return (
    <div className="container mx-auto px-[30rem] pt-[5rem] text-[1.4rem]">
      <div className="text-[2.5rem] font-medium">{quesstion?.title}</div>
      <div className="text-[1.3rem] pt-3 text-[#6d6d6d]">
        Cập nhật {getCurrentMonthAndYear(quesstion?.updatedAt)}
      </div>
      <div className="my-10">
        {quesstion?.tblQuestionsLesson?.question ? (
          <CodeBlock code={quesstion?.tblQuestionsLesson?.question} />
        ) : (
          <div className="font-medium text-center">Chưa cập nhật</div>
        )}
      </div>
      <div className="">Chọn câu trả lời đúng</div>
      <div className="">
        {quesstion?.tblQuestionsLesson?.tblQuestionsLessonDetails?.map(
          (answer: any) => (
            <div
              key={answer?.id}
              onClick={() => handleClick(answer)}
              className={`px-5 my-8 py-6 cursor-pointer ${
                isAnswer?.error && isAnswer?.id === answer?.id
                  ? "border-[#d06868] bg-[#f2d7d7]"
                  : answer?.id !== isAnswer?.id
                  ? "border-[#f6f7f9]"
                  : "border-[#0093fc]"
              } ${
                isAnswer?.error === false &&
                isAnswer?.id === answer?.id &&
                "border-[#48bd79] bg-[#dbf7db]"
              } border-2 rounded-2xl bg-[#f6f7f9] focus:outline-none
            w-full`}
            >
              {answer?.answer}
            </div>
          )
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          ref={buttonRef}
          className="px-10 text-[#fff] py-2 rounded-full bg-[#0093fc] uppercase"
        >
          Trả lời
        </button>
      </div>
      <div className="flex items-center justify-center">
        Made with
        <GoHeartFill className="px-2 text-[2.5rem] text-[#d47171]" />· Powered
        by F8
      </div>
    </div>
  );
};

export default Question;
