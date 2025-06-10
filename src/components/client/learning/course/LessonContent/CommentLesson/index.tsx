import { Button, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import BoxComment from './ProfileComment/BoxComment';
import * as signalR from '@microsoft/signalr';
import { getAllCommentByLessonId } from '@/api/axios/api';
import ContentComment from './ContentComment';
import { useAppSelector } from '@/redux/hook/hook';

const CommentLesson = ({
  title,
  idLesson,
  isShowComment,
  setIsShowComment,
}: any) => {
  const [feedback, setFeedback] = useState<any>({
    id: -1,
    type: 'add',
  });
  const user = useAppSelector(p => p.auth?.user?.user);
  const [moreComment, setMoreComment] = useState<number[]>([]);
  const [data, setData] = useState<any>([]);
  const [isPostReq, setIsPostReq] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<any>('');
  const [connection, setConnection] = useState<any>(null);

  useEffect(() => {
    setIsPostReq(true);
  }, [idLesson]);

  useEffect(() => {
    if (idLesson && isShowComment && isPostReq) {
      const handleRequest = async () => {
        setLoading(true);
        const res = await getAllCommentByLessonId(idLesson);
        if (res?.statusCode === 200) {
          setData(res?.data);
        }
        setIsPostReq(false);
        setLoading(false);
      };
      handleRequest();
    }
  }, [idLesson, isShowComment]);

  // Kết nối SignalR khi component mount
  useEffect(() => {
    const connect = async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5217/commentHub')
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveComment', dataCommentNew => {
        setData(dataCommentNew);
      });
      connection.on('Error', error => {
        console.log(error);
      });

      try {
        await connection.start();
        setConnection(connection);
      } catch (err: any) {
        console.error('Connection failed: ', err.toString());
      }
    };

    connect();

    return () => {
      connection?.stop();
    };
  }, []);

  const showDrawer = () => {
    setIsShowComment(true);
  };

  const closeDrawer = () => {
    setIsShowComment(false);
  };

  const handleShowMoreComment = (id: number) => {
    var comments = moreComment.find(p => p === id);
    if (!comments) {
      setMoreComment([...moreComment, id]);
    }
  };

  const handleHideComment = (id: number) => {
    const newMoreComment = moreComment.filter(item => item !== id);
    setMoreComment(newMoreComment);
  };

  const handleClick = () => {
    connection.send('SendComment2', 'hello xin chào cả nhà');
  };

  return (
    <div>
      <Drawer
        className="comment-drawer"
        title={
          <div className="text-lg font-medium dark:bg-gray-800  text-gray-800 dark:text-gray-100">
            {title}
          </div>
        }
        placement="right"
        onClose={closeDrawer}
        open={isShowComment}
        width="50%"
        bodyStyle={{
          padding: '0',
        }}
        headerStyle={{
          borderBottom: '1px solid',
          borderColor: 'rgb(229, 231, 235)',
          backgroundColor: 'rgb(255, 255, 255)',
        }}
        styles={{
          header: {
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            padding: '1rem',
          },
          body: {
            backgroundColor: 'var(--bg-color)',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <div className="p-6 md:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          {/* Phần nhập bình luận */}
          <div className="flex items-start">
            <img
              onClick={handleClick}
              className="w-12 h-12 md:w-16 md:h-16 object-cover mr-4 rounded-full border-2 border-gray-200 dark:border-gray-600"
              src={user?.avatar ? user?.avatar : '/images/avatar-empty.png'}
              alt="hình ảnh đại diện"
            />
            {feedback?.id !== 0 ? (
              <div
                onClick={() =>
                  setFeedback({
                    id: 0,
                    type: 'add',
                  })
                }
                className="py-3 px-5 cursor-text rounded-xl text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-1"
              >
                Nhập bình luận mới của bạn
              </div>
            ) : (
              <BoxComment
                lessonId={idLesson}
                parentId={null}
                comment={comment}
                feedback={feedback}
                setFeedback={setFeedback}
                setComment={setComment}
              />
            )}
          </div>

          {/* Đường kẻ phân cách */}
          <div className="h-px my-8 bg-gray-200 dark:bg-gray-700"></div>

          {data?.comments?.length > 0 ? (
            loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mr-3"></div>
                <span className="text-gray-700 dark:text-gray-200">Đang tải bình luận...</span>
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="font-medium text-lg md:text-xl text-gray-700 dark:text-gray-100 mb-2 md:mb-0">
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {data?.commentsCount > 9
                        ? data?.commentsCount
                        : '0' + data?.commentsCount}
                    </span>{' '}
                    Bình luận
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300 italic">
                    Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé
                  </div>
                </div>

                <div className="space-y-6">
                  <ContentComment
                    onShowMoreComment={handleShowMoreComment}
                    lessonId={idLesson}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    moreComment={moreComment}
                    handleHideComment={handleHideComment}
                    data={data}
                  />
                </div>

                <div className="h-px my-8 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex items-center justify-center font-medium text-gray-600 dark:text-gray-300">
                  Đã tải hết bình luận ❤️
                </div>
              </div>
            )
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-gray-700 dark:text-gray-200">Đang tải bình luận...</span>
            </div>
          ) : (
            <div className="flex font-medium text-indigo-600 dark:text-indigo-400 text-lg items-center justify-center py-12">
              Hãy là người bình luận đầu tiên 😊
            </div>
          )}
        </div>
      </Drawer>

      <style jsx global>{`
        .comment-drawer .ant-drawer-content {
          background-color: var(--bg-color);
        }
        
        @media (prefers-color-scheme: dark) {
          .comment-drawer .ant-drawer-header {
            background-color: #1f2937;
            border-bottom: 1px solid #374151;
          }
          
          .comment-drawer .ant-drawer-title {
            color: #f3f4f6;
          }
          
          .comment-drawer .ant-drawer-close {
            color: #9ca3af;
          }
          
          .comment-drawer .ant-drawer-content {
            background-color: #111827;
          }
        }
        
        :root {
          --bg-color: #ffffff;
          --text-color: #1f2937;
        }
        
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-color: #111827;
            --text-color: #f3f4f6;
          }
        }
      `}</style>
    </div>
  );
};

export default CommentLesson;
