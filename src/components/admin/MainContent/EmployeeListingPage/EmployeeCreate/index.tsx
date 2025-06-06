'use client';

import { CreateUser } from '@/api/axios/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ICreateUser } from '@/types/next-auth';
import { checkIsEmail, hasValue, hasWhitespace } from '@/Utils/functions';
import { message, Switch, Form, Input, Button, Alert, Card, Select, Upload, Spin, Divider } from 'antd';
import { FiUser, FiMail, FiLock, FiUpload, FiAlertCircle, FiCheck, FiArrowLeft } from 'react-icons/fi';
import LoadingBar from 'react-top-loading-bar';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const EmployeeCreate = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadingRef = useRef<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [data, setData] = useState<ICreateUser & {
    confirmPassword?: string;
    role?: string;
    bio?: string;
    phoneNumber?: string;
  }>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isActive: 0,
    role: 'user',
    bio: '',
    phoneNumber: '',
  });

  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
  }>({ score: 0, message: '' });

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) return { score: 0, message: '' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;

    let message = '';
    if (score === 0) message = 'Rất yếu';
    else if (score === 1) message = 'Yếu';
    else if (score === 2) message = 'Trung bình';
    else if (score === 3) message = 'Mạnh';
    else message = 'Rất mạnh';

    return { score, message };
  };

  useEffect(() => {
    if (data.password) {
      setPasswordStrength(checkPasswordStrength(data.password));
    }
  }, [data.password]);

  const handleUploadChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'uploading') {
      return;
    }

    if (file.status === 'done' || file.originFileObj) {
      const fileObj = file.originFileObj;
      if (fileObj) {
        setAvatarFile(fileObj);
        const imageUrl = URL.createObjectURL(fileObj);
        setAvatarPreview(imageUrl);
      }
    }
  };

  const validateForm = () => {
    return form.validateFields()
      .then(() => true)
      .catch(() => false);
  };

  const handleSubmit = async (values: any) => {
    loadingRef.current?.continuousStart();
    setIsLoading(true);

    try {
      // Prepare form data for the API
      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('isActive', values.isActive ? '1' : '0');
      formData.append('role', values.role);

      if (values.bio) {
        formData.append('bio', values.bio);
      }

      if (values.phoneNumber) {
        formData.append('phoneNumber', values.phoneNumber);
      }

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const result = await CreateUser(formData);

      if (result?.statusCode === 200 || result?.statusCode === 201) {
        messageApi.success({
          content: 'Tạo mới tài khoản thành công',
          duration: 2,
        });

        setTimeout(() => {
          router.push('/admin/users');
        }, 1000);
      } else if (result?.statusCode === 400) {
        if (result.message.includes('email')) {
          form.setFields([{
            name: 'email',
            errors: ['Email này đã được sử dụng']
          }]);
        } else {
          messageApi.error({
            content: result.message || 'Đã xảy ra lỗi khi tạo tài khoản',
            duration: 3,
          });
        }
      } else if (result?.statusCode === 401) {
        messageApi.error({
          content: 'Hết phiên đăng nhập, vui lòng đăng nhập lại',
          duration: 3,
        });
      } else {
        messageApi.error({
          content: result?.message || 'Đã xảy ra lỗi khi tạo tài khoản',
          duration: 3,
        });
      }
    } catch (error) {
      messageApi.error({
        content: 'Đã xảy ra lỗi khi tạo tài khoản',
        duration: 3,
      });
    } finally {
      setIsLoading(false);
      loadingRef.current?.complete();
    }
  };

  const handleCancel = () => {
    router.push('/admin/users');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      {contextHolder}
      <LoadingBar color="#4f46e5" ref={loadingRef} />

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={handleCancel}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiArrowLeft className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tạo mới người dùng</h1>
            <p className="text-gray-500 mt-1">
              Thêm người dùng mới vào hệ thống với các thông tin cần thiết
            </p>
          </div>
        </div>

        <Alert
          message="Lưu ý quan trọng"
          description="Hãy đảm bảo thông tin người dùng chính xác. Mật khẩu nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để đảm bảo an toàn."
          type="info"
          showIcon
          icon={<FiAlertCircle className="mt-1" />}
          className="mb-6"
        />

        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            isActive: false,
            role: 'user'
          }}
          className="max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Ảnh đại diện</h3>
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser size={40} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  <Upload
                    name="avatar"
                    listType="picture"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleUploadChange}
                  >
                    <Button icon={<UploadOutlined />} className="w-full">
                      Chọn ảnh đại diện
                    </Button>
                  </Upload>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Trạng thái tài khoản</h3>
                <Form.Item name="isActive" valuePropName="checked">
                  <Switch
                    checkedChildren="Đã kích hoạt"
                    unCheckedChildren="Chưa kích hoạt"
                  />
                </Form.Item>
                <p className="text-xs text-gray-500 mt-1">
                  Tài khoản đã kích hoạt có thể đăng nhập và sử dụng hệ thống ngay lập tức
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Thông tin tài khoản</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ và tên' },
                    {
                      validator: (_, value) => {
                        if (value && !hasWhitespace(value)) {
                          return Promise.reject('Họ và tên phải có ít nhất 2 từ');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    prefix={<FiUser className="text-gray-400 mr-2" />}
                    placeholder="Nhập họ và tên đầy đủ"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input
                    type="email"
                    prefix={<FiMail className="text-gray-400 mr-2" />}
                    placeholder="Nhập địa chỉ email"
                    className="py-2"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
                    {
                      validator: (_, value) => {
                        if (value && checkPasswordStrength(value).score < 2) {
                          return Promise.reject('Mật khẩu quá yếu, cần thêm chữ hoa, số hoặc ký tự đặc biệt');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  help={
                    form.getFieldValue('password') && (
                      <div className="flex items-center mt-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.score === 0 ? 'bg-gray-300' :
                              passwordStrength.score === 1 ? 'bg-red-500' :
                                passwordStrength.score === 2 ? 'bg-yellow-500' :
                                  passwordStrength.score === 3 ? 'bg-green-500' :
                                    'bg-green-600'
                              }`}
                            style={{ width: `${passwordStrength.score * 25}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs text-gray-500">{passwordStrength.message}</span>
                      </div>
                    )
                  }
                >
                  <Input.Password
                    prefix={<FiLock className="text-gray-400 mr-2" />}
                    placeholder="Nhập mật khẩu"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<FiLock className="text-gray-400 mr-2" />}
                    placeholder="Xác nhận mật khẩu"
                    className="py-2"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item
                  label="Vai trò"
                  name="role"
                  rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                >
                  <Select
                    placeholder="Chọn vai trò người dùng"
                    options={[
                      { value: 'user', label: 'Người dùng' },
                      { value: 'admin', label: 'Quản trị viên' },
                    ]}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Mô tả ngắn"
                name="bio"
              >
                <Input.TextArea
                  placeholder="Nhập thông tin giới thiệu ngắn về người dùng"
                  rows={4}
                />
              </Form.Item>

              <Divider />

              <Form.Item className="mb-0 flex justify-end">
                <Button
                  onClick={handleCancel}
                  className="mr-3"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  icon={<FiCheck className="mr-1" />}
                >
                  Tạo người dùng
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeCreate;
