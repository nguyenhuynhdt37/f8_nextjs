import { login } from '@/api/axios/api';
import Loading from '@/components/client/Loading';
import { useAppDispatch } from '@/redux/hook/hook';
import { getInfoRedux, setEmailRedux } from '@/redux/reducers/slices/AuthSlice';
import { isValidEmail } from '@/Utils/functions';
import { message } from 'antd';
import { AppDispatch } from '@/redux/store';
import { motion } from 'framer-motion';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

interface IError {
  email: string;
  password: string;
}

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginWithEmail = ({ setStep, setOpen }: IProps) => {
  const dispatch = useAppDispatch() as AppDispatch;
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState<IError>({
    email: '',
    password: '',
  });

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    if (value === '') {
      setError({ ...error, [name]: 'Trường không được để trống' });
      return;
    }

    if (name === 'email' && !isValidEmail(value)) {
      setError({ ...error, [name]: 'Không đúng định dạng email' });
    }
  };

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      setError({
        email: email === '' ? 'Trường không được để trống' : '',
        password: password === '' ? 'Trường không được để trống' : '',
      });
      return;
    }

    if (error.email || error.password) return;

    setLoading(true);
    const res = await login({ email, password });

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      messageApi.open({
        type: 'success',
        content: 'Đăng nhập thành công',
      });
      dispatch(getInfoRedux());
      setOpen(false);
    }

    if (res?.statusCode === 401) {
      dispatch(setEmailRedux(email));
      setStep(2);
    } else {
      setError({ ...error, password: res?.message?.message });
    }

    setLoading(false);
  };

  const inputVariants = {
    focus: { scale: 1.01, boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.5)" },
    error: { scale: 1.01, boxShadow: "0 0 0 2px rgba(245, 101, 101, 0.5)" }
  };

  return (
    <>
      {contextHolder}
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <motion.div
              animate={error.email ? "error" : ""}
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
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={e => setError({ ...error, [e.target.name]: '' })}
                onBlur={handleInputBlur}
                className={`block w-full pl-10 pr-3 py-2.5 border ${error.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Nhập địa chỉ email"
              />
            </motion.div>
            {error.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {error.email}
              </motion.p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <motion.div
              animate={error.password ? "error" : ""}
              variants={inputVariants}
              className="relative"
              ref={containerRef}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={e => setError({ ...error, [e.target.name]: '' })}
                onBlur={handleInputBlur}
                className={`block w-full pl-10 pr-10 py-2.5 border ${error.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </motion.div>
            {error.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {error.password}
              </motion.p>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
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
            <span>Đăng nhập</span>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default LoginWithEmail;
