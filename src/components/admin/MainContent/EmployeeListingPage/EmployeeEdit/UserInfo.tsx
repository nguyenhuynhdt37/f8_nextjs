import { IUpdateUser } from '@/types/next-auth';
import { Form, Input, Card } from 'antd';
import React, { useState } from 'react';
import { FiUser, FiLock, FiGithub, FiFacebook, FiYoutube, FiGlobe } from 'react-icons/fi';

interface UserInfoProps {
    editorValue: IUpdateUser;
    setEditorValue: React.Dispatch<React.SetStateAction<IUpdateUser>>;
}

const UserInfo = ({ editorValue, setEditorValue }: UserInfoProps) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
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

        setPasswordStrength({ score, message });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            checkPasswordStrength(value);
        }

        setEditorValue({
            ...editorValue,
            [name]: value,
        });
    };

    return (
        <Card className="mt-6 bg-white shadow-sm rounded-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>

            <Form layout="vertical" requiredMark={false} className="space-y-4">
                <Form.Item label="Tên người dùng">
                    <Input
                        name="fullName"
                        value={editorValue.fullName}
                        onChange={handleChange}
                        placeholder="Nhập tên người dùng"
                        prefix={<FiUser className="text-gray-400 mr-2" />}
                        className="py-2"
                    />
                </Form.Item>

                <Form.Item label="Tên đăng nhập">
                    <Input
                        name="userName"
                        value={editorValue.userName}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập"
                        prefix={<FiUser className="text-gray-400 mr-2" />}
                        className="py-2"
                    />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    help={
                        editorValue.password && (
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
                        name="password"
                        value={editorValue.password}
                        onChange={handleChange}
                        placeholder="Để trống nếu không muốn thay đổi mật khẩu"
                        prefix={<FiLock className="text-gray-400 mr-2" />}
                        className="py-2"
                        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                    />
                </Form.Item>
            </Form>

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Liên kết mạng xã hội</h2>

                <Form layout="vertical" requiredMark={false} className="space-y-4">
                    <Form.Item label="Github">
                        <Input
                            name="githubLink"
                            value={editorValue.githubLink}
                            onChange={handleChange}
                            placeholder="Nhập liên kết Github"
                            prefix={<FiGithub className="text-gray-400 mr-2" />}
                            className="py-2"
                        />
                    </Form.Item>

                    <Form.Item label="Facebook">
                        <Input
                            name="facebookLink"
                            value={editorValue.facebookLink}
                            onChange={handleChange}
                            placeholder="Nhập liên kết Facebook"
                            prefix={<FiFacebook className="text-gray-400 mr-2" />}
                            className="py-2"
                        />
                    </Form.Item>

                    <Form.Item label="Youtube">
                        <Input
                            name="youtubeLink"
                            value={editorValue.youtubeLink}
                            onChange={handleChange}
                            placeholder="Nhập liên kết Youtube"
                            prefix={<FiYoutube className="text-gray-400 mr-2" />}
                            className="py-2"
                        />
                    </Form.Item>

                    <Form.Item label="Website cá nhân">
                        <Input
                            name="personalWebsite"
                            value={editorValue.personalWebsite}
                            onChange={handleChange}
                            placeholder="Nhập liên kết website cá nhân"
                            prefix={<FiGlobe className="text-gray-400 mr-2" />}
                            className="py-2"
                        />
                    </Form.Item>
                </Form>
            </div>
        </Card>
    );
};

export default UserInfo; 