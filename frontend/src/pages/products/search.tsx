import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { searchProducts } from "@/redux/slices/productsSlice";
import ProductCard from "@/components/ProductCard";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const dispatch = useAppDispatch();
  const {
    items: searchResults,
    status,
    totalPages,
  } = useAppSelector((state) => state.products);
  const [page, setPage] = useState<number>(1);
  const limit = 12;

  useEffect(() => {
    if (query) {
      dispatch(searchProducts({ query: query as string, page, limit }));
    }
  }, [query, page, dispatch]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Search Results</h1>
      {searchResults.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded-md mx-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md mx-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No products found for "{query}"</p>
      )}
    </div>
  );
};

export default SearchPage;
