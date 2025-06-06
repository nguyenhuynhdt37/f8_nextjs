'use client';
import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Tooltip, Typography, Statistic, Row, Col, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/redux/hook/hook';
import { axiosInstance } from '@/api/axios/axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PaymentData {
    id: number;
    courseId: number;
    courseName: string;
    amount: number;
    paymentDate: string;
    status: 'success' | 'failed' | 'pending';
    transactionId: string;
}

interface PaymentStats {
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    lastPaymentDate: string;
}

const PaymentStats: React.FC = () => {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [stats, setStats] = useState<PaymentStats>({
        totalAmount: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        lastPaymentDate: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const user = useAppSelector(state => state.auth?.user?.user);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                // Thay thế bằng API thực tế để lấy dữ liệu thanh toán
                const response = await axiosInstance.get('/user/payments', {
                    withCredentials: true,
                });

                // Mock data cho mục đích demo
                const mockData: PaymentData[] = [
                    {
                        id: 1,
                        courseId: 101,
                        courseName: 'Lập trình JavaScript cơ bản',
                        amount: 799000,
                        paymentDate: '2025-05-10T08:30:00Z',
                        status: 'success',
                        transactionId: 'VNP13245678',
                    },
                    {
                        id: 2,
                        courseId: 102,
                        courseName: 'Lập trình ReactJS nâng cao',
                        amount: 1299000,
                        paymentDate: '2025-05-01T10:15:00Z',
                        status: 'success',
                        transactionId: 'VNP98765432',
                    },
                    {
                        id: 3,
                        courseId: 103,
                        courseName: 'Thiết kế UI/UX chuyên nghiệp',
                        amount: 999000,
                        paymentDate: '2025-04-25T14:20:00Z',
                        status: 'success',
                        transactionId: 'VNP45678912',
                    },
                    {
                        id: 4,
                        courseId: 104,
                        courseName: 'NodeJS và ExpressJS',
                        amount: 1099000,
                        paymentDate: '2025-04-15T09:45:00Z',
                        status: 'failed',
                        transactionId: 'VNP78912345',
                    },
                    {
                        id: 5,
                        courseId: 105,
                        courseName: 'AWS cho lập trình viên',
                        amount: 1499000,
                        paymentDate: '2025-04-05T16:30:00Z',
                        status: 'pending',
                        transactionId: 'VNP24681357',
                    },
                ];

                setPayments(mockData);

                // Tính toán thống kê
                const totalAmount = mockData.reduce((sum, payment) =>
                    payment.status === 'success' ? sum + payment.amount : sum, 0);

                const successfulPayments = mockData.filter(p => p.status === 'success').length;
                const failedPayments = mockData.filter(p => p.status === 'failed').length;
                const pendingPayments = mockData.filter(p => p.status === 'pending').length;

                // Tìm ngày thanh toán gần nhất
                const paymentDates = mockData
                    .filter(p => p.status === 'success')
                    .map(p => new Date(p.paymentDate).getTime());

                const lastPaymentDate = paymentDates.length > 0
                    ? new Date(Math.max(...paymentDates)).toISOString()
                    : '';

                setStats({
                    totalAmount,
                    successfulPayments,
                    failedPayments,
                    pendingPayments,
                    lastPaymentDate,
                });

                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu thanh toán:', error);
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, []);

    const columns = [
        {
            title: 'Mã thanh toán',
            dataIndex: 'transactionId',
            key: 'transactionId',
            render: (text: string) => (
                <Typography.Text copyable>{text}</Typography.Text>
            ),
        },
        {
            title: 'Khóa học',
            dataIndex: 'courseName',
            key: 'courseName',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <Typography.Text strong>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                </Typography.Text>
            ),
            sorter: (a: PaymentData, b: PaymentData) => a.amount - b.amount,
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (date: string) => (
                <Tooltip title={new Date(date).toLocaleString('vi-VN')}>
                    {formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })}
                </Tooltip>
            ),
            sorter: (a: PaymentData, b: PaymentData) =>
                new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = '';
                let icon = null;
                let text = '';

                switch (status) {
                    case 'success':
                        color = 'success';
                        icon = <CheckCircleOutlined />;
                        text = 'Thành công';
                        break;
                    case 'failed':
                        color = 'error';
                        icon = <CloseCircleOutlined />;
                        text = 'Thất bại';
                        break;
                    default:
                        color = 'warning';
                        icon = <QuestionCircleOutlined />;
                        text = 'Đang xử lý';
                }

                return <Tag icon={icon} color={color}>{text}</Tag>;
            },
            filters: [
                { text: 'Thành công', value: 'success' },
                { text: 'Thất bại', value: 'failed' },
                { text: 'Đang xử lý', value: 'pending' },
            ],
            onFilter: (value: string, record: PaymentData) => record.status === value,
        },
    ];

    return (
        <div className="py-8">
            <Typography.Title level={2} className="text-center mb-8 text-[2.8rem] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Thống kê thanh toán
            </Typography.Title>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Row gutter={[16, 16]} className="mb-8">
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                <Statistic
                                    title="Tổng thanh toán thành công"
                                    value={stats.totalAmount}
                                    precision={0}
                                    formatter={(value) => (
                                        <Typography.Text className="text-[1.8rem] font-semibold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)}
                                        </Typography.Text>
                                    )}
                                    prefix={<DollarOutlined className="text-indigo-500 mr-2" />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                <Statistic
                                    title="Số thanh toán thành công"
                                    value={stats.successfulPayments}
                                    prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
                                    className="text-[1.8rem]"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                <Statistic
                                    title="Số thanh toán thất bại"
                                    value={stats.failedPayments}
                                    prefix={<CloseCircleOutlined className="text-red-500 mr-2" />}
                                    className="text-[1.8rem]"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                <Statistic
                                    title="Thanh toán gần nhất"
                                    value={stats.lastPaymentDate ? formatDistanceToNow(new Date(stats.lastPaymentDate), { addSuffix: true, locale: vi }) : 'Chưa có'}
                                    prefix={<CalendarOutlined className="text-indigo-500 mr-2" />}
                                    formatter={(value) => (
                                        <Typography.Text className="text-[1.4rem]">
                                            {value}
                                        </Typography.Text>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card
                        title={
                            <div className="flex items-center">
                                <UserOutlined className="mr-2 text-indigo-500" />
                                <span>Lịch sử thanh toán</span>
                            </div>
                        }
                        className="shadow-md rounded-xl overflow-hidden"
                        bordered={false}
                    >
                        <Table
                            dataSource={payments}
                            columns={columns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            className="payment-history-table"
                        />
                    </Card>
                </>
            )}
        </div>
    );
};

export default PaymentStats;
