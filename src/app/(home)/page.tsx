import Home from '@/components/client/Home';
import PageTransition from '@/components/ui/PageTransition';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'F8 - Học lập trình để đi làm',
  description: 'F8 là nền tảng học lập trình hàng đầu Việt Nam với các khóa học chất lượng cao, giúp học viên đi làm được ngay sau khi hoàn thành khóa học.',
  keywords: 'học lập trình, khóa học lập trình, F8, fullstack, frontend, backend',
  openGraph: {
    title: 'F8 - Học lập trình để đi làm',
    description: 'F8 là nền tảng học lập trình hàng đầu Việt Nam với các khóa học chất lượng cao.',
    images: ['https://fullstack.edu.vn/assets/icon/f8_icon.png'],
  }
};

export default function HomePage() {
  return (
    <PageTransition>
      <Home />
    </PageTransition>
  );
}
