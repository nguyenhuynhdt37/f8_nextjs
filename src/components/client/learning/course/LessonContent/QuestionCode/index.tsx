import React, { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as esprima from 'esprima';
import { getQuessonCode, SaveCodeUser, SubmitCode } from '@/api/api';
import { getCurrentMonthAndYear } from '@/Utils/functions';
import 'prismjs/components/prism-typescript';
import 'prism-themes/themes/prism-coldark-cold.css';
import { FaCheck } from 'react-icons/fa6';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { log } from 'node:console';

const QuessonCode = ({
  id,
  courseId,
  isCompleteLesson,
  setIsCompletedLesson,
}: any) => {
  const [data, setData] = useState<any>(null);
  const editorRef = useRef<any>(null);
  const timeout = useRef<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [isResult, setIsResult] = useState<boolean>(false);
  const [animateError, setAnimateError] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [preCode, setPreCode] = useState<string>('');
  const [isBlur, setIsBlur] = useState<number>(0);
  useEffect(() => {
    const getdata = async () => {
      const res = await getQuessonCode(id);
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setData(res?.data);
        setPreCode(
          res?.data?.userCode?.submittedCode ||
            res?.data?.quesson?.starterCode ||
            '',
        );
      }
    };
    getdata();
  }, [id]);
  useEffect(() => {
    const saveCode = async () => {
      if (code !== preCode) {
        setPreCode(code);
        await SaveCodeUser(id, code);
      }
    };
    saveCode();
  }, [isBlur]);

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
            origin: {
              x: 0.7,
              y: 1,
            },
          });
          setIsCompletedLesson({
            ...isCompleteLesson,
            isCompleted: true,
          });
        } else {
          const errorMessages: string[] = [];
          errorMessages.push('Câu trả lời chưa chính xác');
          setErrors(errorMessages);
          setAnimateError(true);
          return;
        }
      }
    } catch (error: any) {
      const { lineNumber, column, description } = error;

      // Đánh dấu lỗi trong Monaco Editor
      markers.push({
        startLineNumber: lineNumber,
        startColumn: column,
        endLineNumber: lineNumber,
        endColumn: column + 1,
        message: description,
        severity: monacoInstance.MarkerSeverity.Error,
      });

      // Thêm lỗi vào danh sách
      errorMessages.push(
        `Line ${lineNumber}, Column ${column}: ${description}`,
      );
    }

    // Hiển thị lỗi trong editor
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
      autoIndent: 'full', // Tự động thụt lề khi gõ
      suggestOnTriggerCharacters: true, // Gợi ý tự động khi gặp ký tự trigger
      wordBasedSuggestions: true, // Gợi ý từ khóa dựa trên từ đã nhập
      quickSuggestions: { other: true, comments: true, strings: true }, // Gợi ý nhanh cho các phần khác nhau
      parameterHints: { enabled: true }, // Hiển thị gợi ý tham số khi gọi hàm
    });
    editorRef.current = editor;

    // Sự kiện mất focus
    editor.onDidBlurEditorText(async () => {
      setIsBlur(pre => pre + 1);
    });
  };

  return (
    <div className="grid h-[85vh] grid-cols-2 text-[1.4rem]">
      <div className="p-10 overflow-y-scroll scrollbar-custom">
        <div className="font-bold text-[2.2rem]">{data?.lesson?.title}</div>
        <div className="mt-5">
          <span className="mr-2">Cập nhật</span>
          {getCurrentMonthAndYear(data?.lesson?.updatedAt)}
        </div>
        {data?.quesson?.description ? (
          <div
            className="custom-textview"
            dangerouslySetInnerHTML={{ __html: data?.quesson?.description }}
          />
        ) : (
          <div className="font-medium text-center">Chưa cập nhật</div>
        )}
      </div>
      <div className="border-s-[0.1rem]">
        <Editor
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
          }}
          height="400px"
          theme="vs-dark"
          defaultLanguage={'javascript'}
          onChange={(v: any) => {
            setCode(v);
          }}
          defaultValue={
            data?.userCode?.submittedCode || data?.quesson?.starterCode || ''
          }
          onMount={handleEditorDidMount}
        />
        <div className="flex py-5 text-[1.5rem] px-5 border-b-[0.1rem] items-center justify-between">
          <div>Bài kiểm tra ({!isResult ? '0' : '1'}/1)</div>
          <div className="" onClick={handleCheckSyntax}>
            <motion.button
              initial={{ scale: 1 }}
              animate={animateError ? { scale: [1, 1.1, 1] } : {}} // Chỉ chạy hiệu ứng khi `is` là true
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                repeat: Infinity, // Lặp vô hạn
              }}
              className={`rounded-full duration-200 px-10 py-3 ${
                animateError ? 'bg-[#c94534]' : 'bg-[#3490c9]'
              } text-[#fff]`}
            >
              Kiểm tra
            </motion.button>
          </div>
        </div>
        {errors.length > 0 ? (
          <div className="p-10 text-[1.5rem]">
            <ul className="p-10 rounded-2xl bg-[#f2f9ff]">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-5 flex items-center">
            {isResult && <FaCheck className="mr-2 text-[#71af3a]" />}
            {data?.quesson?.solution && (
              <div
                className="custom-textview"
                dangerouslySetInnerHTML={{ __html: data?.quesson?.solution }}
              ></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuessonCode;
