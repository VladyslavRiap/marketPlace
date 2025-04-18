import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  Heart,
  ShoppingCart,
  Container,
  User,
  ChevronDown,
  ShoppingBag,
  Star,
  LogOut,
} from "lucide-react";
import NotificationList from "@/components/ui/Notifications/NotificationList";
import NavItems from "./NavItems";
import SearchBar from "./SearchBar";
import { useAppDispatch } from "@/redux/hooks";
import { useRef, useState } from "react";
import { clearCartRedux } from "@/redux/slices/cartSlice";
import { logoutUser } from "@/redux/slices/authSlice";
import router, { useRouter } from "next/router";
import { clearFavorites } from "@/redux/slices/favoriteSlice";
import { usePathname } from "next/navigation";

interface DesktopHeaderProps {
  activeNav: string;
  setActiveNav: (item: string) => void;
  unreadCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  favorites: any[];
  cart: any[];
  user: any;
  notificationRef: React.RefObject<HTMLDivElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent) => void;
  setIsSearchFocused: (focused: boolean) => void;
  isSearchFocused: boolean;
  products: any[];
  searchRef: React.RefObject<HTMLDivElement | null>;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeNav,
  setActiveNav,
  unreadCount,
  isNotificationOpen,
  setIsNotificationOpen,
  favorites,
  cart,
  user,
  notificationRef,
  searchQuery,
  setSearchQuery,
  handleSearchKeyDown,
  setIsSearchFocused,
  isSearchFocused,
  products,
  searchRef,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = router.pathname;
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCartRedux());
    dispatch(clearFavorites());
    router.push("/login");
    setIsProfileMenuOpen(false);
  };

  const isSeller = user?.role === "seller";

  return (
    <div className="hidden lg:flex lg:justify-between md:flex items-center w-full font-sans ">
      <div className="flex items-center ">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          NAME
        </Link>
        <NavItems activeNav={activeNav} setActiveNav={setActiveNav} />
      </div>

      <div className="flex-grow mx-6 max-w-md">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchKeyDown={handleSearchKeyDown}
          setIsSearchFocused={setIsSearchFocused}
          isSearchFocused={isSearchFocused}
          products={products}
          searchRef={searchRef as React.RefObject<HTMLDivElement>}
        />
      </div>

      <div className="hidden md:flex items-center space-x-6">
        {user && (
          <div
            ref={notificationRef}
            className={`relative p-0.5 hover:text-[#E07575] rounded-full ${
              pathname === "/notifications" ? "bg-[#DB4444]" : ""
            }`}
          >
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-1 hover:text-[#E07575]"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-20 text-gray-800 w-72 border border-gray-200">
                <NotificationList
                  isDropdown
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>
            )}
          </div>
        )}
        <Link
          href="/favorites"
          className={`relative p-2 hover:text-[#E07575] rounded-full ${
            pathname === "/favorites" ? "bg-[#DB4444]" : ""
          }`}
        >
          <Heart className="w-6 h-6" />
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Link>

        {!isSeller && (
          <Link
            href="/cart"
            className={`relative p-2 hover:text-[#E07575] rounded-full ${
              pathname === "/cart" ? "bg-[#DB4444]" : ""
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        )}

        {user && (
          <div
            ref={profileMenuRef}
            className={`relative p-2 hover:text-[#E07575] rounded-full ${
              pathname === "/profile" ? "bg-[#DB4444]" : ""
            }`}
          >
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-1 p-1 hover:text-[#E07575]"
            >
              <User className="w-6 h-6" />
              <ChevronDown className="w-4 h-4" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-gray-400/80 to-gray-900/80 rounded-lg p-4 shadow-lg backdrop-blur-md  py-1 z-20 border border-gray-200 font-sans">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-white hover:text-[#E07575] "
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center px-4 py-2 text-sm text-white hover:text-[#E07575]"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Orders
                </Link>

                <Link
                  href="/reviews"
                  className="flex items-center px-4 py-2 text-sm text-white hover:text-[#E07575]"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  My Reviews
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-white  hover:text-[#E07575]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopHeader;
