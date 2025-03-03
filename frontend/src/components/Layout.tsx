import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { fetchUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";

import { Search } from "lucide-react";
import { Product } from "@/redux/slices/productsSlice";
import api from "@/utils/api";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const favorites = useAppSelector((state) => state.favorite.favorites);
  const cart = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        api
          .get("/products/search", {
            params: { query: searchQuery },
          })
          .then((response) => setSearchResults(response.data))
          .catch((error) =>
            console.error("Ошибка при поиске продуктов:", error)
          );
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products/search?query=${searchQuery}`);
      setSearchQuery("");
      setSearchResults([]);
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
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  const handleSearchItemClick = () => {
    setIsSearchFocused(false);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <motion.header
        className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide">Marketplace</h1>

          <div ref={searchRef} className="relative flex-grow mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск продуктов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            </div>
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white text-gray-900 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="block px-4 py-3 hover:bg-blue-100 transition-all duration-200 ease-in-out"
                    onClick={handleSearchItemClick}
                  >
                    <div className="flex items-center">
                      <Image
                        src={product.image_url || "/placeholder.png"}
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

          <nav>
            <ul className="flex space-x-6">
              <li className="relative">
                <Link href="/favorites" className="hover:underline">
                  Favorites
                  {favorites.length > 0 && (
                    <span className="absolute bottom-4 left-14 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">
                  Products
                </Link>
              </li>
              <li className="relative">
                <Link href="/cart" className="hover:underline">
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                {user ? (
                  <Link href="/profile" className="hover:underline">
                    Profile
                  </Link>
                ) : (
                  <Link href="/register" className="hover:underline">
                    Sign In / Register
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </motion.header>

      <motion.main
        className="flex-grow container mx-auto p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>

      <motion.footer
        className="bg-gray-900 text-gray-300 p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <p>&copy; Marketplace. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;
