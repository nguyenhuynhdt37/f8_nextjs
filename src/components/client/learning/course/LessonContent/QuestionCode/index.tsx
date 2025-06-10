import React, { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as esprima from 'esprima';
import { getQuessonCode, SaveCodeUser, SubmitCode } from '@/api/axios/api';
import { getCurrentMonthAndYear } from '@/Utils/functions';
import 'prismjs/components/prism-typescript';
import 'prism-themes/themes/prism-coldark-cold.css';
import 'prism-themes/themes/prism-coldark-dark.css';
import { FaCheck, FaCode, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { log } from 'node:console';
import { message } from 'antd';

const QuessonCode = ({
  id,
  courseId,
  isCompleteLesson,
  setIsCompletedLesson,
}: any) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<any>(null);
  const timeout = useRef<any>(null);
  const saveTimeoutRef = useRef<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [isResult, setIsResult] = useState<boolean>(false);
  const [animateError, setAnimateError] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [preCode, setPreCode] = useState<string>('');
  const [isBlur, setIsBlur] = useState<number>(0);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [isSaving, setIsSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);
  console.log('data', data);
  /** 
   * 
  console.log('data', data); =>
  {
     "id": 54,
     "title": "Bắt đầu với một thử thách nhỏ",
     "description": "<h2>Xin chào các bạn!</h2><p>Đây là màn hình Thử Thách tại F8 các bạn nhé. Từ các bài học sau, các bạn sẽ có những bài tập cần phải vượt qua sau khi học mỗi kiến thức mới.</p><p>Hãy bắt đầu làm quen với màn Thử Thách này bằng cách làm theo yêu cầu dưới đây:</p><p>👉 Hãy nhấn copy và dán đoạn code sau vào file&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">main.js</span>:</p><pre class=\"ql-syntax\" spellcheck=\"false\">console.log('Hello world');",
     "codeStart": "console.log();",
     "answer": "Thêm console.log('Hello world'); vào tệp index.js",
     "language": "JavaScript",
     "order": 54,
     "lessonId": 54,
     "createdAt": "2024-12-22T15:24:43",
     "updatedAt": "2024-12-22T15:24:43",
     "userAnswer": {
       "answer": "string",
       "isCorrect": false
     }
   }
  */
  useEffect(() => {
    const getdata = async () => {
      setIsLoading(true);
      try {
        const res = await getQuessonCode(id);
        setData(res?.data);
        const initialCode = res?.data?.userAnswer?.answer ||
          res?.data?.codeStart || '';
        setCode(initialCode);
        setPreCode(initialCode);
        setCharCount(initialCode.length);
      } catch (error) {
        console.error("Error fetching code data:", error);
        message.error("Lỗi tải dữ liệu bài tập");
      } finally {
        setIsLoading(false);
      }
    };
    getdata();
  }, [id]);
  console.log('code', code);
  console.log('preCode', preCode);
  const saveCode = async () => {
    if (code !== preCode && code !== '') {
      try {
        setIsSaving(true);
        await SaveCodeUser(id, code);
        setPreCode(code);
        message.success("Đã lưu code tạm thời", 1);
      } catch (error) {
        message.error("Lỗi khi lưu code");
      } finally {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    // saveCode();
    if (isBlur > 0) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(saveCode, 1500);
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [isBlur, code, preCode, id]);

  useEffect(() => {
    loader.init().then(monaco => setMonacoInstance(monaco));
  }, []);

  useEffect(() => {
    if (animateError) {
      timeout.current = setTimeout(() => {
        setAnimateError(false);
      }, 500);
    }
    return () => {
      if (timeout) clearTimeout(timeout.current);
      timeout.current = null;
    };
  }, [animateError]);

  const handleCheckSyntax = async () => {
    if (!monacoInstance || !editorRef.current) return;

    if (!code.trim()) {
      setErrors(['Vui lòng nhập code trước khi kiểm tra']);
      setAnimateError(true);
      return;
    }

    if (code.length > 5000) {
      setErrors(['Code vượt quá giới hạn 5000 ký tự']);
      setAnimateError(true);
      return;
    }

    const markers: any[] = [];
    const errorMessages: string[] = [];

    try {
      setIsResult(false);
      await esprima.parseScript(code);
      const res = await SubmitCode({
        lessonId: id,
        code,
        coursesId: Number(courseId),
      });
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        if (res?.data) {
          setIsResult(true);
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 1 },
          });
          setIsCompletedLesson({
            ...isCompleteLesson,
            isCompleted: true,
          });

          const newData = await getQuessonCode(id);
          setData(newData?.data);
          const updatedCode = newData?.data?.userCode?.submittedCode || code;
          setPreCode(updatedCode);
        } else {
          errorMessages.push('Câu trả lời chưa chính xác');
          setErrors(errorMessages);
          setAnimateError(true);
          return;
        }
      }
    } catch (error: any) {
      const { lineNumber, column, description } = error;

      markers.push({
        startLineNumber: lineNumber,
        startColumn: column,
        endLineNumber: lineNumber,
        endColumn: column + 1,
        message: description,
        severity: monacoInstance.MarkerSeverity.Error,
      });

      errorMessages.push(
        `Line ${lineNumber}, Column ${column}: ${description}`,
      );
    }

    monacoInstance.editor.setModelMarkers(
      editorRef.current.getModel(),
      'owner',
      markers,
    );
    if (errorMessages?.length > 0) setAnimateError(true);
    setErrors(errorMessages);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editor.updateOptions({
      autoIndent: 'full',
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: true,
      quickSuggestions: { other: true, comments: true, strings: true },
      parameterHints: { enabled: true },
      fontSize: 14,
      fontFamily: "'Fira Code', 'Consolas', monospace",
      lineHeight: 22,
    });
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const currentValue = editor.getValue();
      setCharCount(currentValue.length);

      if (currentValue.length > 5000) {
        editor.setValue(currentValue.substring(0, 5000));
        message.warning('Đã đạt giới hạn 5000 ký tự');
      }

      setCode(editor.getValue() || '');
    });

    editor.onDidBlurEditorText(() => {
      setIsBlur(prev => prev + 1);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleCheckSyntax();
    });
  };

  const toggleEditorTheme = () => {
    setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
  };

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (editorRef.current) {
        try {
          editorRef.current.dispose();
        } catch (error) {
          console.error("Error disposing editor:", error);
        }
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-800 dark:text-gray-200">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl">Đang tải bài tập...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 text-gray-800 dark:text-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[80vh]">
        {/* Left panel - Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {data?.title}
            </h1>
            <div className="flex items-center mt-2 text-indigo-100">
              <FiClock className="mr-2" />
              <span className="text-sm">
                Cập nhật {getCurrentMonthAndYear(data?.updatedAt)}
              </span>
            </div>
          </div>

          <div className="p-6 overflow-auto max-h-[calc(80vh-8rem)]">
            <div className="mb-6 flex items-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3">
                <FaCode className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Yêu cầu bài tập
              </h2>
            </div>

            {data?.description ? (
              <div
                className="prose dark:prose-invert max-w-none custom-textview"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
            ) : (
              <div className="text-center p-10 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <FaExclamationTriangle className="mx-auto text-yellow-500 text-3xl mb-3" />
                <p className="font-medium">Chưa cập nhật nội dung</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Code editor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-700 py-2 px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-pulse mr-1">Đang lưu...</span>
                </span>
              ) : (
                `script.js • ${charCount}/5000 ký tự`
              )}
            </div>
            <button
              onClick={toggleEditorTheme}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              {editorTheme === 'vs-dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div className="flex-grow">
            <Editor
              key={`editor-${data?.updatedAt || 'initial'}`}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'all',
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8
                }
              }}
              height="100%"
              theme={editorTheme}
              defaultLanguage={data?.language?.toLowerCase() || 'javascript'}
              value={code}
              onMount={handleEditorDidMount}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isResult ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm">Bài kiểm tra ({isResult ? '1' : '0'}/1)</span>
              </div>

              <motion.button
                onClick={handleCheckSyntax}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={animateError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{
                  duration: animateError ? 0.5 : 0.2,
                  ease: 'easeInOut',
                }}
                className={`px-6 py-2 rounded-lg font-medium text-white ${animateError
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-indigo-600 hover:bg-indigo-700'
                  } transition-colors shadow-md`}
              >
                Kiểm tra
              </motion.button>
            </div>

            {errors.length > 0 ? (
              <div className="px-4 pb-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiAlertCircle className="text-red-500 mr-2" />
                    <h3 className="font-medium text-red-800 dark:text-red-300">Lỗi</h3>
                  </div>
                  <ul className="text-sm text-red-700 dark:text-red-300 pl-6 list-disc">
                    {errors.map((error, index) => (
                      <li key={index} className="mb-1">{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : isResult && (
              <div className="px-4 pb-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <h3 className="font-medium text-green-800 dark:text-green-300">Chính xác!</h3>
                  </div>
                  {data?.quesson?.solution && (
                    <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                      <div className="flex items-center mb-1">
                        <FaLightbulb className="text-yellow-500 mr-2" />
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Giải pháp gợi ý</h4>
                      </div>
                      <div
                        className="prose dark:prose-invert prose-sm max-w-none custom-textview"
                        dangerouslySetInnerHTML={{ __html: data?.quesson?.solution }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuessonCode;
