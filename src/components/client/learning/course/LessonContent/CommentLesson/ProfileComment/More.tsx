import { useAppSelector } from '@/redux/hook/hook';
import { Button, message, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { DeleteComment, ReportComment } from '@/api/api';
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
    <div className="bg-[#eef4fc] w-[20rem] text-[#515151] overflow-hidden shadow-xl px-5 rounded-2xl">
      {contextHolder}
      <ul>
        {user?.id === data?.user?.id ? (
          <>
            <li
              onClick={handleEdit}
              className=" cursor-pointer py-4 px-5 border-b-2 border-b-[#fff]"
            >
              Chỉnh sửa
            </li>
            <li className="cursor-pointer  py-4 px-5 border-b-2 border-b-[#fff]">
              <Popconfirm
                title="Xoá bình luận"
                description="Một khi đã xoá thì tiến trình này không thể khôi phục ?"
                onConfirm={handleDelete}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                Xoá bình luận
              </Popconfirm>
            </li>
          </>
        ) : (
          <li className="cursor-pointer  py-4 px-5">
            <Popconfirm
              title="Báo cáo vi phạm"
              description="Bạn có muốn báo cáo vi phạm này ?"
              onConfirm={handleReport}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              Báo cáo vi phạm
            </Popconfirm>
          </li>
        )}
      </ul>
    </div>
  );
};

export default More;
