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
import { LikeChangeOrAdd, UnlikeComment } from '@/api/api';
import { message } from 'antd';
import { playSound } from '@/Utils/functions/SoundNumber';
import ListReaction from './ListReaction';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/common';
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
  const userHasLiked = data?.likes?.find((p: any) => p.userId === user?.id);
  const [messageApi, contextHolder] = message.useMessage();
  const handleRedirectToProfileID = () => {
    ref.current.continuousStart();
    router.push(`/profile/${data?.user?.id}`);
  };
  const mdParser: any = new MarkdownIt({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            hljs.highlight(lang, code, true).value
          }</code></pre>`;
        } catch (_) {}
      }
      return `<pre class="hljs"><code>${mdParser.utils.escapeHtml(
        code,
      )}</code></pre>`;
    },
  });
  const handleUnLike = async () => {
    const res = await UnlikeComment(data.id);
    if (res?.statusCode === 200 || res?.statusCode === 201) {
    } else {
      messageApi.error('Lỗi khi bỏ thích bình luận, vui lòng thử lại sau');
    }
  };
  const handleReactionChangeOrAdd = async (icon: string) => {
    const res = await LikeChangeOrAdd(data.id, icon);
    if (res?.statusCode === 200 || res?.statusCode === 201) {
      playSound('/sounds/LikeComment.mp3');
    } else {
      messageApi.error(
        'Lỗi khi bỏ thả reaction bình luận, vui lòng thử lại sau',
      );
    }
  };
  return (
    <>
      {contextHolder}
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex items-center pb-7">
        <img
          className="w-16 h-16 border-2 border-[#b39836] object-cover mr-5 rounded-full"
          src={data?.user?.avatar || '/images/avatar-empty.png'}
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
      {data?.content && !data?.isDelete && !data?.prohibited && (
        <div
          className="markdown-body custom-textview custom-comment w-full"
          dangerouslySetInnerHTML={{
            __html: mdParser.render(data?.content || ''),
          }}
        />
      )}
      {data?.content && data?.isDelete && !data?.prohibited && (
        <div className="font-medium italic text-[#888]">
          Bình luận này đã bị gỡ bỏ do chủ sở hữu
        </div>
      )}
      {data?.content && data?.isDelete && data?.prohibited && (
        <div className="font-medium italic text-[#888]">
          Bình luận này đã bị gỡ bỏ do chủ sở hữu và quản trị viên so vi phạm
          chính sách cộng đồng
        </div>
      )}
      {data?.content && !data?.isDelete && data?.prohibited && (
        <div className="font-medium italic text-[#888]">
          Bình luận này đã bị gỡ bỏ bởi quản trị viên so vi phạm chính sách cộng
          đồng
        </div>
      )}
      <div className="pt-7 flex items-center justify-between font-medium text-[#217bb3]">
        {data?.isDelete || data?.prohibited ? (
          <div className="flex text-[#888] items-start">
            <button disabled className="mr-5">
              Thích
            </button>
            <button disabled className="mr-5">
              Phản hồi
            </button>
          </div>
        ) : (
          <div className="flex mr-5 items-center">
            <Tippy
              className="tippy-custom left-[5rem]"
              arrow={false}
              delay={[500, 0]}
              content={
                <ReactionBarSelector
                  iconSize={22}
                  onSelect={handleReactionChangeOrAdd}
                />
              }
              interactive={true}
              placement="top"
              trigger="mouseenter"
            >
              {userHasLiked ? (
                <button onClick={handleUnLike} className="mr-5 ">
                  {userHasLiked?.icon === 'satisfaction' && (
                    <div className="font-medium px-3 py-1 rounded-full bg-[#d6e3f8] text-[#0566ff] flex items-center">
                      <span className="text-[1.8rem] mr-1">👍</span>Like
                    </div>
                  )}
                  {userHasLiked?.icon === 'love' && (
                    <div className="font-medium px-3 py-1 rounded-full bg-[#f8d6d6] text-[#e93d56] flex items-center">
                      <span className="text-[1.8rem] mr-1">❤️</span>Love
                    </div>
                  )}
                  {userHasLiked?.icon === 'happy' && (
                    <div className="font-medium px-3 py-1 rounded-full bg-[#f8f6d6] text-[#f7b125] flex items-center">
                      <span className="text-[1.8rem] mr-1">😆</span>Haha
                    </div>
                  )}
                  {userHasLiked?.icon === 'surprise' && (
                    <div className="font-medium px-3 py-1 rounded-full bg-[#f8f6d6] text-[#f7b125] flex items-center">
                      <span className="text-[1.8rem] mr-1">😮</span>Wow
                    </div>
                  )}
                  {userHasLiked?.icon === 'sad' && (
                    <div className="font-medium px-3 py-1 rounded-full bg-[#f8f6d6] text-[#f7b125] flex items-center">
                      <span className="text-[1.8rem] mr-1">😥</span>Sad
                    </div>
                  )}
                  {userHasLiked?.icon === 'angry' && (
                    <div className="font-medium px-3 py-1 rounded-full bg-[#f8e0d6] text-[#e9710f] flex items-center">
                      <span className="text-[1.8rem] mr-1">😡</span>Angry
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleReactionChangeOrAdd('satisfaction')}
                  className="mr-5"
                >
                  Thích
                </button>
              )}
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
            <ListReaction data={data?.likes} />
          </div>
        )}

        <div className="flex items-center">
          {data?.createAt !== data?.updateAt && (
            <div className="italic mr-5 font-normal text-[1.3rem] text-[#555]">
              Bình luận đã được chỉnh sửa
            </div>
          )}
          {!data?.isDelete && !data?.prohibited && (
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
          )}
        </div>
      </div>
      {feedback?.id === data?.id && (
        <div className="ml-2 p-3 flex pt-10 items-start">
          <img
            className="w-16 h-16 object-cover mr-5 rounded-full"
            src={user?.avatar ? user?.avatar : '/images/avatar-empty.png'}
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
