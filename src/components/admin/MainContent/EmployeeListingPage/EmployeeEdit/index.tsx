'use client';
import { getUserByID, UpdateImageUser, UpdateUser, ToggleUserStatus, UpdateUserRole } from '@/api/axios/api';
import NotFound from '@/app/not-found';
import LoadingPage from '@/components/client/LoadingPage';
import { memo, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { message, Button, Card, Alert, Spin, Form, Input, Select, Switch, Tabs, Upload, Divider, Modal } from 'antd';
import { FiSave, FiAlertCircle, FiArrowLeft, FiTrash2, FiUser, FiMail, FiLock, FiPhone, FiLink, FiGlobe, FiGithub, FiFacebook, FiYoutube } from 'react-icons/fi';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import LoadingBar from 'react-top-loading-bar';
import { createValidData } from '@/Utils/functions';
import TextArea from 'antd/es/input/TextArea';

const { TabPane } = Tabs;

const EmployeeEdit = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const { id: idString } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [dataUser, setDataUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const loadingRef = useRef<any>(null);

  useEffect(() => {
    if (!idString) {
      messageApi.error({
        content: 'ID người dùng không hợp lệ',
        duration: 3,
      });
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
      return;
    }

    fetchUserData();
  }, [idString]);

  const fetchUserData = async () => {
    if (!idString) return;

    setLoading(true);
    loadingRef.current?.continuousStart();

    try {
      const id = parseInt(String(idString));
      const res = await getUserByID({ id });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setDataUser(res?.data);

        // Initialize form values
        form.setFieldsValue({
          fullName: res?.data?.fullName,
          email: res?.data?.email,
          isActive: res?.data?.isActive === 1,
          role: res?.data?.role || 'user',
          phoneNumber: res?.data?.phoneNumber,
          bio: res?.data?.bio,
          githubLink: res?.data?.githubLink,
          facebookLink: res?.data?.facebookLink,
          youtubeLink: res?.data?.youtubeLink,
          personalWebsite: res?.data?.personalWebsite,
        });

        if (res?.data.avatar) {
          setAvatarPreview(res?.data.avatar);
        }
      } else {
        messageApi.error({
          content: res?.message || 'Không thể tải thông tin người dùng',
          duration: 3,
        });
        setTimeout(() => {
          router.push('/admin/users');
        }, 1500);
      }
    } catch (error) {
      messageApi.error({
        content: 'Đã xảy ra lỗi khi tải thông tin người dùng',
        duration: 3,
      });
    } finally {
      setLoading(false);
      loadingRef.current?.complete();
    }
  };

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

  const handleSubmit = async (values: any) => {
    if (!idString) return;

    setIsSaving(true);
    loadingRef.current?.continuousStart();
    let hasSuccess = false;

    try {
      const id = parseInt(String(idString));

      // Handle avatar update if there's a new avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const resImage = await UpdateImageUser({
          id,
          data: formData,
        });

        if (resImage?.statusCode === 200 || resImage?.statusCode === 201) {
          setAvatarFile(null);
          hasSuccess = true;
        } else {
          messageApi.error({
            content: 'Có lỗi khi cập nhật hình ảnh',
            duration: 3,
          });
        }
      }

      // Handle account status update if changed
      if (dataUser?.isActive !== (values.isActive ? 1 : 0)) {
        const newStatus = values.isActive ? 1 : 0;
        const resStatus = await ToggleUserStatus({
          id,
          isActive: newStatus
        });

        if (resStatus?.statusCode === 200 || resStatus?.statusCode === 201) {
          hasSuccess = true;
        } else {
          messageApi.error({
            content: 'Có lỗi khi cập nhật trạng thái tài khoản',
            duration: 3,
          });
        }
      }

      // Handle role update if changed
      if (dataUser?.role !== values.role) {
        const resRole = await UpdateUserRole({
          id,
          role: values.role
        });

        if (resRole?.statusCode === 200 || resRole?.statusCode === 201) {
          hasSuccess = true;
        } else {
          messageApi.error({
            content: 'Có lỗi khi cập nhật vai trò người dùng',
            duration: 3,
          });
        }
      }

      // Prepare user data for update
      const updateData: any = {};

      // Only include fields that have changed
      if (values.fullName !== dataUser?.fullName) updateData.fullName = values.fullName;
      if (values.password) updateData.password = values.password;
      if (values.bio !== dataUser?.bio) updateData.bio = values.bio;
      if (values.phoneNumber !== dataUser?.phoneNumber) updateData.phoneNumber = values.phoneNumber;
      if (values.githubLink !== dataUser?.githubLink) updateData.githubLink = values.githubLink;
      if (values.facebookLink !== dataUser?.facebookLink) updateData.facebookLink = values.facebookLink;
      if (values.youtubeLink !== dataUser?.youtubeLink) updateData.youtubeLink = values.youtubeLink;
      if (values.personalWebsite !== dataUser?.personalWebsite) updateData.personalWebsite = values.personalWebsite;

      // Only make the API call if there are fields to update
      if (Object.keys(updateData).length > 0) {
        const res = await UpdateUser({
          id,
          data: updateData,
        });

        if (res?.statusCode === 200 || res?.statusCode === 201) {
          hasSuccess = true;
          // Update local data
          setDataUser({
            ...dataUser,
            ...updateData,
            isActive: values.isActive ? 1 : 0,
            role: values.role
          });
        } else {
          messageApi.error({
            content: res?.message || 'Có lỗi khi cập nhật thông tin',
            duration: 3,
          });
        }
      }

      if (hasSuccess) {
        messageApi.success({
          content: 'Cập nhật thông tin thành công',
          duration: 2,
        });

        // Refresh data to ensure we have the latest
        fetchUserData();
      }
    } catch (error) {
      messageApi.error({
        content: 'Đã xảy ra lỗi khi cập nhật thông tin',
        duration: 3,
      });
    } finally {
      setIsSaving(false);
      loadingRef.current?.complete();
    }
  };

  const handleDelete = async () => {
    // Add delete user functionality here
    setShowDeleteConfirm(false);
    router.push('/admin/users');
  };

  const handleCancel = () => {
    router.push('/admin/users');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="Đang tải thông tin người dùng..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      {contextHolder}
      <LoadingBar color="#4f46e5" ref={loadingRef} />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={handleCancel}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa người dùng</h1>
              <p className="text-gray-500 mt-1">
                ID: #{idString} | Cập nhật thông tin người dùng và phân quyền
              </p>
            </div>
          </div>

          <Button
            danger
            icon={<FiTrash2 className="mr-1" />}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Xóa người dùng
          </Button>
        </div>

        <Alert
          message="Lưu ý khi cập nhật thông tin"
          description="Để trống mật khẩu nếu không muốn thay đổi. Các thay đổi sẽ được áp dụng ngay lập tức sau khi lưu."
          type="info"
          showIcon
          icon={<FiAlertCircle className="mt-1" />}
          className="mb-6"
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{
            isActive: dataUser?.isActive === 1,
            role: dataUser?.role || 'user'
          }}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
            <TabPane tab="Thông tin cơ bản" key="basic">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card className="shadow-sm">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Ảnh đại diện</h3>
                      <div className="flex flex-col items-center">
                        <div className="mb-4">
                          <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt={dataUser?.fullName}
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
                            Thay đổi ảnh
                          </Button>
                        </Upload>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Trạng thái & Vai trò</h3>
                      <div className="space-y-4">
                        <Form.Item name="isActive" valuePropName="checked" label="Trạng thái tài khoản">
                          <Switch
                            checkedChildren="Đã kích hoạt"
                            unCheckedChildren="Chưa kích hoạt"
                          />
                        </Form.Item>

                        <Form.Item
                          label="Vai trò người dùng"
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
                    </div>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  <Card className="shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Thông tin cá nhân</h3>

                    <div className="space-y-4">
                      <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                      >
                        <Input
                          prefix={<FiUser className="text-gray-400 mr-2" />}
                          placeholder="Nhập họ và tên đầy đủ"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Email"
                        name="email"
                      >
                        <Input
                          prefix={<FiMail className="text-gray-400 mr-2" />}
                          placeholder="Email không thể thay đổi"
                          disabled
                        />
                      </Form.Item>

                      <Form.Item
                        label="Mật khẩu mới"
                        name="password"
                        rules={[
                          { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                        ]}
                        help="Để trống nếu không muốn thay đổi mật khẩu"
                      >
                        <Input.Password
                          prefix={<FiLock className="text-gray-400 mr-2" />}
                          placeholder="Nhập mật khẩu mới (để trống nếu không thay đổi)"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                          { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                      >
                        <Input
                          prefix={<FiPhone className="text-gray-400 mr-2" />}
                          placeholder="Nhập số điện thoại"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Mô tả ngắn"
                        name="bio"
                      >
                        <TextArea
                          placeholder="Nhập thông tin giới thiệu ngắn về người dùng"
                          rows={4}
                        />
                      </Form.Item>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Liên kết mạng xã hội" key="social">
              <Card className="shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="GitHub"
                    name="githubLink"
                  >
                    <Input
                      prefix={<FiGithub className="text-gray-400 mr-2" />}
                      placeholder="Nhập đường dẫn GitHub"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Facebook"
                    name="facebookLink"
                  >
                    <Input
                      prefix={<FiFacebook className="text-gray-400 mr-2" />}
                      placeholder="Nhập đường dẫn Facebook"
                    />
                  </Form.Item>

                  <Form.Item
                    label="YouTube"
                    name="youtubeLink"
                  >
                    <Input
                      prefix={<FiYoutube className="text-gray-400 mr-2" />}
                      placeholder="Nhập đường dẫn kênh YouTube"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Website cá nhân"
                    name="personalWebsite"
                  >
                    <Input
                      prefix={<FiGlobe className="text-gray-400 mr-2" />}
                      placeholder="Nhập đường dẫn website cá nhân"
                    />
                  </Form.Item>
                </div>
              </Card>
            </TabPane>
          </Tabs>

          <Divider />

          <div className="flex justify-end">
            <Button
              onClick={handleCancel}
              className="mr-3"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSaving}
              icon={<FiSave className="mr-1" />}
            >
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </div>

      <Modal
        title="Xác nhận xóa người dùng"
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onOk={handleDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default EmployeeEdit;
