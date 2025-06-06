'use client';
import { CheckIsCourseRegister, CreatePayment, RegiterCourseFree } from '@/api/axios/api';
import Login from '@/components/client/Login';
import { useAppSelector } from '@/redux/hook/hook';
import { Button, message, Modal, Spin, Typography, Divider, Avatar, Badge } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { motion } from '@/lib/motion';
import FireworksDisplay from '@/components/client/Fireworks';
import {
  LockOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Course {
  idCourse: number;
  isFree: boolean;
};

const ButtonRegiterStudy = ({ idCourse, isFree }: Course) => {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('payment');

  const auth = useAppSelector(p => p.auth?.user?.user);
  const router = useRouter();
  const ref = useRef<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);

  // Modal states
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [failModalOpen, setFailModalOpen] = useState<boolean>(false);

  // Function to handle redirection with countdown
  const handleRedirectWithDelay = (url: string) => {
    setIsRedirecting(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push(url);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const checkIsRegister = async () => {
      const result = await CheckIsCourseRegister({ idCourse: idCourse });
      console.log('result', result);
      ref.current.continuousStart();
      if (result?.statusCode === 200) {
        setIsRedirecting(true);
        messageApi.loading('Đang chuyển hướng đến khoá học trong vài giây...');
        handleRedirectWithDelay(`/learning/${idCourse}`);
      } else {
        ref.current.complete();
      }
    }
    if (auth) {
      checkIsRegister();
    }
  }, [auth]);

  useEffect(() => {
    if (typeParam) {
      const paramCopy = typeParam.split('?')[0];
      const newUrl = window.location.pathname;
      router.replace(newUrl);

      if (paramCopy === 'success') {
        // Kích hoạt hiệu ứng pháo hoa
        setShowFireworks(true);
        ref.current.continuousStart();
        setSuccessModalOpen(true);
      } else if (paramCopy === 'fail') {
        setFailModalOpen(true);
      }
    }
  }, [typeParam, auth]);

  const handleSubmit = async () => {
    if (!auth) {
      setLoginModalOpen(true);
      return;
    }

    if (isFree) {
      setRegisterModalOpen(true);
    } else {
      setPaymentModalOpen(true);
    }
  };

  const handleRegisterFree = async () => {
    ref.current.continuousStart();
    messageApi.loading('Đang đăng ký khóa học...');
    setRegisterModalOpen(false);

    const result = await RegiterCourseFree({
      idCourse: idCourse,
    });

    if (result?.statusCode === 200 || result?.statusCode === 201) {
      // Kích hoạt hiệu ứng pháo hoa
      setShowFireworks(true);
      setSuccessModalOpen(true);
    } else {
      messageApi.error('Lỗi khi đăng ký khoá học, vui lòng thử lại sau');
      ref.current.complete();
      Modal.error({
        title: 'Đăng ký không thành công',
        content: (
          <div>
            <Paragraph>Đã xảy ra lỗi trong quá trình đăng ký khóa học miễn phí.</Paragraph>
            <div className="bg-red-50 p-4 rounded-lg my-4 border border-red-100 shadow-sm">
              <Text type="danger" className="flex items-center">
                <WarningOutlined className="mr-2 text-red-500" />
                Hệ thống không thể hoàn tất quá trình đăng ký của bạn.
              </Text>
            </div>
            <Paragraph>
              <Text strong>Giải pháp:</Text> Vui lòng đảm bảo kết nối mạng ổn định và thử lại sau ít phút.
            </Paragraph>
          </div>
        ),
        onOk: () => {
          if (auth) {
            handleSubmit();
          } else {
            setIsLoginOpen(true);
          }
        },
      });
    }
  };

  const handleContinueToPayment = async () => {
    ref.current.continuousStart();
    messageApi.loading('Đang kết nối đến cổng thanh toán...');
    setPaymentModalOpen(false);

    // Gọi API tạo thanh toán
    const paymentResult = await CreatePayment({
      courseId: idCourse,
    });

    if (paymentResult?.statusCode === 200) {
      console.log('payment result', paymentResult);

      // Chuyển hướng đến URL thanh toán
      setTimeout(() => {
        window.location.href = paymentResult?.data?.paymentUrl;
      }, 1000);
    } else {
      messageApi.error('Lỗi khi kết nối đến cổng thanh toán, vui lòng thử lại sau');
      ref.current.complete();
      Modal.error({
        title: 'Không thể kết nối thanh toán',
        content: (
          <div>
            <Paragraph>Đã xảy ra lỗi khi kết nối đến cổng thanh toán VNPay.</Paragraph>
            <div className="bg-red-50 p-4 rounded-lg my-4 border border-red-100 shadow-sm">
              <Text type="danger" className="flex items-center">
                <WarningOutlined className="mr-2 text-red-500" />
                Hệ thống không thể tạo yêu cầu thanh toán. Điều này có thể do lỗi kết nối mạng hoặc dịch vụ thanh toán tạm thời không khả dụng.
              </Text>
            </div>
            <Paragraph>
              <Text strong>Giải pháp:</Text> Vui lòng kiểm tra kết nối internet và thử lại sau vài phút.
            </Paragraph>
          </div>
        ),
        onOk: () => {
          if (auth) {
            handleSubmit();
          } else {
            setIsLoginOpen(true);
          }
        },
      });
    }
  };

  // Custom button styles with enhanced UI
  const buttonStyle = {
    free: "bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-600 hover:via-emerald-500 hover:to-teal-600 text-white",
    paid: "bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-600 hover:from-blue-700 hover:via-indigo-600 hover:to-indigo-700 text-white",
    disabled: "bg-gray-400 cursor-not-allowed text-white"
  };

  return (
    <>
      {contextHolder}
      <FireworksDisplay
        show={showFireworks}
        duration={5000}
        onComplete={() => setShowFireworks(false)}
      />
      <LoadingBar color="#0066df" ref={ref} height={3} shadow={true} />
      <div className="px-5 py-5">
        {isRedirecting && (
          <div className="w-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white p-4 rounded-lg mb-4 shadow-lg border border-blue-400/20 backdrop-filter backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                    <div className="absolute w-full h-full rounded-full border-t-2 border-b-2 border-white animate-spin"></div>
                    <div className="text-xl font-bold">{countdown}</div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-base mb-0.5">Đang chuyển hướng...</div>
                  <div className="text-blue-100 text-xs">Hệ thống sẽ tự động chuyển đến khoá học của bạn</div>
                </div>
              </div>
              <div className="hidden sm:flex space-x-1.5">
                {[1, 2, 3].map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: index + 1 === countdown ? [1, 1.3, 1] : 1,
                      opacity: index + 1 <= countdown ? 1 : 0.3
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: index + 1 === countdown ? Infinity : 0,
                      repeatDelay: 0.5
                    }}
                    className={`w-2.5 h-2.5 rounded-full ${index + 1 <= countdown ? 'bg-white' : 'bg-white/30'} 
                      transition-all duration-300`}
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: isRedirecting ? 1 : 1.02 }}
          whileTap={{ scale: isRedirecting ? 1 : 0.98 }}
          onClick={handleSubmit}
          disabled={isRedirecting}
          className={`group w-full relative overflow-hidden ${isRedirecting
            ? buttonStyle.disabled
            : isFree
              ? buttonStyle.free
              : buttonStyle.paid
            } py-3.5 rounded-lg text-white text-sm font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 border border-white/10`}
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="absolute -inset-px opacity-30 bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
              style={{
                animation: "shimmer 2.5s infinite",
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          {isRedirecting ? (
            <div className="flex items-center justify-center">
              <Spin size="small" className="mr-2" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {isFree ? (
                <ThunderboltOutlined className="mr-1.5 text-yellow-300" />
              ) : (
                <LockOutlined className="mr-1.5" />
              )}
              <span className="font-semibold">{isFree ? 'Học ngay' : 'Đăng ký học'}</span>
            </div>
          )}

          {/* Shine effect on hover */}
          <div className="absolute inset-0 w-1/3 -ml-[100%] group-hover:ml-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ease-out -z-10"></div>
        </motion.button>

        {/* Login Modal */}
        <Modal
          title={
            <div className="flex items-center text-blue-600">
              <LockOutlined className="mr-2 text-xl" />
              <span>Đăng nhập để tiếp tục</span>
            </div>
          }
          open={loginModalOpen}
          onCancel={() => setLoginModalOpen(false)}
          width={450}
          centered
          footer={[
            <Button key="cancel" onClick={() => setLoginModalOpen(false)}>
              Để sau
            </Button>,
            <Button
              key="login"
              type="primary"
              onClick={() => {
                setLoginModalOpen(false);
                setIsLoginOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <span className="flex items-center">
                <span className="mr-1">🔑</span> Đăng nhập ngay
              </span>
            </Button>
          ]}
          className="custom-modal"
        >
          <div className="py-4">
            <Paragraph>Bạn cần đăng nhập để đăng ký khóa học này.</Paragraph>

            <div className="flex justify-center my-6">
              <img src="/images/logo.png" alt="Logo" className="h-16" />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg my-4 border border-blue-100 shadow-sm">
              <Text className="flex items-start">
                <InfoCircleOutlined className="mr-2 text-blue-500 mt-1" />
                <span>
                  Đăng nhập để theo dõi tiến độ học tập và nhận được hỗ trợ từ giảng viên.
                  <div className="mt-2 text-gray-500 text-xs">Bạn có thể đăng nhập bằng tài khoản mạng xã hội hoặc email.</div>
                </span>
              </Text>
            </div>
          </div>
        </Modal>

        {/* Register Free Course Modal */}
        <Modal
          title={
            <div className="flex items-center text-emerald-600">
              <GiftOutlined className="mr-2 text-xl" />
              <span>Xác nhận đăng ký</span>
            </div>
          }
          open={registerModalOpen}
          onCancel={() => setRegisterModalOpen(false)}
          width={480}
          centered
          footer={[
            <Button key="cancel" onClick={() => setRegisterModalOpen(false)}>
              Để sau
            </Button>,
            <Button
              key="register"
              type="primary"
              onClick={handleRegisterFree}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <span className="flex items-center">
                <CheckOutlined className="mr-1" /> Đăng ký ngay
              </span>
            </Button>
          ]}
          className="custom-modal"
        >
          <div className="py-4">
            <Paragraph>Bạn đang đăng ký khóa học <Text strong className="text-emerald-600">miễn phí</Text> này. Xác nhận để tiếp tục?</Paragraph>

            <div className="flex justify-center items-center my-6 relative">
              <div className="absolute -top-3 -right-3">
                <Badge.Ribbon text="MIỄN PHÍ" color="green" />
              </div>
              <img src="/images/logo.png" alt="Logo" className="h-16" />
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg my-4 border border-emerald-100 shadow-sm">
              <Text className="flex items-start text-emerald-800">
                <CheckOutlined className="mr-2 text-emerald-500 mt-1" />
                <span>
                  Sau khi đăng ký thành công, bạn sẽ được truy cập đầy đủ nội dung khóa học.
                  <div className="mt-1 text-emerald-600 text-sm font-medium">Học ngay hôm nay!</div>
                </span>
              </Text>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg my-4 border border-blue-100 shadow-sm">
              <Text className="flex items-start">
                <InfoCircleOutlined className="mr-2 text-blue-500 mt-1" />
                <span>
                  Khóa học miễn phí vẫn yêu cầu bạn đăng ký để chúng tôi có thể lưu tiến độ học tập của bạn.
                </span>
              </Text>
            </div>
          </div>
        </Modal>

        {/* Payment Confirmation Modal */}
        <Modal
          title={
            <div className="flex items-center text-blue-600">
              <SafetyCertificateOutlined className="mr-2 text-xl" />
              <span>Xác nhận thanh toán</span>
            </div>
          }
          open={paymentModalOpen}
          onCancel={() => setPaymentModalOpen(false)}
          width={500}
          centered
          footer={[
            <Button key="cancel" onClick={() => setPaymentModalOpen(false)}>
              Hủy
            </Button>,
            <Button
              key="payment"
              type="primary"
              onClick={handleContinueToPayment}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <span className="flex items-center">
                <span className="mr-1">💳</span> Tiếp tục thanh toán
              </span>
            </Button>
          ]}
          className="custom-modal"
        >
          <div className="py-4">
            <Paragraph>Bạn sẽ được chuyển đến cổng thanh toán <Text strong className="text-blue-600">VNPay</Text> để hoàn tất giao dịch.</Paragraph>

            <div className="flex justify-center items-center my-6 bg-gray-50 py-4 px-6 rounded-lg shadow-sm">
              <img src="/images/logo.png" alt="Logo" className="h-14 mr-3" />
              <div className="flex items-center mx-3">
                <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-gray-400"></div>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 mx-1">
                  <ArrowRightOutlined className="text-gray-500 text-xs" />
                </div>
                <div className="w-10 h-[2px] bg-gradient-to-r from-gray-400 via-gray-400 to-transparent"></div>
              </div>
              <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" alt="VNPay" className="h-14 ml-3" />
            </div>

            <div className="bg-amber-50 p-4 rounded-lg my-4 border border-amber-100 shadow-sm">
              <Text className="flex items-start text-amber-800">
                <WarningOutlined className="mr-2 text-amber-500 mt-1" />
                <span>
                  Vui lòng không đóng trình duyệt hoặc tắt ứng dụng trong quá trình thanh toán.
                  <div className="mt-1 text-amber-600 text-sm">Giữ kết nối ổn định để đảm bảo giao dịch thành công.</div>
                </span>
              </Text>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg my-4 border border-emerald-100 shadow-sm">
              <Text className="flex items-start text-emerald-800">
                <CheckOutlined className="mr-2 text-emerald-500 mt-1" />
                <span>
                  Sau khi thanh toán thành công, bạn sẽ được tự động chuyển về trang khóa học.
                </span>
              </Text>
            </div>
          </div>
        </Modal>

        {/* Success Modal */}
        <Modal
          title={
            <div className="flex items-center text-emerald-600">
              <CheckOutlined className="mr-2 text-xl" />
              <span>Đăng ký thành công!</span>
            </div>
          }
          open={successModalOpen}
          onCancel={() => setSuccessModalOpen(false)}
          width={450}
          centered
          footer={[
            <Button key="close" onClick={() => setSuccessModalOpen(false)}>
              Đóng
            </Button>,
            <Button
              key="start"
              type="primary"
              onClick={() => {
                setSuccessModalOpen(false);
                messageApi.success('Đang chuyển hướng đến khoá học của bạn...');
                handleRedirectWithDelay(`/learning/${idCourse}`);
              }}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <span className="flex items-center">
                <RocketOutlined className="mr-1" /> Bắt đầu học ngay!
              </span>
            </Button>
          ]}
          className="custom-modal"
        >
          <div className="py-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-200">
                <CheckOutlined className="text-4xl text-emerald-500" />
              </div>
            </div>

            <Paragraph className="text-center text-lg mb-4">Chúc mừng bạn đã đăng ký khóa học thành công!</Paragraph>

            <div className="bg-blue-50 p-4 rounded-lg my-4 border border-blue-100 shadow-sm">
              <Text className="flex items-start">
                <InfoCircleOutlined className="mr-2 text-blue-500 mt-1" />
                <span>
                  Hệ thống sẽ tự động chuyển bạn đến trang học sau khi đóng thông báo này.
                </span>
              </Text>
            </div>
          </div>
        </Modal>

        {/* Failure Modal */}
        <Modal
          title={
            <div className="flex items-center text-red-600">
              <WarningOutlined className="mr-2 text-xl" />
              <span>Đăng ký thất bại!</span>
            </div>
          }
          open={failModalOpen}
          onCancel={() => setFailModalOpen(false)}
          width={450}
          centered
          footer={[
            <Button key="close" onClick={() => setFailModalOpen(false)}>
              Đóng
            </Button>,
            <Button
              key="retry"
              type="primary"
              danger
              onClick={() => {
                setFailModalOpen(false);
                if (auth) {
                  handleSubmit();
                } else {
                  setIsLoginOpen(true);
                }
              }}
            >
              <span className="flex items-center">
                <span className="mr-1">🔄</span> Thử lại
              </span>
            </Button>
          ]}
          className="custom-modal"
        >
          <div className="py-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-200">
                <WarningOutlined className="text-4xl text-red-500" />
              </div>
            </div>

            <Paragraph className="text-center text-lg mb-4">Đã xảy ra lỗi trong quá trình đăng ký khóa học.</Paragraph>

            <div className="bg-red-50 p-4 rounded-lg my-4 border border-red-100 shadow-sm">
              <Text type="danger" className="flex items-start">
                <WarningOutlined className="mr-2 text-red-500 mt-1" />
                <span>
                  Có thể do lỗi hệ thống hoặc giao dịch của bạn không được xác nhận.
                </span>
              </Text>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg my-4 border border-gray-100 shadow-sm">
              <Paragraph className="m-0 flex items-start">
                <InfoCircleOutlined className="mr-2 text-gray-500 mt-1" />
                <span>
                  <Text strong>Giải pháp:</Text> Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ khách hàng nếu vấn đề vẫn tiếp diễn.
                </span>
              </Paragraph>
            </div>
          </div>
        </Modal>

        <style jsx global>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .custom-modal .ant-modal-content {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .custom-modal .ant-modal-header {
            padding: 16px 24px;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .custom-modal .ant-modal-body {
            padding: 20px 24px;
          }
          
          .custom-modal .ant-modal-footer {
            padding: 16px 24px;
            border-top: 1px solid #f0f0f0;
          }
        `}</style>

        <Login open={isLoginOpen} setOpen={setIsLoginOpen} />
      </div>
    </>
  );
};

export default ButtonRegiterStudy;
