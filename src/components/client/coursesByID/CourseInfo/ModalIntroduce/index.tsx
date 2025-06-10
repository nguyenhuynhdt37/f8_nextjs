'use client';
import { getFirstLesson } from '@/api/axios/api';
import { getVideoIdFromUrl } from '@/Utils/functions';
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaTimes, FaInfoCircle, FaRegClock, FaVideo } from 'react-icons/fa';
import { BiFullscreen } from 'react-icons/bi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface IModalIntroduceProps {
  isModalOpen: boolean;
  setIsModalOpen: (a: boolean) => void;
  id: number;
}

const ModalIntroduce: React.FC<IModalIntroduceProps> = ({ isModalOpen, setIsModalOpen, id }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle pressing Escape key to exit fullscreen or close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isFullscreen, setIsModalOpen]);

  // Fetch course data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await getFirstLesson({ id });
        if (res?.statusCode === 200) {
          setData(res?.data);
        } else {
          setError(res?.message || 'Failed to load course introduction');
        }
      } catch (err) {
        setError('There was an error loading the course introduction');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen) {
      fetchData();
    }
  }, [id, isModalOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop overlay */}
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        />

        {/* Modal content */}
        <motion.div
          ref={modalRef}
          className={`relative bg-white z-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 rounded-none' : 'w-[95%] max-w-5xl max-h-[90vh]'
            }`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-20 text-white bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full transition-all duration-200 group"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <FaTimes className="text-xl group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Fullscreen button */}
          <button
            className="absolute top-4 right-16 z-20 text-white bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full transition-all duration-200 group"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <BiFullscreen className="text-xl group-hover:scale-110 transition-transform duration-300" />
          </button>

          {/* Content container */}
          <div className={`flex flex-col ${isFullscreen ? 'h-screen' : 'h-[90vh]'}`}>
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">Loading course preview...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <FaInfoCircle className="text-red-500 text-5xl mb-4" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Error Loading Content</h3>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
                <button
                  onClick={handleCloseModal}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Video section */}
                <div className="relative w-full z-50" style={{ height: isFullscreen ? '85%' : '60%' }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none"></div>

                  <iframe
                    src={`https://www.youtube.com/embed/${getVideoIdFromUrl(data?.lesson?.videoLink)}?autoplay=1&rel=0&modestbranding=1`}
                    title={data?.title || "Course preview"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Course information */}
                <div className="flex-1 overflow-y-auto p-6">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    {data?.title || "Course Introduction"}
                  </h2>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaRegClock className="mr-2" />
                      <span>{data?.lesson?.duration || "N/A"} minutes</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaVideo className="mr-2" />
                      <span>{data?.totalLessons || "Multiple"} lessons</span>
                    </div>
                  </div>

                  {data?.lesson?.description && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                        <HiOutlineLightBulb className="mr-2 text-yellow-500" />
                        What you'll learn
                      </h3>
                      <div
                        className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: data?.lesson?.description }}
                      />
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors mr-3"
                    >
                      Close
                    </button>
                    <button
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                    >
                      <FaPlay className="mr-2" /> Start Learning
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModalIntroduce;
