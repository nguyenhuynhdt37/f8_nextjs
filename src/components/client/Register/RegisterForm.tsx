import React, { Dispatch, SetStateAction, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

interface RegisterFormProps {
    setStep: Dispatch<SetStateAction<number>>;
}

const RegisterForm = ({ setStep }: RegisterFormProps) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateEmail = (email: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        const newErrors = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(1); // Move to success step
        }, 1500);

        // In a real app, you would call your API here:
        // try {
        //   const response = await registerUser(formData);
        //   if (response.success) {
        //     setStep(1);
        //   } else {
        //     setErrors({ ...errors, email: response.message });
        //   }
        // } catch (error) {
        //   console.error('Registration error:', error);
        // } finally {
        //   setLoading(false);
        // }
    };

    const inputVariants = {
        focus: { scale: 1.01, boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.5)" },
        error: { scale: 1.01, boxShadow: "0 0 0 2px rgba(245, 101, 101, 0.5)" }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                </label>
                <div className="relative">
                    <motion.div
                        animate={errors.fullName ? "error" : ""}
                        variants={inputVariants}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                        </div>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-2.5 border ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </motion.div>
                    {errors.fullName && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600"
                        >
                            {errors.fullName}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <div className="relative">
                    <motion.div
                        animate={errors.email ? "error" : ""}
                        variants={inputVariants}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                            placeholder="Nhập địa chỉ email"
                        />
                    </motion.div>
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600"
                        >
                            {errors.email}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                </label>
                <div className="relative">
                    <motion.div
                        animate={errors.password ? "error" : ""}
                        variants={inputVariants}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                            placeholder="Nhập mật khẩu"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </motion.div>
                    {errors.password && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600"
                        >
                            {errors.password}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Confirm Password Field */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                </label>
                <div className="relative">
                    <motion.div
                        animate={errors.confirmPassword ? "error" : ""}
                        variants={inputVariants}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                        </div>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-10 py-2.5 border ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                            placeholder="Xác nhận mật khẩu"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </motion.div>
                    {errors.confirmPassword && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600"
                        >
                            {errors.confirmPassword}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Đang xử lý...</span>
                    </div>
                ) : (
                    <span>Đăng ký</span>
                )}
            </motion.button>

            <div className="text-center text-xs text-gray-500 mt-4">
                Bằng cách đăng ký, bạn đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a> của chúng tôi.
            </div>
        </form>
    );
};

export default RegisterForm; 