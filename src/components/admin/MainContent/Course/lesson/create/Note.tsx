import { NoteCreateAsync } from '@/api/api';
import RichTextEditor from '@/components/RichTextEditor';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';

const Note = ({
  courseId,
  titleError,
  setTitleErrror,
  lessonType,
  grouplesson,
  title,
}: any) => {
  const ref = useRef<any>(null);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [description, setDescription] = useState<string>('');
  const handleSubmit = async () => {
    let isError = false;
    if (!title) {
      isError = true;
      setTitleErrror('Vui lòng nhập tiêu dề');
    }
    if (!description) {
      isError = true;
    }
    if (isError) {
      messageApi.error('Vui lòng nhập thông tin đầy đủ trước khi gửi đi');
    } else {
      const dataSubmit = {
        lectureDetail: {
          lessonGroup: grouplesson,
          title: title,
          lessonTypeId: lessonType,
        },
        note: {
          description: description,
        },
      };
      ref.current.continuousStart();
      const res = await NoteCreateAsync(courseId, dataSubmit);
      ref.current.complete();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.open({
          type: 'success',
          content:
            'Thêm câu note thành công, bạn sẽ được chuyển đến trang danh sách bài giảng',
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/admin/course/lesson/${courseId}`);
      } else {
        messageApi.open({
          type: 'error',
          content: 'có vấn đề xẩy xa vui lòng thử lại sau, f5 trang để thử lại',
        });
      }
    }
  };
  return (
    <div className="p-10 text-[1.4rem]">
      {contextHolder}
      <LoadingBar color="#0066df" ref={ref} />
      <div className="text-[3rem] font-medium py-10 items-center flex justify-between">
        Viết bài đăng
        <button
          onClick={handleSubmit}
          className="px-5 mt-10 text-[1.4rem] py-4 rounded-xl text-[#fff] bg-[#609fd6]"
        >
          Xác nhận
        </button>
      </div>
      <div className="">Nội dung chi tiết</div>
      <div className="pt-2">
        <RichTextEditor value={description} onChange={setDescription} />
      </div>
    </div>
  );
};

export default Note;
