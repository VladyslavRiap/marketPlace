import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { searchProducts } from "@/redux/slices/productsSlice";
import ProductList from "@/components/ProductList";
import api from "@/utils/api";
import { Product } from "@/redux/slices/productsSlice";
import SortSelect from "@/components/ui/filters/SortSelect";
import Pagination from "@/components/Pagination";
import { useUpdateQueryParams } from "@/utils/useUpdateQueryParams";

interface SearchPageProps {
  initialProducts: Product[];
  initialTotalPages: number;
  initialCurrentPage: number;
  query: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const searchQuery = (query.query as string) || "";
  const page = parseInt(query.page as string) || 1;
  const limit = 12;
  const sortBy = (query.sortBy as string) || "name";
  const order = (query.order as string) || "asc";

  try {
    const response = await api.get("/products/search", {
      params: {
        query: searchQuery,
        page,
        limit,
        sortBy,
        order,
      },
    });

    return {
      props: {
        initialProducts: response.data.products || [],
        initialTotalPages: response.data.totalPages || 1,
        initialCurrentPage: response.data.currentPage || 1,
        query: searchQuery,
      },
    };
  } catch (error) {
    return {
      props: {
        initialProducts: [],
        initialTotalPages: 1,
        initialCurrentPage: 1,
        query: searchQuery,
      },
    };
  }
};

const SearchPage: React.FC<SearchPageProps> = ({
  initialProducts,
  initialTotalPages,
  initialCurrentPage,
  query,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: searchResults, status } = useAppSelector(
    (state) => state.products
  );
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [sortBy, setSortBy] = useState<string>(
    Array.isArray(router.query.sortBy)
      ? router.query.sortBy[0]
      : router.query.sortBy || "name"
  );

  const [order, setOrder] = useState<string>(
    Array.isArray(router.query.order)
      ? router.query.order[0]
      : router.query.order || "asc"
  );

  const updateQueryParams = useUpdateQueryParams();

  useEffect(() => {
    if (query) {
      dispatch(
        searchProducts({
          query: query as string,
          page: currentPage,
          limit: 12,
          sortBy: sortBy as string,
          order: order as string,
        })
      );
    }
  }, [query, currentPage, sortBy, order, dispatch]);

  useEffect(() => {
    setProducts(searchResults);
    setTotalPages(initialTotalPages);
    setCurrentPage(initialCurrentPage);
  }, [searchResults, initialTotalPages, initialCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      updateQueryParams({ page: newPage });
    }
  };

  useEffect(() => {
    updateQueryParams({ sortBy, order, page: currentPage });
  }, [sortBy, order, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Search Results</h1>

      <div className="flex flex-wrap gap-6 mb-8 justify-between bg-white p-6 rounded-xl shadow-lg">
        <SortSelect
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: "name", label: "Name" },
            { value: "price", label: "Price" },
            { value: "rating", label: "Rating" },
          ]}
          placeholder="Sort By"
        />

        <SortSelect
          value={order}
          onChange={setOrder}
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          placeholder="Order"
        />
      </div>

      <ProductList
        products={products}
        status={status}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SearchPage;
