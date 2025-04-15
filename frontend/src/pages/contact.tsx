import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Category } from "../../types/category";
import { Phone, Mail, Home, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ContactPageProps {
  initialCategories: Category[];
}

const ContactPage: React.FC<ContactPageProps> = ({ initialCategories }) => {
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  const handleFocus = (field: keyof typeof focusedFields) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field: keyof typeof focusedFields, value: string) => {
    if (!value) {
      setFocusedFields({ ...focusedFields, [field]: false });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Contact our support team 24/7" />
      </Head>

      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-[#DB4444]">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#DB4444]">Contact Us</span>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-8 space-y-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-[#DB4444] text-white p-3 rounded-full flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-xl">Call To Us</h2>
                <p className="text-gray-600 text-lg">
                  We are available 24/7, 7 days a week.
                </p>
                <p className="font-medium mt-2">
                  Phone:{" "}
                  <a
                    href="tel:++3809533322244"
                    className="text-[#DB4444] hover:underline"
                  >
                    +3809533322244
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-gray-200 pt-6">
              <div className="bg-[#DB4444] text-white p-3 rounded-full flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-xl">Write To Us</h2>
                <p className="text-gray-600 text-lg mb-2">
                  Fill out our form and we will contact you within 24 hours.
                </p>
                <p className="text-sm">
                  Email:{" "}
                  <a
                    href="mailto:customer@name.com"
                    className="text-[#DB4444] hover:underline"
                  >
                    customer@name.com
                  </a>
                </p>
                <p className="text-sm mt-1">
                  Email:{" "}
                  <a
                    href="mailto:support@name.com"
                    className="text-[#DB4444] hover:underline"
                  >
                    support@name.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative">
                  <label
                    className={`absolute left-0 transition-all duration-200 ${
                      focusedFields.name
                        ? "text-xs -top-5 text-gray-600"
                        : "text-sm top-3 text-gray-400"
                    }`}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 focus:border-[#DB4444] focus:outline-none"
                    onFocus={() => handleFocus("name")}
                    onBlur={(e) => handleBlur("name", e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label
                    className={`absolute left-0 transition-all duration-200 ${
                      focusedFields.email
                        ? "text-xs -top-5 text-gray-600"
                        : "text-sm top-3 text-gray-400"
                    }`}
                  >
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 focus:border-[#DB4444] focus:outline-none"
                    onFocus={() => handleFocus("email")}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label
                    className={`absolute left-0 transition-all duration-200 ${
                      focusedFields.phone
                        ? "text-xs -top-5 text-gray-600"
                        : "text-sm top-3 text-gray-400"
                    }`}
                  >
                    Your Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 focus:border-[#DB4444] focus:outline-none"
                    onFocus={() => handleFocus("phone")}
                    onBlur={(e) => handleBlur("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="relative pt-4">
                <label
                  className={`absolute left-0 transition-all duration-200 ${
                    focusedFields.message
                      ? "text-xs -top-1 text-gray-600"
                      : "text-sm top-6 text-gray-400"
                  }`}
                >
                  Your Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-0 py-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 focus:border-[#DB4444] focus:outline-none resize-none"
                  onFocus={() => handleFocus("message")}
                  onBlur={(e) => handleBlur("message", e.target.value)}
                />
              </div>
              <div className="text-right pt-4">
                <button
                  type="submit"
                  className="bg-[#DB4444] hover:bg-[#c13b3b] text-white px-8 py-3 rounded-md transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
