'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search, Filter, Plus, Edit, Lock, Unlock, Trash2, RefreshCw,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    UserPlus, Users, ShieldCheck, ShieldOff, MoreHorizontal, Download, Upload, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllUser, getRoles, deleteUser, toggleUserStatus, resetUserPassword } from '@/api/axios/api';

import { toast } from 'sonner';
import { debounce } from 'lodash';

// Type definitions
interface User {
    id: number;
    fullName: string;
    email: string;
    roleId: number;
    roleName?: string;
    isActive: number;
    createdAt: string;
    avatar: string | null;
}

interface Role {
    id: number;
    name: string;
    code: string;
}

interface FilterParams {
    searchTerm: string;
    role: string;
    status: string;
    pageNumber: number;
    pageSize: number;
    sortField: string;
    sortOrder: string;
}

interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

interface UserListResponse {
    items: User[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

const UserTable: React.FC = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
    const [userToResetPassword, setUserToResetPassword] = useState<number | null>(null);
    const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

    // Pagination and filtering
    const [filters, setFilters] = useState<FilterParams>({
        searchTerm: '',
        role: '',
        status: '',
        pageNumber: 1,
        pageSize: 10,
        sortField: 'createdAt',
        sortOrder: 'desc'
    });

    const [totalUsers, setTotalUsers] = useState(0);
    const [tempSearchTerm, setTempSearchTerm] = useState('');

    // Calculate pagination values properly
    const totalPages = useMemo(() => {
        // Ensure we don't divide by zero and always have at least 1 page
        return Math.max(1, Math.ceil(totalUsers / Math.max(1, filters.pageSize)));
    }, [totalUsers, filters.pageSize]);

    // Generate simple page numbers with direct numbering
    const pageNumbers = useMemo(() => {
        if (totalUsers === 0) return [];
        if (totalPages <= 5) {
            // If 5 pages or less, show all pages
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            // Show current page and 2 pages before and after when possible
            const numbers = [];

            // Always add page 1
            numbers.push(1);

            // Add pages around current
            for (let i = Math.max(2, filters.pageNumber - 1); i <= Math.min(totalPages - 1, filters.pageNumber + 1); i++) {
                numbers.push(i);
            }

            // Always add last page
            if (totalPages > 1) {
                numbers.push(totalPages);
            }

            return numbers;
        }
    }, [filters.pageNumber, totalPages, totalUsers]);

    // Fetch users with dynamic filtering
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            // Make a copy of the filters with validated pagination values
            const validatedFilters = {
                ...filters,
                pageNumber: Math.max(1, filters.pageNumber || 1),
                pageSize: Math.max(1, filters.pageSize || 10)
            };

            console.log("Fetching users with filters:", validatedFilters);
            const response = await getAllUser(validatedFilters);

            if (response && response.statusCode === 200 && response.data) {
                console.log("API response data:", response.data);
                setUsers(response.data.items || []);
                setTotalUsers(response.data.totalCount || 0);

                // If current page has no results and we're not on page 1, go back to page 1
                const calculatedTotalPages = Math.ceil((response.data.totalCount || 0) / validatedFilters.pageSize);
                if (validatedFilters.pageNumber > calculatedTotalPages && calculatedTotalPages > 0) {
                    console.log("Adjusting to page 1 as current page exceeds total pages");
                    setFilters(prev => ({ ...prev, pageNumber: 1 }));
                }
            } else {
                console.warn("Invalid API response:", response);
                setUsers([]);
                setTotalUsers(0);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error('Không thể tải danh sách người dùng');
            setUsers([]);
            setTotalUsers(0);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Fetch roles
    const fetchRoles = useCallback(async () => {
        try {
            const response = await getRoles();
            console.log(response);
            if (response && response.data) {
                setRoles(response.data);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách vai trò');
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    // Debounced search handler
    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                setFilters(prev => ({ ...prev, searchTerm: value, pageNumber: 1 }));
            }, 500),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTempSearchTerm(value);
        debouncedSearch(value);
    };

    // Handle filter changes
    const handleFilterChange = (key: keyof FilterParams, value: string | number) => {
        if (key === 'pageNumber') {
            // Khi thay đổi trang, chỉ cập nhật số trang
            setFilters(prev => ({ ...prev, [key]: Number(value) }));
        } else {
            // Khi thay đổi bộ lọc khác, reset về trang 1
            setFilters(prev => ({ ...prev, [key]: value, pageNumber: 1 }));
        }
    };

    // Handle user deletion
    const showDeleteConfirm = (userId: number) => {
        setUserToDelete(userId);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            setLoading(true);
            const response = await deleteUser(userToDelete);
            const data = response?.data || response;

            // Process response and update UI
            toast.success('Xóa người dùng thành công');
            fetchUsers();
            setSelectedUsers(prev => prev.filter(id => id !== userToDelete));
        } catch (error: any) {
            toast.error("Người dùng đã sử dụng tài khoản");
        } finally {
            setLoading(false);
            setDeleteModalVisible(false);
            setUserToDelete(null);
        }
    };

    // Toggle user status
    const handleToggleStatus = async (userId: number, currentStatus: number) => {
        try {
            setLoading(true);
            await toggleUserStatus(userId, currentStatus === 1 ? 0 : 1);

            toast.success(
                currentStatus === 1
                    ? 'Đã vô hiệu hóa người dùng'
                    : 'Đã kích hoạt người dùng'
            );
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const showResetPasswordConfirm = (userId: number) => {
        setUserToResetPassword(userId);
        setResetPasswordModalVisible(true);
    };

    const handleResetPasswordConfirm = async () => {
        if (!userToResetPassword) return;

        try {
            setLoading(true);
            await resetUserPassword(userToResetPassword);

            toast.success('Đặt lại mật khẩu thành công. Email đã được gửi đến người dùng.');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đặt lại mật khẩu');
        } finally {
            setLoading(false);
            setResetPasswordModalVisible(false);
            setUserToResetPassword(null);
        }
    };

    // Selection handlers
    const toggleUserSelection = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectAllUsers = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
    };

    // Get role badge style
    const getRoleBadgeStyles = (roleName: string = '') => {
        switch (roleName.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'moderator':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'user':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Toggle dropdown
    const toggleDropdown = (userId: number) => {
        if (dropdownOpenId === userId) {
            setDropdownOpenId(null);
        } else {
            setDropdownOpenId(userId);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                            Quản Lý Người Dùng
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                            Quản lý và điều chỉnh tài khoản người dùng trong hệ thống
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => router.push('/admin/users/create')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <UserPlus size={18} />
                            <span>Thêm Người Dùng</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 relative">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                    placeholder="Tìm kiếm theo tên, email..."
                                    value={tempSearchTerm}
                                    onChange={handleSearchChange}
                                />
                                {tempSearchTerm && (
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => {
                                            setTempSearchTerm('');
                                            debouncedSearch('');
                                        }}
                                    >
                                        <svg className="h-4 w-4 text-gray-400 hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <select
                                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={filters.role || ''}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                            >
                                <option value="">Lọc theo vai trò</option>
                                {roles?.map(role => (
                                    <option key={role.id} value={role.code}>{role.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <select
                                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Lọc theo trạng thái</option>
                                <option value="1">Hoạt động</option>
                                <option value="0">Vô hiệu</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="p-4 text-left w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === users.length && users.length > 0}
                                            onChange={selectAllUsers}
                                            className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="p-4 text-left font-medium text-slate-600 dark:text-slate-300">Người Dùng</th>
                                    <th className="p-4 text-left font-medium text-slate-600 dark:text-slate-300">Vai Trò</th>
                                    <th className="p-4 text-left font-medium text-slate-600 dark:text-slate-300">Trạng Thái</th>
                                    <th className="p-4 text-left font-medium text-slate-600 dark:text-slate-300">Ngày Tạo</th>
                                    <th className="p-4 text-right font-medium text-slate-600 dark:text-slate-300">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: filters.pageSize }).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            <td className="p-4">
                                                <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                    <div>
                                                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                                        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                            </td>
                                            <td className="p-4">
                                                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                            </td>
                                            <td className="p-4">
                                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded ml-auto"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-8">
                                            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                <AlertCircle size={48} className="mb-3 opacity-40" />
                                                <p className="text-lg font-medium">Không tìm thấy người dùng nào</p>
                                                <p className="text-sm">Thử thay đổi bộ lọc hoặc thêm người dùng mới</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr
                                            key={user.id}
                                            className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleUserSelection(user.id)}
                                                    className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt={user.fullName}
                                                                width={40}
                                                                height={40}
                                                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                                                                {user.fullName.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {user.fullName}
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyles(user.roleName)}`}>
                                                    {user.roleName === 'Admin' && <ShieldCheck size={12} className="mr-1" />}
                                                    {user.roleName === 'User' && <Users size={12} className="mr-1" />}
                                                    {user.roleName}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    <span className={`w-2 h-2 mr-1 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
                                                        onClick={() => toggleDropdown(user.id)}
                                                    >
                                                        <MoreHorizontal size={18} className="text-slate-500" />
                                                    </button>

                                                    {dropdownOpenId === user.id && (
                                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
                                                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                <button
                                                                    onClick={() => { router.push(`/admin/users/edit/${user.id}`); setDropdownOpenId(null); }}
                                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                    role="menuitem"
                                                                >
                                                                    <Edit size={14} className="mr-2" />
                                                                    Chỉnh sửa
                                                                </button>

                                                                <button
                                                                    onClick={() => { handleToggleStatus(user.id, user.isActive); setDropdownOpenId(null); }}
                                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                    role="menuitem"
                                                                >
                                                                    {user.isActive ? (
                                                                        <>
                                                                            <Lock size={14} className="mr-2" />
                                                                            Vô hiệu hóa
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Unlock size={14} className="mr-2" />
                                                                            Kích hoạt
                                                                        </>
                                                                    )}
                                                                </button>

                                                                <button
                                                                    onClick={() => { showResetPasswordConfirm(user.id); setDropdownOpenId(null); }}
                                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                    role="menuitem"
                                                                >
                                                                    <RefreshCw size={14} className="mr-2" />
                                                                    Đặt lại mật khẩu
                                                                </button>

                                                                <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>

                                                                <button
                                                                    onClick={() => { showDeleteConfirm(user.id); setDropdownOpenId(null); }}
                                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                    role="menuitem"
                                                                >
                                                                    <Trash2 size={14} className="mr-2" />
                                                                    Xóa người dùng
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Custom Pagination */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-300 mb-3 sm:mb-0">
                            Hiển thị {users.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0} đến{' '}
                            {Math.min(filters.pageNumber * filters.pageSize, totalUsers)} của {totalUsers} người dùng
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Page size selector */}
                            <select
                                className="text-sm border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 mr-2"
                                value={filters.pageSize}
                                onChange={(e) => handleFilterChange('pageSize', parseInt(e.target.value))}
                            >
                                {[10, 20, 30, 50].map(size => (
                                    <option key={size} value={size}>{size} / trang</option>
                                ))}
                            </select>

                            {/* Pagination controls */}
                            <nav className="flex items-center space-x-1">
                                {/* First page */}
                                <button
                                    onClick={() => handleFilterChange('pageNumber', 1)}
                                    disabled={filters.pageNumber === 1}
                                    className={`p-1 rounded ${filters.pageNumber === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <ChevronsLeft size={16} />
                                </button>

                                {/* Previous page */}
                                <button
                                    onClick={() => handleFilterChange('pageNumber', filters.pageNumber - 1)}
                                    disabled={filters.pageNumber === 1}
                                    className={`p-1 rounded ${filters.pageNumber === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Page numbers */}
                                {pageNumbers.map((page, index) => (
                                    <React.Fragment key={page}>
                                        {/* Add ellipsis if there's a gap in page numbers */}
                                        {index > 0 && page > pageNumbers[index - 1] + 1 && (
                                            <span className="px-3 py-1 text-gray-500">...</span>
                                        )}

                                        <button
                                            onClick={() => handleFilterChange('pageNumber', page)}
                                            className={`px-3 py-1 rounded ${filters.pageNumber === page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))}

                                {/* Next page */}
                                <button
                                    onClick={() => handleFilterChange('pageNumber', filters.pageNumber + 1)}
                                    disabled={filters.pageNumber === totalPages}
                                    className={`p-1 rounded ${filters.pageNumber === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <ChevronRight size={16} />
                                </button>

                                {/* Last page */}
                                <button
                                    onClick={() => handleFilterChange('pageNumber', totalPages)}
                                    disabled={filters.pageNumber === totalPages}
                                    className={`p-1 rounded ${filters.pageNumber === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <ChevronsRight size={16} />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModalVisible && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setDeleteModalVisible(false)}></div>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md mx-auto">
                                <div className="p-5">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Xác nhận xóa người dùng
                                    </h3>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="p-2 rounded-full bg-red-50 text-red-500">
                                            <AlertCircle size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium dark:text-white">Bạn có chắc chắn muốn xóa người dùng này?</p>
                                            <p className="text-slate-500 text-sm">Hành động này không thể hoàn tác.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 px-5 py-3 flex justify-end gap-2 rounded-b-lg">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                                        onClick={() => setDeleteModalVisible(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                        onClick={handleDeleteConfirm}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xóa...
                                            </span>
                                        ) : 'Xóa'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Reset Password Confirmation Modal */}
                {resetPasswordModalVisible && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setResetPasswordModalVisible(false)}></div>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md mx-auto">
                                <div className="p-5">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Xác nhận đặt lại mật khẩu
                                    </h3>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                                            <RefreshCw size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium dark:text-white">Đặt lại mật khẩu cho người dùng này?</p>
                                            <p className="text-slate-500 text-sm">Mật khẩu mới sẽ được gửi qua email của người dùng.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 px-5 py-3 flex justify-end gap-2 rounded-b-lg">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                                        onClick={() => setResetPasswordModalVisible(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                        onClick={handleResetPasswordConfirm}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xử lý...
                                            </span>
                                        ) : 'Đặt lại mật khẩu'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserTable;
