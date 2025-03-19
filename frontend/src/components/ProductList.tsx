import { Product } from "@/redux/slices/productsSlice";
import ProductCard from "@/components/ui/cards/ProductCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductListProps {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  limit?: number;
}

const ProductList = ({
  products,
  status,
  totalPages,
  currentPage,
  onPageChange,
  limit = 12,
}: ProductListProps) => {
  return (
    <>
      {status === "loading" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Skeleton height={200} className="w-full" />
              <div className="p-4">
                <Skeleton count={2} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="ml-2">Previous</span>
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <span className="mr-2">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found</p>
              <p className="text-gray-500 mt-2">Try a different search term.</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductList;
