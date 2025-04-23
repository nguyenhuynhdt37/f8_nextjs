import {
  getLanguageCodes,
  NoteCreateAsync,
  QuessonCodeCreate,
} from '@/api/axios/api';
import RichTextEditor from '@/components/RichTextEditor';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import OptionType from './OptionType';
import Editor from '@monaco-editor/react';

const QuessonCode = ({
  courseId,
  titleError,
  setTitleErrror,
  lessonType,
  grouplesson,
  title,
}: any) => {
  const ref = useRef<any>(null);
  const router = useRouter();
  const [languages, setLanguages] = useState<any>();
  const [language, setLanguage] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const [description, setDescription] = useState<string>('');
  const [codeStart, setCodeStart] = useState<string>('');
  const [codeResult, setCodeResult] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const handleEditorDidMount = (editor: any) => {
    // Cập nhật các tùy chọn của Monaco Editor
    editor.updateOptions({
      autoIndent: 'full',
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: true,
      quickSuggestions: { other: true, comments: true, strings: true },
      parameterHints: { enabled: true },
    });
  };
  useEffect(() => {
    const getLanguages = async () => {
      const res = await getLanguageCodes();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setLanguages(res?.data);
        setLanguage(res?.data[0]);
      } else {
        messageApi.error('Có vấn đề xảy ra, vui lòng thử lại sau');
        router.push('/404');
      }
    };
    getLanguages();
  }, []);
  const handleSubmit = async () => {
    let isError = false;
    if (!title) {
      isError = true;
      setTitleErrror('Vui lòng nhập tiêu dề');
    }
    if (!description) {
      isError = true;
    }
    if (!codeStart) {
      isError = true;
    }
    if (!codeResult) {
      isError = true;
    }
    if (!solution) {
      isError = true;
    }
    if (isError) {
      messageApi.error('Vui lòng nhập thông tin đầy đủ trước khi gửi đi');
    } else {
      const dataSubmit = {
        lectureDetailCreateDto: {
          lessonGroup: grouplesson,
          title: title,
          lessonTypeId: lessonType,
        },
        QuessonCodeCreate: {
          description: description,
          languageId: language?.id,
          starterCode: codeStart,
          resultcode: codeResult,
          solution: solution,
        },
      };
      ref.current.continuousStart();
      const res = await QuessonCodeCreate(courseId, dataSubmit);
      ref.current.complete();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.open({
          type: 'success',
          content:
            'Thêm câu hỏi về code thành công, bạn sẽ được chuyển đến trang danh sách bài giảng',
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/admin/course/lesson/${courseId}`);
      } else {
        messageApi.open({
          type: 'error',
          content: 'Có vấn đề xảy ra, vui lòng thử lại sau',
        });
      }
    }
  };

  return (
    <div className="p-10 text-[1.4rem]">
      {contextHolder}
      <LoadingBar color="#0066df" ref={ref} />
      <div className="text-[3rem] font-medium py-10 items-center flex justify-between">
        Câu hỏi về Code
        <button
          onClick={handleSubmit}
          className="px-5 mt-10 text-[1.4rem] py-4 rounded-xl text-[#fff] bg-[#609fd6]"
        >
          Xác nhận
        </button>
      </div>
      <div className="items-center flex">
        <div className="text-[1.6rem] font-medium mr-5">
          Vui lòng chọn ngôn ngữ lập trình
        </div>
        <OptionType
          data={languages}
          typeChoise={language}
          setTypeChoise={setLanguage}
        />
      </div>
      <div className="flex pt-10 items-center">
        <div className="w-full pr-3">
          <div className="">Code khởi đầu</div>
          <Editor
            height="400px"
            theme="vs-dark"
            defaultLanguage={language?.name}
            value={codeStart}
            onChange={(v: any) => setCodeStart(v)}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="w-full pl-3">
          <div className="">Kết quả</div>
          <Editor
            height="400px"
            theme="vs-dark"
            defaultLanguage={language?.name}
            value={codeResult}
            onChange={(v: any) => setCodeResult(v)}
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
      <div className="pt-2">Nội dung chi tiết</div>
      <div className="pt-2">
        <RichTextEditor value={description} onChange={setDescription} />
      </div>
      <div className="pt-2">Gợi ý giải pháp</div>
      <div className="pt-2">
        <RichTextEditor value={solution} onChange={setSolution} />
      </div>
    </div>
  );
};

export default QuessonCode;
