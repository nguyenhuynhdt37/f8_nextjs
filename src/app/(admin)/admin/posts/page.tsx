"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaSearch, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { getAdminPendingPosts, approvePost } from '@/api/axios/api';

interface Post {
    id: number;
    title: string;
    content: string;
    banner: string;
    createdAt: string;
    updatedAt: string;
    blogType: {
        id: number;
        type: string;
    };
    user: {
        id: number;
        name: string;
        avatar: string;
        email: string;
    };
}

interface PendingPostsResponse {
    statusCode: number;
    message: string;
    data: {
        posts: Post[];
        totalCount: number;
        totalPage: number;
    };
}

const AdminPostsPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [sortField, setSortField] = useState('CreatedAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const router = useRouter();

    useEffect(() => {
        fetchPendingPosts();
    }, [currentPage, sortField, sortOrder]);

    const fetchPendingPosts = async () => {
        try {
            setLoading(true);
            const response = await getAdminPendingPosts(
                currentPage,
                10,
                sortField,
                sortOrder,
                searchTerm
            );

            if (response.statusCode === 200) {
                setPosts(response.data.posts);
                setTotalPages(response.data.totalPage);
            } else {
                toast.error('Không thể tải danh sách bài viết');
            }
        } catch (error) {
            console.error('Error fetching pending posts:', error);
            toast.error('Đã xảy ra lỗi khi tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPendingPosts();
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleApprove = async (postId: number) => {
        try {
            const response = await approvePost(postId, true);

            if (response.statusCode === 200) {
                toast.success('Đã phê duyệt bài viết thành công');
                fetchPendingPosts();
            } else {
                toast.error('Không thể phê duyệt bài viết');
            }
        } catch (error) {
            console.error('Error approving post:', error);
            toast.error('Đã xảy ra lỗi khi phê duyệt bài viết');
        }
    };

    const openRejectModal = (postId: number) => {
        setSelectedPostId(postId);
        setRejectionReason('');
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        if (!selectedPostId) return;

        try {
            const response = await approvePost(selectedPostId, false, rejectionReason);

            if (response.statusCode === 200) {
                toast.success('Đã từ chối bài viết thành công');
                setShowRejectModal(false);
                fetchPendingPosts();
            } else {
                toast.error('Không thể từ chối bài viết');
            }
        } catch (error) {
            console.error('Error rejecting post:', error);
            toast.error('Đã xảy ra lỗi khi từ chối bài viết');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    &laquo;
                </button>
                {pages}
                <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    &raquo;
                </button>
            </div>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý bài viết</h1>

            {/* Search bar */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-l w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                    >
                        <FaSearch />
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Không có bài viết nào chờ duyệt</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('Title')}
                                    >
                                        Tiêu đề {sortField === 'Title' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại bài viết
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tác giả
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('CreatedAt')}
                                    >
                                        Ngày tạo {sortField === 'CreatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {post.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.blogType.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {post.user.avatar && (
                                                    <img
                                                        src={post.user.avatar}
                                                        alt={post.user.name}
                                                        className="h-8 w-8 rounded-full mr-2"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {post.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {post.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(post.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/post/${post.id}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded"
                                                    title="Xem bài viết"
                                                >
                                                    <FaEye />
                                                </Link>
                                                <button
                                                    onClick={() => handleApprove(post.id)}
                                                    className="text-green-600 hover:text-green-900 bg-green-100 p-2 rounded"
                                                    title="Phê duyệt"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => openRejectModal(post.id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded"
                                                    title="Từ chối"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {renderPagination()}
                </>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Từ chối bài viết</h3>
                        <p className="mb-4">Vui lòng cung cấp lý do từ chối bài viết này:</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 mb-4 h-32"
                            placeholder="Nhập lý do từ chối..."
                        ></textarea>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={!rejectionReason.trim()}
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPostsPage; 