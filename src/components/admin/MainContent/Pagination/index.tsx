import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
      range.unshift("...");
    }
    if (currentPage + delta < totalPage - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPage > 1) {
      range.push(totalPage);
    }

    range.forEach((page, index) => {
      if (page === "...") {
        pageNumbers.push(
          <span key={index} className="px-3 py-2.5">
            ...
          </span>
        );
      } else {
        pageNumbers.push(
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            className={`w-10 mx-2 h-10 flex items-center justify-center px-3 py-2.5 rounded-full text-center font-semibold transition-all hover:opacity-75 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
              currentPage === page ? "bg-[#3084d6] text-[#fff]" : ""
            }`}
            type="button"
          >
            {page}
          </button>
        );
      }
    });

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between p-3">
      <p className="block text-slate-500">{`Page ${pageEdit?.pageNumber} of ${pageEdit?.totalPage}`}</p>
      <div className="flex gap-1">
        <button
          onClick={() => handlePageChange(pageEdit?.pageNumber - 1 || 1)}
          disabled={pageEdit?.pageNumber === 1}
          className={`w-10 h-10 mx-2 bg-[#3084d6] rounded-full flex justify-center items-center text-[#fff] ${
            pageEdit?.pageNumber === 1 ? "bg-[#999] opacity-25" : ""
          }`}
          type="button"
        >
          <FiChevronLeft />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(pageEdit?.pageNumber + 1 || 1)}
          disabled={pageEdit?.pageNumber === pageEdit?.totalPage}
          className={`w-10 h-10 px-2 bg-[#3084d6] rounded-full flex justify-center items-center text-[#fff] ${
            pageEdit?.pageNumber === pageEdit?.totalPage
              ? "bg-[#999] opacity-25"
              : ""
          }`}
          type="button"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
