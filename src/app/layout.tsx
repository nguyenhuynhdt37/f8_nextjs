import type { Metadata } from 'next';
import './globals.css';
import ProviderWrap from '@/redux/middleware/Provider.wrapper';
import { ThemeProvider } from '@/context/ThemeContext';
import CheckIsLogin from '@/components/client/CheckIsLogin';
import { Lexend } from 'next/font/google';
import { cookies } from 'next/headers';
import FireProvider from '@/components/ui/FireProvider';
import dynamic from 'next/dynamic';
import NotificationListener from '@/components/hub/NotificationListener';

// Dynamically import the LoadingProvider to avoid SSR issues
const LoadingProvider = dynamic(
  () => import('@/components/client/Loading/LoadingProvider'),
  { ssr: false }
);

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'F8 - Học Lập Trình Để Đi Làm',
  description: 'F8 là nền tảng học lập trình hàng đầu Việt Nam',
  icons: 'https://fullstack.edu.vn/favicon/favicon_32x32.png',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${lexend.className} min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ProviderWrap>
          <ThemeProvider>
            <FireProvider>
              <LoadingProvider>
                <NotificationListener />
                <main>
                  {children}
                  <CheckIsLogin cookie={cookieStore} />
                </main>
              </LoadingProvider>
            </FireProvider>
          </ThemeProvider>
        </ProviderWrap>
      </body>
    </html>
  );
}
