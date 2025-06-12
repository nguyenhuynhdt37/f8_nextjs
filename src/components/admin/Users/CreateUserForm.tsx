'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateUserDto } from '@/types/user';
import { createUser, getRoles, sendNotification } from '@/api/axios/api';
import RichTextEditor from '@/components/RichTextEditor';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeftIcon, UserIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface Role {
    id: number;
    name: string;
    code: string;
}

const CreateUserForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateUserDto>({
        fullName: '',
        email: '',
        password: '',
        isActive: 1,
        roleId: 1
    });
    const [loading, setLoading] = useState(false);
    const [bioContent, setBioContent] = useState<string>('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                if (response?.statusCode === 200 && response.data) {
                    setRoles(response.data);
                } else {
                    showToast('Không thể tải danh sách vai trò', 'error');
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
                showToast('Đã xảy ra lỗi khi tải danh sách vai trò', 'error');
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.roleId) {
            newErrors.roleId = 'Vui lòng chọn vai trò';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            isActive: checked ? 1 : 0
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type and size
            const isImage = file.type.startsWith('image/');
            const isLt2M = file.size / 1024 / 1024 < 5;

            if (!isImage) {
                showToast('Chỉ có thể tải lên tệp hình ảnh!', 'error');
                return;
            }

            if (!isLt2M) {
                showToast('Hình ảnh phải nhỏ hơn 5MB!', 'error');
                return;
            }

            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const removeAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        // Reset file input
        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
            document.body.appendChild(container);
            toastContainer = document.getElementById('toast-container');
        }

        const toast = document.createElement('div');
        toast.className = `p-4 rounded-md shadow-md transition-all duration-300 transform translate-x-0 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`;
        toast.textContent = message;

        toastContainer?.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    };

    // Helper function to format avatar path
    const formatAvatarPath = (path: string | null | undefined): string => {
        if (!path) return '/images/default-avatar.png';

        // If path already starts with http, it's an absolute URL
        if (path.startsWith('http')) return path;

        // Fix path that doesn't include /images prefix
        if (path.startsWith('/users/')) {
            return `/images${path}`;
        }

        return path;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Create FormData to handle file upload
            const submitFormData = new FormData();
            submitFormData.append('fullName', formData.fullName);
            submitFormData.append('email', formData.email);
            submitFormData.append('password', formData.password);
            submitFormData.append('isActive', formData.isActive.toString());

            // Ensure roleId is always sent as a number
            const roleId = formData.roleId || 1; // Default to 1 if not set
            submitFormData.append('roleId', roleId.toString());

            // Add bio content
            submitFormData.append('bio', bioContent || '');

            // Add avatar file if present
            if (avatar) {
                submitFormData.append('avatar', avatar);
            }

            console.log('Submitting form with data:', {
                fullName: formData.fullName,
                email: formData.email,
                password: '******',
                isActive: formData.isActive,
                roleId: roleId,
                hasAvatar: !!avatar
            });

            const response = await createUser(submitFormData);

            if (response?.statusCode === 200 || response?.statusCode === 201) {
                showToast('Người dùng đã được tạo thành công', 'success');

                // Send notification to the new user
                try {
                    await sendNotification({
                        title: 'Chào mừng bạn đến với F8',
                        message: 'Tài khoản của bạn đã được tạo thành công. Hãy khám phá các khóa học và tính năng của F8!',
                        userId: response.data.id
                    });
                } catch (notificationError) {
                    console.error('Error sending notification:', notificationError);
                }

                router.push('/admin/users');
            } else {
                showToast(response?.message || 'Có lỗi xảy ra khi tạo người dùng', 'error');
            }
        } catch (error: any) {
            console.error('Error creating user:', error);
            showToast(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Tạo người dùng mới</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                                placeholder="Nhập họ và tên"
                            />
                            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                                placeholder="Nhập email"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mật khẩu sẽ được gửi đến email của người dùng sau khi tạo tài khoản</p>
                        </div>

                        {/* Avatar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Ảnh đại diện
                            </label>
                            <div className="mt-1 flex items-center">
                                <div className="relative">
                                    <div className={`h-20 w-20 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 flex items-center justify-center border-2 ${avatarPreview ? 'border-blue-500' : 'border-dashed border-gray-300 dark:border-slate-600'}`}>
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                        )}
                                    </div>
                                    {avatarPreview && (
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="ml-5">
                                    <label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                                        <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                                        Tải lên
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        name="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="sr-only"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF tối đa 5MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Giới thiệu
                            </label>
                            <div className="mt-1">
                                <RichTextEditor
                                    value={bioContent}
                                    onChange={setBioContent}
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Vai trò <span className="text-red-500">*</span>
                            </label>
                            {loadingRoles ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Đang tải danh sách vai trò...</span>
                                </div>
                            ) : (
                                <select
                                    id="roleId"
                                    name="roleId"
                                    value={formData.roleId}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            roleId: value ? parseInt(value, 10) : 1 // Default to 1 (user role) if empty
                                        }));
                                    }}
                                    className={`w-full px-3 py-2 border ${errors.roleId ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                                >
                                    <option value="">Chọn vai trò</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.roleId && <p className="mt-1 text-sm text-red-500">{errors.roleId}</p>}
                        </div>

                        {/* Active Status */}
                        <div>
                            <div className="flex items-center">
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                                    Trạng thái hoạt động
                                </label>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={formData.isActive === 1}
                                    onClick={() => handleSwitchChange(formData.isActive === 0)}
                                    className={`${formData.isActive === 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-600'
                                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                >
                                    <span
                                        className={`${formData.isActive === 1 ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </button>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    {formData.isActive === 1 ? 'Hoạt động' : 'Vô hiệu'}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium ${loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'Tạo người dùng'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserForm; 