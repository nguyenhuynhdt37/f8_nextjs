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
import { LikeChangeOrAdd, UnlikeComment } from '@/api/axios/api';
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
          return `<pre class="hljs"><code>${hljs.highlight(lang, code, true).value
            }</code></pre>`;
        } catch (_) { }
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
      <LoadingBar color="#4f46e5" ref={ref} />
      <div className="flex flex-col space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-gray-900 transition-colors duration-300">
        <div className="flex items-center">
          <img
            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border-2 border-indigo-200 dark:border-indigo-700 mr-3"
            src={data?.user?.avatar || '/images/avatar-empty.png'}
            alt="User avatar"
          />
          <div className="flex flex-col md:flex-row md:items-center">
            <div
              onClick={handleRedirectToProfileID}
              className="font-medium cursor-pointer flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mr-2"
            >
              {data?.user?.fullName}
              {data?.user?.roleId === 2 && (
                <FaCircleCheck className="text-blue-600 dark:text-blue-400 ml-1.5 text-sm" />
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo(data?.createAt)}
            </span>
          </div>
        </div>

        {/* Comment content */}
        <div className="ml-0 md:ml-12">
          {data?.content && !data?.isDelete && !data?.prohibited && (
            <div
              className="custom-textview custom-comment prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: data?.content || '',
              }}
            />

          )}
          {data?.content && data?.isDelete && !data?.prohibited && (
            <div className="italic text-gray-500 dark:text-gray-400 text-sm">
              Bình luận này đã bị gỡ bỏ do chủ sở hữu
            </div>
          )}
          {data?.content && data?.isDelete && data?.prohibited && (
            <div className="italic text-gray-500 dark:text-gray-400 text-sm">
              Bình luận này đã bị gỡ bỏ do chủ sở hữu và quản trị viên so vi phạm
              chính sách cộng đồng
            </div>
          )}
          {data?.content && !data?.isDelete && data?.prohibited && (
            <div className="italic text-gray-500 dark:text-gray-400 text-sm">
              Bình luận này đã bị gỡ bỏ bởi quản trị viên so vi phạm chính sách cộng
              đồng
            </div>
          )}

          {/* Comment actions */}
          <div className="flex items-center justify-between mt-2 text-sm">
            {data?.isDelete || data?.prohibited ? (
              <div className="flex text-gray-400 dark:text-gray-500 items-center">
                <button disabled className="mr-3 opacity-50 cursor-not-allowed">
                  Thích
                </button>
                <button disabled className="mr-3 opacity-50 cursor-not-allowed">
                  Phản hồi
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Tippy
                  className="tippy-custom"
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
                    <button onClick={handleUnLike} className="mr-3">
                      {userHasLiked?.icon === 'satisfaction' && (
                        <div className="font-medium px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center text-xs">
                          <span className="mr-1">👍</span>Like
                        </div>
                      )}
                      {userHasLiked?.icon === 'love' && (
                        <div className="font-medium px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 flex items-center text-xs">
                          <span className="mr-1">❤️</span>Love
                        </div>
                      )}
                      {userHasLiked?.icon === 'happy' && (
                        <div className="font-medium px-2 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 flex items-center text-xs">
                          <span className="mr-1">😆</span>Haha
                        </div>
                      )}
                      {userHasLiked?.icon === 'surprise' && (
                        <div className="font-medium px-2 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 flex items-center text-xs">
                          <span className="mr-1">😮</span>Wow
                        </div>
                      )}
                      {userHasLiked?.icon === 'sad' && (
                        <div className="font-medium px-2 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 flex items-center text-xs">
                          <span className="mr-1">😥</span>Sad
                        </div>
                      )}
                      {userHasLiked?.icon === 'angry' && (
                        <div className="font-medium px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 flex items-center text-xs">
                          <span className="mr-1">😡</span>Angry
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactionChangeOrAdd('satisfaction')}
                      className="mr-3 text-indigo-600 dark:text-indigo-400 hover:underline"
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
                  className="mr-3 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Phản hồi
                </button>
                <ListReaction data={data?.likes} />
              </div>
            )}

            <div className="flex items-center">
              {data?.createAt !== data?.updateAt && (
                <div className="italic mr-3 text-xs text-gray-500 dark:text-gray-400">
                  Đã chỉnh sửa
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
                  <div className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <IoIosMore className="text-xl" />
                  </div>
                </Tippy>
              )}
            </div>
          </div>
        </div>
      </div>

      {feedback?.id === data?.id && (
        <div className="ml-0 md:ml-12 mt-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-start">
            <img
              className="w-8 h-8 md:w-10 md:h-10 object-cover mr-3 rounded-full border border-gray-200 dark:border-gray-600"
              src={user?.avatar ? user?.avatar : '/images/avatar-empty.png'}
              alt="User avatar"
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
        </div>
      )}

      <style jsx global>{`
        .custom-textview.custom-comment {
          color: #374151;
        }
        
        .dark .custom-textview.custom-comment {
          color: #e5e7eb;
        }
        
        .custom-textview.custom-comment pre {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
        }
        
        .dark .custom-textview.custom-comment pre {
          background-color: #1f2937;
          border: 1px solid #374151;
        }
        
        .custom-textview.custom-comment code {
          color: #111827;
        }
        
        .dark .custom-textview.custom-comment code {
          color: #e5e7eb;
        }
        
        .tippy-custom {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        @media (prefers-color-scheme: dark) {
          .tippy-custom {
            background-color: #1f2937;
            border: 1px solid #374151;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
    </>
  );
};

export default ProfileComment;
