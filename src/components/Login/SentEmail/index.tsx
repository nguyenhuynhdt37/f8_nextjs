import { CheckCodeActive, sendEmailAsync } from '@/api/axios/api';
import { RootState } from '@/redux/store';
import { motion } from 'framer-motion';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiMail, FiLock, FiSend } from 'react-icons/fi';

interface IFormSentEmail {
  email: string;
  code: string;
}

const SentEmail = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { emailSentEmail } = useSelector((state: RootState) => state.auth);
  const [sendEmail, setSentEmail] = useState<number>(100);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string>('');
  const [formSentEmail, setFormSentEmail] = useState<IFormSentEmail>({
    email: emailSentEmail,
    code: '',
  });

  const handleSetCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 6) {
      setFormSentEmail({ ...formSentEmail, code: newValue });
    }
  };

  const handleSentEmail = async () => {
    setLoading(true);
    setIsDisabled(true);
    try {
      const result = await sendEmailAsync(emailSentEmail);
      setIsCounting(true);
      if (result?.statusCode === 400 || result?.statusCode === 401) {
        setIsDisabled(true);
      }
    } catch (e) {
      setCodeError('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      setSentEmail(prevSendEmail => {
        if (prevSendEmail <= 1) {
          setIsCounting(false);
          setIsDisabled(false);
          return 0;
        }
        return prevSendEmail - 1;
      });
    }, 1000);

    return () => {
      setSentEmail(100);
      clearInterval(interval);
    };
  }, [isCounting]);

  const handleBlur = () => {
    if (formSentEmail.code === '') {
      setCodeError('Mã xác nhận không được bỏ trống');
      return;
    }
    if (formSentEmail.code.length !== 6) {
      setCodeError('Mã xác nhận phải chứa 6 ký tự');
      return;
    }
    setCodeError('');
  };

  const handleSubmit = async () => {
    if (formSentEmail.code === '') {
      setCodeError('Mã xác nhận không được bỏ trống');
      return;
    }
    if (formSentEmail.email === '') {
      setCodeError('Email không được bỏ trống');
      return;
    }
    if (codeError) return;

    setLoadingAuth(true);
    const res = await CheckCodeActive({
      email: formSentEmail.email,
      codeID: formSentEmail.code,
    });

    if (res?.statusCode === 400 || res?.statusCode === 401) {
      setCodeError(res?.message?.message);
    }

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      setStep(1);
    }

    setLoadingAuth(false);
  };

  // Auto-send email when component mounts
  useEffect(() => {
    handleSentEmail();
  }, []);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <FiMail className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Chúng tôi đã gửi một mã xác nhận đến email của bạn. Vui lòng kiểm tra hộp thư và nhập mã để tiếp tục.
            </p>
          </div>
        </div>
      </motion.div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email của bạn
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 text-sm"
            value={emailSentEmail}
            disabled
            readOnly
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mã xác nhận
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="text-gray-400" />
          </div>
          <input
            type="text"
            className={`block w-full pl-10 pr-24 py-2.5 border ${codeError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
            placeholder="Nhập mã 6 số"
            value={formSentEmail.code}
            onChange={handleSetCode}
            onFocus={() => setCodeError('')}
            onBlur={handleBlur}
            maxLength={6}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSentEmail}
              disabled={isDisabled}
              className={`h-full px-3 rounded-r-lg flex items-center justify-center ${!isDisabled
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } transition-colors text-xs font-medium`}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : !isCounting ? (
                <span className="flex items-center">
                  <FiSend className="mr-1" /> Gửi mã
                </span>
              ) : (
                <span>{sendEmail}s</span>
              )}
            </motion.button>
          </div>
        </div>
        {codeError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {codeError}
          </motion.p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loadingAuth}
        className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
      >
        {loadingAuth ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang xác thực...</span>
          </div>
        ) : (
          <span>Xác thực</span>
        )}
      </motion.button>
    </div>
  );
};

export default SentEmail;
