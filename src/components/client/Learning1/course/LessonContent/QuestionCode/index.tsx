import React, { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as esprima from 'esprima';
import { getQuessonCode, SaveCodeUser, SubmitCode } from '@/api/axios/api';
import { getCurrentMonthAndYear } from '@/Utils/functions';
import 'prismjs/components/prism-typescript';
import 'prism-themes/themes/prism-coldark-cold.css';
import { FiCode, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const QuessonCode = ({
  id,
  courseId,
  isCompleteLesson,
  setIsCompletedLesson,
}: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [code, setCode] = useState<string>('');
  const [preCode, setPreCode] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isBlur, setIsBlur] = useState<number>(0);

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // Lấy dữ liệu bài tập code
  useEffect(() => {
    const getdata = async () => {
      setLoading(true);
      try {
        const res = await getQuessonCode(id);
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          setData(res?.data);
          const initialCode = res?.data?.userCode?.submittedCode ||
            res?.data?.quesson?.starterCode ||
            '';
          setPreCode(initialCode);
          setCode(initialCode);
        }
      } catch (error) {
        console.error("Error fetching code question:", error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, [id]);

  // Lưu code khi người dùng blur khỏi editor
  useEffect(() => {
    const saveCode = async () => {
      if (code && code !== preCode) {
        setPreCode(code);
        try {
          await SaveCodeUser(id, code);
        } catch (error) {
          console.error("Error saving code:", error);
        }
      }
    };

    if (isBlur > 0) {
      saveCode();
    }
  }, [isBlur, code, preCode, id]);

  // Khởi tạo Monaco
  useEffect(() => {
    loader.init().then(monaco => {
      monacoRef.current = monaco;
    });
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Tự động lưu khi blur
    editor.onDidBlurEditorText(() => {
      setIsBlur(prev => prev + 1);
    });

    // Thiết lập các tùy chọn cho editor
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      lineHeight: 24,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true
    });
  };

  const handleCheckCode = async () => {
    if (!editorRef.current || !monacoRef.current) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Kiểm tra cú pháp JavaScript
      await esprima.parseScript(code);

      // Gửi code lên server để kiểm tra
      const res = await SubmitCode({
        lessonId: id,
        code,
        coursesId: Number(courseId),
      });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        if (res?.data) {
          // Code đúng
          setIsSuccess(true);

          // Hiệu ứng confetti
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 0.8 }
          });

          // Đánh dấu hoàn thành bài học
          setIsCompletedLesson({
            lessonId: id,
            isCompleted: true,
            isPostReq: false,
            isOldCompleted: false,
          });
        } else {
          // Code sai logic
          setErrors(['Câu trả lời chưa chính xác. Hãy kiểm tra lại logic của bạn.']);
        }
      }
    } catch (error: any) {
      // Lỗi cú pháp
      const { lineNumber, column, description } = error;

      // Hiển thị lỗi trong editor
      if (monacoRef.current && editorRef.current) {
        monacoRef.current.editor.setModelMarkers(
          editorRef.current.getModel(),
          'owner',
          [{
            startLineNumber: lineNumber,
            startColumn: column,
            endLineNumber: lineNumber,
            endColumn: column + 1,
            message: description,
            severity: monacoRef.current.MarkerSeverity.Error,
          }]
        );
      }

      // Thêm lỗi vào danh sách hiển thị
      setErrors([`Dòng ${lineNumber}, Cột ${column}: ${description}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Phần mô tả bài tập */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-4">
              <FiCode className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{data?.lesson?.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cập nhật {getCurrentMonthAndYear(data?.lesson?.updatedAt)}
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 mb-6"></div>

          {data?.quesson?.description ? (
            <div
              className="prose dark:prose-invert max-w-none custom-textview"
              dangerouslySetInnerHTML={{ __html: data?.quesson?.description }}
            />
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Nội dung đang được cập nhật...
            </div>
          )}
        </div>
      </div>

      {/* Phần code editor */}
      <div className="w-full md:w-1/2 flex flex-col h-full">
        {/* Editor */}
        <div className="h-[400px] border-b border-gray-200 dark:border-gray-700">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>

        {/* Phần kiểm tra và kết quả */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Thanh công cụ */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="text-gray-700 dark:text-gray-300 font-medium">
              Bài kiểm tra ({isSuccess ? '1' : '0'}/1)
            </div>
            <button
              onClick={handleCheckCode}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors
                ${isSubmitting
                  ? 'bg-gray-400 cursor-wait'
                  : errors.length > 0
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isSubmitting ? 'Đang kiểm tra...' : 'Kiểm tra'}
            </button>
          </div>

          {/* Kết quả */}
          <div className="flex-1 overflow-y-auto p-4">
            {errors.length > 0 ? (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
                <div className="flex items-start">
                  <FiAlertCircle className="text-red-500 dark:text-red-400 mt-0.5 mr-3" size={18} />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">Lỗi:</h3>
                    <ul className="text-red-700 dark:text-red-300 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : isSuccess ? (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
                <div className="flex items-start">
                  <FiCheckCircle className="text-green-500 dark:text-green-400 mt-0.5 mr-3" size={18} />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Chính xác!</h3>
                    {data?.quesson?.solution && (
                      <div
                        className="prose dark:prose-invert max-w-none custom-textview text-green-700 dark:text-green-300"
                        dangerouslySetInnerHTML={{ __html: data?.quesson?.solution }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuessonCode;
