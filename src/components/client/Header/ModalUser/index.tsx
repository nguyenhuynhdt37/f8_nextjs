'use client';
import { useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import 'tippy.js/dist/tippy.css';
import ModalInfo from './ModaInfo';
import { useOutsideClick } from '@/hook/useOutsideClick';
import Tippy from '@tippyjs/react';
import LoadingBar from 'react-top-loading-bar';

const ModalUser = ({ data }: any) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<any>(null);
  const handleCloseMenu = () => {
    setVisible(false);
  };
  const menuRef = useOutsideClick(handleCloseMenu);

  return (
    <div className="flex text-[1.4rem] items-center text-[#333333] ">
      <LoadingBar color="#0066df" ref={ref} />
      <div className="font-medium hidden md:block mr-12 cursor-pointer">
        Khoá học của tôi
      </div>
      <div className="">
        <FaBell className="text-3xl mr-8 text-[#707070] hover:text-[#333333] cursor-pointer" />
      </div>
      <Tippy
        className="tippy-custom"
        arrow={false}
        content={
          <div ref={menuRef} className="transition ease-in-out duration-500">
            <ModalInfo refInfo={ref} data={data} />
          </div>
        }
        interactive={true}
        placement="bottom"
        trigger="click"
      >
        <img
          className="object-cover cursor-pointer h-12 w-12 rounded-full"
          src={
            data?.user?.avatar ||
            'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'
          }
          alt=""
        />
      </Tippy>
    </div>
  );
};

export default ModalUser;
