'use client';
import MarkdownIt from 'markdown-it';
import React, { useEffect } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLink } from 'react-icons/fa6';
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
const PostById = ({ data }: any) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStateNav(3));
  }, []);
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
  return (
    <div>
      <div className="grid grid-cols-9 text-[1.4rem] pb-32">
        <div className=""></div>
        <div>
          <div className="sticky top-[9rem]">
            <div className="border-b-[0.1rem] py-2">Nguyễn Xuân Huỳnh</div>
            <div className="flex text-[#757575] pe-[6rem] justify-between mt-5">
              <div className="flex items-center">
                <FaRegHeart className="text-[1.6rem] cursor-pointer mr-5" />1
              </div>
              <div className="flex items-center">
                <FaRegComment className="text-[1.6rem] cursor-pointer mr-5" />1
              </div>
            </div>
            <div className=""></div>
          </div>
        </div>
        <div className="col-span-5 px-20">
          <div className="title font-bold text-[3rem]">Hello cả nhà</div>
          <div className="flex items-center justify-between">
            <div className="flex mt-10 items-center">
              <div className="mr-5">
                <img
                  className="w-20 h-20 object-cover rounded-full"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgTyyEiNolp2zxJ_XR1SyeCA4_hIW_IO9T50YmN8Puq050lAvSnt3NyamC0hdwZFtWLFQ&usqp=CAU"
                  alt=""
                />
              </div>
              <div className="">
                <div className="pb-2">Nguyễn Xuân Huỳnh</div>
                <div className="text-[1.2rem] text-[#9c9b9b]">
                  Một ngày trước
                </div>
              </div>
            </div>
            <Tippy
              trigger="click"
              content={
                <div className="px-5">
                  <div className="flex py-4 hover:text-[#974676] items-center cursor-pointer">
                    <FaPencil className="mr-5" /> Sửa bài viết
                  </div>
                  <div className="flex py-4 hover:text-[#974676] items-center cursor-pointer">
                    <FaFacebook className="mr-5" /> Chia sẻ lên Facebook
                  </div>
                  <div className="flex py-4 hover:text-[#974676] items-center cursor-pointer">
                    <FaTwitter className="mr-5" /> Chia sẻ lên Twitter
                  </div>
                  <div className="flex py-4 hover:text-[#974676] items-center cursor-pointer">
                    <MdEmail className="mr-5" /> Chia sẻ với Email
                  </div>
                  <div className="flex py-4 hover:text-[#974676] items-center cursor-pointer">
                    <FaLink className="mr-5" /> Sao chép liên kết
                  </div>
                </div>
              }
              className="relative right-20"
              interactive={true} // Cho phép tương tác
              theme="light" // Giao diện sáng (tùy chọn)
              arrow={false}
              placement="bottom"
            >
              <div className="text-[2rem] cursor-pointer">
                <IoIosMore />
              </div>
            </Tippy>
          </div>
          <div className="mt-10">
            <div
              className="markdown-body w-full"
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
