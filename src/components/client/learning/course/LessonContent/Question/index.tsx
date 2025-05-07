'use client';
import { ViewNoteLesson, ViewQuestionLesson } from '@/api/axios/api';
import { getCurrentMonthAndYear } from '@/Utils/functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { GoHeartFill } from 'react-icons/go';
import CodeBlock from './CodeBlock';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
const Question = ({ id, isCompleteLesson, setIsCompletedLesson }: any) => {
  const [question, setQuestion] = useState<any>(null);
  const [isAnswer, setAnswer] = useState<any>();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const getData = async () => {
      const data = await ViewQuestionLesson(id);
      if (data?.statusCode === 200) {
        let dataCopy = { ...data?.data };
        console.log('dataCopy', dataCopy);

        dataCopy.tblquestionslesson.tblquestionslessondetails =
          dataCopy.tblquestionslesson.tblquestionslessondetails
            ?.slice()
            .sort(() => Math.random() - 0.5);
        setQuestion(dataCopy);
      } else {
        // router.push('/404');
      }
    };
    getData();
  }, []);
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
        setIsCompletedLesson({
          ...isCompleteLesson,
          isCompleted: true,
        });
      }
      setAnswer({ ...isAnswer, error: false });
    } else {
      setAnswer({ ...isAnswer, error: true });
    }
  };
  return (
    <div className="container mx-auto px-[30rem] pt-[5rem] text-[1.4rem]">
      <div className="text-[2.5rem] font-medium">{question?.title}</div>
      <div className="text-[1.3rem] pt-3 text-[#6d6d6d]">
        Cập nhật {getCurrentMonthAndYear(question?.updatedAt)}
      </div>
      <div className="my-10">
        {question?.tblquestionslesson?.question ? (
          <CodeBlock code={question?.tblquestionslesson?.question} />
        ) : (
          <div className="font-medium text-center">Chưa cập nhật</div>
        )}
      </div>
      <div className="">Chọn câu trả lời đúng</div>
      <div className="mb-5">
        {question?.tblquestionslesson?.tblquestionslessondetails.map(
          (detail: any) => (
            <motion.button
              key={detail.id}
              onClick={() => handleClick(detail)}
              className={`px-5 my-4 py-6 cursor-pointer ${isAnswer?.error && isAnswer?.id === detail?.id
                ? 'border-[#d06868] bg-[#ea8787]'
                : detail?.id !== isAnswer?.id
                  ? 'border-[#f6f7f9]'
                  : 'border-[#0093fc]'
                } ${isAnswer?.error === false &&
                isAnswer?.id === detail?.id &&
                'border-[#48bd79] bg-[#b0f4b0]'
                } border-2 rounded-2xl bg-[#f6f7f9] focus:outline-none w-full`}
              animate={
                isAnswer?.error && isAnswer?.id === detail?.id
                  ? { x: [-10, 10, -10, 10, 0] }
                  : {}
              }
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              {detail.answer}
            </motion.button>
          ),
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
