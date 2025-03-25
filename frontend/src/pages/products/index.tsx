import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts, Product } from "@/redux/slices/productsSlice";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import ProductList from "@/components/ProductList";
import Filters from "@/components/ui/filters/Filters";
import SortSelect from "@/components/ui/filters/SortSelect";
import { useUpdateQueryParams } from "@/utils/useUpdateQueryParams";
import { Category } from "@/redux/slices/categorySlice";
import { FaSync } from "react-icons/fa";
import api from "@/utils/api";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  try {
    const [productsResponse, categoriesResponse, subcategoriesResponse] =
      await Promise.all([
        api.get("/products", { params: query }),
        api.get("/products/categories"),
        api.get("/products/subcategories"),
      ]);

    return {
      props: {
        initialProducts: productsResponse.data.products || [],
        initialTotalPages: productsResponse.data.totalPages || 1,
        initialCurrentPage: productsResponse.data.currentPage || 1,
        categories: categoriesResponse.data as Category[],
        subcategories: subcategoriesResponse.data || [],
      },
    };
  } catch (error) {
    return {
      props: {
        initialProducts: [],
        initialTotalPages: 1,
        initialCurrentPage: 1,
        categories: [],
        subcategories: [],
      },
    };
  }
};

interface HomeProps {
  initialProducts: Product[];
  initialTotalPages: number;
  initialCurrentPage: number;
  categories: Category[];
  subcategories: { id: number; name: string; category_id: number }[];
}

const Home: React.FC<HomeProps> = ({ categories, subcategories }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    items: products,
    totalPages,
    status,
  } = useAppSelector((state) => state.products);

  const [category, setCategory] = useState<string>(
    Array.isArray(router.query.category)
      ? router.query.category[0]
      : router.query.category || ""
  );

  const [subcategory, setSubcategory] = useState<string>(
    Array.isArray(router.query.subcategory)
      ? router.query.subcategory[0]
      : router.query.subcategory || ""
  );
  const currentPage = Number(
    Array.isArray(router.query.page)
      ? router.query.page[0]
      : router.query.page || 1
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(router.query.minPrice) || 0,
    Number(router.query.maxPrice) || 10000,
  ]);

  const [rating, setRating] = useState<number | null>(
    router.query.rating ? Number(router.query.rating) : null
  );

  const [sortBy, setSortBy] = useState<string>(
    Array.isArray(router.query.sortBy)
      ? router.query.sortBy[0]
      : router.query.sortBy || "id"
  );

  const [order, setOrder] = useState<string>(
    Array.isArray(router.query.order)
      ? router.query.order[0]
      : router.query.order || "asc"
  );

  const updateQueryParams = useUpdateQueryParams();

  useEffect(() => {
    updateQueryParams({
      page: currentPage,
      category,
      subcategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      rating: rating || "",
      sortBy,
      order,
    });
  }, [
    category,
    subcategory,
    priceRange,
    rating,
    sortBy,
    order,
    router.query.page,
  ]);

  useEffect(() => {
    dispatch(fetchProducts(router.query));
  }, [router.query, dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      });
    }
  };

  const resetSortBy = () => {
    setSortBy("id");
  };

  const resetOrder = () => {
    setOrder("asc");
  };

  return (
    <div className="px-6 py-12 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-900 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Products
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-6 mb-8 bg-white p-6 rounded-xl shadow-lg m-auto">
          <Filters
            category={category}
            setCategory={setCategory}
            subcategory={subcategory}
            setSubcategory={setSubcategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            rating={rating}
            setRating={setRating}
            categories={categories.map((c) => c.name)}
            subcategories={subcategories.map((c) => c.name)}
          />

          <div className="flex items-center gap-2">
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
            <button
              onClick={resetSortBy}
              className="p-2 rounded-full hover:bg-gray-400 hover:text-blue-500"
            >
              <FaSync className="hover:text-blue-500" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <SortSelect
              value={order}
              onChange={setOrder}
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
              placeholder="Order"
            />
            <button
              onClick={resetOrder}
              className="p-2 rounded-full hover:bg-gray-400 hover:text-blue-500"
            >
              <FaSync className="hover:text-blue-500" />
            </button>
          </div>
        </div>
      </motion.div>

      <ProductList
        products={products}
        status={status}
        totalPages={totalPages}
        currentPage={Number(router.query.page) || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;
