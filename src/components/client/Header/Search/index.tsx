'use client';
import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { TiDelete } from 'react-icons/ti';
const Search = () => {
  const [value, setValue] = useState<string>('');
  return (
    <div className="flex items-center border-2 px-4 text-[#7c7c7c] focus:border-[#676666] py-3 rounded-full text-[2rem]">
      <LuSearch />
      <input
        value={value}
        type="text"
        placeholder="Tìm kiếm khóa học, bài viết, video, ..."
        className="text-[1.4rem] px-4 w-[36rem] focus:outline-none"
        onChange={e => setValue(e.target.value)}
      />

      <TiDelete
        className={`cursor-pointer ${value ? 'text-[#bdbdbd]' : 'text-[#fff]'}`}
        onClick={() => setValue('')}
      />
    </div>
  );
};

export default Search;
