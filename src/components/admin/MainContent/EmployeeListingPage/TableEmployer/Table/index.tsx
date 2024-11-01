import { IUser } from "@/types/next-auth";
import { Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { CiCircleMore, CiEdit, CiUser } from "react-icons/ci";
import { TiDeleteOutline } from "react-icons/ti";
import ChildDelete from "../ChildDelete";
import { AiOutlineDelete } from "react-icons/ai";
import LoadingBar from "react-top-loading-bar";
const Table = ({ data }: { data: IUser[] | undefined }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<number>(-1);
  const handleRedirect = (id: number) => {
    router.push(`/admin/users/details/${id}`);
  };
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<number>(-1);
  const handleMore = (event: any, id: number) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(id);
    setIdDelete(id);
    if (id === showModal) {
      setShowModal(-1);
    }
  };
  const ref = useRef<any>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);
  return (
    <>
      <LoadingBar
        color="#f11946" // Màu của thanh tiến trình
        ref={ref} // Tham chiếu đến LoadingBar
      />
      <table className="mt-4 w-full min-w-max text-[1.2rem] table-auto text-left">
        <thead className="text-[1.3rem] font-medium">
          <tr>
            <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans  font-normal leading-none text-slate-500">
                ID
              </p>
            </th>
            <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans  font-normal leading-none text-slate-500">
                Thông tin
              </p>
            </th>
            <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans  font-normal leading-none text-slate-500">
                Họ và tên
              </p>
            </th>
            <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans  font-normal leading-none text-slate-500">
                Trạng thái kích hoạt
              </p>
            </th>
            <th className="cursor-pointer border-y border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans  font-normal leading-none text-slate-500">
                Hành động
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr
              onClick={() => handleRedirect(+item?.id)}
              className="cursor-pointer hover:bg-[#fdf9f7]"
              key={item?.id}
            >
              <td className="border-b border-slate-200 ps-5">
                <div className="">{item?.id}</div>
              </td>
              <td className="border-b border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item?.avatar ||
                      "https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                    }
                    alt="John Michael"
                    className="relative inline-block h-14 w-14 mr-5 !rounded-full object-cover object-center"
                  />
                  <div className="flex flex-col">
                    <p className=" font-semibold text-slate-700">
                      {item?.fullName}
                    </p>
                    <p className=" text-slate-500">{item?.email}</p>
                  </div>
                </div>
              </td>
              <td className="border-b border-slate-200 p-4">
                <div className="flex flex-col">
                  <p className=" font-semibold text-slate-700">Người dùng</p>
                  <p className=" text-slate-500">{item?.fullName}</p>
                </div>
              </td>
              <td className="border-b border-slate-200 p-4">
                <div className="w-max">
                  <div
                    className={`relative grid select-none items-center whitespace-nowrap rounded-md px-3 py-1 font-sans text-[1.1rem] font-medium uppercase ${
                      item.isActive === 1
                        ? "bg-green-500/20 text-green-900"
                        : "bg-[#fee4e2] text-[#883c3a]"
                    } `}
                  >
                    <span className="">
                      {item?.isActive === 1 ? "Đã kích hoạt" : "Chưa kích hoạt"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="border-b border-slate-200 p-4">
                {Number(item?.id) !== showModal && (
                  <button
                    className="relative"
                    onClick={(e) => handleMore(e, +item?.id)}
                  >
                    <CiCircleMore className="text-[2.4rem] text-[#cccccc]" />
                  </button>
                )}
                {Number(item?.id) === showModal && (
                  <button
                    className="relative"
                    onClick={(e) => handleMore(e, +item?.id)}
                  >
                    <TiDeleteOutline className="text-[2.4rem] text-[#cccccc]" />
                    <div
                      ref={modalRef}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute z-10 w-52 overflow-hidden rounded-xl bg-[#fff] text-[#252424] shadow-lg"
                    >
                      <Link href={`/admin/users/edit/${item?.id}`}>
                        <div className=" flex items-center bg-white  py-3 ps-3 hover:bg-[#ccc]">
                          <CiEdit className="mr-2 text-2xl" /> Chỉnh sửa
                        </div>
                      </Link>
                      <Link href={`/admin/users/details/${item?.id}`}>
                        <div className=" flex items-center bg-white py-3 ps-3 hover:bg-[#ccc]">
                          <CiUser className="mr-2 text-2xl" /> Xem chi tiết
                        </div>
                      </Link>
                      <div
                        className="flex items-center bg-white py-3 ps-3 hover:bg-[#ccc]"
                        onClick={() => {
                          setShowDelete(true);
                        }}
                      >
                        <AiOutlineDelete className="mr-2 text-2xl" />
                        Xoá
                      </div>
                    </div>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!data && (
        <div className="w-full flex bg-[#fff5f5] justify-center items-center py-40">
          <div className="text-2xl font-medium text-[#e34343]">
            Không có dữ liệu
          </div>
        </div>
      )}
      <Modal
        title={null}
        footer={null}
        onCancel={() => setShowDelete(false)}
        open={showDelete}
      >
        <ChildDelete />
      </Modal>
    </>
  );
};

export default Table;
