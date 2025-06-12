import React, { useEffect, useState } from 'react';
import { GetPostOutstandingAsync } from '@/api/axios/api';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoPersonOutline, IoEyeOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/Utils/functions/slugify';

const Post = ({ data }: { data: any }) => {
  const router = useRouter();

  const handleClick = () => {
    if (data.id && data.title) {
      const slug = generateSlug(data.title, data.id);
      router.push(`/post/${slug}`);
    } else {
      router.push(`/post/${data.id}`);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden h-40">


        <img
          src={data.banner || 'https://via.placeholder.com/400x225'}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="flex items-center text-xs text-white">
            <IoCalendarOutline className="mr-1" />
            <span>{formatDate(data.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 dark:text-white transition-colors">
          {data.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-3 flex-1">
          {data.description || 'Không có mô tả'}
        </p>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <div className="flex items-center">
            <IoPersonOutline className="mr-1" />
            <span>{data.user?.fullName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <IoEyeOutline className="mr-1" />
            <span>{data.countView || 0} lượt xem</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedPost = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDataAsync = async () => {
      setLoading(true);
      try {
        const res = await GetPostOutstandingAsync();
        if (res?.statusCode === 200) {
          setData(res?.data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    getDataAsync();
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((post: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Post data={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPost;

