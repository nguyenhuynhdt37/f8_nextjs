'use client';
import { FaPlayCircle, FaStar, FaStarHalfAlt, FaRegStar, FaGraduationCap, FaRegClock, FaLock, FaUnlock } from 'react-icons/fa';
import { CgPerformance } from 'react-icons/cg';
import { TbMovie } from 'react-icons/tb';
import { MdOutlineAccessTimeFilled, MdOutlineVerified } from 'react-icons/md';
import { IoIosBatteryFull, IoMdRibbon } from 'react-icons/io';
import ButtonRegiterStudy from './ButtonRegiterStudy';
import { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import ModalIntroduce from './ModalIntroduce';
import { motion } from '@/lib/motion';
import { AnimateButton, FadeAnimation, SlideAnimation } from '@/components/ui/Animations';
import { FiAward, FiDownload, FiGift, FiShield, FiSmartphone, FiUsers } from 'react-icons/fi';

const CourseInfo = ({
  data,
  timeCourse,
  totalLesson,
}: {
  data: any;
  timeCourse: string;
  totalLesson: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Price details
  const price = data?.courseDetail?.price || 0;
  const oldPrice = data?.courseDetail?.priceOld;
  const discountPercent = oldPrice ? Math.round((oldPrice - price) / oldPrice * 100) : 0;

  // Generate random rating between 4.5 and 5.0
  const rating = 4.5 + Math.random() * 0.5;
  const ratingRounded = Math.round(rating * 10) / 10;

  // Generate random enrollment count
  const enrollmentCount = Math.floor(500 + Math.random() * 1500);

  // Course benefits
  const benefits = [
    { icon: <FiUsers />, text: "Hơn 10,000 học viên" },
    { icon: <FiDownload />, text: "Tài liệu học tập đầy đủ" },
    { icon: <FiSmartphone />, text: "Học trên mọi thiết bị" },
    { icon: <FiShield />, text: "Bảo hành trọn đời" },
    { icon: <FiAward />, text: "Chứng chỉ hoàn thành" },
    { icon: <FiGift />, text: "Ưu đãi khóa học tiếp theo" },
  ];

  // 3D card effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setMousePosition({ x, y });

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };

  return (
    <div>
      <div className="sticky top-[7.5rem] md:top-[10.5rem] mt-8 md:mt-0">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="cursor-pointer relative group overflow-hidden rounded-2xl shadow-xl transform-gpu transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
        >
          {/* Spotlight effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            }}
          />

          <img
            className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-105"
            alt={data?.title || "Khóa học"}
            src={data?.banner}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-2xl opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-5 rounded-full cursor-pointer shadow-lg"
            // animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaPlayCircle size={48} className="text-white drop-shadow-lg" />
          </motion.div>
          <div className="font-medium absolute left-1/2 -translate-x-1/2 bottom-7 text-xl text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            Xem giới thiệu khoá học
          </div>

          {/* Course rating badge */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center transform transition-transform duration-300 group-hover:scale-110">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => {
                if (star <= Math.floor(ratingRounded)) {
                  return <FaStar key={star} className="text-yellow-500 w-3.5 h-3.5" />;
                } else if (star === Math.ceil(ratingRounded) && !Number.isInteger(ratingRounded)) {
                  return <FaStarHalfAlt key={star} className="text-yellow-500 w-3.5 h-3.5" />;
                } else {
                  return <FaRegStar key={star} className="text-yellow-500 w-3.5 h-3.5" />;
                }
              })}
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ratingRounded}</span>
          </div>

          {/* Students count */}
          <div className="absolute top-4 right-4 bg-indigo-600/90 text-white px-3 py-1.5 rounded-full shadow-md flex items-center text-sm transform transition-transform duration-300 group-hover:scale-110">
            <FiUsers className="mr-1.5" />
            {enrollmentCount.toLocaleString()} học viên
          </div>
        </motion.div>

        <div className="pt-5 text-[#494949] dark:text-gray-300">
          {data?.courseDetail?.isFree ? (
            <motion.div
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white text-center py-6 px-8 rounded-2xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                  <div className="absolute top-0 left-0 w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
                </div>

                {/* Animated particles */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white opacity-50 animate-float"
                    style={{
                      width: `${Math.random() * 6 + 3}px`,
                      height: `${Math.random() * 6 + 3}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 5 + 5}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Đặc biệt</span>
                <h2 className="text-5xl font-extrabold mt-3 mb-2 animate-pulse">Miễn phí</h2>
                <p className="text-white/90 text-lg">Truy cập ngay hôm nay</p>

                <motion.div
                  className="mt-6 inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="#course-content" className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                    Bắt đầu học
                  </a>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative py-8 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Background effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-5 left-5 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                {/* Animated particles */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white opacity-30 animate-float"
                    style={{
                      width: `${Math.random() * 6 + 3}px`,
                      height: `${Math.random() * 6 + 3}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 5 + 5}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              {/* Discount badge */}
              {oldPrice > price && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-3 -right-3 bg-red-500 dark:bg-red-600 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-lg transform rotate-12 z-10"
                >
                  -{discountPercent}%
                </motion.div>
              )}

              <div className="text-center text-white relative z-10">
                {/* Old price */}
                {oldPrice > price && (
                  <div className="text-xl opacity-75 line-through mb-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(oldPrice)}
                  </div>
                )}

                {/* New price */}
                <motion.h2
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200 dark:from-yellow-200 dark:to-yellow-100 mb-2 animate-gradient"
                >
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </motion.h2>

                {/* Tagline */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-lg opacity-90 font-medium mb-2">
                    Nhanh tay kẻo lỡ ưu đãi đặc biệt!
                  </p>
                  <div className="flex justify-center items-center text-sm">
                    <MdOutlineVerified className="mr-1.5" />
                    <span>Bảo đảm hoàn tiền trong 30 ngày</span>
                  </div>
                </motion.div>

                {/* Countdown timer */}
                <div className="mt-4 flex justify-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg w-14 text-center">
                    <div className="text-xl font-bold">24</div>
                    <div className="text-xs opacity-80">Giờ</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg w-14 text-center">
                    <div className="text-xl font-bold">59</div>
                    <div className="text-xs opacity-80">Phút</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg w-14 text-center">
                    <div className="text-xl font-bold">59</div>
                    <div className="text-xs opacity-80">Giây</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <SlideAnimation delay={0.2} className="py-4">
            <ButtonRegiterStudy isFree={data?.courseDetail?.isFree} idCourse={data?.id} />

            <div className="bg-white dark:bg-gray-800 mt-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <IoMdRibbon className="mr-2 text-indigo-500 dark:text-indigo-400" />
                Thông tin khóa học
              </h3>

              <div className="space-y-4">
                <FadeAnimation delay={0.3} className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2.5 rounded-lg mr-4">
                    <CgPerformance className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Cấp độ</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{data?.level?.name || "Cơ bản"}</div>
                  </div>
                </FadeAnimation>

                <FadeAnimation delay={0.4} className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2.5 rounded-lg mr-4">
                    <TbMovie className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Số bài học</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{totalLesson} bài học</div>
                  </div>
                </FadeAnimation>

                <FadeAnimation delay={0.5} className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2.5 rounded-lg mr-4">
                    <MdOutlineAccessTimeFilled className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Thời lượng</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{timeCourse}</div>
                  </div>
                </FadeAnimation>

                <FadeAnimation delay={0.6} className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2.5 rounded-lg mr-4">
                    <IoIosBatteryFull className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Truy cập</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{data?.courseDetail?.slogan || "Trọn đời"}</div>
                  </div>
                </FadeAnimation>
              </div>
            </div>

            {/* Benefits section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 mt-6 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Bạn sẽ nhận được
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-indigo-50 dark:border-indigo-800/30"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(238, 242, 255, 0.9)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-indigo-600 dark:text-indigo-400 mr-3">
                      {benefit.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Course access indicators */}
            <div className="bg-white dark:bg-gray-800 mt-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Truy cập khóa học</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-indigo-500 dark:text-indigo-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Học trên web</span>
                  </div>
                  <div className="text-emerald-500 dark:text-emerald-400">
                    <FaUnlock />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaRegClock className="text-indigo-500 dark:text-indigo-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Học mọi lúc</span>
                  </div>
                  <div className="text-emerald-500 dark:text-emerald-400">
                    <FaUnlock />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiDownload className="text-indigo-500 dark:text-indigo-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Tải tài liệu</span>
                  </div>
                  <div className="text-emerald-500 dark:text-emerald-400">
                    <FaUnlock />
                  </div>
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">Chia sẻ khóa học</h3>
              <div className="flex justify-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </SlideAnimation>
        </div>
      </div>
      <ModalIntroduce
        id={data?.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default CourseInfo;
