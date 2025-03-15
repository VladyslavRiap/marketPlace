import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Product } from "@/redux/slices/productsSlice";
import ProductCard from "@/components/ProductCard";
import api from "@/utils/api";
import Slider from "@mui/material/Slider";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  Select,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronsUpDown } from "lucide-react";

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
        categories: categoriesResponse.data || [],
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
  categories: string[];
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
  const [category, setCategory] = useState(router.query.category || "");
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(router.query.minPrice) || 0,
    Number(router.query.maxPrice) || 10000,
  ]);
  const [rating, setRating] = useState<number | null>(
    router.query.rating ? Number(router.query.rating) : null
  );
  const [sortBy, setSortBy] = useState(router.query.sortBy || "id");
  const [order, setOrder] = useState(router.query.order || "asc");

  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", (currentPage || 1).toString());

    if (category) queryParams.set("category", category as string);
    if (priceRange) {
      queryParams.set("minPrice", priceRange[0].toString());
      queryParams.set("maxPrice", priceRange[1].toString());
    }
    if (rating) queryParams.set("rating", rating.toString());
    if (sortBy) queryParams.set("sortBy", sortBy as string);
    if (order) queryParams.set("order", order as string);

    router.replace(
      { pathname: "/products/", query: queryParams.toString() },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    updateQueryParams();
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

  const handleStarClick = (starValue: number) => {
    setRating((prevRating) => (prevRating === starValue ? null : starValue));
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
        className="flex flex-wrap gap-6 mb-8 justify-between bg-white p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Listbox value={category} onChange={setCategory}>
          <div className="relative w-64 z-10">
            <ListboxButton className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="block truncate">
                {category || "All Categories"}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              <ListboxOption
                value=""
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                All Categories
              </ListboxOption>
              {categories.map((cat: any) => (
                <ListboxOption
                  key={cat.id}
                  value={cat.name}
                  className={({ active }) =>
                    `p-3 cursor-pointer ${
                      active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                    }`
                  }
                >
                  {cat.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        <div className="flex flex-col items-center">
          <span className="text-lg font-medium text-gray-700">Price Range</span>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            sx={{ width: 250 }}
          />
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-2xl transition duration-200 ease-in-out ${
                star <= (rating || 0)
                  ? "text-yellow-500"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        <Listbox value={sortBy} onChange={setSortBy}>
          <div className="relative w-48 z-10">
            <ListboxButton className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="block truncate">{sortBy || "Sort By"}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              <ListboxOption
                value="new"
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                New
              </ListboxOption>
              <ListboxOption
                value="name"
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                Name
              </ListboxOption>
              <ListboxOption
                value="price"
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                Price
              </ListboxOption>
              <ListboxOption
                value="rating"
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                Rating
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>

        <Listbox value={order} onChange={setOrder}>
          <div className="relative w-48 z-10">
            <ListboxButton className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="block truncate">
                {order === "asc" ? "Ascending" : "Descending"}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              <ListboxOption
                value="asc"
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                Ascending
              </ListboxOption>
              <ListboxOption
                value="desc"
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                Descending
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </motion.div>

      {products?.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center justify-center w-full h-[50vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-3xl font-semibold text-gray-800 text-center">
            No products found
          </p>
        </motion.div>
      )}

      {products?.length > 0 && (
        <motion.div
          className="flex justify-center mt-8 space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 disabled:bg-indigo-200 transition duration-200"
          >
            Previous
          </button>
          <span className="px-6 py-3 text-lg font-medium text-gray-800">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 disabled:bg-indigo-200 transition duration-200"
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
