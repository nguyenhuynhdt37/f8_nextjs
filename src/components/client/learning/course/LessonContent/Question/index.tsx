'use client';
import { ViewNoteLesson, ViewQuestionLesson } from '@/api/axios/api';
import { getCurrentMonthAndYear } from '@/Utils/functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { GoHeartFill } from 'react-icons/go';
import CodeBlock from './CodeBlock';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiFilter, FiCheckCircle, FiXCircle, FiHelpCircle, FiCode, FiBookOpen } from 'react-icons/fi';
import Image from 'next/image';

// Define types for better type safety
interface QuestionDetail {
  id: number;
  answer: string;
  isTrue: boolean;
  imageUrl?: string;
  codeSnippet?: string;
}

interface QuestionData {
  id: number;
  question: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  tblquestionslessondetails: QuestionDetail[];
}

interface QuestionResponse {
  title: string;
  updatedAt: string;
  description?: string;
  imageUrl?: string;
  tblquestionslesson: QuestionData;
}

interface QuestionProps {
  id: number;
  isCompleteLesson: any;
  setIsCompletedLesson: (value: any) => void;
}

const Question: React.FC<QuestionProps> = ({ id, isCompleteLesson, setIsCompletedLesson }) => {
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [isAnswer, setAnswer] = useState<QuestionDetail & { error?: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState<string>('all');
  const [showExplanation, setShowExplanation] = useState(false);
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const data = await ViewQuestionLesson(id);
        if (data?.statusCode === 200) {
          let dataCopy = { ...data?.data };
          // Randomize the order of answers
          dataCopy.tblquestionslesson.tblquestionslessondetails =
            dataCopy.tblquestionslesson.tblquestionslessondetails
              ?.slice()
              .sort(() => Math.random() - 0.5);
          setQuestion(dataCopy);
        } else {
          // router.push('/404');
        }
      } catch (error) {
        console.error("Error fetching question data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleClick = (answer: QuestionDetail) => {
    setAnswer(answer);
  };

  const handleSubmit = () => {
    if (!isAnswer) return;

    if (isAnswer.isTrue) {
      if (buttonRef.current) {
        // Create more elaborate confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);

          // Since particles fall down, start a bit higher than random
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff0000', '#00ff00', '#0000ff'],
            shapes: ['circle', 'square'],
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff0000', '#00ff00', '#0000ff'],
            shapes: ['circle', 'square'],
          });
        }, 250);

        // Mark lesson as completed
        setIsCompletedLesson({
          ...isCompleteLesson,
          isCompleted: true,
        });
      }
      setAnswer({ ...isAnswer, error: false });
      setShowExplanation(true);
    } else {
      setAnswer({ ...isAnswer, error: true });

      // Scroll to the selected answer for better UX
      setTimeout(() => {
        const selectedElement = document.getElementById(`answer-${isAnswer.id}`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const resetQuestion = () => {
    setAnswer(null);
    setShowExplanation(false);
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-[10rem] 2xl:px-[10rem] pt-8 md:pt-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4 mb-8"></div>

            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>

            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>

            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-[10rem] 2xl:px-[10rem] pt-8 md:pt-12 text-gray-800 dark:text-gray-100 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with title and metadata */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white"
          >
            {question?.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>Cập nhật {getCurrentMonthAndYear(question?.updatedAt)}</span>
            </div>

            {question?.tblquestionslesson?.difficulty && (
              <div className={`px-2 py-0.5 rounded-full border ${getDifficultyColor(question.tblquestionslesson.difficulty)} text-xs font-medium`}>
                {question.tblquestionslesson.difficulty === 'easy' ? 'Dễ' :
                  question.tblquestionslesson.difficulty === 'medium' ? 'Trung bình' :
                    question.tblquestionslesson.difficulty === 'hard' ? 'Khó' :
                      'Chưa phân loại'}
              </div>
            )}

            {question?.tblquestionslesson?.category && (
              <div className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800 text-xs font-medium">
                {question.tblquestionslesson.category}
              </div>
            )}
          </div>
        </div>

        {/* Description if available */}
        {question?.description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
        )}

        {/* Question image if available */}
        {question?.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={question.imageUrl}
              alt={question.title}
              width={800}
              height={400}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        )}

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 md:mb-10 rounded-xl overflow-hidden shadow-md dark:shadow-gray-900/50"
        >
          <div className="bg-blue-50/50 dark:bg-gray-800/50 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FiCode className="mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Câu hỏi</span>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm flex items-center px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 dark:text-blue-300 transition-colors"
            >
              <FiHelpCircle className="mr-1" />
              {showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
            </button>
          </div>

          {question?.tblquestionslesson?.question ? (
            <CodeBlock code={question?.tblquestionslesson?.question} />
          ) : (
            <div className="font-medium text-center py-12 bg-gray-50 dark:bg-gray-800">Chưa cập nhật</div>
          )}

          {/* Hint section */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800/50 p-4"
              >
                <div className="flex items-start">
                  <FiHelpCircle className="mt-1 mr-2 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Gợi ý:</p>
                    <p className="text-yellow-700 dark:text-yellow-200 text-sm">
                      Hãy xem xét kỹ các điều kiện trong đoạn code và suy nghĩ về các trường hợp đặc biệt.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Answer section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-200 flex items-center">
              <FiBookOpen className="mr-2" />
              Chọn câu trả lời đúng
            </h2>
          </div>

          <div className="mb-8 space-y-4">
            {question?.tblquestionslesson?.tblquestionslessondetails.map(
              (detail: QuestionDetail) => (
                <motion.button
                  id={`answer-${detail.id}`}
                  key={detail.id}
                  onClick={() => !isAnswer?.error === false && handleClick(detail)}
                  disabled={isAnswer?.error === false}
                  className={`relative px-5 md:px-6 py-4 md:py-5 cursor-pointer ${isAnswer?.error && isAnswer?.id === detail?.id
                    ? 'border-red-400 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200'
                    : detail?.id !== isAnswer?.id
                      ? 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'
                      : 'border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
                    } ${isAnswer?.error === false && isAnswer?.id === detail?.id &&
                    'border-green-400 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200'
                    } border-2 rounded-xl focus:outline-none w-full transition-all duration-200 text-left text-base md:text-lg shadow-sm dark:shadow-gray-900/30 flex items-center`}
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
                  <div className="flex-grow pr-8">
                    {/* Answer text */}
                    <div>{detail.answer}</div>

                    {/* Code snippet if available */}
                    {detail.codeSnippet && (
                      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded text-sm font-mono overflow-x-auto">
                        {detail.codeSnippet}
                      </div>
                    )}

                    {/* Answer image if available */}
                    {detail.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <Image
                          src={detail.imageUrl}
                          alt="Answer illustration"
                          width={300}
                          height={150}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Status indicator */}
                  {isAnswer?.id === detail.id && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isAnswer.error === false ? (
                        <FiCheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
                      ) : isAnswer.error ? (
                        <FiXCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                      ) : null}
                    </div>
                  )}
                </motion.button>
              ),
            )}
          </div>
        </motion.div>

        {/* Explanation section (shows after correct answer) */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl"
            >
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                <FiCheckCircle className="mr-2" />
                Giải thích
              </h3>
              <p className="text-green-700 dark:text-green-200">
                Câu trả lời chính xác! Đây là lựa chọn đúng vì nó phù hợp với yêu cầu của bài toán và logic của đoạn code.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex justify-between items-center mb-12">
          {isAnswer?.error === false ? (
            <motion.button
              onClick={resetQuestion}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all duration-200 text-sm md:text-base"
            >
              Làm lại
            </motion.button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}

          <motion.button
            onClick={handleSubmit}
            ref={buttonRef}
            disabled={!isAnswer || isAnswer?.error === false}
            whileHover={!isAnswer?.error === false ? { scale: 1.05 } : {}}
            whileTap={!isAnswer?.error === false ? { scale: 0.95 } : {}}
            className={`px-8 md:px-10 py-2 md:py-3 rounded-full ${!isAnswer
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : isAnswer?.error === false
                ? 'bg-green-500 dark:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              } text-white uppercase font-medium transition-all duration-200 text-sm md:text-base shadow-md dark:shadow-gray-900/50 flex items-center`}
          >
            {!isAnswer ? (
              'Chọn đáp án'
            ) : isAnswer?.error === false ? (
              <>
                <FiCheckCircle className="mr-2" />
                Đã trả lời đúng
              </>
            ) : (
              'Trả lời'
            )}
          </motion.button>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center py-6 text-center border-t border-gray-200 dark:border-gray-700"
        >
          <span className="text-sm md:text-base">Made with</span>
          <GoHeartFill className="mx-2 text-xl md:text-2xl text-red-500 animate-pulse" />
          <span className="text-sm md:text-base">Powered by F8</span>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (prefers-color-scheme: dark) {
          .hljs {
            background-color: #1f2937 !important;
            color: #e5e7eb !important;
          }
          
          .hljs-keyword, .hljs-selector-tag, .hljs-title, .hljs-section, .hljs-doctag, .hljs-name, .hljs-strong {
            color: #93c5fd !important;
          }
          
          .hljs-string, .hljs-attr, .hljs-symbol, .hljs-bullet, .hljs-built_in, .hljs-builtin-name, .hljs-template-tag, .hljs-template-variable, .hljs-addition {
            color: #a7f3d0 !important;
          }
          
          .hljs-comment, .hljs-quote, .hljs-deletion, .hljs-meta {
            color: #9ca3af !important;
          }
          
          .hljs-emphasis {
            font-style: italic;
          }
          
          .hljs-strong {
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
};

export default Question;
