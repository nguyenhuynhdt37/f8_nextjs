import React, { useRef, useState } from 'react';

const Search = ({ pageEdit, setPageEdit, setLoadData }: any) => {
  const timeoutRef = useRef<number | null>(null);
  const [data, setData] = useState<string>('');
  const handleSearch = (e: any) => {
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
    }, 700);
  };
  return (
    <input
      onChange={handleSearch}
      value={data}
      className="w-[40rem] border-2 border-[#b1c6da] focus:border-[#3084d6] px-5 py-2 focus:outline-none  rounded-2xl"
      placeholder="Tìm kiếm theo tên bài học"
    />
  );
};

export default Search;
