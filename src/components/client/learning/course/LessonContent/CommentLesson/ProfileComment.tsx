import React, { useRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import { FaCircleCheck } from 'react-icons/fa6';
import 'tippy.js/dist/tippy.css';
import {
  FacebookCounter,
  ReactionBarSelector,
} from '@charkour/react-reactions';
import { IoIosMore } from 'react-icons/io';
import BoxComment from './ProfileComment/BoxComment';
import More from './ProfileComment/More';
import LoadingBar from 'react-top-loading-bar';
import { useRouter } from 'next/navigation';
import { timeAgo } from '@/Utils/functions';
import { useAppSelector } from '@/redux/hook/hook';
const ProfileComment = ({
  data,
  feedback,
  setFeedback,
  lessonId,
  rootParentId,
  parentId,
  onShowMoreComment,
}: any) => {
  const [comment, setComment] = useState<string>('');
  const ref = useRef<any>(null);
  const router = useRouter();
  const user = useAppSelector(state => state.auth?.user?.user);

  const handleReactionChange = (reaction: any) => {
    console.log(reaction);
  };
  const handleRedirectToProfileID = () => {
    ref.current.continuousStart();
    router.push(`/profile/${data?.user?.id}`);
  };
  return (
    <>
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex items-center pb-7">
        <img
          className="w-16 h-16 border-2 border-[#b39836] object-cover mr-5 rounded-full"
          src={
            data?.user?.avatar ||
            'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474274OrH/anh-avatar-khong-hinh-cuc-doc-dao_094008300.jpg'
          }
          alt=""
        />
        <div className="flex items-center">
          <div
            onClick={handleRedirectToProfileID}
            className="font-medium cursor-pointer flex items-center text-[#44a5c5] mr-5"
          >
            {data?.user?.fullName}
            {data?.user?.roleId === 2 && (
              <FaCircleCheck className="text-[#0c5ee4] ml-5" />
            )}
          </div>
          {timeAgo(data?.createAt)}
        </div>
      </div>
      {data?.content && (
        <div
          className="custom-textview custom-comment"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        />
      )}
      <div className="pt-7 flex items-center justify-between font-medium text-[#217bb3]">
        <div className="flex mr-5 items-center">
          <Tippy
            className="tippy-custom left-[5rem]"
            arrow={false}
            content={
              <ReactionBarSelector
                iconSize={22}
                onSelect={handleReactionChange}
              />
            }
            interactive={true}
            placement="top"
            trigger="mouseenter"
          >
            <button className="mr-5">Thích</button>
          </Tippy>
          <button
            onClick={() => {
              setFeedback({
                id: data?.id,
                type: 'add',
              });
              setComment('');
            }}
            className="mr-5"
          >
            Phản hồi
          </button>
          <FacebookCounter />
        </div>

        <div className="flex items-center">
          {data?.createAt !== data?.updateAt && (
            <div className="italic mr-5 font-normal text-[1.3rem] text-[#555]">
              Bình luận đã được chỉnh sửa
            </div>
          )}
          <Tippy
            trigger="click"
            className="tippy-custom"
            arrow={false}
            content={
              <More
                data={data}
                comment={comment}
                setComment={setComment}
                setFeedback={setFeedback}
              />
            }
            interactive={true}
            placement="bottom"
          >
            <div className="">
              <IoIosMore className="text-[2rem] cursor-pointer" />
            </div>
          </Tippy>
        </div>
      </div>
      {feedback?.id === data?.id && (
        <div className="ml-2 p-3 flex pt-10 items-start">
          <img
            className="w-16 h-16 object-cover mr-5 rounded-full"
            src={
              user?.avatar
                ? user?.avatar
                : 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474274OrH/anh-avatar-khong-hinh-cuc-doc-dao_094008300.jpg'
            }
            alt=""
          />
          <BoxComment
            onShowMoreComment={onShowMoreComment}
            rootParentId={rootParentId}
            data={data}
            parentId={parentId}
            lessonId={lessonId}
            comment={comment}
            feedback={feedback}
            setComment={setComment}
            setFeedback={setFeedback}
          />
        </div>
      )}
    </>
  );
};

export default ProfileComment;
