'use client';
import Header from '@/layout/courseLayout/Header';
import LoadingPage from '@/components/client/LoadingPage';
import { useAppSelector } from '@/redux/hook/hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { activeShowLesson, checkCourseRegister, CheckLessonComplete } from '@/api/axios/api';
import LoadingBar from 'react-top-loading-bar';
import { group } from 'console';
import { FooterBar, LessonContent, SideBar } from './course';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import FireworksDisplay from '@/components/client/Fireworks';
import CustomFireworks from '@/components/client/Fireworks/CustomFireworks';
import ConfettiEffect from '@/components/client/Fireworks/ConfettiEffect';
import Celebration from '@/components/client/Fireworks/Celebration';
import dynamic from 'next/dynamic';
const FireworksCombination = dynamic(
  () => import('@/components/client/Fireworks/FireworksCombination'),
  {
    ssr: false,
  },
);
const Learning = ({ dataLearning, courseId }: any) => {
  const searchParams = useSearchParams();
  const user = useAppSelector(state => state.auth?.user?.user);
  const typeParam = searchParams.get('payment');
  const [data, setData] = useState<any>(dataLearning);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [lessonActive, setLessonActive] = useState<any>(
    data?.userActiveLessonByCourses[0],
  );
  const sweetAlertStyles = `
.swal2-popup {
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 550px;
  margin: 0 auto;
}

.swal2-title {
  font-size: 2.3rem !important;
  color: #059669 !important;
  margin-bottom: 1rem !important;
}

.swal2-html-container {
  margin-top: 0.5rem !important;
  font-size: 1.4rem !important;
}

.swal2-confirm {
  background: linear-gradient(to right, #059669, #10b981) !important;
  border: none !important;
  color: white !important;
  padding: 1rem 2rem !important;
  font-size: 1.4rem !important;
  font-weight: 500 !important;
  border-radius: 0.8rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.3s !important;
}

.swal2-confirm:hover {
  background: linear-gradient(to right, #047857, #059669) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06) !important;
}

.swal2-cancel {
  background: #f3f4f6 !important;
  color: #4b5563 !important;
  padding: 1rem 2rem !important;
  font-size: 1.4rem !important;
  font-weight: 500 !important;
  border-radius: 0.8rem !important;
  transition: all 0.3s !important;
}

.swal2-cancel:hover {
  background: #e5e7eb !important;
}

.swal2-icon {
  border-width: 3px !important;
  margin: 1.5rem auto 0.5rem auto !important;
}

.swal2-icon.swal2-success {
  border-color: #10b981 !important;
}

.swal2-icon.swal2-success [class^=swal2-success-line] {
  background-color: #10b981 !important;
}

.swal2-icon.swal2-success .swal2-success-ring {
  border-color: rgba(16, 185, 129, 0.3) !important;
}

.swal2-backdrop {
  background-size: 80px !important;
  background-position: 20px 20px !important;
}
`;
  const [isCompleteLesson, setIsCompletedLesson] = useState<any>({
    isCompleted: false,
    lessonId: null,
    groupId: null,
    isPostReq: false,
    isOldCompleted: false,
  });

  useEffect(() => {
    const handleCheckCourseRegister = async () => {
      if (user) {
        const result = await checkCourseRegister({ courseId });
        if (result?.statusCode === 200) {
          console.log('result', result);

        } else {
          router.push(`/courses/${courseId}`);
        }
      } else {
        router.push(`/courses/${courseId}`);
      }
    }
    const timeout = setTimeout(() => {
      handleCheckCourseRegister()
    }, 100);
    return () => {
      clearTimeout(timeout);
    }
  }, [user]);

  useEffect(() => {
    if (
      isCompleteLesson?.isCompleted &&
      isCompleteLesson?.groupId &&
      isCompleteLesson?.lessonId
    ) {
      var dataCopy = { ...data };
      dataCopy?.lessonGroups?.map((lessonGroup: any) => {
        if (lessonGroup?.id === isCompleteLesson?.groupId) {
          lessonGroup?.lectureDetails?.map((lesson: any) => {
            if (lesson?.id === isCompleteLesson?.lessonId) {
              lesson?.userLessons?.push(lessonActive);
            }
          });
        }
      });
      setData(dataCopy);
    }
  }, [isCompleteLesson]);
  const [isShowSideBar, setIsShowSideBar] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);

  useEffect(() => {
    const checkCompleteLesson = async () => {
      const res = await CheckLessonComplete(lessonActive?.lessonId);
      if (res?.statusCode === 200) {
        setIsCompletedLesson({
          ...isCompleteLesson,
          groupId: lessonActive?.groupId,
          lessonId: lessonActive?.lessonId,
          isPostReq: false,
          isCompleted: false,
          isOldCompleted: true,
        });
      } else {
        if (lessonActive?.groupId && lessonActive?.lessonId) {
          setIsCompletedLesson({
            ...isCompleteLesson,
            groupId: lessonActive?.groupId,
            lessonId: lessonActive?.lessonId,
            isPostReq: false,
            isCompleted: false,
            isOldCompleted: false,
          });
        }
      }
    };
    checkCompleteLesson();
  }, [lessonActive]);

  // Xử lý hiệu ứng khi đăng ký thành công
  useEffect(() => {
    // In ra giá trị của typeParam để debug
    console.log("Learning component - typeParam:", typeParam, "showFireworks:", showFireworks);

    if (typeParam === 'success') {
      console.log("Setting showFireworks to true");
      // Bắt đầu thanh loading
      // Force rendering của hiệu ứng pháo hoa
      // Sử dụng setTimeout và đặt lại state để đảm bảo component re-render đúng cách
      if (!showFireworks) {
        setShowFireworks(true);
      }

      // Kích hoạt hiệu ứng pháo hoa ngay lập tức (force update)
      setTimeout(() => {
        // Hiển thị thông báo chúc mừng
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công!',
          html: `
            <div style="text-align: left; margin: 1.5rem 0;">
              <p style="font-size: 1.6rem; color: #374151; margin-bottom: 1.5rem;text-align: center;">Chúc mừng bạn đã đăng ký khóa học thành công!</p>
              <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 0.8rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                <p style="color: #2563EB; font-size: 1.4rem; margin: 0; text-align: center;">
                  <i style="margin-right: 0.8rem; color: #3B82F6;">💡</i>
                  Chào mừng bạn đến với khóa học <strong>${data?.title || 'mới'}</strong>! Chúng tôi rất vui mừng được đồng hành cùng bạn trong hành trình học tập này.
                </p>
              </div>
            </div>
          `,
          confirmButtonText: '<span style="display: flex; align-items: center; justify-content: center; font-size: 1.4rem;"><span style="margin-right: 0.8rem;">🚀</span> Bắt đầu học ngay!</span>',
          width: '45rem',
          padding: '2rem',
          background: 'linear-gradient(to bottom right, #FFFFFF, #F9FAFB)',
          showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster',
          }
        }).then(result => {
          if (result.isConfirmed) {
            setTimeout(() => {
              setShowFireworks(false);
            }, 1000);
          }
          try {
            const styleElement = document.getElementById('swal-styles');
            if (styleElement) {
              document.head.removeChild(styleElement);
            }
          } catch (error) {
            console.log('Style element not found');
          }
        });
      }, 500); // Đợi 500ms để pháo hoa bắt đầu trước khi hiện thông báo

      // Đặt lại URL để tránh hiện lại hiệu ứng khi refresh
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [typeParam, data?.title, router]);
  const ref = useRef<any>(null);
  const handleShowLesson = useCallback(
    async (
      idLesson: number,
      groupId: number,
      isOldCompletedLesson: boolean,
    ) => {
      if (idLesson && data?.id) {
        ref.current.continuousStart();
        const result = await activeShowLesson({
          courseId: Number(data?.id),
          lessonId: idLesson,
          groupId: groupId,
        });
        ref.current.complete();
        if (result?.statusCode === 200 || result?.statusCode === 201) {
          const dataActive = result?.data || {};
          setLessonActive({
            ...dataActive,
            isOldCompletedLesson,
          });
        }
      } else {
        messageApi.open({
          type: 'warning',
          content: 'không thể lưu trạng thái lưu lịch sử bài học',
        });
      }
    },
    [],
  );
  // Thêm style cho SweetAlert2
  try {
    const style = document.createElement('style');
    style.id = 'swal-styles';
    style.innerHTML = sweetAlertStyles;
    document.head.appendChild(style);
  } catch (error) {
    console.error('Không thể thêm style:', error);
  }
  return (
    <>
      {contextHolder}
      <CustomFireworks
        show={showFireworks}
        duration={10000}
        onComplete={() => console.log("Custom fireworks complete")}
      />
      <ConfettiEffect
        show={showFireworks}
        duration={10000}
        onComplete={() => console.log("Confetti effect complete")}
      />
      <Celebration
        show={showFireworks}
        duration={10000}
        onComplete={() => console.log("Celebration effect complete")}
      />
      {/* FireworksCombination component will be added here manually */}
      <Header data={data} courseId={courseId} />
      <LoadingBar color="#b90021" ref={ref} />
      <div className="">
        {isLoading && <LoadingPage />}
        <div className="grid grid-cols-4 overflow-hidden">
          <LessonContent
            courseId={courseId}
            isCompleteLesson={isCompleteLesson}
            setIsCompletedLesson={setIsCompletedLesson}
            courseSuggestion={data?.courseDetail}
            lessonActive={lessonActive}
            isShowSideBar={isShowSideBar}
          />
          <SideBar
            lessonActive={lessonActive}
            onShowLesson={handleShowLesson}
            data={data}
            isShowSideBar={isShowSideBar}
          />
        </div>
        <FooterBar
          data={data}
          lessonActive={lessonActive}
          onShowLesson={handleShowLesson}
          isCompleteLesson={isCompleteLesson}
          setIsCompletedLesson={setIsCompletedLesson}
          isShowSideBar={isShowSideBar}
          setIsShowSideBar={setIsShowSideBar}
        />
      </div>
    </>
  );
};

export default Learning;
