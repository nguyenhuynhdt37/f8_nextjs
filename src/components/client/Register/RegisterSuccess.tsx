import React, { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

interface RegisterSuccessProps {
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const RegisterSuccess = ({ setOpen }: RegisterSuccessProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-4">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.6
                }}
                className="mb-6"
            >
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                    <FiCheckCircle className="text-green-500 w-14 h-14" />
                </div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-800 mb-2 text-center"
            >
                Đăng ký thành công!
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-center mb-6"
            >
                Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
                Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để hoàn tất quá trình đăng ký.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 w-full"
            >
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                    Đăng nhập ngay
                </motion.button>

                <button
                    onClick={() => setOpen(false)}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Đóng
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-xs text-gray-500 text-center"
            >
                <p>Không nhận được email?</p>
                <button className="text-blue-600 hover:underline mt-1">
                    Gửi lại email xác nhận
                </button>
            </motion.div>
        </div>
    );
};

export default RegisterSuccess; 