import React from 'react';
import { FaCheckCircle } from "react-icons/fa";
import Tippy from '@tippyjs/react';
import { lib } from 'markdown-it/lib/common/utils.mjs';
const UserCard: React.FC<any> = ({
    data,
    type,
    onConfirm,
    onDelete
}) => {
    // console.log('data', data);
    const avatar = data?.commonFriends?.find((friend: any) => friend?.avatar)?.avatar;
    const friendsMutuals = data?.commonFriends?.reduce((acc: any, friend: any) => {
        if (friend?.fullName) {
            acc.push(friend?.fullName);
        }
        return acc;
    }, []);

    return (
        <div className="shadow-md cursor-pointer border-[0.1rem] rounded-lg overflow-hidden bg-white flex flex-col">
            {/* Image */}
            <img
                src={data?.senderAvatar}
                alt={data?.senderName}
                className="w-full h-96 object-cover" />

            {/* Info */}
            <div className='p-5'>
                <div className="flex gap-2 items-center">
                    <h3 className="font-medium text-2xl mb-1 truncate">{data?.senderName}</h3>
                    {data?.roleId === 2 && <FaCheckCircle className='text-2xl text-[#2463eb]' />}
                </div >
                <div className='h-10 relative'>
                    <Tippy
                        content={
                            <div className="flex relative flex-col">
                                {friendsMutuals.map((friend: any, index: number) => (
                                    <p key={index} className="text-lg leading-8">{friend}</p>
                                ))}
                            </div>
                        }
                        placement="bottom-start"
                        arrow={false}
                        delay={[0, 200]}
                    >
                        <div>
                            <div className="flex items-center gap-3">
                                {avatar && <img
                                    src={avatar}
                                    alt={data?.senderName}
                                    className="w-8 border-[1px] h-8 rounded-full object-cover"
                                />}
                                {friendsMutuals.length > 0 && <p className="text-lg font-semibold text-gray-800">{friendsMutuals.length || 0} bạn chung</p>}
                            </div>
                        </div>
                    </Tippy>
                </div>
                {/* Buttons - đặt ở cuối thẻ */}
                <div className="mt-auto space-y-1.5 pt-2"> {/* mt-auto đẩy nút xuống dưới */}
                    {type === 'request' && (
                        <>
                            <button
                                onClick={() => onConfirm && onConfirm(id)}
                                className="w-full text-xl py-4 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-150"
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() => onDelete && onDelete(id)}
                                className="w-full text-xl p-4 mt-5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-150 font-medium"
                            >
                                Xoá
                            </button>
                        </>
                    )}
                    {type === 'suggestion' && (
                        <>
                            <button className="w-full text-xl p-4 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition duration-150 font-semibold">
                                Add friend
                            </button>
                            <button className="w-full text-xl p-4 mt-5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-150 font-medium">
                                Remove
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default UserCard;