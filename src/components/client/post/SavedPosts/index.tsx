'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { message, Spin, Empty, Pagination, Button, Input, Dropdown, Menu, Tooltip, Checkbox, Tag, Modal } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import { getSavedPosts, savePost } from '@/api/axios/api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { generateSlug } from '@/Utils/functions/slugify';

// Icons
import {
    FiBookmark,
    FiCalendar,
    FiChevronDown,
    FiEye,
    FiFilter,
    FiGrid,
    FiHeart,
    FiImage,
    FiList,
    FiSearch,
    FiTrash2,
    FiUser,
    FiX,
    FiClock,
    FiSettings,
    FiInfo,
    FiSliders,
    FiPlus,
    FiExternalLink
} from 'react-icons/fi';

// Types
interface SavedPost {
    postId: number;
    title: string;
    banner: string;
    blogTypeId: number;
    blogTypeName: string;
    createdAt: string;
    savedAt: string;
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    reactionCount: number;
    viewCount: number;
}

interface SavedPostsState {
    posts: SavedPost[];
    totalCount: number;
    totalPages: number;
    loading: boolean;
    currentPage: number;
    pageSize: number;
    sortField: string;
    sortOrder: string;
    viewMode: 'grid' | 'list';
    searchQuery: string;
}

const SavedPosts: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(state => state.auth?.user?.user);
    const [messageApi, contextHolder] = message.useMessage();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // State
    const [state, setState] = useState<SavedPostsState>({
        posts: [],
        totalCount: 0,
        totalPages: 0,
        loading: true,
        currentPage: 1,
        pageSize: 12,
        sortField: 'SavedAt',
        sortOrder: 'desc',
        viewMode: 'grid',
        searchQuery: '',
    });

    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    // Set active nav item
    useEffect(() => {
        dispatch(setStateNav(3)); // 3 is for blog/posts
    }, [dispatch]);

    // Check authentication
    useEffect(() => {
        if (!user) {
            messageApi.warning('Vui lòng đăng nhập để xem danh sách bài viết đã lưu');
            router.push('/');
        }
    }, [user, router, messageApi]);

    // Fetch saved posts
    const fetchSavedPosts = async () => {
        if (!user) return;

        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await getSavedPosts(
                state.currentPage,
                state.pageSize,
                state.sortField,
                state.sortOrder
            );

            if (response.statusCode === 200) {
                setState(prev => ({
                    ...prev,
                    posts: response.data.posts || [],
                    totalCount: response.data.totalCount || 0,
                    totalPages: response.data.totalPages || 0,
                    loading: false,
                }));
            } else {
                messageApi.error(response.message || 'Không thể tải danh sách bài viết đã lưu');
                setState(prev => ({ ...prev, loading: false }));
            }
        } catch (error: any) {
            console.error('Failed to fetch saved posts:', error);
            messageApi.error(error?.message || 'Không thể tải danh sách bài viết đã lưu');
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, [state.currentPage, state.pageSize, state.sortField, state.sortOrder]);

    // Handle pagination change
    const handlePageChange = (page: number, pageSize?: number) => {
        setState(prev => ({
            ...prev,
            currentPage: page,
            pageSize: pageSize || prev.pageSize,
        }));
    };

    // Handle sort change
    const handleSortChange = (option: { field: string; order: string }) => {
        setState(prev => ({
            ...prev,
            sortField: option.field,
            sortOrder: option.order,
            currentPage: 1, // Reset to first page on sort change
        }));
    };

    // Handle view mode change
    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setState(prev => ({ ...prev, viewMode: mode }));
    };

    // Handle search
    const handleSearch = (value: string) => {
        setState(prev => ({
            ...prev,
            searchQuery: value,
            currentPage: 1, // Reset to first page on search
        }));
    };

    // Handle unsave post
    const handleUnsavePost = async (postId: number) => {
        try {
            const response = await savePost(postId, 'unsave');

            if (response.statusCode === 200) {
                if (response.data.action !== 'none') {
                    messageApi.success('Đã xóa bài viết khỏi danh sách đã lưu');
                    // Refresh the list
                    fetchSavedPosts();
                }
            } else {
                messageApi.error(response.message || 'Có lỗi xảy ra khi xóa bài viết khỏi danh sách đã lưu');
            }
        } catch (error: any) {
            console.error('Failed to unsave post:', error);
            messageApi.error(error?.message || 'Không thể xóa bài viết khỏi danh sách đã lưu');
        }
    };

    // Handle bulk removal of posts
    const handleBulkRemove = async () => {
        if (selectedPosts.length === 0) {
            messageApi.warning('Vui lòng chọn ít nhất một bài viết để xóa');
            return;
        }

        setDeleteModalVisible(true);
    };

    // Confirm bulk removal
    const confirmBulkRemove = async () => {
        setIsRemoving(true);
        try {
            const promises = selectedPosts.map(postId => savePost(postId, 'unsave'));
            await Promise.all(promises);

            messageApi.success(`Đã xóa ${selectedPosts.length} bài viết khỏi danh sách đã lưu`);
            setSelectedPosts([]);
            fetchSavedPosts();
            setDeleteModalVisible(false);
        } catch (error: any) {
            console.error('Failed to remove selected posts:', error);
            messageApi.error('Không thể xóa một số bài viết. Vui lòng thử lại sau.');
        } finally {
            setIsRemoving(false);
        }
    };

    // Handle post selection
    const handleSelectPost = (postId: number) => {
        setSelectedPosts(prev => {
            if (prev.includes(postId)) {
                return prev.filter(id => id !== postId);
            } else {
                return [...prev, postId];
            }
        });
    };

    // Handle select all posts
    const handleSelectAll = () => {
        if (selectedPosts.length === filteredPosts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(filteredPosts.map(post => post.postId));
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
        } catch (error) {
            return "không xác định";
        }
    };

    // Filter posts by search query
    const filteredPosts = state.searchQuery
        ? state.posts.filter(post =>
            post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            post.blogTypeName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
        : state.posts;

    // Get filtered posts by type if filter is active
    const filteredByTypePosts = activeFilter === 'all'
        ? filteredPosts
        : filteredPosts.filter(post => post.blogTypeName.toLowerCase() === activeFilter.toLowerCase());

    // Get unique blog types for filtering
    const uniqueBlogTypes = Array.from(new Set(state.posts.map(post => post.blogTypeName)));

    // Sort options
    const sortOptions = [
        { label: 'Mới nhất đã lưu', field: 'SavedAt', order: 'desc' },
        { label: 'Cũ nhất đã lưu', field: 'SavedAt', order: 'asc' },
        { label: 'Mới đăng nhất', field: 'CreatedAt', order: 'desc' },
        { label: 'Cũ đăng nhất', field: 'CreatedAt', order: 'asc' },
        { label: 'Theo tiêu đề (A-Z)', field: 'Title', order: 'asc' },
        { label: 'Theo tiêu đề (Z-A)', field: 'Title', order: 'desc' },
        { label: 'Nhiều lượt thích nhất', field: 'Reactions', order: 'desc' },
        { label: 'Nhiều lượt xem nhất', field: 'Views', order: 'desc' },
    ];

    // Get current sort option label
    const currentSortLabel = sortOptions.find(
        opt => opt.field === state.sortField && opt.order === state.sortOrder
    )?.label || 'Sắp xếp';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {contextHolder}

            {/* Heroic header with 3D design */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800">
                {/* Background patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
                </div>

                {/* Content with 3D effect */}
                <div className="relative pt-12 pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center md:text-left md:max-w-2xl"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                                Bộ sưu tập bài viết
                            </h1>
                            <p className="mt-4 text-xl text-white/80 max-w-3xl">
                                Tất cả bài viết bạn đã lưu trong một nơi, dễ dàng quản lý và truy cập khi cần
                            </p>
                        </motion.div>

                        {/* Stats cards */}
                        <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20 text-white">
                                        <FiBookmark size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-white/70">Bài viết đã lưu</p>
                                        <h3 className="text-2xl font-bold text-white">{state.totalCount}</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20 text-white">
                                        <FiClock size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-white/70">Đã lưu gần đây</p>
                                        <h3 className="text-2xl font-bold text-white">{state.posts.length > 0 ? formatDate(state.posts[0]?.savedAt) : 'Không có'}</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20 text-white">
                                        <FiHeart size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-white/70">Lượt thích</p>
                                        <h3 className="text-2xl font-bold text-white">
                                            {state.posts.reduce((sum, post) => sum + post.reactionCount, 0)}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20 text-white">
                                        <FiEye size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-white/70">Lượt xem</p>
                                        <h3 className="text-2xl font-bold text-white">
                                            {state.posts.reduce((sum, post) => sum + post.viewCount, 0)}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Search and filter cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-8 md:mt-10 bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-xl relative -mb-20 md:-mb-24"
                        >
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="w-full md:w-1/3">
                                    <div className="relative">
                                        <Input
                                            placeholder="Tìm kiếm bài viết đã lưu..."
                                            prefix={<FiSearch className="text-white/60" />}
                                            value={state.searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="py-2.5 px-4 w-full bg-white/20 border-white/30 rounded-xl text-white placeholder-white/60"
                                            allowClear={{ clearIcon: <FiX className="text-white/60" /> }}
                                        />
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex-1 flex flex-wrap gap-2">
                                    <Tag.CheckableTag
                                        className={`${activeFilter === 'all'
                                            ? 'bg-white/30 text-white'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'} 
                                            py-1.5 px-3 rounded-full border border-white/30 cursor-pointer`}
                                        checked={activeFilter === 'all'}
                                        onChange={() => setActiveFilter('all')}
                                    >
                                        Tất cả
                                    </Tag.CheckableTag>

                                    {uniqueBlogTypes.map(type => (
                                        <Tag.CheckableTag
                                            key={type}
                                            className={`${activeFilter === type.toLowerCase()
                                                ? 'bg-white/30 text-white'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20'} 
                                                py-1.5 px-3 rounded-full border border-white/30 cursor-pointer`}
                                            checked={activeFilter === type.toLowerCase()}
                                            onChange={() => setActiveFilter(type.toLowerCase())}
                                        >
                                            {type}
                                        </Tag.CheckableTag>
                                    ))}
                                </div>

                                <div className="w-full md:w-auto flex items-center gap-3">
                                    <Dropdown
                                        overlay={
                                            <Menu className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl">
                                                {sortOptions.map((option) => (
                                                    <Menu.Item
                                                        key={`${option.field}-${option.order}`}
                                                        onClick={() => handleSortChange(option)}
                                                        className={option.field === state.sortField && option.order === state.sortOrder
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/30'
                                                            : ''}
                                                    >
                                                        <div className={`flex items-center px-3 py-2 text-sm ${option.field === state.sortField && option.order === state.sortOrder
                                                            ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                            }`}>
                                                            {option.label}
                                                        </div>
                                                    </Menu.Item>
                                                ))}
                                            </Menu>
                                        }
                                        trigger={['click']}
                                        placement="bottomRight"
                                    >
                                        <Button
                                            icon={<FiSliders size={16} />}
                                            className="flex items-center gap-2 py-2.5 px-4 bg-white/20 border-white/30 text-white rounded-xl hover:bg-white/30"
                                        >
                                            <span>{currentSortLabel}</span>
                                            <FiChevronDown size={16} />
                                        </Button>
                                    </Dropdown>

                                    <div className="flex rounded-xl overflow-hidden border border-white/30">
                                        <Tooltip title="Chế độ lưới">
                                            <button
                                                onClick={() => handleViewModeChange('grid')}
                                                className={`h-10 w-10 flex items-center justify-center ${state.viewMode === 'grid'
                                                    ? 'bg-white/30 text-white'
                                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                    }`}
                                            >
                                                <FiGrid size={18} />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Chế độ danh sách">
                                            <button
                                                onClick={() => handleViewModeChange('list')}
                                                className={`h-10 w-10 flex items-center justify-center ${state.viewMode === 'list'
                                                    ? 'bg-white/30 text-white'
                                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                    }`}
                                            >
                                                <FiList size={18} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            {/* Selection and bulk actions */}
                            {selectedPosts.length > 0 && (
                                <div className="mt-4 flex items-center justify-between bg-indigo-600/40 rounded-xl py-2 px-4">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={selectedPosts.length === filteredByTypePosts.length && filteredByTypePosts.length > 0}
                                            indeterminate={selectedPosts.length > 0 && selectedPosts.length < filteredByTypePosts.length}
                                            onChange={handleSelectAll}
                                            className="bg-white/20 border-white/50 rounded"
                                        />
                                        <span className="text-white">
                                            Đã chọn {selectedPosts.length} / {filteredByTypePosts.length} bài viết
                                        </span>
                                    </div>

                                    <Button
                                        danger
                                        type="primary"
                                        icon={<FiTrash2 size={16} />}
                                        onClick={handleBulkRemove}
                                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 border-none"
                                    >
                                        Xóa khỏi danh sách
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            <Modal
                title={
                    <div className="flex items-center text-red-500 gap-2">
                        <FiTrash2 size={20} />
                        <span>Xác nhận xóa</span>
                    </div>
                }
                open={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="delete"
                        danger
                        type="primary"
                        loading={isRemoving}
                        onClick={confirmBulkRemove}
                    >
                        Xác nhận xóa
                    </Button>
                ]}
                centered
            >
                <p>Bạn có chắc chắn muốn xóa {selectedPosts.length} bài viết đã chọn khỏi danh sách đã lưu?</p>
                <p className="text-gray-500 mt-2">Hành động này không thể hoàn tác.</p>
            </Modal>

            {/* Main content with posts */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {state.loading ? (
                    <div className="min-h-[50vh] flex items-center justify-center">
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải bài viết đã lưu...</p>
                        </div>
                    </div>
                ) : filteredByTypePosts.length > 0 ? (
                    <>
                        {/* Grid view */}
                        {state.viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {filteredByTypePosts.map((post) => (
                                        <motion.div
                                            key={post.postId}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30
                                            }}
                                            className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                        >
                                            {/* Selection checkbox */}
                                            <div className="absolute top-3 left-3 z-10">
                                                <Checkbox
                                                    checked={selectedPosts.includes(post.postId)}
                                                    onChange={() => handleSelectPost(post.postId)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-md"
                                                />
                                            </div>

                                            {/* Banner image */}
                                            <div className="aspect-video w-full relative overflow-hidden">
                                                {post.banner ? (
                                                    <img
                                                        src={post.banner}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                                        <FiImage size={40} className="text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                )}

                                                {/* Category badge */}
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-600/90 text-white backdrop-blur-sm">
                                                        {post.blogTypeName}
                                                    </span>
                                                </div>

                                                {/* Save/unsave button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleUnsavePost(post.postId);
                                                    }}
                                                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-rose-500 shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                                    title="Xóa khỏi danh sách đã lưu"
                                                >
                                                    <FiBookmark className="fill-current" />
                                                </button>
                                            </div>

                                            {/* Post content */}
                                            <Link
                                                href={`/post/${generateSlug(post.title, post.postId)}`}
                                                className="flex-1 flex flex-col p-5"
                                            >
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {post.title}
                                                </h3>

                                                <div className="mt-auto pt-4">
                                                    {/* Author info */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={post.author.avatar || "https://via.placeholder.com/40"}
                                                                alt={post.author.name}
                                                                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                                            />
                                                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                                                {post.author.name}
                                                            </span>
                                                        </div>

                                                        {/* Date saved */}
                                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                            <FiClock size={12} className="mr-1" />
                                                            <span>{formatDate(post.savedAt)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center">
                                                                <FiHeart size={14} className="mr-1 text-rose-500" />
                                                                {post.reactionCount}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <FiEye size={14} className="mr-1 text-blue-500" />
                                                                {post.viewCount}
                                                            </span>
                                                        </div>

                                                        <div className="text-indigo-500 dark:text-indigo-400 text-sm font-medium flex items-center group-hover:underline">
                                                            <span>Đọc bài</span>
                                                            <FiExternalLink size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* List view */}
                        {state.viewMode === 'list' && (
                            <div className="space-y-5">
                                <AnimatePresence mode="popLayout">
                                    {filteredByTypePosts.map((post) => (
                                        <motion.div
                                            key={post.postId}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <Link
                                                href={`/post/${generateSlug(post.title, post.postId)}`}
                                                className="flex flex-col sm:flex-row"
                                            >
                                                {/* Banner image */}
                                                <div className="sm:w-1/4 lg:w-1/5 relative">
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <Checkbox
                                                            checked={selectedPosts.includes(post.postId)}
                                                            onChange={() => handleSelectPost(post.postId)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-md"
                                                        />
                                                    </div>

                                                    {post.banner ? (
                                                        <img
                                                            src={post.banner}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover aspect-video sm:aspect-auto sm:min-h-full transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full min-h-[150px] sm:min-h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                                            <FiImage size={30} className="text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 sm:w-3/4 lg:w-4/5 flex flex-col">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                                                            {post.blogTypeName}
                                                        </span>
                                                        <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                            <FiClock size={12} className="mr-1" />
                                                            <span>Đã lưu {formatDate(post.savedAt)}</span>
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {post.title}
                                                    </h3>

                                                    <div className="mt-auto flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={post.author.avatar || "https://via.placeholder.com/40"}
                                                                alt={post.author.name}
                                                                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                                            />
                                                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {post.author.name}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="flex items-center">
                                                                    <FiHeart size={16} className="mr-1 text-rose-500" />
                                                                    {post.reactionCount}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <FiEye size={16} className="mr-1 text-blue-500" />
                                                                    {post.viewCount}
                                                                </span>
                                                            </div>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleUnsavePost(post.postId);
                                                                }}
                                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-rose-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                                title="Xóa khỏi danh sách đã lưu"
                                                            >
                                                                <FiBookmark className="fill-current" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-10 flex justify-center">
                            <Pagination
                                current={state.currentPage}
                                pageSize={state.pageSize}
                                total={state.totalCount}
                                onChange={handlePageChange}
                                showSizeChanger
                                pageSizeOptions={['12', '24', '48', '96']}
                                showTotal={(total, range) => `${range[0]}-${range[1]} trên ${total} bài viết`}
                                className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm"
                            />
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto"
                    >
                        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
                            <FiBookmark size={30} className="text-indigo-600 dark:text-indigo-400" />
                        </div>

                        {state.searchQuery ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Không tìm thấy bài viết
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Không có bài viết nào phù hợp với từ khóa "{state.searchQuery}"
                                </p>
                                <Button
                                    type="primary"
                                    onClick={() => setState(prev => ({ ...prev, searchQuery: '' }))}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                                >
                                    Xóa bộ lọc
                                </Button>
                            </>
                        ) : activeFilter !== 'all' ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Không có bài viết nào thuộc loại "{activeFilter}"
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Hãy thử chọn một danh mục khác hoặc xem tất cả bài viết đã lưu
                                </p>
                                <Button
                                    type="primary"
                                    onClick={() => setActiveFilter('all')}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                                >
                                    Xem tất cả bài viết
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Bạn chưa lưu bài viết nào
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Khám phá các bài viết trên F8 và lưu lại những bài viết bạn thích
                                </p>
                                <Button
                                    type="primary"
                                    onClick={() => router.push('/')}
                                    icon={<FiPlus size={16} />}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                                >
                                    Khám phá bài viết
                                </Button>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SavedPosts; 