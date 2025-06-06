'use client';

import { useAppSelector } from '@/redux/hook/hook';
import Tippy from '@tippyjs/react';
import { useRouter } from 'next/navigation';
import { motion } from '@/lib/motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import LoadingBar from 'react-top-loading-bar';

const ListReaction = ({ data }: any) => {
  const [listSortdata, setListSortData] = useState<any>([]);
  const [isMe, setIsMe] = useState<boolean>(false);
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
  }, [data, user?.id]);

  // Render emoji based on icon type
  const renderEmoji = (icon: string, index: number) => {
    const emojis = {
      satisfaction: "👍",
      love: "❤️",
      happy: "😆",
      sad: "😥",
      surprise: "😮",
      angry: "😡"
    };

    return (
      <motion.span
        key={`${icon}-${index}`}
        className="mr-1 inline-block"
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {emojis[icon as keyof typeof emojis]}
      </motion.span>
    );
  };

  // Modal component for reaction details
  const ReactionModal = () => {
    return (
      <div
        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
        className="p-5 pt-0 overflow-y-scroll scrollbar-custom max-h-[24em] rounded-xl bg-[#fff] text-[#000]"
      >
        {/* Reaction counts */}
        <div className="sticky flex flex-wrap top-0 left-0 right-0 bg-[#fff] z-10 border-b-[0.1rem] py-5 items-center">
          {listSortdata.map((item: any, index: number) => {
            if (item.count > 0) {
              const emojis = {
                satisfaction: "👍",
                love: "❤️",
                happy: "😆",
                sad: "😥",
                surprise: "😮",
                angry: "😡"
              };

              return (
                <motion.span
                  key={`${item.icon}-count-${index}`}
                  className="flex items-center mr-5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-xl">{emojis[item.icon as keyof typeof emojis]}</span>
                  <span className="ml-2">{item.count}</span>
                </motion.span>
              );
            }
            return null;
          })}
        </div>

        {/* User list */}
        <div className="">
          {data?.map((item: any, index: number) => (
            <motion.div
              key={`${item.user.id}-${item.icon}`}
              className="flex border-b-[0.1rem] py-5 border-[#e6e6e6] items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: "#f9f9f9", x: 5 }}
            >
              <div className="relative">
                <img
                  className="w-16 h-16 object-cover border-2 border-[#ceae30] mr-5 rounded-full"
                  src={item?.user?.avatar || '/images/avatar-empty.png'}
                  alt=""
                />
                <motion.div
                  className="text-[1.9rem] absolute right-2 -bottom-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                >
                  {renderEmoji(item.icon, index)}
                </motion.div>
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
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <LoadingBar color="#0066df" ref={ref} />
      <Tippy
        className="tippy-custom"
        trigger="click"
        arrow={false}
        interactive={true}
        placement="bottom"
        content={<ReactionModal />}
      >
        <div className="flex items-center mr-5">
          <div className="">
            {listSortdata.map((item: any, index: number) => {
              if (item.count > 0 && index < 3) {
                return renderEmoji(item.icon, index);
              }
              return null;
            })}
          </div>
          <div className="font-normal ml-2 text-[#000]">
            {isMe && `Bạn ${data?.length > 1 ? `và ${data?.length - 1} người khác` : ''}`}
            {!isMe && data?.length > 0 && `${data?.length} người khác`}
          </div>
        </div>
      </Tippy>
    </>
  );
};

export default ListReaction;
