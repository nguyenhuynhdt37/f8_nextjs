import React, { useRef, useState, useEffect } from 'react';
import { Input } from 'antd';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  pageEdit: any;
  setPageEdit: (value: any) => void;
  setLoadData: (value: React.SetStateAction<number>) => void;
}

const Search: React.FC<SearchProps> = ({ pageEdit, setPageEdit, setLoadData }) => {
  const timeoutRef = useRef<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Initialize search term from pageEdit on component mount
  useEffect(() => {
    if (pageEdit?.searchTerm) {
      setSearchTerm(pageEdit.searchTerm);
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setPageEdit({
        ...pageEdit,
        searchTerm: value,
        pageNumber: 1
      });
      setLoadData((prev: number) => prev + 1);
    }, 500);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full md:w-80 lg:w-96">
      <Input
        prefix={<SearchIcon className="h-4 w-4 text-gray-400" />}
        placeholder="Tìm kiếm khóa học..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        allowClear
      />
    </div>
  );
};

export default Search;
