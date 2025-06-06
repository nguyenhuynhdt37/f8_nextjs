'use client';
import React from 'react';
import { Typography, Tabs } from 'antd';
import dynamic from 'next/dynamic';

// Dynamic import để tránh lỗi SSR với thư viện biểu đồ
const PaymentStats = dynamic(
    () => import('@/components/client/payment/PaymentStats'),
    { ssr: false }
);

const PaymentCharts = dynamic(
    () => import('@/components/client/payment/PaymentCharts'),
    { ssr: false }
);

const { Title } = Typography;
const { TabPane } = Tabs;

const PaymentStatisticsPage = () => {
    return (
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-28 py-10">
            <Title level={1} className="text-center mb-8 text-[3rem] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Thống kê thanh toán của bạn
            </Title>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
                <Tabs defaultActiveKey="1" type="card" size="large" className="payment-stats-tabs">
                    <TabPane tab="Thống kê chi tiết" key="1">
                        <PaymentStats />
                    </TabPane>
                    <TabPane tab="Biểu đồ" key="2">
                        <PaymentCharts />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default PaymentStatisticsPage;