import Link from "next/link";
import { motion } from "framer-motion";

interface NavItemsProps {
  activeNav: string;
  setActiveNav: (item: string) => void;
}

const navItems = ["Home", "Contact", "Sign Up"];

const NavItems: React.FC<NavItemsProps> = ({ activeNav, setActiveNav }) => {
  return (
    <nav className="hidden md:flex items-center pl-56 space-x-8 ml-8">
      {navItems.map((item) => (
        <Link
          key={item}
          href={
            item === "Home"
              ? "/"
              : item === "Sign Up"
              ? "/login"
              : `/${item.toLowerCase()}`
          }
          className={`relative px-2 py-1 ${
            activeNav === item ? "text-gray-900" : "text-gray-700"
          } hover:text-gray-900 transition-colors`}
          onClick={() => setActiveNav(item)}
        >
          {item}
          {activeNav === item && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
              layoutId="navUnderline"
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6,
              }}
            />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
