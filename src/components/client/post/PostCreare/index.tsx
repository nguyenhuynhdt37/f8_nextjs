'use client';
import Banner from '@/components/admin/MainContent/Course/create/Banner';
import OptionType from '@/components/admin/MainContent/Course/lesson/create/OptionType';
import MarkdownEditor from '@/components/Edittor/MarkdownEditor';
import { message, Modal } from 'antd';
import React, { useState } from 'react';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { CreatePost } from '@/api/api';
import { useRouter } from 'next/navigation';
const PostCreate = ({ types }: any) => {
  const [content, setContent] = useState<string>('');
  const mdParser = new MarkdownIt();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<any>({
    title: '',
    banner: null,
  });
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const [type, setType] = useState<any>(types[0]);
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('content', content || '');
    formData.append('blogTypeId', type?.id || '');
    formData.append('banner', data?.banner || '');
    formData.append('title', data?.title || '');
    const res = await CreatePost(formData);
    if (res?.statusCode === 200 || res?.statusCode === 200) {
      messageApi.open({
        type: 'success',
        content: 'Tạo mới thành công',
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/admin/course');
    } else {
      messageApi.open({
        type: 'error',
        content: 'Có lỗi xẩy ra, vui lòng thử lại sau',
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <input
            value={data.title}
            onChange={e =>
              setData({
                ...data,
                title: e.target.value,
              })
            }
            type="text"
            placeholder="Tiêu đề"
            className="w-full flex-1 focus:outline-none py-5 text-[3rem]"
          />
          <button
            disabled={!((content && data.title) || !openModal)}
            onClick={e => setOpenModal(true)}
            className="w-[15rem] disabled:bg-[#7fc9fd] py-3 rounded-full bg-[#4dacf0] px-10 text-[#fff] font-medium text-2xl"
          >
            XUẤT BẢN
          </button>
        </div>
        <div className="pb-10">
          <MarkdownEditor value={content} onChange={setContent} height="80vh" />
        </div>
      </div>
      <Modal
        title={null}
        footer={null}
        onCancel={() => setOpenModal(false)}
        width={1000}
        open={openModal}
        centered
      >
        <div className="font-medium">Xem trước</div>
        <div className="grid grid-cols-2 gap-11">
          <div className="">
            <Banner data={data.banner} setData={setData} />
            <div className="">
              <input type="text" className="w-full" />
            </div>
          </div>
          <div className="">
            <div className="">Chọn chủ đề của bạn</div>
            <div className="pt-5">
              <OptionType
                className="px-10 py-5"
                data={types}
                typeChoise={type}
                setTypeChoise={setType}
              />
            </div>
            <button
              onClick={() => handleSubmit()}
              disabled={!(data.title && data.banner)}
              className="w-[15rem] mt-10 disabled:bg-[#7fc9fd] py-3 rounded-full bg-[#4dacf0] px-1 text-[#fff] font-medium text-2xl"
            >
              XUẤT BẢN NGAY
            </button>
          </div>
        </div>
        <div className="">
          <input
            type="text"
            className="border-y-[0.1rem] w-full focus:outline-none font-bold text-[2rem] py-4 "
            value={data?.title}
            onChange={e =>
              setData({
                ...data,
                title: e.target.value,
              })
            }
          />
          <div
            className="custom-textview"
            dangerouslySetInnerHTML={{ __html: mdParser.render(content) }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PostCreate;
