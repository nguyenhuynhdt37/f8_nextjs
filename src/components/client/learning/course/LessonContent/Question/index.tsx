'use client';
import { ViewQuestionLesson } from '@/api/axios/api';
import { getCurrentMonthAndYear } from '@/Utils/functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CodeBlock from './CodeBlock';
import confetti from 'canvas-confetti';
import { FiHelpCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Question = ({ id, isCompleteLesson, setIsCompletedLesson }: any) => {
  const [question, setQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showResult, setShowResult] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await ViewQuestionLesson(id);
        if (data?.statusCode === 200) {
          // Tạo bản sao và xáo trộn các câu trả lời
          const dataCopy = { ...data?.data };
          if (dataCopy.tblquestionslesson?.tblquestionslessondetails) {
            dataCopy.tblquestionslesson.tblquestionslessondetails =
              [...dataCopy.tblquestionslesson.tblquestionslessondetails]
                .sort(() => Math.random() - 0.5);
          }
          setQuestion(dataCopy);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id, router]);

  const handleSelectAnswer = (answer: any) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    setShowResult(true);

    if (selectedAnswer.isTrue) {
      // Đánh dấu hoàn thành và hiệu ứng confetti
      setIsCompletedLesson({
        lessonId: id,
        isCompleted: true,
        isPostReq: false,
        isOldCompleted: false,
      });

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.8 }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-4">
            <FiHelpCircle className="text-indigo-600 dark:text-indigo-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{question?.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cập nhật {getCurrentMonthAndYear(question?.updatedAt)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 mb-6"></div>

        {/* Question content */}
        <div className="mb-8">
          {question?.tblquestionslesson?.question ? (
            <CodeBlock code={question?.tblquestionslesson?.question} />
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Câu hỏi đang được cập nhật...
            </div>
          )}
        </div>

        {/* Answer options */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Chọn câu trả lời đúng:</h3>

          <div className="space-y-3">
            {question?.tblquestionslesson?.tblquestionslessondetails?.map((detail: any) => {
              const isSelected = selectedAnswer?.id === detail.id;
              const isCorrect = detail.isTrue;

              let bgClass = "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
              let iconElement = null;

              if (showResult) {
                if (isCorrect) {
                  bgClass = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
                  iconElement = <FiCheckCircle className="text-green-500 dark:text-green-400 ml-2" size={20} />;
                } else if (isSelected) {
                  bgClass = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
                  iconElement = <FiXCircle className="text-red-500 dark:text-red-400 ml-2" size={20} />;
                }
              } else if (isSelected) {
                bgClass = "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700";
              }

              return (
                <button
                  key={detail.id}
                  onClick={() => handleSelectAnswer(detail)}
                  className={`w-full text-left px-5 py-4 rounded-xl border ${bgClass} 
                    flex items-center justify-between transition-colors
                    ${!showResult ? 'hover:bg-gray-100 dark:hover:bg-gray-750' : ''}
                    ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                  disabled={showResult}
                >
                  <span className="text-gray-800 dark:text-gray-200">{detail.answer}</span>
                  {iconElement}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`px-6 py-2 rounded-full text-white font-medium
                ${selectedAnswer
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Kiểm tra
            </button>
          ) : (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              {selectedAnswer?.isTrue ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <FiCheckCircle className="mr-2" />
                  <span>Chính xác!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <FiXCircle className="mr-2" />
                  <span>Chưa chính xác. Hãy thử lại!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by F8
          </p>
        </div>
      </div>
    </div>
  );
};

export default Question;
