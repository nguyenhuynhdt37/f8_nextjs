'use client';
import { useAppSelector } from '@/redux/hook/hook';
import { ChapterEditAsync, CreateLessonGroup, CreateUser } from '@/api/axios/api';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ICreateUser } from '@/types/next-auth';
import Loading from '@/components/client/Loading';
import { hasValue, hasWhitespace } from '@/Utils/functions';
import { message, Switch } from 'antd';

const ChapterEdit = ({ dataChapter }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [error, setError] = useState<any>({
    name: '',
  });
  const [data, setData] = useState<any>({
    name: dataChapter?.name,
  });
  const [isLoadding, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    if (hasValue(error)) {
      messageApi.open({
        type: 'error',
        content:
          'Vui lòng nhập đúng thông tin hợp lệ trước khi tạo mới chương học',
      });
      return;
    }
    if (data.email === '' || data.name === '' || data.password === '') {
      messageApi.open({
        type: 'error',
        content: 'Thông tin không được bỏ trống',
      });
      return;
    }
    setIsLoading(true);
    const chapterId: number = datachapter?.id;
    const result = await ChapterEditAsync({ chapterId, name: data.name });
    setIsLoading(false);
    if (result?.statusCode === 200 || result?.statusCode === 201) {
      messageApi.open({
        type: 'success',
        content: 'Sửa chương học thành công',
      });
      router.push(`/admin/course/chapter/${result?.data}`);
    }
    if (result?.statusCode === 400) {
      setError({
        ...error,
        email: 'Email này đã được sử dụng',
      });
    }
    if (result?.statusCode === 401)
      messageApi.open({
        type: 'error',
        content: 'Hết phiên đănng nhập vui lòng đăng nhập lại',
      });
  };
  const handleOnchange = (e: any) => {
    setError({
      ...error,
      [e.target.name]: '',
    });
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'name' && !hasWhitespace(value)) {
      setError((prevError: any) => ({
        ...prevError,
        [name]: 'Tên chương học phải chứa ít nhất phải chứa 2 từ',
      }));
    }
  };
  return (
    <div className="text-[1.4rem] p-10">
      {contextHolder}
      <div className="text-left text-[2rem] pt-10 font-bold">
        Chỉnh sửa chương học
      </div>
      {/* <div className="text-[#dd9ba0] py-2 my-4">
        Lưu ý, người dùng do bạn tạo ra thì có quyền mặc định là người dùng.
      </div> */}
      <div className="pt-5 w-[40rem]">
        <div>
          <div className="">
            <div className="text-[1.5rem]">Tên chương học</div>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên của người dùng"
              className="px-4 mt-2 mb-2 bg-[#fff] py-3 focus:outline-none border-[#e0cacd] focus:border-[#dd9ba0] border-[0.2rem] rounded-xl y-3 w-full"
              onChange={handleOnchange}
              value={data.name}
              onBlur={e => handleBlur(e)}
            />
            <div className="pb-2 text-[#d52e74]">{error.name}</div>
          </div>
          <button
            type="submit"
            className={`disabled:bg-[#ccc] bg-[#5385e7] flex items-center mt-4 text-[#fff] py-4 rounded-xl  px-10`}
            onClick={handleSubmit}
            disabled={
              data.name === '' ||
              hasValue(error) ||
              isLoadding ||
              data.name === dataChapter?.name
            }
          >
            <span className="mr-2">Lưu lại</span>
            {isLoadding && <Loading />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterEdit;
