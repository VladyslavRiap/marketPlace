import { motion } from "framer-motion";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 px-4">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold">name</h3>
          <p className="mt-2">Subscribe</p>
          <p className="text-gray-400 text-sm">Get 10% off your first order</p>
          <div className="mt-4 flex border border-gray-600 rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 bg-black text-white outline-none text-sm md:text-base"
            />
            <button className="px-3 md:px-4 bg-white text-black text-sm md:text-base">
              ➜
            </button>
          </div>
        </div>

        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold">Support</h3>
          <p className="text-gray-400 text-sm mt-2">
            Lorem ipsum dolor sit amet.
          </p>
          <p className="text-gray-400 text-sm">name@gmail.com</p>
          <p className="text-gray-400 text-sm">+3809533322244</p>
        </div>

        <div className="md:col-span-1">
          <div
            className="flex justify-between items-center md:block cursor-pointer md:cursor-auto"
            onClick={() => toggleSection("account")}
          >
            <h3 className="text-lg font-semibold">Account</h3>
            <ChevronDown
              className={`md:hidden transition-transform ${
                openSection === "account" ? "rotate-180" : ""
              }`}
            />
          </div>
          <ul
            className={`mt-2 space-y-2 ${
              openSection === "account" ? "block" : "hidden md:block"
            }`}
          >
            <li>
              <Link
                href="/profile"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                My Account
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                Login / Register
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                Shop
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-1">
          <div
            className="flex justify-between items-center md:block cursor-pointer md:cursor-auto"
            onClick={() => toggleSection("quicklink")}
          >
            <h3 className="text-lg font-semibold">Quick Link</h3>
            <ChevronDown
              className={`md:hidden transition-transform ${
                openSection === "quicklink" ? "rotate-180" : ""
              }`}
            />
          </div>
          <ul
            className={`mt-2 space-y-2 ${
              openSection === "quicklink" ? "block" : "hidden md:block"
            }`}
          >
            <li>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                Terms Of Use
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold">Download App</h3>
          <p className="text-gray-400 text-sm mt-2">
            Save $3 with App New User Only
          </p>
          <div className="mt-2 flex flex-col space-y-2">
            <Link
              href="https://play.google.com"
              target="_blank"
              className="w-28"
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/012/871/364/non_2x/google-play-store-download-button-in-white-colors-download-on-the-google-play-store-free-png.png"
                alt="Google Play"
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <Link
              href="https://www.apple.com/app-store/"
              target="_blank"
              className="w-28"
            >
              <img
                src="https://w7.pngwing.com/pngs/22/912/png-transparent-app-store-iphone-google-play-supermarket-promotion-text-logo-monochrome.png"
                alt="App Store"
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          <div className="flex space-x-4 mt-4 text-gray-400">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 mt-6 pt-4 text-center text-gray-400 text-sm">
        © Copyright 2025. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
