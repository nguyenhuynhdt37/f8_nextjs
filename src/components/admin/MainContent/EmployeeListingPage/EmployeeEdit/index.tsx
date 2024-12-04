"use client";
import { getUserByID, UpdateImageUser, UpdateUser } from "@/api/api";
import NotFound from "@/app/not-found";
import LoadingPage from "@/components/client/LoadingPage";
import RichTextEditor from "@/components/RichTextEditor";
import { useAppSelector } from "@/redux/hook/hook";
import { IUpdateUser } from "@/types/next-auth";
import {
  createValidData,
  formatDateConfig,
  UpdateData,
} from "@/Utils/functions";
import { message } from "antd";
import { useParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import ImageUser from "./ImageUser";
import UserInfo from "./UserInfo";

const EmployeeEdit = () => {
  const [bio, setBio] = useState<string>("");
  const [editorValue, setEditorValue] = useState<IUpdateUser>({
    fullName: "",
    password: "",
    githubLink: "",
    facebookLink: "",
    youtubeLink: "",
    userName: "",
    personalWebsite: "",
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [dataUser, setDataUser] = useState<any>();
  const { id: idString } = useParams();
  const { accessToken } = useAppSelector((s) => s.auth);
  const [error, setError] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>("");
  useEffect(() => {
    if (!idString) {
      setError(true);
      return;
    }
  }, [idString]);

  useEffect(() => {
    const handleGetUser = async () => {
      if (idString) {
        setLoading(true);
        const id = parseInt(String(idString));
        const res = await getUserByID({ id });
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          setDataUser(res?.data);
          setBio(res?.data?.bio);
          setEditorValue({
            fullName: res?.data?.fullName || "",
            password: "",
            githubLink: res?.data?.githubLink || "",
            facebookLink: res?.data?.facebookLink || "",
            youtubeLink: res?.data?.youtubeLink || "",
            userName: res?.data?.userName || "",
            personalWebsite: res?.data?.personalWebsite || "",
          });
          if (res?.data.avatar) {
            setPreview(res?.data.avatar);
          }
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
      setLoading(false);
    };
    handleGetUser();
  }, [accessToken, idString]);

  const handleDelete = () => {
    setPreview("");
    setImage(null);
  };

  const checkChange = (
    data: any,
    editorValue: any
  ): { image: boolean; other: boolean } => {
    const checker = { image: false, other: false };
    if (image) checker.image = true;
    if (bio !== data.bio) checker.other = true;
    for (const key in editorValue) {
      data[key] = data[key] === undefined ? "" : data[key];
      if (editorValue[key] !== data[key]) {
        if (editorValue[key]) checker.other = true;
      }
    }
    return checker;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const checkExists = checkChange(dataUser, editorValue);
    if (!checkExists.image && !checkExists.other) {
      messageApi.open({
        type: "warning",
        content: "Không có sự thay đổi nào được thực hiện",
      });
      return;
    }
    setLoading(true);
    let CheckSuccess = true;
    if (image) {
      const formData = new FormData();
      formData.append("avatar", image);
      const resImage = await UpdateImageUser({
        id: Number(idString),
        token: accessToken,
        data: formData,
      });
      if (resImage?.statusCode === 200 || resImage?.statusCode === 201) {
        setImage(null);
      } else {
        CheckSuccess = false;
        setLoading(false);
        messageApi.open({
          content: "Có lỗi khi cập nhật hình ảnh",
          type: "error",
        });

        return;
      }
    }

    if (checkExists.other) {
      const dataPost = {
        fullName:
          editorValue.fullName !== dataUser.fullName
            ? editorValue.fullName
            : null,
        password: editorValue.password !== "" ? editorValue.password : null,
        githubLink:
          editorValue.githubLink !== dataUser.githubLink
            ? editorValue.githubLink
            : null,
        facebookLink:
          editorValue.facebookLink !== dataUser.facebookLink
            ? editorValue.facebookLink
            : null,
        youtubeLink:
          editorValue.youtubeLink !== dataUser.youtubeLink
            ? editorValue.youtubeLink
            : null,
        userName:
          editorValue.userName !== dataUser.userName
            ? editorValue.userName
            : null,
        bio: bio !== dataUser.bio ? bio : null,
      };
      const validData = createValidData(dataPost, dataUser);

      const res = await UpdateUser({
        id: Number(idString),
        token: accessToken,
        data: validData,
      });
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        CheckSuccess = true;
        setDataUser(UpdateData(dataUser, editorValue));
        setEditorValue({ ...editorValue, password: "" });
      } else {
        CheckSuccess = false;
        messageApi.open({
          content: "Có lỗi khi cập nhật thông tin",
          type: "error",
        });
        setLoading(false);
        return;
      }
    }
    if (CheckSuccess === true) {
      messageApi.open({
        content: "Cập nhật thôg tin thành công",
        type: "success",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      {isLoading && <LoadingPage />}
      {error && <NotFound />}
      {!error && (
        <div className="border-t-2 ">
          <div className="pt-5 text-[2.4rem] font-medium mt-2">
            Chỉnh sửa người dùng
          </div>
          <div className="pt-10 grid-cols-3 gap-5 overflow-y-auto  p-5 text-[1.3rem] lg:grid">
            <div className="">
              <ImageUser
                setImage={setImage}
                preview={preview}
                setPreview={setPreview}
              />
              <UserInfo
                editorValue={editorValue}
                setEditorValue={setEditorValue}
              />
              <div className="mt-10 rounded-xl border-2 border-[#e5bda7] bg-[#fff] p-12">
                <div className="flex items-center pb-2">
                  <div className="mr-2 mb-1 text-[1.3rem] font-medium">
                    Ngày tạo:
                  </div>
                  <div className="text-[1.3rem]">
                    {formatDateConfig(dataUser?.createdAt)}
                  </div>
                </div>
                <div className="flex items-center pb-2">
                  <div className="mr-2 mb-1 text-[1.3rem] font-medium">
                    Lần cuổi chỉnh sửa:
                  </div>
                  <div className="text-[1.3rem]">
                    {formatDateConfig(dataUser?.updatedAt)}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 text-[1.3rem] font-medium">
                    Số lần đăng ký khoá học:
                  </div>
                  <div className="text-[1.3rem]">12</div>
                </div>
              </div>
            </div>
            <div className="col-span-2 rounded-xl border-[0.2rem] border-[#e5bda7] bg-[#fff] px-5 py-10">
              <div className="mb-2 flex flex-wrap rounded-xl">
                <div className="mr-2 flex-1 pb-5">
                  <div className="mb-2 text-[#605f5f]">Tên người dùng</div>
                  <input
                    type="text"
                    name={"fullName"}
                    value={editorValue.fullName}
                    onChange={(e) =>
                      setEditorValue({
                        ...editorValue,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-[0.1rem] border-[#e5bda7] bg-[#e6e3e1] px-5 py-2 focus:outline-none"
                  />
                </div>
                <div className="flex-1 pb-5">
                  <div className="mb-2 text-[#605f5f]">Đặt lại mật khẩu</div>
                  <input
                    value={editorValue.password}
                    name={"password"}
                    type="password"
                    className="w-full rounded-lg border-[0.1rem] border-[#e5bda7] bg-[#e6e3e1] px-5 py-2 focus:outline-none"
                    onChange={(e) =>
                      setEditorValue({
                        ...editorValue,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="pb-5">
                <div className="pb-2 text-[#605f5f]">Bio</div>
                <RichTextEditor value={bio} onChange={setBio} />
              </div>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-[#3590f1] px-4 py-3 text-[#fff]"
              >
                Xác nhận sự thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default memo(EmployeeEdit);
