'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiMoon, FiSun } from 'react-icons/fi';

const ErrorPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Theo dõi vị trí chuột để tạo hiệu ứng parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Kiểm tra theme từ localStorage hoặc system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));

    // Áp dụng theme
    document.documentElement.classList.toggle('dark', isDarkMode);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Cập nhật theme khi thay đổi
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Tính toán hiệu ứng parallax dựa trên vị trí chuột
  const calcParallax = (factor: number) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (mousePosition.x - centerX) / factor;
    const moveY = (mousePosition.y - centerY) / factor;
    return { x: moveX, y: moveY };
  };

  // Hiệu ứng cho các phần tử
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const floatingAnimation = {
    y: ['-5px', '5px'],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300 to-indigo-400 dark:from-purple-900 dark:to-indigo-900 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-300 to-cyan-400 dark:from-blue-900 dark:to-cyan-900 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-indigo-400 dark:bg-indigo-600' : i % 3 === 1 ? 'bg-purple-400 dark:bg-purple-600' : 'bg-blue-400 dark:bg-blue-600'}`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.4, 0.1, 0.4]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Header with Logo */}
      <motion.div
        className="fixed top-0 left-0 w-full p-6 flex items-center justify-between z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href={'/'} className="flex items-center">
          <div className="flex items-center">
            <motion.img
              src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
              alt="F8 Logo"
              className="w-10 h-10 rounded-lg mr-3"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.span
              className="text-lg font-bold"
              animate={floatingAnimation}
            >
              F8 - Học lập trình để đi làm
            </motion.span>
          </div>
        </Link>

        <motion.button
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Text */}
        <motion.div
          className="relative"
          style={{ perspective: 1000 }}
          variants={itemVariants}
        >
          <motion.h1
            className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-400"
            animate={{
              ...calcParallax(30),
              textShadow: isDarkMode
                ? ['0 0 10px rgba(139, 92, 246, 0.3)', '0 0 20px rgba(139, 92, 246, 0.2)', '0 0 30px rgba(139, 92, 246, 0.1)']
                : ['0 0 10px rgba(139, 92, 246, 0.1)', '0 0 20px rgba(139, 92, 246, 0.05)']
            }}
          >
            404
          </motion.h1>

          <motion.div
            className="absolute -inset-0.5 rounded-lg blur-sm bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 opacity-10"
            animate={{
              ...calcParallax(20)
            }}
          />
        </motion.div>

        {/* Message */}
        <motion.h2
          className="mt-6 text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100"
          variants={itemVariants}
          animate={{ ...calcParallax(60) }}
        >
          Không tìm thấy nội dung
        </motion.h2>

        <motion.div
          className="mt-6 space-y-4"
          variants={itemVariants}
        >
          <p className="text-lg text-gray-600 dark:text-gray-300">
            URL của nội dung này đã bị thay đổi hoặc không còn tồn tại.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Nếu bạn đang lưu URL này, hãy thử truy cập lại từ trang chủ thay vì dùng URL đã lưu.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={'/'} className="group">
              <div className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white font-medium rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-700/20 hover:shadow-xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-700/30 transition-all duration-300">
                <FiHome className="mr-2" />
                <span>Về trang chủ</span>
              </div>
            </Link>
          </motion.div>

          <motion.button
            className="px-8 py-3 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            <FiArrowLeft className="mr-2" />
            <span>Quay lại</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 text-center text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <p>© {new Date().getFullYear()} F8 - Học lập trình để đi làm</p>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
