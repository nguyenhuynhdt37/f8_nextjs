'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiLink, FiGithub, FiYoutube, FiFacebook, FiLinkedin, FiGlobe, FiChevronLeft, FiSave, FiUpload, FiCheck, FiX, FiEye, FiEyeOff, FiInfo } from 'react-icons/fi';
import { editProfile, changePassword, updateSocialLinks, updateAvatar } from '@/api/axios/api';
import { message } from 'antd';
import { useAppSelector, useAppDispatch } from '@/redux/hook/hook';
import { getInfoRedux } from '@/redux/reducers/slices/AuthSlice';

const ProfileEditForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [showSuccess, setShowSuccess] = useState<{ profile: boolean, password: boolean, social: boolean }>({
        profile: false,
        password: false,
        social: false
    });
    const [showPassword, setShowPassword] = useState<{
        currentPassword: boolean,
        newPassword: boolean,
        confirmPassword: boolean
    }>({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    // Track if forms have been changed
    const [formChanged, setFormChanged] = useState<{
        profile: boolean,
        password: boolean,
        social: boolean
    }>({
        profile: false,
        password: false,
        social: false
    });

    // Get user data from Redux store
    const userData = useAppSelector(state => state.auth?.user?.user);
    console.log(userData);
    const isLoadingUser = useAppSelector(state => state.auth?.loading);

    // Form states
    // Profile form
    const [profileForm, setProfileForm] = useState({
        fullName: '',
        userName: '',
        bio: ''
    });
    const [profileErrors, setProfileErrors] = useState({
        fullName: '',
        userName: '',
        bio: ''
    });

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Social links form
    const [socialForm, setSocialForm] = useState({
        facebookLink: '',
        youtubeLink: '',
        githubLink: '',
        personalWebsite: ''
    });
    const [socialErrors, setSocialErrors] = useState({
        facebookLink: '',
        youtubeLink: '',
        githubLink: '',
        personalWebsite: ''
    });

    // Original form data to compare against changes
    const [originalData, setOriginalData] = useState({
        profile: {
            fullName: '',
            userName: '',
            bio: ''
        },
        social: {
            facebookLink: '',
            youtubeLink: '',
            githubLink: '',
            personalWebsite: ''
        }
    });

    // Fetch user data from Redux on component mount
    useEffect(() => {
        dispatch(getInfoRedux());
    }, [dispatch]);

    // Update form values when user data is available
    useEffect(() => {
        if (userData) {
            // Set profile form data
            const profileData = {
                fullName: userData.fullName || '',
                userName: userData.userName || '',
                bio: userData.bio || ''
            };

            setProfileForm(profileData);

            // Set social links form data
            const socialData = {
                facebookLink: userData.facebookLink || '',
                youtubeLink: userData.youtubeLink || '',
                githubLink: userData.githubLink || '',
                personalWebsite: userData.personalWebsite || ''
            };

            setSocialForm(socialData);

            // Save original data for comparison
            setOriginalData({
                profile: { ...profileData },
                social: { ...socialData }
            });

            // Set avatar preview
            if (userData.avatar) {
                setAvatarPreview(userData.avatar);
            }
        }
    }, [userData]);

    // Handle profile form changes
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedForm = {
            ...profileForm,
            [name]: value
        };

        setProfileForm(updatedForm);

        // Clear error when user types
        if (profileErrors[name as keyof typeof profileErrors]) {
            setProfileErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Check if form data has changed from original
        const hasChanged =
            updatedForm.fullName.trim() !== originalData.profile.fullName.trim() ||
            updatedForm.userName.trim() !== originalData.profile.userName.trim() ||
            updatedForm.bio.trim() !== originalData.profile.bio.trim();

        setFormChanged(prev => ({
            ...prev,
            profile: hasChanged
        }));
    };

    // Validate profile form
    const validateProfileForm = () => {
        let isValid = true;
        const errors = {
            fullName: '',
            userName: '',
            bio: ''
        };

        // Validate fullName
        if (!profileForm.fullName.trim()) {
            errors.fullName = 'Họ tên không được để trống';
            isValid = false;
        } else if (profileForm.fullName.trim().length < 2) {
            errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
            isValid = false;
        } else if (profileForm.fullName.trim().length > 50) {
            errors.fullName = 'Họ tên không được vượt quá 50 ký tự';
            isValid = false;
        }

        // Validate userName
        if (!profileForm.userName.trim()) {
            errors.userName = 'Tên người dùng không được để trống';
            isValid = false;
        } else if (profileForm.userName.trim().length < 3) {
            errors.userName = 'Tên người dùng phải có ít nhất 3 ký tự';
            isValid = false;
        } else if (profileForm.userName.trim().length > 30) {
            errors.userName = 'Tên người dùng không được vượt quá 30 ký tự';
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(profileForm.userName.trim())) {
            errors.userName = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
            isValid = false;
        }

        // Validate bio
        if (profileForm.bio && profileForm.bio.trim().length > 500) {
            errors.bio = 'Giới thiệu không được vượt quá 500 ký tự';
            isValid = false;
        }

        setProfileErrors(errors);
        return isValid;
    };

    // Handle avatar change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle avatar submit
    const handleAvatarSubmit = async () => {
        if (!avatarFile) {
            messageApi.error("Vui lòng chọn ảnh đại diện");
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            // Display loading message
            const key = 'avatarUpdate';
            messageApi.loading({ content: 'Đang cập nhật ảnh đại diện...', key, duration: 0 });

            // Truyền đúng định dạng tham số theo định nghĩa API
            const response = await updateAvatar(formData);

            // Check response
            if (response.statusCode && response.statusCode !== 200) {
                messageApi.error({ content: response.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện', key, duration: 3 });
                return;
            }

            // Refresh user data in Redux after successful update
            dispatch(getInfoRedux());

            // Clear avatar file state
            setAvatarFile(null);

            messageApi.success({ content: 'Cập nhật ảnh đại diện thành công', key, duration: 3 });
        } catch (error: any) {
            console.error("Avatar update error:", error);
            const errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện';
            messageApi.error({ content: errorMessage, duration: 3 });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle profile submit
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Trim input values to avoid spaces-only inputs
        const trimmedProfileForm = {
            fullName: profileForm.fullName.trim(),
            userName: profileForm.userName.trim(),
            bio: profileForm.bio.trim()
        };

        // Update the form with trimmed values
        setProfileForm(trimmedProfileForm);

        // Check if data has actually changed
        if (!formChanged.profile) {
            messageApi.info('Không có thông tin nào được thay đổi');
            return;
        }

        if (!validateProfileForm()) {
            messageApi.error("Vui lòng kiểm tra lại thông tin nhập vào");
            return;
        }

        try {
            setIsLoading(true);

            // Display loading message
            const key = 'profileUpdate';
            messageApi.loading({ content: 'Đang cập nhật thông tin...', key, duration: 0 });

            const response = await editProfile(trimmedProfileForm.fullName, trimmedProfileForm.userName, trimmedProfileForm.bio);

            // Check response
            if (response.statusCode && response.statusCode !== 200) {
                messageApi.error({ content: response.message || 'Có lỗi xảy ra khi cập nhật thông tin', key, duration: 3 });
                return;
            }

            // Show success state
            setShowSuccess(prev => ({ ...prev, profile: true }));

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(prev => ({ ...prev, profile: false }));
            }, 3000);

            // Refresh user data in Redux after successful update
            dispatch(getInfoRedux());

            // Update original data
            setOriginalData(prev => ({
                ...prev,
                profile: { ...trimmedProfileForm }
            }));

            // Reset form changed state
            setFormChanged(prev => ({ ...prev, profile: false }));

            messageApi.success({ content: 'Cập nhật thông tin thành công', key, duration: 3 });
        } catch (error: any) {
            console.error("Profile update error:", error);
            const errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật thông tin';
            messageApi.error({ content: errorMessage, duration: 3 });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle password form changes
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedForm = {
            ...passwordForm,
            [name]: value
        };

        setPasswordForm(updatedForm);

        // Clear error when user types
        if (passwordErrors[name as keyof typeof passwordErrors]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Check if form has any values (any non-empty fields)
        const hasValues =
            updatedForm.currentPassword.trim() !== '' ||
            updatedForm.newPassword.trim() !== '' ||
            updatedForm.confirmPassword.trim() !== '';

        setFormChanged(prev => ({
            ...prev,
            password: hasValues
        }));
    };

    // Validate password form
    const validatePasswordForm = () => {
        let isValid = true;
        const errors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        // Validate currentPassword
        if (!passwordForm.currentPassword.trim()) {
            errors.currentPassword = 'Mật khẩu hiện tại không được để trống';
            isValid = false;
        } else if (passwordForm.currentPassword.trim().length < 6) {
            errors.currentPassword = 'Mật khẩu hiện tại phải có ít nhất 6 ký tự';
            isValid = false;
        }

        // Validate newPassword
        if (!passwordForm.newPassword.trim()) {
            errors.newPassword = 'Mật khẩu mới không được để trống';
            isValid = false;
        } else if (passwordForm.newPassword.trim().length < 8) {
            errors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
            isValid = false;
        } else {
            // Check if password contains at least 1 uppercase, 1 lowercase, and 1 number
            const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
            const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
            const hasNumber = /\d/.test(passwordForm.newPassword);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordForm.newPassword);

            if (!hasUpperCase || !hasLowerCase || !hasNumber) {
                errors.newPassword = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
                isValid = false;
            } else if (!hasSpecialChar) {
                errors.newPassword = 'Mật khẩu nên chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*...)';
                isValid = false;
            }
        }

        // Check if new password is the same as current password
        if (isValid && passwordForm.newPassword === passwordForm.currentPassword) {
            errors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
            isValid = false;
        }

        // Validate confirmPassword
        if (!passwordForm.confirmPassword.trim()) {
            errors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
            isValid = false;
        } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setPasswordErrors(errors);
        return isValid;
    };

    // Handle password submit
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Trim input values
        const trimmedPasswordForm = {
            currentPassword: passwordForm.currentPassword.trim(),
            newPassword: passwordForm.newPassword.trim(),
            confirmPassword: passwordForm.confirmPassword.trim()
        };

        // Update the form with trimmed values
        setPasswordForm(trimmedPasswordForm);

        // Check if form has changed
        if (!formChanged.password) {
            messageApi.info('Không có thông tin nào được thay đổi');
            return;
        }

        if (!validatePasswordForm()) {
            messageApi.error("Vui lòng kiểm tra lại thông tin nhập vào");
            return;
        }

        try {
            setIsLoading(true);

            // Display loading message
            const key = 'passwordUpdate';
            messageApi.loading({ content: 'Đang cập nhật mật khẩu...', key, duration: 0 });

            const response = await changePassword(trimmedPasswordForm.currentPassword, trimmedPasswordForm.newPassword);

            // Check response
            if (response.statusCode && response.statusCode !== 200) {
                messageApi.error({ content: response.message || 'Có lỗi xảy ra khi đổi mật khẩu', key, duration: 3 });
                return;
            }

            // Show success state
            setShowSuccess(prev => ({ ...prev, password: true }));

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(prev => ({ ...prev, password: false }));
            }, 3000);

            messageApi.success({ content: 'Đổi mật khẩu thành công', key, duration: 3 });

            // Reset password form after successful update
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Reset form changed state
            setFormChanged(prev => ({ ...prev, password: false }));
        } catch (error: any) {
            console.error("Password change error:", error);
            const errorMessage = error.message || 'Có lỗi xảy ra khi đổi mật khẩu';
            if (error.statusCode === 400) {
                messageApi.error({ content: "Mật khẩu hiện tại không chính xác", duration: 3 });
            } else {
                messageApi.error({ content: errorMessage, duration: 3 });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle social links form changes
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedForm = {
            ...socialForm,
            [name]: value
        };

        setSocialForm(updatedForm);

        // Clear error when user types
        if (socialErrors[name as keyof typeof socialErrors]) {
            setSocialErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Check if form data has changed from original
        const hasChanged =
            updatedForm.facebookLink.trim() !== originalData.social.facebookLink.trim() ||
            updatedForm.youtubeLink.trim() !== originalData.social.youtubeLink.trim() ||
            updatedForm.githubLink.trim() !== originalData.social.githubLink.trim() ||
            updatedForm.personalWebsite.trim() !== originalData.social.personalWebsite.trim();

        setFormChanged(prev => ({
            ...prev,
            social: hasChanged
        }));
    };

    // Validate social links form
    const validateSocialForm = () => {
        let isValid = true;
        const errors = {
            facebookLink: '',
            youtubeLink: '',
            githubLink: '',
            personalWebsite: ''
        };

        // URL regex pattern
        const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

        // Function to add https:// if missing
        const ensureHttps = (url: string): string => {
            if (!url) return url;
            return url.startsWith('http') ? url : `https://${url}`;
        };

        // Validate facebookLink
        if (socialForm.facebookLink) {
            const formattedUrl = ensureHttps(socialForm.facebookLink.trim());
            if (!urlPattern.test(formattedUrl)) {
                errors.facebookLink = 'Đường dẫn Facebook không hợp lệ';
                isValid = false;
            }
        }

        // Validate youtubeLink
        if (socialForm.youtubeLink) {
            const formattedUrl = ensureHttps(socialForm.youtubeLink.trim());
            if (!urlPattern.test(formattedUrl)) {
                errors.youtubeLink = 'Đường dẫn YouTube không hợp lệ';
                isValid = false;
            }
        }

        // Validate githubLink
        if (socialForm.githubLink) {
            const formattedUrl = ensureHttps(socialForm.githubLink.trim());
            if (!urlPattern.test(formattedUrl)) {
                errors.githubLink = 'Đường dẫn GitHub không hợp lệ';
                isValid = false;
            }
        }

        // Validate personalWebsite
        if (socialForm.personalWebsite) {
            const formattedUrl = ensureHttps(socialForm.personalWebsite.trim());
            if (!urlPattern.test(formattedUrl)) {
                errors.personalWebsite = 'Đường dẫn Website không hợp lệ';
                isValid = false;
            }
        }

        setSocialErrors(errors);
        return isValid;
    };

    // Handle social links submit
    const handleSocialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if form has changed
        if (!formChanged.social) {
            messageApi.info('Không có thông tin nào được thay đổi');
            return;
        }

        if (!validateSocialForm()) {
            messageApi.error("Vui lòng kiểm tra lại các đường dẫn liên kết");
            return;
        }

        // Ensure all URLs have https://
        const ensureHttps = (url: string): string => {
            if (!url) return '';
            return url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
        };

        // Create formatted links
        const formattedLinks = {
            facebookLink: ensureHttps(socialForm.facebookLink),
            youtubeLink: ensureHttps(socialForm.youtubeLink),
            githubLink: ensureHttps(socialForm.githubLink),
            personalWebsite: ensureHttps(socialForm.personalWebsite),
        };

        try {
            setIsLoading(true);

            // Display loading message
            const key = 'socialUpdate';
            messageApi.loading({ content: 'Đang cập nhật liên kết...', key, duration: 0 });

            const response = await updateSocialLinks(
                formattedLinks.facebookLink,
                formattedLinks.youtubeLink,
                formattedLinks.githubLink,
                '',  // linkedinLink không có trong API
                formattedLinks.personalWebsite
            );

            // Check response
            if (response.statusCode && response.statusCode !== 200) {
                messageApi.error({ content: response.message || 'Có lỗi xảy ra khi cập nhật liên kết', key, duration: 3 });
                return;
            }

            // Show success state
            setShowSuccess(prev => ({ ...prev, social: true }));

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(prev => ({ ...prev, social: false }));
            }, 3000);

            // Refresh user data in Redux after successful update
            dispatch(getInfoRedux());

            // Update original data
            setOriginalData(prev => ({
                ...prev,
                social: { ...formattedLinks }
            }));

            // Reset form changed state
            setFormChanged(prev => ({ ...prev, social: false }));

            messageApi.success({ content: 'Cập nhật liên kết thành công', key, duration: 3 });
        } catch (error: any) {
            console.error("Social links update error:", error);
            const errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật liên kết';
            messageApi.error({ content: errorMessage, duration: 3 });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="text-center">
                    <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-t-4 border-purple-600 animate-spin"></div>
                        <div className="absolute inset-3 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="text-center p-8 max-w-md">
                    <div className="text-red-500 mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <FiX className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không thể tải thông tin</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Có lỗi xảy ra khi tải thông tin hồ sơ. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
                    </p>
                    <button
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        onClick={() => router.push('/profile')}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
            {/* Include message context holder at the top level */}
            {contextHolder}

            <div className="flex items-center mb-8 relative">
                <button
                    className="flex items-center gap-2 bg-transparent text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:underline py-2 px-4 rounded-lg transition-colors"
                    onClick={() => router.push('/profile')}
                >
                    <FiChevronLeft className="w-4 h-4" /> Quay lại hồ sơ
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mx-auto text-center">Chỉnh sửa hồ sơ</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Sidebar */}
                <div className="bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 md:border-b-0 border-b">
                    <div className="sticky top-24 flex md:flex-col">
                        <button
                            className={`flex items-center gap-3 w-full text-left py-4 px-6 relative ${activeTab === 'profile'
                                ? 'text-purple-600 bg-purple-50 dark:bg-gray-800 font-semibold'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50/50 dark:hover:bg-gray-800/50'
                                } transition-colors`}
                            onClick={() => setActiveTab('profile')}
                        >
                            {activeTab === 'profile' && (
                                <div className="absolute left-0 top-0 w-1 md:w-1 h-full bg-purple-600"></div>
                            )}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'profile' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                <FiUser className="w-4 h-4" />
                            </div>
                            <span>Thông tin cá nhân</span>
                        </button>
                        <button
                            className={`flex items-center gap-3 w-full text-left py-4 px-6 relative ${activeTab === 'password'
                                ? 'text-purple-600 bg-purple-50 dark:bg-gray-800 font-semibold'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50/50 dark:hover:bg-gray-800/50'
                                } transition-colors`}
                            onClick={() => setActiveTab('password')}
                        >
                            {activeTab === 'password' && (
                                <div className="absolute left-0 top-0 w-1 md:w-1 h-full bg-purple-600"></div>
                            )}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'password' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                <FiLock className="w-4 h-4" />
                            </div>
                            <span>Đổi mật khẩu</span>
                        </button>
                        <button
                            className={`flex items-center gap-3 w-full text-left py-4 px-6 relative ${activeTab === 'social'
                                ? 'text-purple-600 bg-purple-50 dark:bg-gray-800 font-semibold'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50/50 dark:hover:bg-gray-800/50'
                                } transition-colors`}
                            onClick={() => setActiveTab('social')}
                        >
                            {activeTab === 'social' && (
                                <div className="absolute left-0 top-0 w-1 md:w-1 h-full bg-purple-600"></div>
                            )}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'social' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                <FiLink className="w-4 h-4" />
                            </div>
                            <span>Liên kết mạng xã hội</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {activeTab === 'profile' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white relative">
                                Thông tin cá nhân
                                {showSuccess.profile && (
                                    <span className="absolute ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <FiCheck className="mr-1" /> Đã lưu
                                    </span>
                                )}
                            </h2>

                            <div className="bg-purple-50 dark:bg-gray-800/50 p-6 rounded-xl mb-8">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                                            <img
                                                src={avatarPreview || 'https://via.placeholder.com/150'}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all shadow-sm duration-300 flex items-center justify-center">
                                            <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-lg">
                                                <FiUpload className="w-5 h-5" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-1">Ảnh đại diện</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                            Hãy chọn ảnh đại diện thể hiện cá tính của bạn
                                        </p>

                                        {avatarFile && (
                                            <button
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
                                                onClick={handleAvatarSubmit}
                                                disabled={isLoading}
                                            >
                                                <FiSave className="w-4 h-4" /> Lưu ảnh đại diện
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Họ tên
                                    </label>
                                    <input
                                        name="fullName"
                                        value={profileForm.fullName}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${profileErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                                        placeholder="Nhập họ tên của bạn"
                                    />
                                    {profileErrors.fullName && (
                                        <p className="mt-1 text-sm text-red-500">{profileErrors.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tên người dùng
                                    </label>
                                    <input
                                        name="userName"
                                        value={profileForm.userName}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${profileErrors.userName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                                        placeholder="Nhập tên người dùng"
                                    />
                                    {profileErrors.userName && (
                                        <p className="mt-1 text-sm text-red-500">{profileErrors.userName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Giới thiệu bản thân
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={profileForm.bio}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${profileErrors.bio ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm resize-vertical min-h-[120px]`}
                                        placeholder="Viết đôi điều về bản thân"
                                        rows={4}
                                    />
                                    {profileErrors.bio && (
                                        <p className="mt-1 text-sm text-red-500">{profileErrors.bio}</p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className={`inline-flex items-center justify-center px-6 py-3 ${!formChanged.profile || isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium rounded-lg shadow transition-colors`}
                                        disabled={!formChanged.profile || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="mr-2" /> Lưu thông tin
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white relative">
                                Đổi mật khẩu
                                {showSuccess.password && (
                                    <span className="absolute ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <FiCheck className="mr-1" /> Đã cập nhật
                                    </span>
                                )}
                            </h2>

                            <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Lưu ý về bảo mật</h3>
                                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Mật khẩu mới phải có ít nhất 8 ký tự</li>
                                                <li>Nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                                                <li>Không sử dụng mật khẩu đã dùng cho các dịch vụ khác</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Mật khẩu hiện tại
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="currentPassword"
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            type={showPassword.currentPassword ? "text" : "password"}
                                            className={`w-full px-4 py-3 rounded-lg border ${passwordErrors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm pr-10`}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {showPassword.currentPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {passwordErrors.currentPassword && (
                                        <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="newPassword"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            type={showPassword.newPassword ? "text" : "password"}
                                            className={`w-full px-4 py-3 rounded-lg border ${passwordErrors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm pr-10`}
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {showPassword.newPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {passwordErrors.newPassword && (
                                        <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="confirmPassword"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            type={showPassword.confirmPassword ? "text" : "password"}
                                            className={`w-full px-4 py-3 rounded-lg border ${passwordErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm pr-10`}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>
                                    {passwordErrors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className={`inline-flex items-center justify-center px-6 py-3 ${!formChanged.password || isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium rounded-lg shadow transition-colors`}
                                        disabled={!formChanged.password || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="mr-2" /> Lưu thông tin
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white relative">
                                Liên kết mạng xã hội
                                {showSuccess.social && (
                                    <span className="absolute ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <FiCheck className="mr-1" /> Đã lưu
                                    </span>
                                )}
                            </h2>

                            <form onSubmit={handleSocialSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Facebook
                                    </label>
                                    <input
                                        name="facebookLink"
                                        value={socialForm.facebookLink}
                                        onChange={handleSocialChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${socialErrors.facebookLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                                        placeholder="https://facebook.com/username"
                                    />
                                    {socialErrors.facebookLink && (
                                        <p className="mt-1 text-sm text-red-500">{socialErrors.facebookLink}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        YouTube
                                    </label>
                                    <input
                                        name="youtubeLink"
                                        value={socialForm.youtubeLink}
                                        onChange={handleSocialChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${socialErrors.youtubeLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                                        placeholder="https://youtube.com/channel/..."
                                    />
                                    {socialErrors.youtubeLink && (
                                        <p className="mt-1 text-sm text-red-500">{socialErrors.youtubeLink}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        GitHub
                                    </label>
                                    <input
                                        name="githubLink"
                                        value={socialForm.githubLink}
                                        onChange={handleSocialChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${socialErrors.githubLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                                        placeholder="https://github.com/username"
                                    />
                                    {socialErrors.githubLink && (
                                        <p className="mt-1 text-sm text-red-500">{socialErrors.githubLink}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Website cá nhân
                                    </label>
                                    <input
                                        name="personalWebsite"
                                        value={socialForm.personalWebsite}
                                        onChange={handleSocialChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${socialErrors.personalWebsite ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-purple-500 focus:border-purple-500'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                                        placeholder="https://example.com"
                                    />
                                    {socialErrors.personalWebsite && (
                                        <p className="mt-1 text-sm text-red-500">{socialErrors.personalWebsite}</p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className={`inline-flex items-center justify-center px-6 py-3 ${!formChanged.social || isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium rounded-lg shadow transition-colors`}
                                        disabled={!formChanged.social || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="mr-2" /> Lưu thông tin
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileEditForm;