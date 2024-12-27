import { cookies } from 'next/headers';
import Link from 'next/link';
interface CoursePageProps {
  params: { id: string };
}
const NotFoundChapter = async (context: CoursePageProps) => {
  const { id } = (await context.params) || {};
  return (
    <div className="h-full">
      <div className="w-full h-full flex items-center  justify-center top-0 bottom-0 right-0 left-0">
        <div>
          <div className="text-center font-extrabold text-[#ff6f70] text-[15rem]">
            400
          </div>
          <div className="text-[5rem] font-bold">
            Chương học không tồn tại 🥲
          </div>
          <div className="text-center pt-8 text-[1.4rem] font-medium pb-10">
            <div className="text-clip">
              Vui lòng tạo mới chương học trước khi tạo bài học.
            </div>
            <div className="py-2"></div>
            <div className="text-center pt-10">
              <Link href={'/'}>
                <button className="text-[1.7rem] py-2 px-10 text-[#fff] rounded-full bg-[#0093fc]">
                  Về trang danh sách chương học
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundChapter;
