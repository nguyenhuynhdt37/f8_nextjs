import type { Metadata } from 'next';
import './globals.css';
import ProviderWrap from '@/redux/middleware/Provider.wrapper';
import CheckIsLogin from '@/components/client/CheckIsLogin';
import { Lexend } from '@next/font/google';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'F8',
  description: 'Generated by create next app',
  icons: 'https://fullstack.edu.vn/favicon/favicon_32x32.png',
};
const lexend = Lexend({
  weight: ['400', '100', '200', '300', '500', '600', '700'], // Thêm các trọng số bạn cần
  subsets: ['latin', 'vietnamese'], // Thêm subset "vietnamese" nếu cần
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  return (
    <html lang="en">
      <body className={lexend.className}>
        <ProviderWrap>
          <main>
            {children}
            <CheckIsLogin cookie={cookieStore} />
          </main>
        </ProviderWrap>
      </body>
    </html>
  );
}
