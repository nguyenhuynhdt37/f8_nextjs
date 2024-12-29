import { useRef } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import LoadingBar from 'react-top-loading-bar';
import ModalUser from '../Header/ModalUser';
import { useAppSelector } from '@/redux/hook/hook';

const Header = () => {
  const ref = useRef<any>(null);
  const user = useAppSelector(state => state.auth.user);
  const handleGoBack = () => {};
  const handleBackHome = () => {};
  return (
    <header>
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex fixed text-[1.4rem] top-0 left-0 right-0 h-[5rem] px-10 bg-[#29303b] items-center justify-between">
        <div className="flex text-[#fff] items-center">
          <div onClick={handleBackHome}>
            <img
              className="w-[3rem] rounded-xl mr-5 hidden md:block"
              src="/logo/logo1.png"
              alt=""
            />
          </div>
          <button className="px-2 py-5" onClick={handleGoBack}>
            <FaChevronLeft className="text-[1.4rem]" />
          </button>
          Quay lại
          <div className="font-bold text-[1.4rem]">{}</div>
        </div>
        {user && <ModalUser data={user} />}
      </div>
    </header>
  );
};

export default Header;
