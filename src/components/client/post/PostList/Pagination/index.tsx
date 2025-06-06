import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
const Pagination = ({ pageEdit, setLoadData, setPageEdit }: any) => {
  const handlePageChange = (pageNumber: number) => {
    setLoadData((prev: any) => prev + 1);
    setPageEdit({
      ...pageEdit,
      pageNumber: pageNumber,
    });
  };

  const renderPageNumbers = () => {
    const pageNumbers: any = [];
    const totalPage = pageEdit?.totalPage;
    const currentPage = pageEdit?.pageNumber;
    const delta = 2;

    let range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPage - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPage - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPage > 1) {
      range.push(totalPage);
    }

    range.forEach((page, index) => {
      if (page === '...') {
        pageNumbers.push(
          <span key={index} className="px-3 py-2.5 text-[1.4rem] text-slate-500">
            ...
          </span>,
        );
      } else {
        pageNumbers.push(
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            className={`w-12 mx-1 h-12 flex items-center justify-center px-3 py-2 rounded-xl text-center font-medium text-[1.4rem] transition-all duration-200 hover:shadow-md ${currentPage === page
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-white border border-indigo-100 text-slate-700 hover:border-indigo-300'
              }`}
            type="button"
          >
            {page}
          </button>,
        );
      }
    });

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center p-6 mt-4">
      <div className="flex gap-1 items-center">
        <button
          onClick={() => handlePageChange(1)}
          disabled={pageEdit?.pageNumber === 1}
          className={`flex justify-center items-center h-12 w-12 rounded-xl mr-1 transition-all duration-200 border ${pageEdit?.pageNumber === 1
            ? 'opacity-50 cursor-not-allowed border-gray-200'
            : 'border-indigo-100 hover:border-indigo-300 hover:shadow-md'
            }`}
          type="button"
        >
          <HiChevronDoubleLeft className="text-[1.8rem] text-slate-700" />
        </button>

        <button
          onClick={() => handlePageChange(pageEdit?.pageNumber - 1 || 1)}
          disabled={pageEdit?.pageNumber === 1}
          className={`flex justify-center items-center h-12 w-12 rounded-xl mr-3 transition-all duration-200 border ${pageEdit?.pageNumber === 1
            ? 'opacity-50 cursor-not-allowed border-gray-200'
            : 'border-indigo-100 hover:border-indigo-300 hover:shadow-md'
            }`}
          type="button"
        >
          <FiChevronLeft className="text-[1.8rem] text-slate-700" />
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(pageEdit?.pageNumber + 1 || 1)}
          disabled={pageEdit?.pageNumber === pageEdit?.totalPage}
          className={`flex justify-center items-center h-12 w-12 rounded-xl ml-3 transition-all duration-200 border ${pageEdit?.pageNumber === pageEdit?.totalPage
            ? 'opacity-50 cursor-not-allowed border-gray-200'
            : 'border-indigo-100 hover:border-indigo-300 hover:shadow-md'
            }`}
          type="button"
        >
          <FiChevronRight className="text-[1.8rem] text-slate-700" />
        </button>

        <button
          onClick={() => handlePageChange(pageEdit?.totalPage)}
          disabled={pageEdit?.pageNumber === pageEdit?.totalPage}
          className={`flex justify-center items-center h-12 w-12 rounded-xl ml-1 transition-all duration-200 border ${pageEdit?.pageNumber === pageEdit?.totalPage
            ? 'opacity-50 cursor-not-allowed border-gray-200'
            : 'border-indigo-100 hover:border-indigo-300 hover:shadow-md'
            }`}
          type="button"
        >
          <HiChevronDoubleRight className="text-[1.8rem] text-slate-700" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

