import { Button, Drawer } from "antd";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";
import RichTextEditor from "@/components/RichTextEditor";
import ReactQuill from "react-quill";
import ReactReactions from "@charkour/react-reactions";
const CommentLesson = ({
  title,
  idLesson,
  isShowComment,
  setIsShowComment,
}: any) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const showDrawer = () => {
    setIsShowComment(true);
  };

  const closeDrawer = () => {
    setIsShowComment(false);
  };
  const [reaction, setReaction] = useState(null);

  const handleReactionChange = (newReaction) => {
    setReaction(newReaction);
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
          padding: "20px",
        }}
      >
        <div className="p-10">
          <div className="flex items-start">
            <img
              className="w-16 h-16 object-cover mr-5 rounded-full"
              src="https://files.fullstack.edu.vn/f8-prod/user_photos/299093/63fc362173671.jpg"
              alt=""
            />
            {!isEdit ? (
              <div
                onClick={() => setIsEdit(true)}
                className="py-4 px-7 cursor-text rounded-2xl text-[#8893a1] bg-[#eef4fc] flex-1"
              >
                Nhập bình luận mới của bạn
              </div>
            ) : (
              <div className="">
                {/* <ReactQuill
                  value={comment}
                  onChange={setComment}
                  className="text-[3rem] border-[0.1rem] rounded-3xl border-[#1d8388]  overflow-hidden  rounded-lg scrollbar-custom"
                  theme="snow"
                  style={{ padding: "0px" }}
                  placeholder="Viết văn bản ở đây..."
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ align: [] }],
                      [{ color: [] }, { background: [] }],
                      ["link", "image"],
                      ["clean"],
                      ["code-block"],
                    ],
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "color",
                    "background",
                    "align",
                    "code-block",
                  ]}
                /> */}
                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setIsEdit(false)}
                    className="font-medium px-20 py-2.5 mr-5 rounded-3xl text-[#3590f1] border-[#3590f1] border-[0.1rem]"
                  >
                    Hủy
                  </button>
                  <button className="font-medium px-20 py-2.5 rounded-3xl bg-[#3590f1] text-[#fff] border-[0.1rem]">
                    Bình luận
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="h-[0.1rem] my-10 bg-[#f1f1f1]"></div>
          <div className="flex items-center justify-between">
            <div className="font-medium text-[1.6rem] text-[#555555]">
              33 Bình luận
            </div>
            <div className=" text-[#a6a6a6]">
              Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé
            </div>
          </div>
          <div className="mt-10 ">
            <div className="flex items-center pb-7">
              <img
                className="w-16 h-16 object-cover mr-5 rounded-full"
                src="https://files.fullstack.edu.vn/f8-prod/user_photos/299093/63fc362173671.jpg"
                alt=""
              />
              <div className="flex items-center">
                <div className="font-medium text-[#44a5c5] mr-5">
                  Nguyễn Xuân Huỳnh
                </div>
                26 phút trước
              </div>
            </div>
            <div className="">content</div>
            <div className="pt-7 flex items-center justify-between font-medium text-[#217bb3]">
              <div className="flex">
                <button className="mr-5">Thích</button>
                <button>Phản hồi</button>
              </div>
              <div className="flex items-center">
                <div className="">like</div>
                <div className="">
                  <IoIosMore />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <ReactReactions
        reactions={["like", "love", "haha", "wow", "sad", "angry"]}
        onReactionChange={handleReactionChange}
        selectedReaction={reaction}
      />
    </div>
  );
};

export default CommentLesson;
