'use client';
import Header from './Header';
import { useAppSelector } from '@/redux/hook/hook';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            <main className="w-full transition-all duration-300">
                <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout; 