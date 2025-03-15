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
  return (
    <div className="flex justify-center mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
