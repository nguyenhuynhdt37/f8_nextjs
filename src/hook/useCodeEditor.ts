import { useEffect, useRef, useState } from 'react';
import { getQuessonCode, SaveCodeUser, SubmitCode } from '@/api/api';

export const useQuessonCode = (id: string, courseId: string) => {
  const [data, setData] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isResult, setIsResult] = useState<boolean>(false);
  const [animateError, setAnimateError] = useState<boolean>(false);
  const timeout = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getQuessonCode(id);
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setData(res?.data);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (animateError) {
      timeout.current = setTimeout(() => {
        setAnimateError(false);
      }, 500);
    }
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
    };
  }, [animateError]);

  const handleSave = async (code: string) => {
    await SaveCodeUser(id, code);
  };

  const handleSubmit = async (code: string) => {
    const result = await SubmitCode({
      lessonId: id,
      code,
      coursesId: Number(courseId),
    });
    return result;
  };

  const handleCheckSyntax = () => {
    // Giả lập kiểm tra cú pháp
    const simulatedErrors: string[] = []; // Thêm lỗi nếu cần
    setErrors(simulatedErrors);
    setIsResult(simulatedErrors.length === 0);
    setAnimateError(simulatedErrors.length > 0);
  };

  return {
    data,
    errors,
    isResult,
    animateError,
    handleSave,
    handleSubmit,
    handleCheckSyntax,
  };
};
