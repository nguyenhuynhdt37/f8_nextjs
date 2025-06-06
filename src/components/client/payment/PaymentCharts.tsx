'use client';
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Radio, Spin, Empty } from 'antd';
import type { RadioChangeEvent, DatePickerProps } from 'antd';
import { Line, Pie } from '@ant-design/charts';
import { axiosInstance } from '@/api/axios/axiosInstance';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import { useAppSelector } from '@/redux/hook/hook';

interface PaymentData {
    date: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    courseName: string;
}

const PaymentCharts: React.FC = () => {
    const [timeRange, setTimeRange] = useState<string>('month');
    const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
    const [chartData, setChartData] = useState<PaymentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const user = useAppSelector(state => state.auth?.user?.user);

    // Mock data cho biểu đồ
    const generateMockData = (range: string): PaymentData[] => {
        const now = new Date();
        const data: PaymentData[] = [];

        // Tạo danh sách các khóa học mẫu
        const courses = [
            'Lập trình JavaScript cơ bản',
            'Lập trình ReactJS nâng cao',
            'Thiết kế UI/UX chuyên nghiệp',
            'NodeJS và ExpressJS',
            'AWS cho lập trình viên',
            'Docker và Kubernetes',
            'Flutter mobile development',
            'Python cho Data Science',
            'Machine Learning cơ bản',
            'MongoDB và NoSQL'
        ];

        // Tạo dữ liệu theo range
        if (range === 'week') {
            // Dữ liệu cho 7 ngày gần nhất
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(now.getDate() - i);

                // Một số ngẫu nhiên từ 0-2 giao dịch mỗi ngày
                const transactions = Math.floor(Math.random() * 3);

                for (let j = 0; j < transactions; j++) {
                    const amount = Math.floor(Math.random() * 1000000) + 500000; // 500k - 1.5M VND
                    const status = Math.random() > 0.2
                        ? 'success'
                        : (Math.random() > 0.5 ? 'failed' : 'pending');
                    const courseIndex = Math.floor(Math.random() * courses.length);

                    data.push({
                        date: date.toISOString().split('T')[0],
                        amount,
                        status,
                        courseName: courses[courseIndex]
                    });
                }
            }
        } else if (range === 'month') {
            // Dữ liệu cho 30 ngày gần nhất
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(now.getDate() - i);

                // Một số ngẫu nhiên từ 0-2 giao dịch mỗi ngày
                const transactions = Math.floor(Math.random() * 3);

                for (let j = 0; j < transactions; j++) {
                    const amount = Math.floor(Math.random() * 1000000) + 500000; // 500k - 1.5M VND
                    const status = Math.random() > 0.2
                        ? 'success'
                        : (Math.random() > 0.5 ? 'failed' : 'pending');
                    const courseIndex = Math.floor(Math.random() * courses.length);

                    data.push({
                        date: date.toISOString().split('T')[0],
                        amount,
                        status,
                        courseName: courses[courseIndex]
                    });
                }
            }
        } else {
            // Dữ liệu cho 365 ngày gần nhất (year)
            for (let i = 11; i >= 0; i--) {
                const date = new Date();
                date.setMonth(now.getMonth() - i);

                // Một số ngẫu nhiên từ 2-8 giao dịch mỗi tháng
                const transactions = Math.floor(Math.random() * 6) + 2;

                for (let j = 0; j < transactions; j++) {
                    const amount = Math.floor(Math.random() * 1000000) + 500000; // 500k - 1.5M VND
                    const status = Math.random() > 0.2
                        ? 'success'
                        : (Math.random() > 0.5 ? 'failed' : 'pending');
                    const courseIndex = Math.floor(Math.random() * courses.length);

                    // Ngày trong tháng ngẫu nhiên
                    const day = Math.floor(Math.random() * 28) + 1;
                    date.setDate(day);

                    data.push({
                        date: date.toISOString().split('T')[0],
                        amount,
                        status,
                        courseName: courses[courseIndex]
                    });
                }
            }
        }

        return data;
    };

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                // Thay thế bằng API thực tế
                // const response = await axiosInstance.get(`/user/payments/chart?range=${timeRange}`, {
                //   withCredentials: true,
                // });

                // Mock data cho mục đích demo
                const mockData = generateMockData(timeRange);

                setChartData(mockData);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
                setLoading(false);
            }
        };

        fetchChartData();
    }, [timeRange, dateRange]);

    const handleRangeChange = (e: RadioChangeEvent) => {
        setTimeRange(e.target.value);
    };

    const handleDateRangeChange: DatePickerProps['onChange'] = (dates: any, dateStrings: [string, string]) => {
        if (dates) {
            setDateRange(dateStrings);
        } else {
            setDateRange(['', '']);
        }
    };

    // Tính toán dữ liệu cho biểu đồ doanh thu
    const getRevenueChartData = () => {
        // Lọc chỉ lấy các giao dịch thành công
        const successData = chartData.filter(item => item.status === 'success');

        // Tổng hợp theo ngày
        const aggregated = successData.reduce((acc: any, curr) => {
            const date = curr.date;
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += curr.amount;
            return acc;
        }, {});

        // Định dạng để phù hợp với biểu đồ
        return Object.keys(aggregated).map(date => ({
            date,
            amount: aggregated[date]
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    // Tính toán dữ liệu cho biểu đồ tròn
    const getPieChartData = () => {
        // Tổng hợp theo khóa học
        const courseData = chartData
            .filter(item => item.status === 'success')
            .reduce((acc: any, curr) => {
                const course = curr.courseName;
                if (!acc[course]) {
                    acc[course] = 0;
                }
                acc[course] += curr.amount;
                return acc;
            }, {});

        // Định dạng để phù hợp với biểu đồ
        return Object.keys(courseData).map(course => ({
            type: course,
            value: courseData[course]
        }));
    };

    // Cấu hình cho biểu đồ đường
    const lineConfig = {
        data: getRevenueChartData(),
        xField: 'date',
        yField: 'amount',
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            formatter: (datum: any) => `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(datum.amount)}`,
        },
        color: '#4F46E5',
        smooth: true,
    };

    // Cấu hình cho biểu đồ tròn
    const pieConfig = {
        appendPadding: 10,
        data: getPieChartData(),
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            formatter: (datum: any) => {
                return `${datum.type}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(datum.value)}`;
            },
        },
        interactions: [{ type: 'element-active' }],
    };

    return (
        <div className="py-6">
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} md={16}>
                    <Radio.Group value={timeRange} onChange={handleRangeChange} className="mb-4">
                        <Radio.Button value="week">7 ngày</Radio.Button>
                        <Radio.Button value="month">30 ngày</Radio.Button>
                        <Radio.Button value="year">365 ngày</Radio.Button>
                    </Radio.Group>
                </Col>
                <Col xs={24} md={8} className="flex justify-end">
                    <DatePicker.RangePicker
                        onChange={handleDateRangeChange}
                        locale={locale}
                        className="w-full"
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card
                        title="Biểu đồ doanh thu"
                        className="shadow-md rounded-xl overflow-hidden"
                        bordered={false}
                    >
                        {loading ? (
                            <div className="h-80 flex justify-center items-center">
                                <Spin size="large" />
                            </div>
                        ) : getRevenueChartData().length > 0 ? (
                            <Line {...lineConfig} height={320} />
                        ) : (
                            <Empty description="Không có dữ liệu" className="h-80 flex flex-col justify-center" />
                        )}
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card
                        title="Phân bổ thanh toán theo khóa học"
                        className="shadow-md rounded-xl overflow-hidden"
                        bordered={false}
                    >
                        {loading ? (
                            <div className="h-80 flex justify-center items-center">
                                <Spin size="large" />
                            </div>
                        ) : getPieChartData().length > 0 ? (
                            <Pie {...pieConfig} height={320} />
                        ) : (
                            <Empty description="Không có dữ liệu" className="h-80 flex flex-col justify-center" />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PaymentCharts;