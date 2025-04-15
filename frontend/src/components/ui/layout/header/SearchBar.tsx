import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent) => void;
  setIsSearchFocused: (focused: boolean) => void;
  isSearchFocused: boolean;
  products: any[];
  searchRef: React.RefObject<HTMLDivElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearchKeyDown,
  setIsSearchFocused,
  isSearchFocused,
  products,
  searchRef,
}) => {
  return (
    <div
      ref={searchRef}
      className="relative  w-1/2 lg:w-full md:flex-grow md:mx-6  md:mt-0 max-w-lg "
    >
      <div className="relative">
        <input
          type="text"
          placeholder="What are you looking for?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => setIsSearchFocused(true)}
          className="w-full pl-10 pr-4 py-1  text-sm  lg:py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 "
        />
        <Search className="absolute left-3 lg:top-2.5 top-2 text-gray-400 w-5 h-5" />
      </div>
      {isSearchFocused && products.length > 0 && (
        <div className="absolute lg:top-12  left-0 right-0 bg-white text-gray-900 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block px-4 py-3 hover:bg-gray-100 transition-all duration-200 ease-in-out"
              onClick={() => setIsSearchFocused(false)}
            >
              <div className="flex items-center">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/placeholder.png"
                  }
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md mr-3"
                />
                <div>
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.price} $</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
