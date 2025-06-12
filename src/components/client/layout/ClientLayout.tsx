'use client';

import Slider from '@/components/client/Slider/page';
import Footer from '@/layout/mainLayout/Footer/page';
import Header from '@/layout/mainLayout/Header';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Header />
            <div className="flex pt-20">
                <Slider />
                <div className="flex-1 dark:bg-gray-900">{children}</div>
            </div>
            <Footer />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--bg-card, #ffffff)',
                        color: 'var(--text-color, #1a1a1a)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
        </div>
    );
}
