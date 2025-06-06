'use client';
import RichTextEditor from '@/components/RichTextEditor';
import { message, Form, Input, Card, Button, Alert, Divider } from 'antd';
import { useState } from 'react';

import CoursePrice from './CoursePrice';
import Levels from './Levels';
import { hasValue } from '@/Utils/functions';
import { CourseCreate } from '@/api/axios/api';
import { useRouter } from 'next/navigation';
import Banner from './Banner';
import { FiAlertCircle, FiSave, FiDollarSign, FiType, FiBookOpen } from 'react-icons/fi';

interface ICourseCreate {
  title: string;
  banner: File | null;
  levelId: number | undefined;
  price: number | undefined;
  priceOld: number | undefined;
  isFree: boolean;
  slogan: string;
}

const CreateCourse = ({ levels }: any) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [resultsAfterStudying, setResultsAfterStudying] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{
    title?: string;
    slogan?: string;
    price?: string;
    priceOld?: string;
    banner?: string;
    introduce?: string;
    description?: string;
  }>({});
  const [courseSuggestions, setCourseSuggestions] = useState<string>('');
  const [introduce, setIntroduce] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<ICourseCreate>({
    title: '',
    banner: null,
    levelId: levels[0]?.id,
    price: undefined,
    priceOld: undefined,
    isFree: true,
    slogan: '',
  });

  const handleChoiseCourse = (id: any) => {
    setData({
      ...data,
      levelId: id,
    });
  };

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!data.title || data.title.trim() === '') {
      newErrors.title = 'Tiêu đề không được để trống';
      isValid = false;
    }

    if (!data.slogan || data.slogan.trim() === '') {
      newErrors.slogan = 'Slogan không được để trống';
      isValid = false;
    }

    if (!data.banner) {
      newErrors.banner = 'Vui lòng tải lên hình ảnh cho khóa học';
      isValid = false;
    }

    if (!data.isFree) {
      if (!data.price || data.price <= 0) {
        newErrors.price = 'Giá không được để trống và phải lớn hơn 0';
        isValid = false;
      }

      if (!data.priceOld || data.priceOld <= 0) {
        newErrors.priceOld = 'Giá cũ không được để trống và phải lớn hơn 0';
        isValid = false;
      }

      if (data.price && data.priceOld && data.price >= data.priceOld) {
        newErrors.price = 'Giá khuyến mãi phải nhỏ hơn giá gốc';
        isValid = false;
      }
    }

    if (!introduce || introduce.trim() === '<p><br></p>') {
      newErrors.introduce = 'Thông tin khóa học không được để trống';
      isValid = false;
    }

    if (!description || description.trim() === '<p><br></p>') {
      newErrors.description = 'Mô tả khóa học không được để trống';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      messageApi.open({
        type: 'error',
        content: 'Vui lòng nhập đầy đủ thông tin hợp lệ',
      });
      return;
    }

    setIsLoading(true);

    try {
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

      const res = await CourseCreate(formData);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.open({
          type: 'success',
          content: 'Tạo khóa học mới thành công',
        });

        setTimeout(() => {
          router.push('/admin/course');
        }, 1500);
      } else {
        messageApi.open({
          type: 'error',
          content: 'Có lỗi xảy ra, vui lòng thử lại sau',
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Có lỗi xảy ra, vui lòng thử lại sau',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      {contextHolder}

      <div className="mb-3">
        <h1 className="text-sm font-semibold text-gray-800">Thêm khóa học mới</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Tạo khóa học mới với đầy đủ thông tin và nội dung học tập
        </p>
      </div>

      <Alert
        message="Lưu ý khi tạo khóa học"
        description="Vui lòng điền đầy đủ thông tin để tạo khóa học hiệu quả."
        type="info"
        showIcon
        icon={<FiAlertCircle className="mt-0.5" />}
        className="mb-3 text-xs"
      />

      <Card className="mb-3 shadow-sm" size="small">
        <div className="mb-3">
          <h2 className="text-xs font-medium text-gray-800 mb-2 flex items-center">
            <FiBookOpen className="mr-1 text-xs" /> Thông tin cơ bản
          </h2>

          <Form layout="vertical" size="small">
            <Form.Item
              label="Tiêu đề khóa học"
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title}
              required
            >
              <Input
                size="small"
                name="title"
                value={data.title}
                onChange={(e) => {
                  setErrors({
                    ...errors,
                    title: '',
                  });
                  setData({
                    ...data,
                    title: e.target.value,
                  });
                }}
                placeholder="Nhập tiêu đề khóa học..."
              />
            </Form.Item>

            <Form.Item
              label="Slogan khóa học"
              validateStatus={errors.slogan ? 'error' : ''}
              help={errors.slogan}
              required
            >
              <Input
                size="small"
                name="slogan"
                value={data.slogan}
                onChange={(e) => {
                  setErrors({
                    ...errors,
                    slogan: '',
                  });
                  setData({
                    ...data,
                    slogan: e.target.value,
                  });
                }}
                placeholder="Nhập slogan ngắn gọn, hấp dẫn..."
              />
            </Form.Item>
          </Form>
        </div>

        <Divider className="my-2" />

        <div className="mb-3">
          <h2 className="text-xs font-medium text-gray-800 mb-2 flex items-center">
            <FiDollarSign className="mr-1 text-xs" /> Thông tin giá
          </h2>

          <CoursePrice
            error={errors}
            setError={setErrors}
            data={data}
            setData={setData}
          />
        </div>

        <Divider className="my-2" />

        <div className="mb-2">
          <h2 className="text-xs font-medium text-gray-800 mb-2 flex items-center">
            <FiType className="mr-1 text-xs" /> Cấp độ khóa học
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
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
      </Card>

      <Card className="mb-3 shadow-sm" size="small">
        <h2 className="text-xs font-medium text-gray-800 mb-2">Hình ảnh khóa học</h2>

        <Banner data={data?.banner} setData={setData} />

        {errors.banner && (
          <div className="text-red-500 text-xs mt-1">{errors.banner}</div>
        )}
      </Card>

      <Card className="mb-3 shadow-sm" size="small">
        <h2 className="text-xs font-medium text-gray-800 mb-2">Thông tin chi tiết khóa học</h2>

        <div className="mb-3">
          <h3 className="text-xs font-medium text-gray-700 mb-1">Giới thiệu khóa học <span className="text-red-500">*</span></h3>
          <RichTextEditor value={introduce} onChange={setIntroduce} />
          {errors.introduce && (
            <div className="text-red-500 text-xs mt-0.5">{errors.introduce}</div>
          )}
        </div>

        <div className="mb-3">
          <h3 className="text-xs font-medium text-gray-700 mb-1">Mô tả chi tiết <span className="text-red-500">*</span></h3>
          <RichTextEditor value={description} onChange={setDescription} />
          {errors.description && (
            <div className="text-red-500 text-xs mt-0.5">{errors.description}</div>
          )}
        </div>
      </Card>

      <Card className="mb-3 shadow-sm" size="small">
        <h2 className="text-xs font-medium text-gray-800 mb-2">Thông tin bổ sung</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <h3 className="text-xs font-medium text-gray-700 mb-1">Kết quả sau khi học</h3>
            <RichTextEditor value={resultsAfterStudying} onChange={setResultsAfterStudying} />
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-700 mb-1">Khóa học gợi ý</h3>
            <RichTextEditor value={courseSuggestions} onChange={setCourseSuggestions} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          type="default"
          size="small"
          className="mr-2"
          onClick={() => router.push('/admin/course')}
        >
          Hủy
        </Button>

        <Button
          type="primary"
          size="small"
          icon={<FiSave className="mr-1 text-xs" />}
          onClick={handleSubmit}
          loading={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Tạo khóa học
        </Button>
      </div>
    </div>
  );
};

export default CreateCourse;
