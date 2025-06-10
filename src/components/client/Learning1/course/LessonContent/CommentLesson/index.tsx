'use client';
import { Button, Drawer } from 'antd';
import { useEffect, useRef, useState } from 'react';
import BoxComment from './ProfileComment/BoxComment';
import * as signalR from '@microsoft/signalr';
import { getAllCommentByLessonId } from '@/api/axios/api';
import ContentComment from './ContentComment';
import { useAppSelector } from '@/redux/hook/hook';
import { createOrGetConnection } from '@/services/signalRService';
import { motion, AnimatePresence } from '@/lib/motion';
import { FiMessageCircle, FiSend, FiX, FiAlertCircle, FiMessageSquare, FiSmile, FiImage, FiCode, FiMoreHorizontal, FiFilter, FiRefreshCw, FiHeart } from 'react-icons/fi';

const CommentLesson = ({
  title,
  courseId,
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
  const [comment, setComment] = useState<string>('');
  const refConnection = useRef<signalR.HubConnection | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const commentListRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [animateParticles, setAnimateParticles] = useState<boolean>(false);

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
          // Kích hoạt hiệu ứng particles khi tải xong dữ liệu
          setTimeout(() => {
            setAnimateParticles(true);
            setTimeout(() => setAnimateParticles(false), 2000);
          }, 800);
        }
        setIsPostReq(false);
        setTimeout(() => setLoading(false), 600);
      };
      handleRequest();
    }
  }, [idLesson, isShowComment, isPostReq]);

  useEffect(() => {
    let isMounted = true;

    async function setupAndJoin() {
      if (!courseId || !idLesson || !isShowComment) return;

      // 1) Khởi tạo hoặc lấy connection đã tồn tại
      let conn = refConnection.current;
      if (!conn) {
        conn = await createOrGetConnection('commentHub');
        refConnection.current = conn;

        // 2) Đăng ký handlers
        conn.on('ReceiveMessage', message => {
          console.log('ReceiveMessage:', message);
        });
        conn.on('ReceiveComment', comments => {
          console.log('ReceiveComment:', comments);
          setData(comments);
        });
        conn.on('ErrorMessage', errMsg => {
          console.error('ErrorMessage từ server:', errMsg);
        });
      }

      // 3) Chỉ invoke khi đã thực sự connected
      if (conn.state === signalR.HubConnectionState.Connected) {
        try {
          await conn.invoke("PostGrant", Number(courseId), Number(idLesson));
        } catch (err) {
          console.error('❌ invoke GrantReceiveMessage thất bại:', err);
        }
      }
    }

    setupAndJoin();

    return () => {
      if (!isShowComment && refConnection.current) {
        refConnection.current.stop();
        refConnection.current = null;
      }
    };
  }, [courseId, idLesson, isShowComment]);

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

  // Xử lý scroll để hiển thị header shadow
  const handleScroll = () => {
    if (commentListRef.current) {
      setIsScrolled(commentListRef.current.scrollTop > 10);
    }
  };

  // Làm mới bình luận
  const handleRefreshComments = () => {
    setIsPostReq(true);
    setAnimateParticles(true);
    setTimeout(() => setAnimateParticles(false), 2000);
  };

  // Các filter cho bình luận
  const filters = [
    { id: 'all', label: 'Tất cả', icon: <FiMessageCircle size={14} /> },
    { id: 'recent', label: 'Gần đây', icon: <FiRefreshCw size={14} /> },
    { id: 'popular', label: 'Phổ biến', icon: <FiHeart size={14} /> },
    { id: 'unanswered', label: 'Chưa trả lời', icon: <FiAlertCircle size={14} /> }
  ];

  // Tạo hiệu ứng particles
  const Particles = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${i % 3 === 0 ? 'from-indigo-500 to-purple-500' :
              i % 3 === 1 ? 'from-blue-500 to-cyan-500' : 'from-pink-500 to-rose-500'
              }`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={animateParticles ? {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 2 + 0.5, 0],
            } : {}}
            transition={{
              duration: Math.random() * 2 + 1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <Drawer
      title={null}
      placement="right"
      onClose={closeDrawer}
      open={isShowComment}
      width={520}
      className="comments-drawer"
      bodyStyle={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
      maskStyle={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      headerStyle={{
        display: 'none',
      }}
      closeIcon={null}
    >
      {/* Custom header */}
      <motion.div
        className={`sticky top-0 z-30 px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg mr-3">
              <FiMessageSquare size={20} />
            </div>
            <div>
              <motion.h2
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h2>
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {data?.commentsCount || 0} bình luận
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRefreshComments}
              className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <FiRefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeDrawer}
              className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <FiX size={18} />
            </motion.button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter, index) => (
            <motion.button
              key={filter.id}
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${activeFilter === filter.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white shadow-sm hover:shadow text-gray-600 border border-gray-200'
                }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col h-full">
        {/* Comments list */}
        <div
          className="flex-1 overflow-y-auto p-6 pt-2"
          ref={commentListRef}
          onScroll={handleScroll}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64"
              >
                <div className="relative w-20 h-20">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-indigo-500/20"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500"
                    animate={{ rotate: 360, scale: [1, 0.9, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <motion.p
                  className="mt-6 text-gray-600 dark:text-gray-400 text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Đang tải bình luận...
                </motion.p>
              </motion.div>
            ) : data?.comments?.length > 0 ? (
              <motion.div
                key="comments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="font-medium text-lg text-gray-800 dark:text-gray-200">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">
                      {data?.commentsCount > 9 ? data?.commentsCount : '0' + data?.commentsCount}
                    </span> Bình luận
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <FiFilter className="mr-1.5" />
                    <span>Lọc</span>
                  </motion.button>
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

                <div className="mt-8 text-center">
                  <motion.div
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full text-sm font-medium text-indigo-600"
                    whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)" }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Đã tải hết bình luận ❤️
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-xl"></div>
                  <motion.div
                    className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white relative z-10"
                    animate={{
                      boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0.4)", "0 0 0 20px rgba(99, 102, 241, 0)"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <FiMessageCircle size={48} />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mt-6 mb-2">
                  Chưa có bình luận nào
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                  Hãy là người đầu tiên chia sẻ suy nghĩ của bạn về bài học này
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={() => setFeedback({ id: 0, type: 'add' })}
                >
                  Viết bình luận đầu tiên
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment input */}
        <motion.div
          className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(236,240,255,0.9))',
            boxShadow: '0 -4px 20px rgba(99, 102, 241, 0.05)'
          }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="relative">
                <motion.div
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={user?.avatar ? user?.avatar : '/images/avatar-empty.png'}
                    alt="Avatar"
                  />
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
            </div>

            <div className="flex-1 relative">
              {feedback?.id !== 0 ? (
                <motion.div
                  onClick={() => setFeedback({ id: 0, type: 'add' })}
                  className="w-full px-4 py-3.5 bg-white rounded-2xl text-gray-500 cursor-text hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Viết bình luận của bạn...
                </motion.div>
              ) : (
                <div className="relative">
                  <BoxComment
                    lessonId={idLesson}
                    parentId={null}
                    comment={comment}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    setComment={setComment}
                  />

                  {/* Comment toolbar */}
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-full text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <FiSmile size={18} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-full text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                      <FiImage size={18} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-full text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                      <FiCode size={18} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-full text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                      <FiMoreHorizontal size={18} />
                    </motion.button>
                  </div>

                  {/* Emoji picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="grid grid-cols-6 gap-2">
                          {['😀', '😂', '😍', '🤔', '😎', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥'].map(emoji => (
                            <motion.button
                              key={emoji}
                              whileHover={{ scale: 1.2, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                              onClick={() => {
                                setComment((prev: string) => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements & particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-blue-500/10 to-cyan-300/5 rounded-full blur-3xl"></div>
        <Particles />
      </div>
    </Drawer>
  );
};

export default CommentLesson;
