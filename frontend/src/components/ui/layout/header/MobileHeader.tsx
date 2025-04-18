import Link from "next/link";
import {
  Menu,
  X,
  Bell,
  Heart,
  ShoppingCart,
  Container,
  User,
  ShoppingBag,
} from "lucide-react";
import SearchBar from "./SearchBar";

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  unreadCount: number;
  favorites: any[];
  cart: any[];
  user: any;
  mobileMenuRef: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent) => void;
  setIsSearchFocused: (focused: boolean) => void;
  isSearchFocused: boolean;
  products: any[];
  searchRef: React.RefObject<HTMLDivElement | null>;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  unreadCount,
  favorites,
  cart,
  user,
  mobileMenuRef,
  searchQuery,
  setSearchQuery,
  handleSearchKeyDown,
  setIsSearchFocused,
  isSearchFocused,
  products,
  searchRef,
}) => {
  // Check if user is a seller
  const isSeller = user?.role === "seller";

  return (
    <>
      <div className="w-full flex justify-between items-center md:hidden">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          NAME
        </Link>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchKeyDown={handleSearchKeyDown}
          setIsSearchFocused={setIsSearchFocused}
          isSearchFocused={isSearchFocused}
          products={products}
          searchRef={searchRef as React.RefObject<HTMLDivElement>}
        />
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden w-full bg-white text-gray-800 rounded-lg shadow-lg mt-3 p-4 z-20 border border-gray-200 font-sans"
        >
          <div className="flex flex-col space-y-4">
            {user && (
              <Link href="/notifications" className="relative">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            )}
            <Link
              href="/favorites"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="w-5 h-5" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="ml-auto bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Only show cart for non-seller users */}
            {!isSeller && (
              <Link
                href="/cart"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="ml-auto bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <Link
                href="/orders"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            )}

            <Link
              href={user ? "/profile" : "/register"}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              <span>{user ? "Profile" : "Sign In"}</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
