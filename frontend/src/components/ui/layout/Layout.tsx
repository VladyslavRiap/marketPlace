import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector, useDebounce } from "@/redux/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { searchProducts } from "@/redux/slices/productsSlice";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const favorites = useAppSelector((state) => state.favorite.favorites);
  const cart = useAppSelector((state) => state.cart.items);
  const products = useAppSelector((state) => state.products.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(
        searchProducts({ query: debouncedSearchQuery, page: 1, limit: 10 })
      );
    }
  }, [dispatch, debouncedSearchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && debouncedSearchQuery.trim()) {
      router.push(`/products/search?query=${debouncedSearchQuery}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <motion.header
        className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-5 shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold tracking-wide">
            Marketplace
          </Link>

          <div ref={searchRef} className="relative flex-grow mx-6 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            </div>
            {isSearchFocused && products.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white text-gray-900 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="block px-4 py-3 hover:bg-blue-100 transition-all duration-200 ease-in-out"
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
                        <div className="text-sm text-gray-500">
                          {product.price} $
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="flex space-x-6">
            <Link
              href="/favorites"
              className="relative flex items-center gap-1 hover:text-gray-200 transition"
            >
              <Heart className="w-7 h-7" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-1 hover:text-gray-200 transition"
            >
              <ShoppingCart className="w-7 h-7" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link
              href={user ? "/profile" : "/register"}
              className="flex items-center gap-1 hover:text-gray-200 transition"
            >
              <User className="w-7 h-7" />
            </Link>
          </nav>
        </div>
      </motion.header>

      <motion.main
        className="flex-grow container mx-auto "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>

      <motion.footer
        className="bg-gray-900 text-gray-400 p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <p>
            &copy; {new Date().getFullYear()} Marketplace. Все права защищены.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;
