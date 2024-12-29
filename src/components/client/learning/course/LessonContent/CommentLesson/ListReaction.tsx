import { useAppSelector } from '@/redux/hook/hook';
import Tippy from '@tippyjs/react';
import { useRouter } from 'next/navigation';
import { log } from 'node:console';
import React, { useEffect, useRef, useState } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import LoadingBar from 'react-top-loading-bar';

const ListReaction = ({ data }: any) => {
  const [listSortdata, setListSortData] = useState<any>([]);
  const [isMe, setIsMe] = useState<boolean>(false);
  console.log('data', data);
  const user = useAppSelector(state => state.auth?.user?.user);
  const handleRedirectProfile = (id: any) => {
    ref.current.continuousStart();
    router.push(`/profile/${id}`);
  };
  const router = useRouter();
  const ref = useRef<any>(null);
  useEffect(() => {
    if (data) {
      let satisfaction = 0;
      let love = 0;
      let happy = 0;
      let sad = 0;
      let surprise = 0;
      let angry = 0;
      let isMe = false;
      data.forEach((item: any) => {
        if (item?.userId === user?.id) {
          isMe = true;
        }
        if (item.icon === 'satisfaction') {
          satisfaction++;
        }
        if (item.icon === 'love') {
          love++;
        }
        if (item.icon === 'happy') {
          happy++;
        }
        if (item.icon === 'sad') {
          sad++;
        }
        if (item.icon === 'surprise') {
          surprise++;
        }
        if (item.icon === 'angry') {
          angry++;
        }
      });
      let listSort = [
        { icon: 'satisfaction', count: satisfaction },
        { icon: 'love', count: love },
        { icon: 'happy', count: happy },
        { icon: 'sad', count: sad },
        { icon: 'surprise', count: surprise },
        { icon: 'angry', count: angry },
      ];
      listSort = listSort.sort((a: any, b: any) => b.count - a.count);
      setIsMe(isMe);
      setListSortData(listSort);
    }
  }, [data]);
  console.log('listSortdata', listSortdata);
  return (
    <>
      <LoadingBar color="#0066df" ref={ref} />
      <Tippy
        className="tippy-custom"
        trigger="click"
        arrow={false}
        content={
          <Modal
            data={data}
            listSortdata={listSortdata}
            handleRedirectProfile={handleRedirectProfile}
          />
        }
        interactive={true}
        placement="bottom"
      >
        <div className="flex items-center mr-5">
          <div className="">
            {listSortdata.map((item: any, index: number) => {
              console.log('item', item);

              if (item?.count > 0 && index < 3) {
                if (item?.icon === 'satisfaction') {
                  return <span className="mr-1">👍</span>;
                }
                if (item?.icon === 'love') {
                  return <span className="mr-1">❤️</span>;
                }
                if (item?.icon === 'happy') {
                  return <span className="mr-1">😆</span>;
                }
                if (item?.icon === 'sad') {
                  return <span className="mr-1">😥</span>;
                }
                if (item?.icon === 'surprise') {
                  return <span className="mr-1">😮</span>;
                }
                if (item?.icon === 'angry') {
                  return <span className="mr-1">😡</span>;
                }
              }
            })}
          </div>
          <div className="font-normal ml-2 text-[#000]">
            {isMe &&
              `Bạn ${data?.length > 1 ? `và ${data?.length - 1} người khác` : ''}`}
            {!isMe && data?.length > 0 && `${data?.length} người khác`}
          </div>
        </div>
      </Tippy>
    </>
  );
};
const Modal = ({ data, handleRedirectProfile, listSortdata }: any) => {
  return (
    <div
      style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
      className="p-5 pt-0 overflow-y-scroll scrollbar-custom max-h-[24em] rounded-xl bg-[#fff] text-[#000]"
    >
      <div className="sticky flex top-0 left-0 right-0 bg-[#fff]  z-10 border-b-[0.1rem] py-5 items-center">
        {listSortdata?.map((item: any) => {
          if (item?.icon === 'satisfaction' && item?.count > 0)
            return (
              <span className="flex items-center mr-5 mr-5">
                👍 <span className="ml-2">{item?.count}</span>
              </span>
            );
          if (item?.icon === 'love' && item?.count > 0)
            return (
              <span className="flex items-center mr-5">
                ❤️ <span className="ml-2">{item?.count}</span>
              </span>
            );
          if (item?.icon === 'happy' && item?.count > 0)
            return (
              <span className="flex items-center mr-5">
                😆 <span className="ml-2">{item?.count}</span>
              </span>
            );
          if (item?.icon === 'sad' && item?.count > 0)
            return (
              <span className="flex items-center mr-5">
                😥 <span className="ml-2">{item?.count}</span>
              </span>
            );
          if (item?.icon === 'surprise' && item?.count > 0)
            return (
              <span className="flex items-center mr-5">
                😮 <span className="ml-2">{item?.count}</span>
              </span>
            );
          if (item?.icon === 'angry' && item?.count > 0)
            return (
              <span className="flex items-center mr-5">
                😡 <span className="ml-2">{item?.count}</span>
              </span>
            );
        })}
      </div>
      <div className="">
        {data?.map((item: any, index: number) => (
          <div className="flex border-b-[0.1rem] py-5 border-[#e6e6e6] items-center">
            <div className="relative">
              <img
                className="w-16 h-16 object-cover border-2 border-[#ceae30] mr-5 rounded-full"
                src={item?.user?.avatar || '/images/avatar-empty.png'}
                alt=""
              />
              <div className="text-[1.9rem] absolute right-2 -bottom-3">
                {item?.icon === 'satisfaction' && <span>👍</span>}
                {item?.icon === 'love' && <span>❤️</span>}
                {item?.icon === 'happy' && <span>😆</span>}
                {item?.icon === 'sad' && <span>😥</span>}
                {item?.icon === 'surprise' && <span>😮</span>}
                {item?.icon === 'angry' && <span>😡</span>}
              </div>
            </div>
            <div
              onClick={() => handleRedirectProfile(item?.user?.id)}
              className="flex cursor-pointer text-[#50abc9] items-center"
            >
              {item?.user?.fullName}
              {item?.user?.roleId === 2 && (
                <FaCircleCheck className="text-[#0c5ee4] ml-5" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ListReaction;
