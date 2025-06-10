'use client'
import React, { useEffect, useState } from 'react';
import ResultCourse from './ResultCourse';
import ContentMain from './ContentMain';
import { CheckIsCourseRegister } from '@/api/axios/api';
import { id } from 'date-fns/locale';
import { motion } from '@/lib/motion';
import AnimateInView from '@/components/ui/AnimateInView';
import { FiAward, FiBook, FiBookmark, FiCheck, FiClock, FiCode, FiDownload, FiGlobe, FiLayers, FiUsers } from 'react-icons/fi';

const Content = ({ data, courseId, totalLesson, timeCourse }: any) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Features list for the course
  const features = [
    { icon: <FiClock />, text: "Học theo tốc độ của riêng bạn" },
    { icon: <FiGlobe />, text: "Truy cập trọn đời vào nội dung" },
    { icon: <FiDownload />, text: "Tài liệu học tập có thể tải về" },
    { icon: <FiCode />, text: "Bài tập thực hành với code mẫu" },
    { icon: <FiUsers />, text: "Cộng đồng học viên hỗ trợ" },
    { icon: <FiAward />, text: "Chứng chỉ hoàn thành khóa học" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="col-span-1 md:col-span-2"
      id="course-content"
    >
      {/* Tab navigation */}
      <div className="mb-8 border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium text-base whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === 'overview'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Tổng quan
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-6 py-3 font-medium text-base whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === 'content'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Nội dung khóa học
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-6 py-3 font-medium text-base whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === 'features'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Tính năng
        </button>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {data?.title && (
              <AnimateInView>
                <motion.h2
                  className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6"
                >
                  Giới thiệu về khóa học
                </motion.h2>
              </AnimateInView>
            )}

            <div className="bg-white rounded-2xl shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden border border-indigo-50 mb-8">
              <div className="p-6 md:p-8">
                {data?.courseDetail?.introduce && (
                  <AnimateInView delay={0.1}>
                    <motion.div
                      className="custom-textview prose max-w-none text-gray-700 text-lg leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      dangerouslySetInnerHTML={{ __html: data?.introduce }}
                    />
                  </AnimateInView>
                )}

                {!data?.courseDetail?.introduce && (
                  <p className="  dark:text-gray-200 text-gray-500 italic">Chưa có nội dung giới thiệu cho khóa học này.</p>
                )}
              </div>

              {/* Course highlights */}
              <div className="bg-gradient-to-r dark:from-indigo-900 dark:to-purple-900 dark:border-indigo-900 dark:text-white from-indigo-50 to-purple-50 p-6 md:p-8 border-t border-indigo-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Điểm nổi bật của khóa học</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Học từ kinh nghiệm thực tế",
                    "Nội dung cập nhật liên tục",
                    "Bài tập thực hành sau mỗi bài học",
                    "Hỗ trợ giải đáp thắc mắc 24/7",
                    "Tài liệu học tập đầy đủ",
                    "Chứng chỉ sau khi hoàn thành"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <div className="mr-3 bg-indigo-100 text-indigo-600 p-1 rounded-full">
                        <FiCheck size={16} />
                      </div>
                      <span className="text-gray-700 dark:text-white">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <ResultCourse introduce={data?.introduce} />

            {/* Target audience */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden border border-indigo-50 mb-8">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-semibold text-gray-800  dark:text-white mb-4">Đối tượng phù hợp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                        <FiUsers size={20} />
                      </div>
                      <h4 className="font-medium text-gray-800">Người mới bắt đầu</h4>
                    </div>
                    <p className="text-gray-600">
                      Khóa học cung cấp kiến thức nền tảng vững chắc cho người mới bắt đầu với lộ trình học tập rõ ràng.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center mb-3">
                      <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                        <FiLayers size={20} />
                      </div>
                      <h4 className="font-medium text-gray-800">Người có kinh nghiệm</h4>
                    </div>
                    <p className="text-gray-600">
                      Nâng cao kỹ năng với các kỹ thuật chuyên sâu và các bài tập thực tế từ chuyên gia trong ngành.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContentMain data={data?.lessonGroups} />
          </motion.div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-50"
          >
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Tính năng khóa học</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-white border border-indigo-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{feature.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Requirements */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold dark:text-white  text-gray-800 mb-4">Yêu cầu</h3>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-amber-100 text-amber-600 p-1 rounded-full mr-3 mt-1">
                        <FiCheck size={14} />
                      </div>
                      <span className="text-gray-700">Máy tính có kết nối internet</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 text-amber-600 p-1 rounded-full mr-3 mt-1">
                        <FiCheck size={14} />
                      </div>
                      <span className="text-gray-700">Kiến thức cơ bản về máy tính</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 text-amber-600 p-1 rounded-full mr-3 mt-1">
                        <FiCheck size={14} />
                      </div>
                      <span className="text-gray-700">Sự kiên trì và tinh thần học hỏi</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Content;
