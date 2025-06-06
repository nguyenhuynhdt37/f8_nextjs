'use client';

import Slider from '@/components/client/Slider/page';
import Footer from '@/layout/mainLayout/Footer/page';
import Header from '@/layout/mainLayout/Header';


export default function HomeClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Header />
            <div className="flex pt-16">
                {/* <Slider /> */}
                <div className="flex-1">{children}</div>
            </div>
            <Footer />
        </div>
    );
}
