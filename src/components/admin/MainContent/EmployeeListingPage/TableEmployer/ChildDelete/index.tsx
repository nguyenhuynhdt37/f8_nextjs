import { DeleteUser } from '@/api/axios/api';
import { message } from 'antd';
import React from 'react';

const ChildDelete = ({ setLoadData, setShowDelete, id }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const handleDeleteUser = async (id: number, event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (id === -1) return;
    const res = await DeleteUser({ id });
    if (res?.statusCode === 200 || res?.statusCode === 201) {
      messageApi.open({
        content: 'Xoá tài khoản thành công!',
        type: 'success',
      });

      setLoadData((prev: any) => prev + 1);
    } else if (res?.statusCode === 400 || res?.statusCode === 401) {
      messageApi.open({
        content: 'Tài khoản đã sử dụng không thể huỷ bỏ!',
        type: 'error',
      });
    } else {
      messageApi.open({
        content: 'Có lỗi trong quá trình thực hiện!',
        type: 'error',
      });
    }
    setShowDelete(false);
  };
  return (
    <>
      <div className="flex justify-center text-[1.3xl]">
        <img src="/assets/icons/delete.png" className="w-24" alt="" />
      </div>
      <div className="py-4 text-center text-2xl font-bold text-[#334049]">
        Xoá người dùng này
      </div>
      <div className=" text-center text-[1.3rem] py-5 ">
        Bạn có chắc chắn xoá người dùng này, sau khi xoá thì không thể khôi phục
        được.
      </div>
      <div className="flex py-5">
        <button
          onClick={() => setShowDelete(false)}
          className="mx-1 flex-1 rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 text-[#334049]"
        >
          Huỷ bỏ
        </button>
        <button
          className="mx-1 flex-1 rounded-2xl border-0 bg-[#ff3f56] px-4 py-3 text-[#fff]"
          onClick={e => handleDeleteUser(id, e)}
        >
          Đồng ý
        </button>
      </div>
    </>
  );
};

export default ChildDelete;
