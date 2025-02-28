import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { fetchUser } from "@/redux/slices/authSlice";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
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
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:underline">
                  Cart
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
