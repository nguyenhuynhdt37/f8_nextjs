'use client';
import { useEffect, useState } from 'react';
import Category from './Category';
import { getAllCourseByLevel, getDashboardStatisticsByHomePage } from '@/api/axios/api';
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import FeaturedPost from './FeaturedPost';
import { IoSchoolOutline, IoRocketOutline, IoNewspaperOutline, IoApps, IoFolderOutline, IoTerminalOutline, IoSettingsOutline, IoTimeOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FaCode, FaLaptopCode, FaArrowRight, FaGraduationCap, FaUserGraduate } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/Utils/functions/slugify';

const Home = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [courseOne, setCourseOne] = useState<any>(null);
  const [courseTwo, setCourseTwo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statistics, setStatistics] = useState<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(setStateNav(1));
    const getDataAsync = async () => {
      setIsLoading(true);
      try {
        const res = await getDashboardStatisticsByHomePage();
        setStatistics(res?.data);
        const resOne = await getAllCourseByLevel(1);
        const resTwo = await getAllCourseByLevel(2);
        setCourseOne(resOne?.data);
        setCourseTwo(resTwo?.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDataAsync();

    // Cập nhật thời gian mỗi phút
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Animated background variants
  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900"
        variants={backgroundVariants}
        animate="animate"
        style={{
          backgroundSize: "200% 200%",
        }}
      >
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 30 - 15],
                x: [0, Math.random() * 30 - 15],
                scale: [1, Math.random() * 0.2 + 0.9],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Học Lập Trình <br />
                  <span className="text-yellow-300">Để Đi Làm</span>
                </h1>
                <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-lg">
                  Khởi đầu sự nghiệp của bạn với các khóa học chất lượng cao,
                  được thiết kế bởi các chuyên gia hàng đầu.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/learning-paths')}
                    className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center shadow-lg"
                  >
                    <FaGraduationCap className="mr-2" />
                    Lộ trình học tập
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/courses')}
                    className="bg-blue-800 bg-opacity-50 backdrop-blur-sm text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center border border-blue-400"
                  >
                    <FaLaptopCode className="mr-2" />
                    Khám phá khóa học
                  </motion.button>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                  {/* Terminal Header */}
                  <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-400">bash ~ f8-learning</div>
                    <div></div>
                  </div>

                  {/* Terminal Content */}
                  <div className="p-4 font-mono text-sm text-green-400">
                    <TypewriterEffect />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl -z-10 opacity-50 blur-sm"></div>
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl -z-10 opacity-50 blur-sm"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCard
              icon={<FaUserGraduate className="text-blue-500 text-3xl" />}
              value={statistics?.totalUsers}
              label="Học viên"
            />
            <StatCard
              icon={<IoFolderOutline className="text-indigo-500 text-3xl" />}
              value={statistics?.totalCourses}
              label="Khóa học"
            />
            <StatCard
              icon={<IoTerminalOutline className="text-purple-500 text-3xl" />}
              value={statistics?.totalLessons}
              label="Bài học"
            />
            <StatCard
              icon={<IoNewspaperOutline className="text-green-500 text-3xl" />}
              value={statistics?.totalBlogs}
              label="Bài viết"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Lộ trình học tập */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                    <IoSchoolOutline className="text-2xl text-blue-500 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Lộ trình học tập</h2>
                </div>
                <Category data={courseOne} />
                <div className="mt-6 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/learning-paths')}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Xem tất cả lộ trình
                    <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </div>

              {/* Khóa học chuyên sâu */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                    <IoRocketOutline className="text-2xl text-green-500 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Khóa học chuyên sâu</h2>
                </div>
                <Category data={courseTwo} />
                <div className="mt-6 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/courses')}
                    className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300"
                  >
                    Xem tất cả khóa học
                    <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </div>

              {/* Bài viết nổi bật */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                    <IoNewspaperOutline className="text-2xl text-purple-500 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Bài viết nổi bật</h2>
                </div>
                <FeaturedPost />
                <div className="mt-6 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/post')}
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300"
                  >
                    Xem tất cả bài viết
                    <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-700 dark:from-indigo-800 dark:to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <HiOutlineSparkles className="text-4xl text-yellow-300 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sẵn sàng bắt đầu hành trình học tập?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Đăng ký ngay hôm nay để tiếp cận các khóa học chất lượng cao và cộng đồng học tập sôi động.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg shadow-lg"
            >
              Bắt đầu ngay
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Typewriter Effect Component
const TypewriterEffect = () => {
  const [text, setText] = useState('');
  const fullText = `$ git clone https://github.com/nguyenhuynhdt37/f8_nextjs\n> Installing packages...\n> Successfully installed!\n\n$ yarn install\n$ yarn dev:ssl\n> Welcome to F8 Learning Platform!\n> Loading courses...\n> Ready to learn! Happy coding!`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return <pre className="whitespace-pre-wrap">{text}</pre>;
};

// Stat Card Component
const StatCard = ({ icon, value, label }: { icon: React.ReactNode; label: string; value: string }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </motion.div>
  );
};

// Desktop Icon Component
const DesktopIcon = ({ icon, label }: { icon: React.ReactNode; label: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center p-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm text-gray-700 dark:text-gray-300 text-center">{label}</span>
    </motion.div>
  );
};

export default Home;
