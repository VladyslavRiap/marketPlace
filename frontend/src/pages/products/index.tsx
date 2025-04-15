import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/redux/slices/productsSlice";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import ProductList from "@/components/ProductList";
import Filters from "@/components/ui/filters/Filters";
import SortSelect from "@/components/ui/filters/SortSelect";
import { useUpdateQueryParams } from "@/utils/useUpdateQueryParams";
import { Category } from "@/redux/slices/categorySlice";
import { FaFilter, FaSync } from "react-icons/fa";
import api from "@/utils/api";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { Product } from "../../../types/product";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { favorites } = useAppSelector((state) => state.favorite);
  const { showMessage } = useSnackbarContext();
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
  const filtersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileFiltersOpen &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setMobileFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileFiltersOpen]);
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);

    if (newCategory === "") {
      setSubcategory("");
    }
  };
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileFiltersOpen]);

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
  }, [category, subcategory, priceRange, rating, sortBy, order, currentPage]);

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
  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart(product.id)).unwrap();
      showMessage("Product added to cart", "success");
    } catch (error) {
      showMessage("Failed to add to cart", "error");
    }
  };

  const handleToggleFavorite = async (product: Product) => {
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(product.id)).unwrap();
        showMessage("Product removed from favorites", "info");
      } else {
        await dispatch(addToFavorites(product.id)).unwrap();
        showMessage("Product added to favorites", "success");
      }
    } catch (error) {
      showMessage("An error occurred", "error");
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
        <title>Product Catalog</title>
        <meta name="description" content="Wide selection of products" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900"
            >
              Catalog
            </motion.h1>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="p-2 rounded-lg bg-indigo-600 text-white flex items-center gap-2"
            >
              <FaFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <motion.div
              ref={filtersRef}
              initial={{ opacity: 0, x: 0 }}
              animate={{
                opacity: 1,
                x: mobileFiltersOpen
                  ? 0
                  : typeof window !== "undefined" && window.innerWidth < 1024
                  ? -320
                  : 0,
              }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-y-0 left-0 w-full z-50
    lg:static lg:z-auto lg:w-72
    bg-white p-6 overflow-y-auto
    ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}
            >
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <Filters
                category={category}
                setCategory={handleCategoryChange}
                subcategory={subcategory}
                setSubcategory={setSubcategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                rating={rating}
                setRating={setRating}
                categories={categories.map((c) => c.name)}
                subcategories={subcategories.map((c) => c.name)}
              />
            </motion.div>

            <div
              className={`flex-1  ${
                mobileFiltersOpen ? "hidden lg:block" : "block"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 justify-between items-center"
              >
                <div className="text-sm text-gray-600">
                  Found: {products.length} products
                </div>
                <div className="flex gap-4">
                  <div className="w-40">
                    <SortSelect
                      value={sortBy}
                      onChange={setSortBy}
                      options={[
                        { value: "name", label: "By Name" },
                        { value: "price", label: "By Price" },
                        { value: "rating", label: "By Rating" },
                      ]}
                      placeholder="Sort"
                    />
                  </div>
                  <div className="w-40">
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
              </motion.div>

              <ProductList
                products={products}
                status={status}
                totalPages={totalPages}
                currentPage={Number(router.query.page) || 1}
                onPageChange={handlePageChange}
                cardSize="medium"
                onAddToCart={(product) => handleAddToCart(product)}
                onToggleFavorite={(product) => handleToggleFavorite(product)}
                isInCart={isInCart}
                isFavorite={isFavorite}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
