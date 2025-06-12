'use client';
import RichTextEditor from '@/components/RichTextEditor';
import { Button, Card, Form, Input, message, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { fetchFile } from '@/Utils/functions';
import { CourseEditAsync } from '@/api/axios/api';
import { useRouter } from 'next/navigation';
import CoursePrice from '../create/CoursePrice';
import Levels from '../create/Levels';
import Banner from '../create/Banner';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
  const [form] = Form.useForm();

  const [resultsAfterStudying, setResultsAfterStudying] = useState<string>(
    course?.courseDetail?.resultsAfterStudying,
  );
  const [description, setDescription] = useState<string>(
    course?.courseDetail?.description,
  );
  const [error, setError] = useState<any>({});
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
        [name]: 'Khẩu hiệu không được bỏ trống',
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
        slogan: 'Khẩu hiệu không được bỏ trống',
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
          priceOld: 'Giá gốc không được bỏ trống',
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
      messageApi.warning('Bạn chưa thay đổi thông tin nào');
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

    messageApi.loading({ content: 'Đang lưu thông tin...', key: 'saveLoading' });

    try {
      const res = await CourseEditAsync(formData, course.id);
      if (res?.statusCode === 200) {
        messageApi.success({ content: 'Lưu thành công', key: 'saveLoading' });
        router.push('/admin/course');
      } else {
        messageApi.error({ content: res?.message || 'Có lỗi xảy ra', key: 'saveLoading' });
      }
    } catch (error) {
      messageApi.error({ content: 'Có lỗi xảy ra, vui lòng thử lại sau', key: 'saveLoading' });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {contextHolder}

      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">Chỉnh sửa khóa học</Title>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Lưu thay đổi
        </Button>
      </div>

      <Card className="shadow-md mb-6">
        <div className="mb-6">
          <input
            onBlur={handleSetErrror}
            type="text"
            name="title"
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
            className="w-full rounded-lg text-[2rem] py-8 px-6 text-white focus:outline-none bg-gradient-to-r from-blue-500 to-blue-600 font-medium"
            placeholder="Tiêu đề khóa học..."
          />
          {error?.title && (
            <Text type="danger" className="mt-2 block">{error.title}</Text>
          )}
        </div>

        <Form layout="vertical" form={form} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <Form.Item
              label={<span className="text-base font-medium">Khẩu hiệu</span>}
              validateStatus={error?.slogan ? 'error' : ''}
              help={error?.slogan}
            >
              <Input
                name="slogan"
                value={data.slogan}
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
                onBlur={handleSetErrror}
                placeholder="Nhập khẩu hiệu khóa học..."
                size="large"
              />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <CoursePrice
              error={error}
              setError={setError}
              data={data}
              setData={setData}
            />
          </div>
        </Form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Cấp độ" className="shadow-md col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
        </Card>

        <Card title="Banner khóa học" className="shadow-md col-span-1">
          <Banner data={data?.banner} setData={setData} />
        </Card>
      </div>

      <Tabs defaultActiveKey="1" type="card" className="mb-6">
        <TabPane tab="Thông tin khóa học" key="1">
          <Card className="shadow-md">
            <RichTextEditor value={introduce} onChange={setIntroduce} />
          </Card>
        </TabPane>

        <TabPane tab="Mô tả chi tiết" key="2">
          <Card className="shadow-md">
            <RichTextEditor value={description} onChange={setDescription} />
          </Card>
        </TabPane>

        <TabPane tab="Gợi ý khóa học" key="3">
          <Card className="shadow-md">
            <RichTextEditor value={courseSuggestions} onChange={setCourseSuggestions} />
          </Card>
        </TabPane>

        <TabPane tab="Kết quả sau khóa học" key="4">
          <Card className="shadow-md">
            <RichTextEditor value={resultsAfterStudying} onChange={setResultsAfterStudying} />
          </Card>
        </TabPane>
      </Tabs>

      <div className="flex justify-end">
        <Button
          type="default"
          size="large"
          onClick={() => router.push('/admin/course')}
          className="mr-4"
        >
          Hủy
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default CourseEdit;
