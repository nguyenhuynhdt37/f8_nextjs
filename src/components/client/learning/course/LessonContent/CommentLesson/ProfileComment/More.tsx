import { useAppSelector } from '@/redux/hook/hook';
import { Button, message, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { DeleteComment, ReportComment } from '@/api/axios/api';

const More = ({ data, comment, setComment, setFeedback }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';
  const user = useAppSelector(state => state.auth?.user?.user);

  const handleReport = () => {
    const handleReport = async () => {
      messageApi.open({
        key,
        type: 'loading',
        content: 'Đang gửi báo cáo...',
      });
      const res = await ReportComment(data?.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.open({
          key,
          type: 'success',
          content: 'Gửi thành công!',
          duration: 2,
        });
      } else if (res?.statusCode === 400) {
        messageApi.open({
          key,
          type: 'warning',
          content: 'Bạn đã báo cáo rồi!',
          duration: 2,
        });
      } else {
        messageApi.open({
          key,
          type: 'error',
          content: 'Có lỗi xảy ra vui lòng thử lại sau',
          duration: 2,
        });
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    };
    handleReport();
  };

  const handleDelete = () => {
    const handleRequest = async () => {
      messageApi.open({
        key,
        type: 'loading',
        content: 'Đang xoá bình luận...',
      });
      const res = await DeleteComment(data?.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.open({
          key,
          type: 'success',
          content: 'Xoá thành công!',
          duration: 2,
        });
      } else if (res?.statusCode === 400) {
        messageApi.open({
          key,
          type: 'warning',
          content: 'Bình luận không tồn tại!',
          duration: 2,
        });
      } else if (res?.statusCode === 400) {
        messageApi.open({
          key,
          type: 'error',
          content: 'Bạn không phải chủ sở hữu bình luận này!',
          duration: 2,
        });
      } else {
        messageApi.open({
          key,
          type: 'error',
          content: 'Có lỗi xảy ra vui lòng thử lại sau',
          duration: 2,
        });
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    };
    handleRequest();
  };

  const handleEdit = () => {
    setFeedback({
      id: data?.id,
      type: 'edit',
    });
    setComment(data?.content);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden w-48 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
      {contextHolder}
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {user?.id === data?.user?.id ? (
          <>
            <li
              onClick={handleEdit}
              className="cursor-pointer py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Chỉnh sửa
            </li>
            <li className="py-3 px-4">
              <Popconfirm
                title="Xoá bình luận"
                description="Một khi đã xoá thì tiến trình này không thể khôi phục ?"
                onConfirm={handleDelete}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                okButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
                overlayClassName="custom-popconfirm"
              >
                <button className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 w-full text-left">
                  Xoá bình luận
                </button>
              </Popconfirm>
            </li>
          </>
        ) : (
          <li className="py-3 px-4">
            <Popconfirm
              title="Báo cáo vi phạm"
              description="Bạn có muốn báo cáo vi phạm này ?"
              onConfirm={handleReport}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
              overlayClassName="custom-popconfirm"
            >
              <button className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 w-full text-left">
                Báo cáo vi phạm
              </button>
            </Popconfirm>
          </li>
        )}
      </ul>

      <style jsx global>{`
        .custom-popconfirm .ant-popover-inner {
          background-color: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .custom-popconfirm .ant-popover-title,
        .custom-popconfirm .ant-popover-inner-content {
          color: #374151;
        }
        
        @media (prefers-color-scheme: dark) {
          .custom-popconfirm .ant-popover-inner {
            background-color: #1f2937;
            border: 1px solid #374151;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
          }
          
          .custom-popconfirm .ant-popover-title,
          .custom-popconfirm .ant-popover-inner-content {
            color: #e5e7eb;
          }
          
          .custom-popconfirm .ant-popover-buttons .ant-btn-default {
            background-color: #374151;
            border-color: #4b5563;
            color: #e5e7eb;
          }
          
          .custom-popconfirm .ant-popover-buttons .ant-btn-default:hover {
            background-color: #4b5563;
            border-color: #6b7280;
          }
          
          .custom-popconfirm .ant-popover-arrow-content::before {
            background-color: #1f2937;
          }
        }
      `}</style>
    </div>
  );
};

export default More;
