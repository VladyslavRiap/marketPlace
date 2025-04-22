import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCategories,
  fetchSubcategories,
  setCategories,
} from "@/redux/slices/categorySlice";
import api from "@/utils/api";
import { Category, Subcategory } from "../../types/category";
import { Menu, X } from "lucide-react";
import AdSlider from "@/components/AdSlider";
import DesktopCategoryMenu from "@/components/ui/home/DesktopCategoryMenu";
import MobileCategoryMenu from "@/components/ui/home/MobileCategoryMenu";
import { Product } from "../../types/product";
import FlashSales from "@/components/ui/home/FlashSales";
import Categories from "@/components/ui/home/Categories";
import TopSellingProducts from "@/components/ui/home/TopSellingProducts";
import ExploreOurProducts from "@/components/ui/home/ExploreOurProducts";
import FeaturesSection from "@/components/ui/home/FeaturesSection";
import AdGridSection from "@/components/ui/home/AdGridSection";

interface HomePageProps {
  initialCategories: Category[];
  discountedProducts: Product[];
  topSellingProducts: Product[];
  trendingProducts: Product[];
  initialSubcategories: Subcategory[];
  exploreProducts: {
    products: Product[];
  };
}

const HomePage: React.FC<HomePageProps> = ({
  initialCategories,
  discountedProducts,
  initialSubcategories,
  topSellingProducts,
  trendingProducts,
  exploreProducts,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, subcategories } = useAppSelector(
    (state) => state.categories
  );
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(
    null
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
  };

  const handleCategoryHover = (categoryId: number) => {
    setHoveredCategoryId(categoryId);
    if (!subcategories?.[categoryId]) {
      dispatch(fetchSubcategories(categoryId));
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setSelectedCategory(null);
    }
  };

  const handleCategoryLeave = () => {
    setHoveredCategoryId(null);
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    if (!subcategories?.[categoryId]) {
      dispatch(fetchSubcategories(categoryId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-[#DB4444] text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full font-sans">
        <MobileCategoryMenu
          isOpen={mobileMenuOpen}
          onClose={toggleMobileMenu}
          categories={categories}
          subcategories={subcategories}
          selectedCategory={selectedCategory}
          toggleCategory={toggleCategory}
          handleSubcategoryClick={handleSubcategoryClick}
        />

        <DesktopCategoryMenu
          categories={categories}
          subcategories={subcategories}
          hoveredCategoryId={hoveredCategoryId}
          handleCategoryHover={handleCategoryHover}
          handleCategoryClick={handleCategoryClick}
          handleCategoryLeave={handleCategoryLeave}
          handleSubcategoryClick={handleSubcategoryClick}
        />

        <div className="flex-1">
          <div className="p-4 lg:p-6">
            <AdSlider position="header" />
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-4">
        {" "}
        <FlashSales discountedProducts={discountedProducts} />
        <Categories categories={initialSubcategories} />
        <TopSellingProducts topSellingProducts={topSellingProducts} />
        <div className="px-2 sm:px-0">
          {" "}
          <div className="w-100% h-96">
            <AdSlider position="mainPage" />
          </div>
        </div>
        <ExploreOurProducts exploreProducts={exploreProducts} />
        <AdGridSection />
        <FeaturesSection />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const headers = { cookie: req.headers.cookie || "" };

    const [
      categoriesRes,
      discountedRes,
      topSellingRes,
      trendingRes,
      subcatgorieRes,
      exploreRes,
    ] = await Promise.all([
      api.get("/products/categories", { headers }),
      api.get("/products/discounted", { headers }),
      api.get("/products/top-selling", { headers }),
      api.get("/products/trending", { headers }),
      api.get("/products/subcategories", { headers }),
      api.get("/products", { headers }),
    ]);

    return {
      props: {
        initialCategories: categoriesRes.data,
        discountedProducts: discountedRes.data,
        topSellingProducts: topSellingRes.data,
        trendingProducts: trendingRes.data,
        initialSubcategories: subcatgorieRes.data,
        exploreProducts: exploreRes.data,
      },
    };
  } catch (error) {
    return {
      props: {
        initialCategories: [],
        discountedProducts: [],
        topSellingProducts: [],
        trendingProducts: [],
        initialSubcategories: [],
        exploreProducts: [],
      },
    };
  }
};

export default HomePage;
