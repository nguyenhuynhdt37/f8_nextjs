'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search, Filter, Plus, Edit, Lock, Unlock, Trash2, RefreshCw,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    UserPlus, Users, ShieldCheck, ShieldOff, MoreHorizontal, Download, Upload, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllUser, getRoles, deleteUser, toggleUserStatus, resetUserPassword } from '@/api/axios/api';
import Image from 'next/image';
import { toast } from 'sonner';
import { Dropdown, Menu, Pagination, Tooltip, Modal, Button, Badge, Tag, Space, Input, Select } from 'antd';
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

    // Fetch users with dynamic filtering
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllUser({
                config: filters
            });

            if (response.statusCode === 200) {
                setUsers(response.data.items);
                setTotalUsers(response.data.totalCount);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Fetch roles
    const fetchRoles = useCallback(async () => {
        try {
            const response = await getRoles();
            if (response.statusCode === 200) {
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
        setFilters(prev => ({ ...prev, [key]: value, pageNumber: 1 }));
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

            if (response.statusCode === 200) {
                toast.success('Xóa người dùng thành công');
                fetchUsers();
                setSelectedUsers(prev => prev.filter(id => id !== userToDelete));
            } else {
                toast.error(response.message || 'Xóa người dùng thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa người dùng');
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
            const response = await toggleUserStatus(userId, currentStatus === 1 ? 0 : 1);

            if (response.statusCode === 200) {
                toast.success(
                    currentStatus === 1
                        ? 'Đã vô hiệu hóa người dùng'
                        : 'Đã kích hoạt người dùng'
                );
                fetchUsers();
            } else {
                toast.error(response.message || 'Thay đổi trạng thái thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thay đổi trạng thái');
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
            const response = await resetUserPassword(userToResetPassword);

            if (response.statusCode === 200) {
                toast.success('Đặt lại mật khẩu thành công. Email đã được gửi đến người dùng.');
            } else {
                toast.error(response.message || 'Đặt lại mật khẩu thất bại');
            }
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
    const getRoleBadge = (roleName: string = '') => {
        switch (roleName.toLowerCase()) {
            case 'admin':
                return { color: 'red', icon: <ShieldCheck size={14} /> };
            case 'moderator':
                return { color: 'purple', icon: <ShieldCheck size={14} /> };
            case 'user':
                return { color: 'blue', icon: <Users size={14} /> };
            default:
                return { color: 'default', icon: <Users size={14} /> };
        }
    };

    // Action menu for each user
    const getActionMenu = (user: User) => (
        <Menu items={[
            {
                key: 'edit',
                label: 'Chỉnh sửa',
                icon: <Edit size={14} />,
                onClick: () => router.push(`/admin/users/edit/${user.id}`)
            },
            {
                key: 'status',
                label: user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt',
                icon: user.isActive ? <Lock size={14} /> : <Unlock size={14} />,
                onClick: () => handleToggleStatus(user.id, user.isActive)
            },
            {
                key: 'reset',
                label: 'Đặt lại mật khẩu',
                icon: <RefreshCw size={14} />,
                onClick: () => showResetPasswordConfirm(user.id)
            },
            {
                type: 'divider'
            },
            {
                key: 'delete',
                label: 'Xóa người dùng',
                icon: <Trash2 size={14} className="text-red-500" />,
                danger: true,
                onClick: () => showDeleteConfirm(user.id)
            }
        ]} />
    );

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
                            <Input
                                prefix={<Search className="text-slate-400" size={18} />}
                                placeholder="Tìm kiếm theo tên, email..."
                                value={tempSearchTerm}
                                onChange={handleSearchChange}
                                className="w-full"
                                allowClear
                            />
                        </div>

                        <div className="md:col-span-3">
                            <Select
                                placeholder="Lọc theo vai trò"
                                value={filters.role || undefined}
                                onChange={(value) => handleFilterChange('role', value || '')}
                                className="w-full"
                                allowClear
                            >
                                {roles.map(role => (
                                    <Select.Option key={role.id} value={role.code}>
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(role.name).icon}
                                            <span>{role.name}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        <div className="md:col-span-3">
                            <Select
                                placeholder="Lọc theo trạng thái"
                                value={filters.status || undefined}
                                onChange={(value) => handleFilterChange('status', value || '')}
                                className="w-full"
                                allowClear
                            >
                                <Select.Option value="1">
                                    <div className="flex items-center gap-2">
                                        <Badge status="success" />
                                        <span>Hoạt động</span>
                                    </div>
                                </Select.Option>
                                <Select.Option value="0">
                                    <div className="flex items-center gap-2">
                                        <Badge status="error" />
                                        <span>Vô hiệu</span>
                                    </div>
                                </Select.Option>
                            </Select>
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
                                    users.map(user => {
                                        const roleBadge = getRoleBadge(user.roleName || '');
                                        return (
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
                                                                <Image
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
                                                    <Tag
                                                        color={roleBadge.color}
                                                        icon={roleBadge.icon}
                                                        className="flex items-center gap-1 py-1"
                                                    >
                                                        {user.roleName}
                                                    </Tag>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        status={user.isActive ? "success" : "error"}
                                                        text={user.isActive ? "Hoạt động" : "Vô hiệu"}
                                                    />
                                                </td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">
                                                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    })}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Dropdown
                                                        overlay={getActionMenu(user)}
                                                        trigger={['click']}
                                                        placement="bottomRight"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<MoreHorizontal size={18} />}
                                                            className="hover:bg-slate-100 dark:hover:bg-slate-700"
                                                        />
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-300 mb-3 sm:mb-0">
                            Hiển thị {users.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0} đến{' '}
                            {Math.min(filters.pageNumber * filters.pageSize, totalUsers)} của {totalUsers} người dùng
                        </div>

                        <Pagination
                            current={filters.pageNumber}
                            pageSize={filters.pageSize}
                            total={totalUsers}
                            onChange={(page) => handleFilterChange('pageNumber', page)}
                            onShowSizeChange={(_, size) => handleFilterChange('pageSize', size)}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `Tổng ${total} người dùng`}
                        />
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Xác nhận xóa người dùng"
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
                            onClick={handleDeleteConfirm}
                            loading={loading}
                        >
                            Xóa
                        </Button>
                    ]}
                >
                    <div className="flex items-center gap-3 py-2">
                        <div className="p-2 rounded-full bg-red-50 text-red-500">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="font-medium">Bạn có chắc chắn muốn xóa người dùng này?</p>
                            <p className="text-slate-500 text-sm">Hành động này không thể hoàn tác.</p>
                        </div>
                    </div>
                </Modal>

                {/* Reset Password Confirmation Modal */}
                <Modal
                    title="Xác nhận đặt lại mật khẩu"
                    open={resetPasswordModalVisible}
                    onCancel={() => setResetPasswordModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setResetPasswordModalVisible(false)}>
                            Hủy
                        </Button>,
                        <Button
                            key="reset"
                            type="primary"
                            onClick={handleResetPasswordConfirm}
                            loading={loading}
                        >
                            Đặt lại mật khẩu
                        </Button>
                    ]}
                >
                    <div className="flex items-center gap-3 py-2">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <p className="font-medium">Đặt lại mật khẩu cho người dùng này?</p>
                            <p className="text-slate-500 text-sm">Mật khẩu mới sẽ được gửi qua email của người dùng.</p>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default UserTable;
