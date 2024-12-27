import React from 'react';
import { HiOutlineFilter } from 'react-icons/hi';
const Filter = () => {
  return (
    <button className="flex items-center px-10 py-3 bg-[#fff] rounded-2xl shadow-md mr-5">
      <HiOutlineFilter className="mr-2" />
      Lọc
    </button>
  );
};

export default Filter;
