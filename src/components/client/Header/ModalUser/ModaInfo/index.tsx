import { logoutApi } from '@/api/axios/api';
import { useAppDispatch } from '@/redux/hook/hook';
import { logout } from '@/redux/reducers/slices/AuthSlice';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const ModalInfo = ({ data, refInfo }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const handleLogout = async () => {
    const res = await logoutApi();
    if (res?.statusCode === 200 || res?.statusCode === 201) {
      dispatch(logout());
      messageApi.open({
        content: 'Đăng xuất thành công!',
        type: 'success',
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      messageApi.open({
        content: 'Có vấn đề khi đăng xuất, vui lòng thử lại sau!',
        type: 'error',
      });
    }
  };
  const handleRedirectProfile = () => {
    refInfo.current.continuousStart();
    router.push('/profile');
    refInfo.current.complete();
  };
  const handleRedirectPostCreate = () => {
    refInfo.current.continuousStart();
    router.push('/post/create');
    refInfo.current.complete();
  };
  const handleRedirectPostForMe = () => {
    refInfo.current.continuousStart();
    router.push('/post/me');
    refInfo.current.complete();
  };
  return (
    <>
      <div
        className="p-10 bg-[#fff] text-[#666666] rounded-2xl w-[28.5rem]"
        style={{ boxShadow: '0 -4px 32px #0003' }}
      >
        {contextHolder}
        <div className="flex pb-10">
          <div className="mr-7">
            <img
              className="w-20 h-20 border-2 border-[#d2c023] object-cover rounded-full"
              src={
                data?.user?.avatar ||
                'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'
              }
              alt=""
            />
          </div>
          <div className="">
            <div className="text-[1.6rem] text-[#000] font-medium">
              {data?.user?.fullName}
            </div>
            <div className="py-1">@{data?.user?.userName}</div>
          </div>
        </div>
        <div className="text-[1.3rem] w-full">
          <div className="py-6 w-full border-y-[0.1rem] cursor-pointer hover:text-[#000000]">
            <button onClick={handleRedirectProfile}>Trang cá nhân</button>
          </div>
          <div
            onClick={handleRedirectPostCreate}
            className="py-3 mt-2 cursor-pointer hover:text-[#000000]"
          >
            Viết bài
          </div>
          <div
            onClick={handleRedirectPostForMe}
            className="py-3 cursor-pointer hover:text-[#000000]"
          >
            Bài viết của tôi
          </div>
          <div className=" border-t-[0.1rem] cursor-pointer">
            <div className="py-3 mt-3 cursor-pointer hover:text-[#000000]">
              Cài đặt
            </div>
            <div
              onClick={handleLogout}
              className="pt-3 cursor-pointer hover:text-[#000000]"
            >
              Đăng xuất
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalInfo;
