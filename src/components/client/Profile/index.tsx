'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/hook/hook';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import { motion } from 'framer-motion';
import { timeAgo } from '@/Utils/functions';

// Icons
import {
  FaGithub,
  FaFacebook,
  FaYoutube,
  FaCertificate,
  FaCalendarAlt,
  FaGraduationCap
} from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { FiExternalLink } from 'react-icons/fi';

const Profile = ({ user }: any) => {
  const userRedux = useAppSelector(state => state?.auth?.user);
  const loadingRef = useRef<any>(null);
  const [data, setData] = useState<any>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setData(userRedux);
      setIsCurrentUser(true);
    } else {
      setData(user);
      setIsCurrentUser(userRedux?.user?.id === user?.user?.id);
    }
  }, [user, userRedux]);

  const handleCourseClick = (id: number) => {
    loadingRef.current?.continuousStart();
    router.push(`/learning/${id}`);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { user: profileUser, courses } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LoadingBar color="#4f46e5" ref={loadingRef} height={3} shadow={true} />

      {/* Cover and Profile Image */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={profileUser?.coverImage || "https://fullstack.edu.vn/assets/cover-profile-CDYcrPwJ.png"}
            alt="Cover"
          />
        </div>

        {/* Profile Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-20 md:-bottom-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
              <img
                className="w-32 h-32 md:w-40 md:h-40 object-cover"
                src={profileUser?.avatar || "https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg"}
                alt={profileUser?.fullName || "User"}
              />
            </div>
            {profileUser?.roleId === 2 && (
              <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1">
                <FaCircleCheck className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        {/* User Name and Basic Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
            {profileUser?.fullName || "User"}
            {profileUser?.roleId === 2 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Admin
              </span>
            )}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 flex items-center justify-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            Thành viên từ {timeAgo(profileUser?.createdAt || Date.now())}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - About and Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-1"
          >
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FaCertificate className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Giới thiệu
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900">
                        <FaGraduationCap className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Thành viên của</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-amber-600 dark:text-amber-400">F8 - Học lập trình để đi làm</span>
                        {' '}từ {timeAgo(profileUser?.createdAt || Date.now())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Liên kết
                </h2>
                <div className="space-y-3">
                  {profileUser?.githubLink && (
                    <a
                      href={profileUser.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                        <FaGithub className="text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="ml-4 flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">GitHub</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 truncate">{profileUser.githubLink}</p>
                      </div>
                      <FiExternalLink className="text-gray-400" />
                    </a>
                  )}

                  {profileUser?.facebookLink && (
                    <a
                      href={profileUser.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                        <FaFacebook className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4 flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Facebook</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 truncate">{profileUser.facebookLink}</p>
                      </div>
                      <FiExternalLink className="text-gray-400" />
                    </a>
                  )}

                  {profileUser?.youtubeLink && (
                    <a
                      href={profileUser.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900">
                        <FaYoutube className="text-red-600 dark:text-red-400" />
                      </div>
                      <div className="ml-4 flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">YouTube</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 truncate">{profileUser.youtubeLink}</p>
                      </div>
                      <FiExternalLink className="text-gray-400" />
                    </a>
                  )}

                  {!profileUser?.githubLink && !profileUser?.facebookLink && !profileUser?.youtubeLink && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Chưa có liên kết nào</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Bio and Courses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2"
          >
            {/* Bio Section */}
            {profileUser?.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Giới thiệu bản thân
                  </h2>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: profileUser.bio }}
                  />
                </div>
              </div>
            )}

            {/* Courses Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Các khóa học đã tham gia
                </h2>

                {courses && courses.length > 0 ? (
                  <div className="space-y-6">
                    {courses.map((course: any) => (
                      <motion.div
                        key={course.id}
                        whileHover={{ scale: 1.01 }}
                        className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        <div className="md:w-1/3 lg:w-1/4">
                          <img
                            src={course.banner}
                            alt={course.title}
                            className="w-full h-40 md:h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="md:w-2/3 lg:w-3/4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {course.title}
                          </h3>
                          {course.introduce ? (
                            <div
                              className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: course.introduce }}
                            />
                          ) : (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                              Chưa có mô tả cho khóa học này
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                      Chưa tham gia khóa học nào
                    </p>
                    <button
                      onClick={() => router.push('/courses')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Khám phá các khóa học
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
