import React from 'react';
// Cài đặt react-icons: npm install react-icons
import SidebarItem from './SidebarItem';
import { FaUserFriends } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
interface SidebarItemProps {
    activeTab: number;
    setActiveTab: (tab: number) => void;
}
const Sidebar: React.FC<SidebarItemProps> = ({ activeTab, setActiveTab }) => {
    // Dữ liệu mẫu cho sidebar items
    const sidebarItems = [
        { icon: FaUserFriends, text: 'Trang chủ', id: 0, active: true },
        { icon: FaUserPlus, text: 'Lời mời kết bạn', id: 1, hasMore: true },
        { icon: FaUserCheck, text: 'Gợi ý kết bạn', id: 2, hasMore: true },
        { icon: FaUsers, text: 'Tất cả bạn bè', id: 3, hasMore: true },
        { icon: FaBirthdayCake, text: 'Sinh nhật', id: 4 },
        { icon: FaUserCheck, text: 'Custom lists', id: 5, hasMore: true },
    ];

    return (
        < div className="w-70 md:w-[35rem] border-r-[0.1px] bg-white h-screen sticky top-[6.5rem] p-4 shadow-sm hidden md:flex md:flex-col" >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-2" >
                <h1 className="text-3xl font-bold">Bạn bè</h1>
            </div >

            {/* Navigation */}
            <nav className="flex-1" >
                <ul>
                    {sidebarItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            <SidebarItem
                                icon={item.icon}
                                text={item.text}
                                id={item.id}
                                active={item.active}
                                hasMore={item.hasMore}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </li>
                    ))}
                </ul>
            </nav >

            {/* Footer or other elements if needed */}
            {/* <div className="mt-auto"> ... </div> */}
        </div >
    );
};

export default Sidebar;