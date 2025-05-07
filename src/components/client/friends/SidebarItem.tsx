import React from 'react';
import { IconType } from 'react-icons'; // Cần cài react-icons
import { IoChevronForward } from "react-icons/io5";

interface SidebarItemProps {
    icon: IconType;
    text: string;
    id: number;
    active?: boolean;
    hasMore?: boolean;
    activeTab: number;
    setActiveTab: (tab: number) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ activeTab, setActiveTab, icon: Icon, text, id, active = false, hasMore = false }) => {
    const activeClasses = activeTab == id ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100';
    const handleClick = () => {
        setActiveTab(id);
    }
    return (
        <button
            disabled={activeTab == id}
            onClick={handleClick}
            className={`flex w-full items-center justify-between p-4 rounded-md text-xl text-gray-800 ${activeTab == id ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'} ${activeClasses} transition duration-150 ease-in-out`}
        >
            <div className="flex items-center space-x-3">
                <Icon size={20} className={activeTab === id ? 'text-blue-600' : 'text-gray-600'} />
                <span>{text}</span>
            </div>
            {hasMore && <IoChevronForward className="text-gray-500" />}
        </button>
    );
};

export default SidebarItem;