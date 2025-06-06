'use client';
import React, { useState } from 'react';
import { FaCheck, FaQuoteLeft, FaRegLightbulb, FaChalkboardTeacher, FaRocket, FaAward } from 'react-icons/fa';
import { motion } from '@/lib/motion';
import { FiTarget, FiAward, FiBriefcase, FiCode, FiCpu, FiGlobe, FiLayers, FiTrendingUp, FiUsers } from 'react-icons/fi';

const ResultCourse = ({ introduce }: any) => {
  const [activeTab, setActiveTab] = useState('description');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // Default learning outcomes if none provided
  const defaultOutcomes = [
    "Nắm vững kiến thức nền tảng và ứng dụng thực tế",
    "Xây dựng các dự án thực tế từ đầu đến cuối",
    "Tự tin ứng tuyển vào các vị trí liên quan",
    "Phát triển tư duy giải quyết vấn đề",
    "Tiếp cận các kỹ thuật và công nghệ mới nhất"
  ];

  // Career paths
  const careerPaths = [
    { icon: <FiCode />, title: "Lập trình viên", description: "Phát triển ứng dụng và giải quyết vấn đề kỹ thuật" },
    { icon: <FiLayers />, title: "Nhà phát triển web", description: "Xây dựng và tối ưu hóa các trang web hiện đại" },
    { icon: <FiCpu />, title: "Kỹ sư phần mềm", description: "Thiết kế và triển khai các hệ thống phần mềm phức tạp" },
    { icon: <FiTrendingUp />, title: "Chuyên gia tối ưu hóa", description: "Cải thiện hiệu suất và trải nghiệm người dùng" },
    { icon: <FiGlobe />, title: "Nhà phát triển full-stack", description: "Làm việc trên cả front-end và back-end" },
    { icon: <FiUsers />, title: "Quản lý dự án", description: "Điều phối các dự án phát triển phần mềm" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="custom-textview leading-relaxed text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none pl-6 border-l-4 border-indigo-200 dark:border-indigo-700"
          >
            {introduce ? (
              <div
                dangerouslySetInnerHTML={{ __html: introduce }}
                className="prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 [&>p]:text-gray-700 [&>p]:dark:text-gray-300 [&>ul]:text-gray-700 [&>ul]:dark:text-gray-300 [&>ol]:text-gray-700 [&>ol]:dark:text-gray-300 [&>h1]:text-gray-900 [&>h1]:dark:text-gray-100 [&>h2]:text-gray-800 [&>h2]:dark:text-gray-200 [&>h3]:text-gray-800 [&>h3]:dark:text-gray-200 [&>h4]:text-gray-800 [&>h4]:dark:text-gray-200 [&>h5]:text-gray-800 [&>h5]:dark:text-gray-200 [&>h6]:text-gray-800 [&>h6]:dark:text-gray-200 [&>a]:text-indigo-600 [&>a]:dark:text-indigo-400 [&>blockquote]:text-gray-700 [&>blockquote]:dark:text-gray-300 [&>code]:text-gray-800 [&>code]:dark:text-gray-200 [&>pre]:bg-gray-100 [&>pre]:dark:bg-gray-900 [&_span]:!text-gray-700 [&_span]:dark:!text-gray-300 dark:[&_*[style*='color:#000']]:!text-gray-300 dark:[&_*[style*='color: #000']]:!text-gray-300 dark:[&_*[style*='color: black']]:!text-gray-300 dark:[&_*[style*='color:black']]:!text-gray-300"
              />
            ) : (
              <div className="space-y-4">
                <p>
                  Khóa học này được thiết kế để giúp bạn nắm vững các kiến thức nền tảng và phát triển kỹ năng thực tiễn. Với phương pháp học tập tương tác và thực hành, bạn sẽ tiến bộ nhanh chóng và tự tin ứng dụng kiến thức vào các dự án thực tế.
                </p>
                <p>
                  Nội dung khóa học được cập nhật thường xuyên để đảm bảo bạn luôn được học những kiến thức mới nhất và phù hợp với nhu cầu thị trường.
                </p>
                <p>
                  Bạn sẽ được hướng dẫn từng bước một, từ những khái niệm cơ bản đến các kỹ thuật nâng cao, thông qua các bài giảng video chất lượng cao và các bài tập thực hành thiết thực.
                </p>
              </div>
            )}
          </motion.div>
        );

      case 'outcomes':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {defaultOutcomes.map((outcome, index) => (
              <motion.div
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5 }}
              >
                <div className="bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-400 p-1 rounded-full mr-3 mt-1.5 flex-shrink-0">
                  <FaCheck size={12} />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{outcome}</p>
              </motion.div>
            ))}

            <div className="mt-6 pt-6 border-t border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center gap-3 text-purple-700 dark:text-purple-400">
                <FaRegLightbulb className="text-lg" />
                <span className="font-medium">Học từ kinh nghiệm thực tế của chuyên gia</span>
              </div>
            </div>
          </motion.div>
        );

      case 'careers':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {careerPaths.map((career, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm border border-blue-50 dark:border-blue-900/30 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${hoveredItem === index ? 'bg-blue-500 text-white' : 'bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400'}`}>
                    {career.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{career.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{career.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Main content card with tabs */}
      <motion.div
        transition={{ duration: 0.5 }}
        className="p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      >
        {/* Tab navigation */}
        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => setActiveTab('description')}
            className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 -mb-px ${activeTab === 'description'
              ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <FaQuoteLeft className="mr-2" />
            Mô tả khoá học
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => setActiveTab('outcomes')}
            className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 -mb-px ${activeTab === 'outcomes'
              ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'border-transparent text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <FiTarget className="mr-2" />
            Bạn sẽ học được gì
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => setActiveTab('careers')}
            className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 -mb-px ${activeTab === 'careers'
              ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <FiBriefcase className="mr-2" />
            Cơ hội nghề nghiệp
          </motion.button>
        </div>

        {/* Tab content */}
        <div className="py-4">
          {renderTabContent()}
        </div>
      </motion.div>

      {/* Instructor information */}
      <motion.div
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-800/30"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white overflow-hidden">
              <FaChalkboardTeacher size={32} />
            </div>
            <div className="absolute -right-1 -bottom-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Giảng viên F8</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Chuyên gia với hơn 5 năm kinh nghiệm</p>

            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                <FaAward className="mr-1" />
                <span>4.9</span>
              </div>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                <FaRocket className="mr-1" />
                <span>12 khóa học</span>
              </div>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                <FiUsers className="mr-1" />
                <span>10k+ học viên</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills you'll gain */}
      <motion.div
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-md border border-purple-100 dark:border-purple-800/30"
        whileHover={{ y: -5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <FiAward className="mr-2 text-purple-500" />
          Kỹ năng bạn sẽ đạt được
        </h3>

        <div className="flex flex-wrap gap-2">
          {["HTML & CSS", "JavaScript", "React", "Node.js", "Git", "Responsive Design", "API Integration", "Performance Optimization"].map((skill, index) => (
            <motion.span
              key={index}
              className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm border border-purple-100 dark:border-purple-800/30 text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ResultCourse;
