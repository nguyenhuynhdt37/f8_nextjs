import React from 'react';
import { IoSearch } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";

interface RequestsFilterProps {
    onSearch: (query: string) => void;
    onFilter: () => void;
}

const RequestsFilter: React.FC<RequestsFilterProps> = ({ onSearch, onFilter }) => {
    return (
        <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                <h1 className="text-3xl font-bold">Lời mời kết bạn</h1>
                <div className="flex gap-2">
                    <button
                        onClick={onFilter}
                        className="bg-gray-200 hover:bg-gray-300 transition-colors rounded-md px-4 py-2 flex items-center gap-2 text-lg"
                    >
                        <IoFilter size={18} />
                        <span>Lọc</span>
                    </button>
                </div>
            </div>

            <div className="relative w-full md:w-1/2">
                <input
                    type="text"
                    placeholder="Tìm kiếm lời mời"
                    className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    onChange={(e) => onSearch(e.target.value)}
                />
                <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
        </div>
    );
};

export default RequestsFilter;