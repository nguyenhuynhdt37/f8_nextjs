import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
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
            className={`w-14 mx-2 h-10 flex items-center justify-center px-3 py-2.5 rounded-xl text-center font-semibold transition-all hover:opacity-75 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
              currentPage === page ? "bg-[#f05123] text-[#fff]" : ""
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
    <div className="flex items-center justify-center p-3">
      <div className="flex gap-1">
        <button
          onClick={() => handlePageChange(pageEdit?.pageNumber - 1 || 1)}
          disabled={pageEdit?.pageNumber === 1}
          className={`flex mr-3 justify-center items-center text-[#000] ${
            pageEdit?.pageNumber === 1 ? "opacity-30" : ""
          }`}
          type="button"
        >
          <HiChevronDoubleLeft />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(pageEdit?.pageNumber + 1 || 1)}
          disabled={pageEdit?.pageNumber === pageEdit?.totalPage}
          className={`flex justify-center ms-3 items-center text-[#000] ${
            pageEdit?.pageNumber === pageEdit?.totalPage ? "opacity-30" : ""
          }`}
          type="button"
        >
          <HiChevronDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
