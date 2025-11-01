import React, { useMemo } from "react";

// Type Definitions
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const createPageNumbers = useMemo<number[]>(() => {
    if (totalPages <= 5) {
      return [...Array(totalPages)].map((_: undefined, i: number) => i + 1);
    } else if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    }
  }, [currentPage, totalPages]);

  const pageNumbers: number[] = createPageNumbers;

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-light-gray rounded-md bg-white hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed text-small"
        aria-label="Go to first page"
      >
        First
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-light-gray rounded-md bg-white hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed text-small"
        aria-label="Go to previous page"
      >
        Prev
      </button>

      {pageNumbers.map((page: number) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded-md text-small ${
            page === currentPage
              ? "bg-accent-magenta text-white border-accent-magenta hover:bg-gradient-from"
              : "bg-white border-light-gray hover:bg-cream"
          }`}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-light-gray rounded-md bg-white hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed text-small"
        aria-label="Go to next page"
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-light-gray rounded-md bg-white hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed text-small"
        aria-label="Go to last page"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
