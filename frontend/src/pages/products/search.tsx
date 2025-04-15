import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { searchProducts } from "@/redux/slices/productsSlice";
import ProductList from "@/components/ProductList";
import api from "@/utils/api";

import SortSelect from "@/components/ui/filters/SortSelect";
import { useUpdateQueryParams } from "@/utils/useUpdateQueryParams";
import { Search } from "lucide-react";
import Head from "next/head";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { Product } from "../../../types/product";

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
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { favorites } = useAppSelector((state) => state.favorite);
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
      updateQueryParams({ page: newPage, query });
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product.id));
  };

  const handleToggleFavorite = (product: Product) => {
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product.id));
    }
  };

  const isInCart = (productId: number) => {
    return cartItems.some((item) => item.id === productId);
  };

  const isFavorite = (productId: number) => {
    return favorites.some((fav) => fav.id === productId);
  };

  return (
    <>
      <Head>
        <title>Search results: {query}</title>
        <meta name="description" content={`Search results for ${query}`} />
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Search className="w-6 h-6 text-gray-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">
              Search results: "{query}"
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-row gap-4 justify-between items-center">
              <div className="w-full sm:w-auto">
                <SortSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: "name", label: "By name" },
                    { value: "price", label: "By price" },
                    { value: "rating", label: "By rating" },
                  ]}
                  placeholder="Sort by"
                />
              </div>

              <div className="w-full sm:w-auto">
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
            </div>
          </div>

          <ProductList
            products={products}
            status={status}
            totalPages={totalPages}
            currentPage={Number(router.query.page) || 1}
            onPageChange={handlePageChange}
            cardSize="medium"
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            isInCart={isInCart}
            isFavorite={isFavorite}
          />
        </div>
      </div>
    </>
  );
};

export default SearchPage;
