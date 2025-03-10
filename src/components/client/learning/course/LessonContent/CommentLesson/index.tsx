import { Button, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import BoxComment from './ProfileComment/BoxComment';
import * as signalR from '@microsoft/signalr';
import { getAllCommentByLessonId } from '@/api/api';
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
        title={title}
        placement="right" // Vị trí mở từ bên phải
        onClose={closeDrawer}
        open={isShowComment}
        width="50%" // Chiều rộng modal (50% màn hình)
        bodyStyle={{
          padding: '20px',
        }}
      >
        <div className="p-10">
          {/* Phần nhập bình luận */}
          <div className="flex items-start">
            <img
              onClick={handleClick}
              className="w-16 h-16 object-cover mr-5 rounded-full"
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
                className="py-4 px-7 cursor-text rounded-2xl text-[#8893a1] bg-[#eef4fc] flex-1"
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
          <div className="h-[0.1rem] my-10 bg-[#f1f1f1]"></div>
          {data?.comments?.length > 0 ? (
            loading ? (
              <div className="flex items-center justify-center">
                <img
                  className="w-5 mr-2"
                  src="/images/loading_black.gif"
                  alt="Loading"
                />
                <span>Đang tải bình luận...</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-[1.6rem] text-[#555555]">
                    {data?.commentsCount > 9
                      ? data?.commentsCount
                      : '0' + data?.commentsCount}{' '}
                    Bình luận
                  </div>
                  <div className="text-[#a6a6a6]">
                    Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé
                  </div>
                </div>
                <ContentComment
                  onShowMoreComment={handleShowMoreComment}
                  lessonId={idLesson}
                  feedback={feedback}
                  setFeedback={setFeedback}
                  moreComment={moreComment}
                  handleHideComment={handleHideComment}
                  data={data}
                />
                <div className="h-[0.1rem] my-10 bg-[#f1f1f1]"></div>
                <div className="flex items-center justify-center font-medium">
                  Đã tải hết bình luận ❤️
                </div>
              </div>
            )
          ) : loading ? (
            <>
              <div className="flex items-center justify-center">
                <img
                  className="w-5 mr-2"
                  src="/images/loading_black.gif"
                  alt="Loading"
                />
                <span>Đang tải bình luận...</span>
              </div>
            </>
          ) : (
            <div className="flex font-medium text-[#4a88b8] text-[1.4rem] items-center justify-center">
              Hãy là người bình luận đầu tiên 😊
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default CommentLesson;
