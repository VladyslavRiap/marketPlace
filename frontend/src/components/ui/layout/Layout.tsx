import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector, useDebounce } from "@/redux/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { searchProducts } from "@/redux/slices/productsSlice";

import MobileHeader from "./header/MobileHeader";
import DesktopHeader from "./header/DesktopHeader";

import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const favorites = useAppSelector((state) => state.favorite.favorites);
  const cart = useAppSelector((state) => state.cart.items);
  const products = useAppSelector((state) => state.products.items);
  const unreadCount = useAppSelector(
    (state) => state.notifications.unreadCount
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  useEffect(() => {
    const path = router.pathname;
    if (path === "/") setActiveNav("Home");
    else if (path === "/contact") setActiveNav("Contact");
    else if (path === "/login") setActiveNav("Sign Up");
  }, [router.pathname]);

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
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <motion.header
        className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <MobileHeader
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            unreadCount={unreadCount}
            favorites={favorites}
            cart={cart}
            user={user}
            mobileMenuRef={mobileMenuRef as React.RefObject<HTMLDivElement>}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchKeyDown={handleSearchKeyDown}
            setIsSearchFocused={setIsSearchFocused}
            isSearchFocused={isSearchFocused}
            products={products}
            searchRef={searchRef}
          />

          <DesktopHeader
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            unreadCount={unreadCount}
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
            favorites={favorites}
            cart={cart}
            user={user}
            notificationRef={notificationRef as React.RefObject<HTMLDivElement>}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchKeyDown={handleSearchKeyDown}
            setIsSearchFocused={setIsSearchFocused}
            isSearchFocused={isSearchFocused}
            products={products}
            searchRef={searchRef}
          />
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

      <Footer />
    </div>
  );
};

export default Layout;
