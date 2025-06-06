import React, { useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchProps {
  pageEdit: any;
  setPageEdit: React.Dispatch<React.SetStateAction<any>>;
  setLoadData: React.Dispatch<React.SetStateAction<number>>;
}

const Search: React.FC<SearchProps> = ({ pageEdit, setPageEdit, setLoadData }) => {
  const timeoutRef = useRef<number | null>(null);
  const [data, setData] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setPageEdit({
        ...pageEdit,
        searchTerm: value,
        pageNumber: 1,
        totalPage: 1,
        totalCount: 0,
      });
      setLoadData((prev: number) => prev + 1);
    }, 500);
  };

  return (
    <div className="relative flex-grow max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên chương..."
        value={data}
        onChange={handleSearch}
        className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
};

export default Search;
