import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Product } from "@/redux/slices/productsSlice";
import api from "@/utils/api";
import { motion } from "framer-motion";
import ProductList from "@/components/ProductList";
import Filters from "@/components/ui/filters/Filters";
import SortSelect from "@/components/ui/filters/SortSelect";

import { useUpdateQueryParams } from "@/utils/useUpdateQueryParams";
import { Category } from "@/redux/slices/categorySlice";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      api.get("/products", { params: query }),
      api.get("/products/categories"),
    ]);

    return {
      props: {
        initialProducts: productsResponse.data.products || [],
        initialTotalPages: productsResponse.data.totalPages || 1,
        initialCurrentPage: productsResponse.data.currentPage || 1,
        categories: categoriesResponse.data as Category[],
      },
    };
  } catch (error) {
    return {
      props: {
        initialProducts: [],
        initialTotalPages: 1,
        initialCurrentPage: 1,
        categories: [],
      },
    };
  }
};

interface HomeProps {
  initialProducts: Product[];
  initialTotalPages: number;
  initialCurrentPage: number;
  categories: Category[];
}

const Home: React.FC<HomeProps> = ({
  initialProducts,
  initialTotalPages,
  initialCurrentPage,
  categories,
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [category, setCategory] = useState<string>(
    Array.isArray(router.query.category)
      ? router.query.category[0]
      : router.query.category || ""
  );

  const [priceRange, setPriceRange] = useState<number[]>([
    Number(
      Array.isArray(router.query.minPrice)
        ? router.query.minPrice[0]
        : router.query.minPrice
    ) || 0,
    Number(
      Array.isArray(router.query.maxPrice)
        ? router.query.maxPrice[0]
        : router.query.maxPrice
    ) || 10000,
  ]);

  const [rating, setRating] = useState<number | null>(
    router.query.rating
      ? Number(
          Array.isArray(router.query.rating)
            ? router.query.rating[0]
            : router.query.rating
        )
      : null
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
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      rating: rating || "",
      sortBy,
      order,
    });
  }, [category, priceRange, rating, sortBy, order, currentPage]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const { data } = await api.get("/products", { params: router.query });
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchFilteredProducts();
  }, [router.query]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
        <div className="flex flex-wrap gap-6 mb-8 justify-between bg-white p-6 rounded-xl shadow-lg m-auto ">
          <Filters
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            rating={rating}
            setRating={setRating}
            categories={categories.map((c) => c.name)}
          />

          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "name", label: "Name" },
              { value: "price", label: "Price" },
              { value: "rating", label: "Rating" },
            ]}
            placeholder="Order"
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
      </motion.div>

      <ProductList
        products={products}
        status={products.length > 0 ? "succeeded" : "idle"}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;
