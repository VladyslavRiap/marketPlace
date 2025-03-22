import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCategories,
  fetchSubcategories,
  setCategories,
} from "@/redux/slices/categorySlice";
import { RootState } from "@/redux/store";
import api from "@/utils/api";
import { ShoppingBag } from "lucide-react";
import { categoryIcons, subcategoryIcons } from "@/utils/iconutils";
import AdSlider from "@/components/AdSlider";

interface Category {
  id: number;
  name: string;
}

interface HomePageProps {
  initialCategories: Category[];
}

const HomePage: React.FC<HomePageProps> = ({ initialCategories }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, subcategories } = useAppSelector(
    (state: RootState) => state.categories
  );
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (initialCategories.length > 0) {
      dispatch(setCategories(initialCategories));
    } else {
      dispatch(fetchCategories());
    }
  }, [dispatch, initialCategories]);

  const handleCategoryClick = (categoryName: string) => {
    const url = `/products?page=1&category=${encodeURIComponent(
      categoryName
    )}&minPrice=0&maxPrice=10000&rating=&sortBy=id&order=asc`;
    router.push(url);
  };

  const handleSubcategoryClick = (
    subcategoryName: string,
    categoryId: number
  ) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const url = `/products?page=1&category=${encodeURIComponent(
      category.name
    )}&subcategory=${encodeURIComponent(
      subcategoryName
    )}&minPrice=0&maxPrice=10000&rating=&sortBy=id&order=asc`;
    router.push(url);
  };

  const handleCategoryHover = (categoryId: number) => {
    setHoveredCategoryId(categoryId);
    if (!subcategories?.[categoryId]) {
      dispatch(fetchSubcategories(categoryId));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start bg-gray-50">
      <h1 className="w-full p-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-lg font-semibold tracking-wide">
        Category
      </h1>
      <div className="flex w-full">
        <div className=" z-10 flex flex-col space-y-4 w-full max-w-xs relative">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="relative"
              onMouseEnter={() => handleCategoryHover(category.id)}
              onMouseLeave={() => setHoveredCategoryId(null)}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
                onClick={() => handleCategoryClick(category.name)}
              >
                {categoryIcons[category.name] || (
                  <ShoppingBag className="w-6 h-6 text-gray-700" />
                )}
                <p className="text-md font-medium text-gray-900">
                  {category.name}
                </p>
              </div>
              <AnimatePresence>
                {hoveredCategoryId === category.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute left-full top-0 ml-4 bg-white shadow-lg rounded-lg p-4 min-w-[200px] z-10"
                  >
                    {subcategories?.[category.id]?.length ? (
                      subcategories[category.id].map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center gap-2 py-2 text-gray-700 cursor-pointer hover:text-blue-500"
                          onClick={() =>
                            handleSubcategoryClick(
                              subcategory.name,
                              category.id
                            )
                          }
                        >
                          {subcategoryIcons[subcategory.name] || (
                            <ShoppingBag className="w-6 h-6 text-gray-700" />
                          )}
                          <p>{subcategory.name}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Нет подкатегорий</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <AdSlider />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data: initialCategories } = await api.get("/products/categories", {
      headers: { cookie: req.headers.cookie || "" },
    });
    return {
      props: { initialCategories },
    };
  } catch (error) {
    return { props: { initialCategories: [] } };
  }
};

export default HomePage;
