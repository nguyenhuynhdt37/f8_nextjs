'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Select, Spin, Switch, Tabs, message, Upload } from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined, LockOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { UpdateUserDto, User } from '@/types/user';
import { getUserByID } from '@/api/axios/api';
import { updateUser } from '@/api/axios/api';
import { sendNotification } from '@/api/axios/api';
import { getRoles } from '@/api/axios/api';
import RichTextEditor from '@/components/RichTextEditor';
import 'react-quill/dist/quill.snow.css';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { UpdateImageUser } from '@/api/axios/api';

const { TabPane } = Tabs;

interface Props {
    userId: number;
}

interface Role {
    id: number;
    name: string;
    code: string;
}

const EditUserForm = ({ userId }: Props) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [originalStatus, setOriginalStatus] = useState<number>(1);
    const [originalRole, setOriginalRole] = useState<string>('1');
    const [bioContent, setBioContent] = useState<string>('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    console.log(user);
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                if (response?.statusCode === 200 && response.data) {
                    setRoles(response.data);
                } else {
                    message.error('Không thể tải danh sách vai trò');
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
                message.error('Đã xảy ra lỗi khi tải danh sách vai trò');
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    // Helper function to format avatar path
    const formatAvatarPath = (path: string | null | undefined): string => {
        if (!path) return '/images/default-avatar.png';

        // If path already starts with http, it's an absolute URL
        if (path.startsWith('http')) return path;

        // Fix path that doesn't include /images prefix
        if (path.startsWith('/users/')) {
            return `/images${path}`;
        }

        return path;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await getUserByID({ id: userId });

                if (response?.statusCode === 200 && response.data) {
                    console.log(response.data);
                    setUser(response.data);
                    setOriginalStatus(response.data.isActive);
                    setOriginalRole(response.data.roleId?.toString() || '1');
                    setBioContent(response.data.bio || '');

                    form.setFieldsValue({
                        fullName: response.data.fullName,
                        email: response.data.email,
                        userName: response.data.userName,
                        personalWebsite: response.data.personalWebsite,
                        githubLink: response.data.githubLink,
                        youtubeLink: response.data.youtubeLink,
                        facebookLink: response.data.facebookLink,
                        isActive: response.data.isActive,
                        roleId: response.data.roleId
                    });

                    if (response.data.avatar) {
                        setAvatarPreview(formatAvatarPath(response.data.avatar));
                    }
                } else {
                    message.error('Không thể tải thông tin người dùng');
                    router.push('/admin/users');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                message.error('Đã xảy ra lỗi khi tải thông tin người dùng');
                router.push('/admin/users');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, router, form]);

    const onFinish = async (values: any) => {
        try {
            setSubmitting(true);

            // Create FormData to handle all form data
            const formData = new FormData();

            // Add basic fields
            if (values.fullName) formData.append('fullName', values.fullName);
            if (values.userName) formData.append('userName', values.userName);
            if (values.roleId) formData.append('roleId', values.roleId.toString());
            if (values.isActive !== undefined) formData.append('isActive', values.isActive.toString());

            // Add social links
            if (values.personalWebsite) formData.append('personalWebsite', values.personalWebsite);
            if (values.githubLink) formData.append('githubLink', values.githubLink);
            if (values.youtubeLink) formData.append('youtubeLink', values.youtubeLink);
            if (values.facebookLink) formData.append('facebookLink', values.facebookLink);

            // Add bio from rich text editor
            formData.append('bio', bioContent || '');

            // Check if role or status changed to prepare notification
            const roleChanged = values.roleId?.toString() !== originalRole;
            const statusChanged = values.isActive !== originalStatus;

            const response = await updateUser(userId, formData);

            if (response?.statusCode === 200) {
                message.success('Cập nhật thông tin người dùng thành công');

                // Send notification to user if role or status changed
                if (roleChanged || statusChanged) {
                    try {
                        let notificationMessage = "";

                        // Get role name from roles array
                        const roleName = roles.find(r => r.id === values.roleId)?.name || getRoleName(values.roleId);

                        if (roleChanged && statusChanged) {
                            notificationMessage = `Vai trò của bạn đã được thay đổi thành ${roleName} và tài khoản của bạn đã được ${values.isActive === 1 ? 'kích hoạt' : 'vô hiệu hóa'}.`;
                        } else if (roleChanged) {
                            notificationMessage = `Vai trò của bạn đã được thay đổi thành ${roleName}.`;
                        } else if (statusChanged) {
                            notificationMessage = `Tài khoản của bạn đã được ${values.isActive === 1 ? 'kích hoạt' : 'vô hiệu hóa'}.`;
                        }

                        await sendNotification({
                            title: 'Tài khoản của bạn đã được cập nhật',
                            message: notificationMessage,
                            userId: userId,
                            entityType: 'UserUpdate'
                        });
                    } catch (notificationError) {
                        console.error('Error sending notification:', notificationError);
                    }
                }

                router.push('/admin/users');
            } else {
                message.error(response?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (values: any) => {
        try {
            setSubmitting(true);

            // Create FormData for password reset
            const formData = new FormData();
            formData.append('password', values.newPassword);

            const response = await updateUser(userId, formData);

            if (response?.statusCode === 200) {
                message.success('Đã đặt lại mật khẩu thành công và gửi qua email cho người dùng');
                passwordForm.resetFields();

                // Send notification to user about password change
                try {
                    await sendNotification({
                        title: 'Mật khẩu của bạn đã được đặt lại',
                        message: 'Mật khẩu của bạn đã được quản trị viên đặt lại. Vui lòng kiểm tra email để lấy mật khẩu mới.',
                        userId: userId,
                        entityType: 'PasswordReset'
                    });
                } catch (notificationError) {
                    console.error('Error sending notification:', notificationError);
                }
            } else {
                message.error(response?.message || 'Không thể đặt lại mật khẩu');
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu');
        } finally {
            setSubmitting(false);
        }
    };

    const getRoleName = (role: string | number): string => {
        if (typeof role === 'number') {
            // Handle roleId (number)
            switch (role) {
                case 1:
                    return 'Quản trị viên';
                case 2:
                    return 'Điều hành viên';
                default:
                    return 'Người dùng';
            }
        } else {
            // Handle role code (string)
            switch (role) {
                case 'admin':
                    return 'Quản trị viên';
                case 'moderator':
                    return 'Điều hành viên';
                default:
                    return 'Người dùng';
            }
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ có thể tải lên tệp hình ảnh!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
        }

        return false; // Return false to prevent automatic upload
    };

    const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
    };

    const handleAvatarUpload = async () => {
        if (fileList.length === 0 || !fileList[0].originFileObj) {
            message.warning('Vui lòng chọn hình ảnh trước khi tải lên');
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append('avatar', fileList[0].originFileObj);

            const response = await UpdateImageUser({ id: userId, data: formData });

            if (response?.statusCode === 200) {
                message.success('Ảnh đại diện đã được cập nhật thành công');
                // Refresh the user data
                const userResponse = await getUserByID({ id: userId });
                if (userResponse?.statusCode === 200 && userResponse.data) {
                    setUser(userResponse.data);
                    setFileList([]);
                    if (userResponse.data.avatar) {
                        setAvatarPreview(formatAvatarPath(userResponse.data.avatar));
                    }
                }
            } else {
                message.error(response?.message || 'Không thể cập nhật ảnh đại diện');
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật ảnh đại diện');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" tip="Đang tải thông tin người dùng..." />
            </div>
        );
    }

    return (
        <div className="p-4 min-h-screen bg-gray-50 dark:bg-slate-900">
            <Card
                title={
                    <div className="flex items-center">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            onClick={() => router.back()}
                            className="mr-2"
                        />
                        <span>Chỉnh sửa người dùng</span>
                    </div>
                }
                className="max-w-4xl mx-auto"
            >
                {user && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                                    <img
                                        src={formatAvatarPath(user.avatar)}
                                        alt={user.fullName}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.fullName}</h2>
                                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${user.isActive === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive === 1 ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                                        </span>
                                        <span className={`inline-block ml-2 px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                                            ? 'bg-red-100 text-red-800'
                                            : user.role === 'moderator'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {getRoleName(user.role)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Tabs defaultActiveKey="profile">
                    <TabPane
                        tab={<span><UserOutlined />Thông tin cá nhân</span>}
                        key="profile"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email' },
                                        { type: 'email', message: 'Email không hợp lệ' }
                                    ]}
                                >
                                    <Input placeholder="Nhập email" disabled />
                                </Form.Item>

                                <Form.Item
                                    name="userName"
                                    label="Tên người dùng"
                                >
                                    <Input placeholder="Nhập tên người dùng" />
                                </Form.Item>

                                <Form.Item
                                    name="roleId"
                                    label="Vai trò"
                                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                                >
                                    {loadingRoles ? (
                                        <div className="flex items-center">
                                            <Spin size="small" className="mr-2" />
                                            <span className="text-gray-500">Đang tải danh sách vai trò...</span>
                                        </div>
                                    ) : (
                                        <Select placeholder="Chọn vai trò">
                                            {roles.map(role => (
                                                <Select.Option key={role.id} value={role.id}>
                                                    {role.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item
                                    name="isActive"
                                    label="Trạng thái"
                                    valuePropName="checked"
                                    getValueFromEvent={(checked) => checked ? 1 : 0}
                                    getValueProps={(value) => ({ checked: value === 1 })}
                                >
                                    <Switch
                                        checkedChildren="Hoạt động"
                                        unCheckedChildren="Vô hiệu"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="Giới thiệu"
                                required={false}
                                className="mb-8"
                            >
                                <div className="mb-2 text-sm text-gray-500">Mô tả về người dùng này, sở thích, kinh nghiệm, v.v.</div>
                                <RichTextEditor
                                    value={bioContent}
                                    onChange={setBioContent}
                                />
                            </Form.Item>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item
                                    name="personalWebsite"
                                    label="Website cá nhân"
                                >
                                    <Input placeholder="https://..." />
                                </Form.Item>

                                <Form.Item
                                    name="githubLink"
                                    label="GitHub"
                                >
                                    <Input placeholder="https://github.com/username" />
                                </Form.Item>

                                <Form.Item
                                    name="youtubeLink"
                                    label="YouTube"
                                >
                                    <Input placeholder="https://youtube.com/c/channelname" />
                                </Form.Item>

                                <Form.Item
                                    name="facebookLink"
                                    label="Facebook"
                                >
                                    <Input placeholder="https://facebook.com/username" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="Ảnh đại diện"
                                className="mb-6"
                            >
                                <div className="flex items-start">
                                    <div className="flex items-center mb-4">
                                        <div className="mr-4 mb-4">
                                            <img
                                                src={avatarPreview || (user ? formatAvatarPath(user.avatar) : '/images/default-avatar.png')}
                                                alt={user?.fullName || 'User avatar'}
                                                className="w-20 h-20 rounded-full object-cover border border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            fileList={fileList}
                                            beforeUpload={() => false}
                                            onChange={({ fileList: newFileList, file }) => {
                                                // Validate file type and size
                                                if (file.status === 'uploading') {
                                                    const isImage = file.type?.startsWith('image/');
                                                    const isLt2M = file.size && file.size / 1024 / 1024 < 5;

                                                    if (!isImage) {
                                                        message.error('Chỉ có thể tải lên tệp hình ảnh!');
                                                        return;
                                                    }

                                                    if (!isLt2M) {
                                                        message.error('Hình ảnh phải nhỏ hơn 5MB!');
                                                        return;
                                                    }

                                                    // Set preview for the new image
                                                    if (file.originFileObj) {
                                                        setAvatarPreview(URL.createObjectURL(file.originFileObj));
                                                    }
                                                }
                                                setFileList(newFileList);
                                            }}
                                            maxCount={1}
                                            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                                        >
                                            {fileList.length === 0 && (
                                                <div>
                                                    <UploadOutlined />
                                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                                </div>
                                            )}
                                        </Upload>
                                        {fileList.length > 0 && (
                                            <Button
                                                type="primary"
                                                onClick={handleAvatarUpload}
                                                loading={submitting}
                                                className="mt-2"
                                            >
                                                Cập nhật ảnh đại diện
                                            </Button>
                                        )}
                                        <div className="text-xs text-gray-500 mt-2">
                                            Định dạng: JPG, PNG. Kích thước tối đa: 5MB
                                        </div>
                                    </div>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitting}
                                >
                                    Cập nhật thông tin
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    <TabPane
                        tab={<span><LockOutlined />Đặt lại mật khẩu</span>}
                        key="password"
                    >
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={handlePasswordChange}
                        >
                            <div className="mb-4 bg-blue-50 text-blue-700 p-4 rounded-md flex items-start">
                                <InfoCircleOutlined className="mr-2 mt-1" />
                                <p>
                                    Đặt lại mật khẩu cho người dùng này. Người dùng sẽ nhận được mật khẩu mới qua email và thông báo về việc đặt lại mật khẩu.
                                </p>
                            </div>

                            <Form.Item
                                name="newPassword"
                                label="Mật khẩu mới"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                                ]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu mới" />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Xác nhận mật khẩu" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    danger
                                    htmlType="submit"
                                    loading={submitting}
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default EditUserForm; 