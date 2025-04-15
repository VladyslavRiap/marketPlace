import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Subcategory } from "../../../../types/category";
import { subcategoryIcons } from "@/utils/iconutils";

interface CategoriesProps {
  categories: Subcategory[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="lg:py-0 py-4 lg:px-0 px-4 bg-gray-50 relative pb-12 border-b border-gray-300 mb-6">
      <div className="mx-auto ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-col  gap-6">
            <div className="flex items-center  gap-2">
              <div className="w-6 h-12 bg-[#DB4444]  rounded"></div>
              <span className="text-[#DB4444] font-semibold text-lg">
                Categories
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Browse By Category
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={scrollRight}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 no-scrollbar"
          >
            <div className="flex gap-4 md:gap-6 w-max lg:w-auto px-2">
              {categories.map((category) => {
                const IconComponent = subcategoryIcons[category.name] || (
                  <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-black">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                );

                return (
                  <div
                    key={category.id}
                    className="w-[150px] md:w-[180px] flex-shrink-0 bg-white rounded-lg border border-gray-300 hover:bg-[#DB4444] group transition-colors"
                  >
                    <Link
                      href={`/products?subcategory=${encodeURIComponent(
                        category.name
                      )}`}
                      passHref
                    >
                      <div className="p-4 flex flex-col items-center h-full">
                        <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-3 md:mb-4">
                          {React.cloneElement(IconComponent, {
                            className: ` text-black group-hover:text-white`,
                          })}
                        </div>
                        <h3 className="text-sm md:text-base font-medium text-center text-black group-hover:text-white">
                          {category.name}
                        </h3>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
