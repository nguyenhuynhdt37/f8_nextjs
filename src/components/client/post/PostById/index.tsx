'use client';
import MarkdownIt from 'markdown-it';
import React, { useEffect } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaCircleCheck, FaLink } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';
import Tippy from '@tippyjs/react'; // Import thư viện
import 'tippy.js/dist/tippy.css'; // Import CSS
import { FaRegHeart } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa6';
import { IoIosMore } from 'react-icons/io';
import { FaPencil } from 'react-icons/fa6';
import 'github-markdown-css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import { message } from 'antd';
import { timeAgo } from '@/Utils/functions';
const PostById = ({ data }: any) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStateNav(3));
  }, []);
  const [messageApi, contextHolder] = message.useMessage();
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
  const handleEdit = () => {
    // Xử lý khi người dùng chọn sửa bài viết
    // Thực hiện các hành động cần thiết như điều hướng hoặc mở modal
  };

  const handleShareFacebook = () => {
    // Chia sẻ lên Facebook
    const url = window.location.href; // Lấy URL hiện tại của trang
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const handleShareTwitter = () => {
    // Chia sẻ lên Twitter
    const url = window.location.href; // Lấy URL hiện tại của trang
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        'Xem bài viết này! ' + url,
      )}`,
      '_blank',
    );
  };

  const handleShareEmail = () => {
    const url = window.location.href; // Lấy URL hiện tại của trang
    window.open(
      `mailto:?subject=${encodeURIComponent(
        'Xem bài viết này',
      )}&body=${encodeURIComponent(
        'Tôi muốn chia sẻ bài viết này với bạn: ' + url,
      )}`,
    );
  };

  const handleCopyLink = () => {
    const url = window.location.href; // Lấy URL hiện tại của trang
    navigator.clipboard.writeText(url).then(() => {
      messageApi.success('Copy thành công');
    });
  };
  return (
    <div>
      {contextHolder}
      <div className="grid grid-cols-9 text-[1.4rem] pb-32">
        <div className=""></div>
        <div>
          <div className="sticky top-[9rem]">
            <div className="">
              <div className="flex ml-20 text-[#757575] pe-[6rem] justify-between mt-5">
                <div className="flex items-center mr-5">
                  <FaRegHeart className="text-[1.6rem] cursor-pointer mr-5" />1
                </div>
                <div className="flex items-center">
                  <FaRegComment className="text-[1.6rem] cursor-pointer mr-5" />
                  1
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5 px-20">
          <div className="flex sticky top-[6.6rem] py-5 bg-[#fff] z-10 items-center mb-10 justify-between">
            <div className="flex items-center">
              <div className="mr-5">
                <img
                  className="w-16 h-16 object-cover rounded-full border-2 border-[#d2b523]"
                  src={
                    data?.user?.avatar ||
                    'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'
                  }
                  alt=""
                />
              </div>

              <div className="">
                <div className="flex items-center pb-2">
                  <div className="">{data?.user?.name}</div>
                  {data?.user?.roleId === 2 && (
                    <FaCircleCheck className="text-[#46a8ff] ml-4 text-[1.4rem]" />
                  )}
                </div>
                <div className="text-[1.2rem] text-[#9c9b9b]">
                  {timeAgo(data?.post?.updatedAt)}
                </div>
              </div>
            </div>
            <Tippy
              className="tippy-custom right-[7rem]"
              arrow={false}
              trigger="click"
              placement="bottom"
              interactive
              content={
                <div className="px-5 shadow-2xl text-[#111]">
                  {/* Sửa bài viết */}
                  <div
                    className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                    onClick={handleEdit}
                  >
                    <FaPencil className="mr-5" /> Sửa bài viết
                  </div>

                  {/* Chia sẻ lên Facebook */}
                  <div
                    className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                    onClick={handleShareFacebook}
                  >
                    <FaFacebook className="mr-5" /> Chia sẻ lên Facebook
                  </div>

                  {/* Chia sẻ lên Twitter */}
                  <div
                    className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                    onClick={handleShareTwitter}
                  >
                    <FaTwitter className="mr-5" /> Chia sẻ lên Twitter
                  </div>

                  {/* Chia sẻ qua Email */}
                  <div
                    className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                    onClick={handleShareEmail}
                  >
                    <MdEmail className="mr-5" /> Chia sẻ với Email
                  </div>

                  {/* Sao chép liên kết */}
                  <div
                    className="flex py-4 hover:text-[#974676] items-center cursor-pointer"
                    onClick={() => handleCopyLink()}
                  >
                    <FaLink className="mr-5" /> Sao chép liên kết
                  </div>
                </div>
              }
            >
              <div className="text-[2rem] cursor-pointer">
                <IoIosMore />
              </div>
            </Tippy>
          </div>
          <div className="title font-bold text-[3rem]">{data?.post?.title}</div>
          <div className="mt-10">
            <div
              className="w-full custom-textview custom-comment scrollbar-custom custom-post "
              dangerouslySetInnerHTML={{
                __html: mdParser.render(data?.post?.content),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostById;
