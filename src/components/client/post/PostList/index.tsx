'use client';
import { getAllPost } from '@/api/axios/api';
import Pagination from './Pagination';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import { IpageEdit } from '@/types/next-auth';
import React, { useEffect, useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { motion, AnimatePresence } from 'framer-motion';
import TruncateMarkdown from '@/components/client/TruncateMarkdown';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import { message } from 'antd';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// Icons
import {
  FiSearch,
  FiFilter,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiEdit,
  FiMoreHorizontal,
  FiCopy,
  FiCheckCircle,
  FiEye
} from 'react-icons/fi';
import {
  FaFacebook,
  FaTwitter
} from 'react-icons/fa';
import { MdEmail, MdOutlineMoreHoriz } from 'react-icons/md';
import {
  FaCircleCheck,
  FaLink,
  FaPencil,
} from 'react-icons/fa6';
import { IoIosMore } from 'react-icons/io';

// Types
interface Post {
  id: number;
  title: string;
  content: string;
  banner: string;
  createdAt: string;
  userId: number;
  blogType: {
    id: number;
    type: string;
  };
  user: {
    id: number;
    role: number;
    name: string;
    avatar: string;
    isMe: boolean;
  };
  reactionCount?: number;
  countView?: number;
}

interface PostListProps {
  types: any[];
}

const PostList = ({ types }: PostListProps) => {
  // console.log('types', types);
  const router = useRouter();
  const ref = useRef<any>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStateNav(3));
  }, []);
  const user = useAppSelector(state => state.auth?.user?.user);
  const [messageApi, contextHolder] = message.useMessage();

  // States
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);

  const [params, setParams] = useState<IpageEdit>({
    pageSize: 10,
    pageNumber: 1,
    totalPage: 1,
    totalCount: 0,
    searchTerm: '',
    sortField: 'CreatedAt',
    sortOrder: 'desc',
  });
  console.log('params', user);

  // Set active nav item
  useEffect(() => {
    dispatch(setStateNav(3));
  }, [dispatch]);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [params.pageNumber, params.searchTerm, selectedType]);

  const fetchPosts = async () => {
    setIsLoading(true);
    ref.current?.continuousStart();

    try {
      const config = {
        ...params,
        searchTerm: searchTerm,
        typeId: selectedType || undefined
      };

      const res = await getAllPost({ config });
      // console.log('res', res);
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setPosts(res?.data?.posts || []);
        setParams({
          ...params,
          totalCount: res?.data?.totalCount || 0,
          totalPage: res?.data?.totalPage || 1,
        });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      messageApi.error("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
      ref.current?.complete();
    }
  };

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({
      ...params,
      pageNumber: 1,
      searchTerm: searchTerm
    });
  };

  const handleFilterByType = (typeId: number | null) => {
    setSelectedType(typeId);
    setParams({
      ...params,
      pageNumber: 1
    });
  };

  const handlePageChange = (page: number) => {
    setParams({
      ...params,
      pageNumber: page
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add a function to generate slug from title and id
  const generateSlug = (title: string, id: number) => {
    // Remove special characters, replace spaces with hyphens, and convert to lowercase
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();                  // Trim leading/trailing spaces

    // Append the ID to the slug
    return `${slug}-${id}`;
  };

  const handleViewPost = (id: number, title: string) => {
    ref.current?.continuousStart();
    const slug = generateSlug(title, id);
    router.push(`/post/${slug}`);
  };

  const handleEditPost = (id: number) => {
    ref.current?.continuousStart();
    router.push(`/post/edit/${id}`);
  };

  const handleShareFacebook = (id: number, title: string) => {
    const slug = generateSlug(title, id);
    const url = `${window.location.origin}/post/${slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(null);
  };

  const handleShareTwitter = (id: number, title: string) => {
    const slug = generateSlug(title, id);
    const url = `${window.location.origin}/post/${slug}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Xem bài viết này! ' + url)}`, '_blank');
    setShowShareMenu(null);
  };

  const handleShareEmail = (id: number, title: string) => {
    const slug = generateSlug(title, id);
    const url = `${window.location.origin}/post/${slug}`;
    window.open(`mailto:?subject=${encodeURIComponent('Xem bài viết này')}&body=${encodeURIComponent('Tôi muốn chia sẻ bài viết này với bạn: ' + url)}`, '_blank');
    setShowShareMenu(null);
  };

  const handleCopyLink = (id: number, title: string) => {
    const slug = generateSlug(title, id);
    const url = `${window.location.origin}/post/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      messageApi.success('Đã sao chép liên kết');
      setShowShareMenu(null);
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    } catch (error) {
      return "không xác định";
    }
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    // Remove markdown syntax
    const cleanText = text
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*|__/g, '') // Remove bold
      .replace(/\*|_/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, '') // Remove images
      .replace(/\n/g, ' '); // Replace newlines with spaces

    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  // Thêm useEffect và useRef để xử lý click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(null);
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const shareMenuRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {contextHolder}
      <LoadingBar color="#4f46e5" ref={ref} height={3} shadow={true} />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cộng đồng F8</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Nơi chia sẻ kinh nghiệm học tập, kỹ thuật lập trình và cơ hội nghề nghiệp trong ngành công nghệ.
            </p>
            <div className="mt-8">
              <Link
                href="/post/create"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-full font-medium shadow-lg hover:bg-gray-100 transition-colors"
              >
                <FiEdit className="mr-2" /> Viết bài mới
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex-1 relative"
          >
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tìm
            </button>
          </form>

          <div className="relative group">
            <button
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiFilter />
              <span>Lọc theo chủ đề</span>
            </button>

            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10 hidden group-hover:block">
              <div className="p-2">
                <button
                  onClick={() => handleFilterByType(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg ${!selectedType ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  Tất cả chủ đề
                </button>

                {types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleFilterByType(type.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedType === type.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {type.type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {isLoading && posts.length === 0 ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"
              >
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-xl">Không tìm thấy bài viết nào</p>
                <p className="mt-2">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
              </motion.div>
            ) : (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  {/* Banner image at top */}
                  {post.banner && (
                    <div
                      className="cursor-pointer w-full h-48 overflow-hidden"
                      onClick={() => handleViewPost(post.id, post.title)}
                    >
                      <img
                        src={post.banner}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col">
                    {/* Post type tag */}
                    <div className="mb-3">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                        onClick={() => handleFilterByType(post.blogType.id)}
                      >
                        {post.blogType.type}
                      </span>
                    </div>

                    {/* Post title */}
                    <h2
                      className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      onClick={() => handleViewPost(post.id, post.title)}
                    >
                      {post.title}
                    </h2>

                    {/* Post excerpt */}
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                      <div dangerouslySetInnerHTML={{ __html: truncateText(post.content, 80) }} />
                    </div>

                    {/* Author info and post stats */}
                    <div className="mt-auto">
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          {/* Author */}
                          <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => router.push(`/profile/${post.user.id}`)}
                          >
                            <img
                              src={post.user.avatar || "https://placehold.co/200/indigo/white?text=User"}
                              alt={post.user.name}
                              className="w-8 h-8 rounded-full object-cover border border-indigo-100 dark:border-indigo-800"
                            />
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[100px]">
                                {post.user.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(post.createdAt)}
                              </div>
                            </div>
                          </div>

                          {/* Post interactions */}
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                            <div className="flex items-center">
                              <FiHeart className="mr-1" />
                              <span>{post.reactionCount || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <FiEye className="mr-1" />
                              <span>{post.countView || 0}</span>
                            </div>
                          </div>

                          {/* Post actions */}
                          <div className="flex items-center space-x-1">
                            {/* Share button */}
                            <div className="relative">
                              <button
                                onClick={() => setShowShareMenu(showShareMenu === post.id ? null : post.id)}
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <FiShare2 className="text-gray-500 dark:text-gray-400 text-sm" />
                              </button>

                              {showShareMenu === post.id && (
                                <div
                                  ref={shareMenuRef}
                                  className="absolute right-0 -top-52 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                                >
                                  <div className="p-2">
                                    <button
                                      onClick={() => handleShareFacebook(post.id, post.title)}
                                      className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <FaFacebook className="mr-3 text-blue-600" />
                                      <span>Chia sẻ Facebook</span>
                                    </button>

                                    <button
                                      onClick={() => handleShareTwitter(post.id, post.title)}
                                      className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <FaTwitter className="mr-3 text-blue-400" />
                                      <span>Chia sẻ Twitter</span>
                                    </button>

                                    <button
                                      onClick={() => handleShareEmail(post.id, post.title)}
                                      className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <MdEmail className="mr-3 text-red-500" />
                                      <span>Gửi qua Email</span>
                                    </button>

                                    <button
                                      onClick={() => handleCopyLink(post.id, post.title)}
                                      className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <FiCopy className="mr-3 text-gray-600" />
                                      <span>Sao chép liên kết</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* More actions button */}
                            {user?.id === post.userId && (
                              <div className="relative">
                                <button
                                  onClick={() => setShowActionsMenu(showActionsMenu === post.id ? null : post.id)}
                                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <FiMoreHorizontal className="text-gray-500 dark:text-gray-400 text-sm" />
                                </button>

                                {showActionsMenu === post.id && (
                                  <div
                                    ref={actionsMenuRef}
                                    className="absolute right-0 -top-20 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                                  >
                                    <div className="p-2">
                                      <button
                                        onClick={() => handleEditPost(post.id)}
                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        <FiEdit className="mr-3 text-indigo-600" />
                                        <span>Chỉnh sửa</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(params.pageNumber - 1)}
                disabled={params.pageNumber <= 1}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Trước
              </button>

              {Array.from({ length: params.totalPage }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${params.pageNumber === page
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } transition-colors`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(params.pageNumber + 1)}
                disabled={params.pageNumber >= params.totalPage}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Tiếp
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;

