'use client';
import RichTextEditor from '@/components/RichTextEditor';
import { message } from 'antd';
import { useEffect, useState } from 'react';

import { fetchFile, hasValue } from '@/Utils/functions';
import { CourseCreate, CourseEditAsync } from '@/api/api';
import { useRouter } from 'next/navigation';
import CoursePrice from '../create/CoursePrice';
import Levels from '../create/Levels';
import Banner from '../create/Banner';

interface ICourseEdit {
  title: string;
  banner: File | null | undefined;
  levelId: number | undefined;
  price: number | undefined;
  priceOld: number | undefined;
  isFree: boolean;
  slogan: string;
}
const CourseEdit = ({ levels, course }: any) => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [resultsAfterStudying, setResultsAfterStudying] = useState<string>(
    course?.courseDetail?.resultsAfterStudying,
  );
  const [description, setDescription] = useState<string>(
    course?.courseDetail?.description,
  );
  const [error, setError] = useState<any>();
  const [courseSuggestions, setCourseSuggestions] = useState<string>(
    course?.courseDetail?.courseSuggestions,
  );
  const [introduce, setIntroduce] = useState<string>(course?.introduce);
  const [data, setData] = useState<ICourseEdit>({
    title: course?.title,
    banner: null,
    levelId: course?.levelId,
    price: course?.courseDetail?.price,
    priceOld: course?.courseDetail?.priceOld,
    isFree: course?.courseDetail?.isFree,
    slogan: course?.courseDetail?.slogan,
  });
  useEffect(() => {
    const fetchImage = async () => {
      if (course?.banner) {
        const image = await fetchFile(course?.banner);
        if (image) {
          setData({
            ...data,
            banner: image,
          });
        }
      }
    };
    fetchImage();
  }, []);
  const handleChoiseCourse = (id: any) => {
    setData({
      ...data,
      levelId: id,
    });
  };
  const handleSetErrror = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'title' && value.length === 0) {
      setError({
        ...error,
        [name]: 'Tiêu đề không được bỏ trống',
      });
    }
    if (name === 'slogan' && value.length === 0) {
      setError({
        ...error,
        [name]: 'Slogan không được bỏ trống',
      });
    }
  };
  const handleSubmit = async () => {
    let hasError = false;

    if (!data?.title) {
      setError((prevError: any) => ({
        ...prevError,
        title: 'Tiêu đề không được bỏ trống',
      }));
      hasError = true;
    }

    if (!data?.slogan) {
      setError((prevError: any) => ({
        ...prevError,
        slogan: 'Slogan không được bỏ trống',
      }));
      hasError = true;
    }

    if (!data?.isFree) {
      if (!data?.price || data?.price === 0) {
        setError((prevError: any) => ({
          ...prevError,
          price: 'Giá không được bỏ trống',
        }));
        hasError = true;
      }

      if (!data?.priceOld || data?.priceOld === 0) {
        setError((prevError: any) => ({
          ...prevError,
          priceOld: 'Giá cũ không được bỏ trống',
        }));
        hasError = true;
      }
    }

    if (hasError) {
      messageApi.open({
        type: 'error',
        content: 'Vui lòng nhập thông tin đầy đủ',
      });
      return;
    }
    if (
      course?.courseDetail?.courseSuggestions === courseSuggestions &&
      course?.courseDetail?.description === description &&
      course?.courseDetail?.isFree === data?.isFree &&
      course?.courseDetail?.slogan === data?.slogan &&
      course?.introduce == introduce &&
      data?.title === data?.title
    ) {
      messageApi.warning('bạn chưa thay đổi giá trị');
      return;
    }
    const formData = new FormData();
    formData.append('CourseCreate.LevelId', data?.levelId?.toString() || '');
    formData.append('CourseCreate.Title', data?.title || '');
    formData.append('CourseCreate.Image', data?.banner || '');
    formData.append('CourseCreate.introduce', introduce || '');
    formData.append(
      'CourseDetailCreate.IsFree',
      data?.isFree ? 'true' : 'false',
    );
    if (!data?.isFree) {
      formData.append(
        'CourseDetailCreate.Price',
        data?.price?.toString() || '',
      );
      formData.append(
        'CourseDetailCreate.PriceOld',
        data?.priceOld?.toString() || '',
      );
    }
    formData.append('CourseDetailCreate.Description', description || '');
    formData.append(
      'CourseDetailCreate.ResultsAfterStudying',
      resultsAfterStudying || '',
    );
    formData.append('CourseDetailCreate.Slogan', data?.slogan || '');
    formData.append(
      'CourseDetailCreate.CourseSuggestions',
      courseSuggestions || '',
    );

    const res = await CourseEditAsync(formData, course.id);
    if (res?.statusCode === 200 || res?.statusCode === 200) {
      messageApi.open({
        type: 'success',
        content: 'Lưu thành công',
      });
      router.push('/admin/course');
    } else {
      messageApi.open({
        type: 'error',
        content: 'Có lỗi xẩy ra, vui lòng thử lại sau',
      });
    }
  };

  return (
    <div className="p-10 text-[1.3rem]">
      {contextHolder}
      <div className="text-[2.5rem]  font-bold">Chỉnh sửa khoá học</div>
      <div className="mt-10">
        <input
          onBlur={handleSetErrror}
          type="text"
          name={'title'}
          value={data.title}
          onChange={e => {
            setError({
              ...error,
              [e.target.name]: '',
            });
            setData({
              ...data,
              title: e.target.value,
            });
          }}
          className="w-full rounded-xl placeholder-[#cecdcd] text-[3rem] py-11 px-10 text-[#fff] focus:outline-none bg-[#1e75e5]"
          placeholder="Tiêu đề khoá học ...."
        />
        <div className="text-[1.2rem] mt-4 ps-4 text-[#d98888]">
          {error?.title}
        </div>
        <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
          <div className="">Khẩu hiệu</div>
          <div className="">
            <input
              onBlur={handleSetErrror}
              type="text"
              name={'slogan'}
              value={data.slogan}
              className="w-full mt-10 rounded-xl placeholder-[#908e8e] text-[1.4rem] py-4 px-10 shadow-lg text-[#000] focus:outline-none bg-[#fff]"
              placeholder="Slogan ...."
              onChange={e => {
                setError({
                  ...error,
                  [e.target.name]: '',
                });
                setData({
                  ...data,
                  slogan: e.target.value,
                });
              }}
            />
          </div>
          <div className="text-[1.2rem] mt-4 ps-4 text-[#d98888]">
            {error?.slogan}
          </div>
        </div>
        <CoursePrice
          error={error}
          setError={setError}
          data={data}
          setData={setData}
        />
        <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
          Level
          <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
          <div className="pt-10 cursor-pointer grid text-[1.4rem] grid-cols-6 gap-6">
            {levels?.length > 0 &&
              levels?.map((level: any) => (
                <Levels
                  key={level?.id}
                  levelChoise={data?.levelId}
                  onChoiseCourse={handleChoiseCourse}
                  level={level}
                />
              ))}
          </div>
        </div>
        Banner khoá học
        <span className=" absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
        <Banner data={data?.banner} setData={setData} />
        <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
          Thông tin khoá học
          <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
          <div className="pt-10">
            <RichTextEditor value={introduce} onChange={setIntroduce} />
          </div>
        </div>
        <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
          Mô tả
          <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
          <div className="pt-10">
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
            Gợi ý khoá học
            <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
            <div className="pt-10">
              <RichTextEditor
                value={courseSuggestions}
                onChange={setCourseSuggestions}
              />
            </div>
          </div>
          <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
            Kết quả sau khi học xong khoá học
            <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
            <div className="pt-10">
              <RichTextEditor
                value={resultsAfterStudying}
                onChange={setResultsAfterStudying}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <button
          onClick={handleSubmit}
          className="px-10 py-4 rounded-2xl bg-[#609fd6] text-[#fff]"
        >
          Lưu lại
        </button>
      </div>
    </div>
  );
};

export default CourseEdit;
