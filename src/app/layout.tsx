import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/context/ThemeContext';
import ProviderWrap from '@/redux/middleware/Provider.wrapper';
import CheckIsLogin from '@/components/client/CheckIsLogin';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'F8 Learning Platform',
  description: 'Học lập trình trực tuyến miễn phí',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <ProviderWrap>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3000}
              theme="system"
            />
            <CheckIsLogin cookie={cookies()} />
          </ProviderWrap>
        </ThemeProvider>
      </body>
    </html>
  );
}
