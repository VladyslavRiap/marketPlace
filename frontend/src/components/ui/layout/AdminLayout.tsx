import Link from "next/link";
import { useRouter } from "next/router";
import { Users, Box, BarChart2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="w-full p-4">
          <h2 className="text-xl font-bold text-indigo-600 mb-8 px-4">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className={`flex items-center px-4 py-3 rounded-lg transition ${
                isActive("/admin")
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BarChart2 className="w-5 h-5 mr-3" />
              Statistics
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center px-4 py-3 rounded-lg transition ${
                isActive("/admin/users")
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              Users
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center px-4 py-3 rounded-lg transition ${
                isActive("/admin/products")
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Box className="w-5 h-5 mr-3" />
              Products
            </Link>
          </nav>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around p-2">
          <Link
            href="/admin"
            className={`flex flex-col items-center p-2 rounded-lg ${
              isActive("/admin") ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-xs mt-1">Stats</span>
          </Link>
          <Link
            href="/admin/users"
            className={`flex flex-col items-center p-2 rounded-lg ${
              isActive("/admin/users") ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Users</span>
          </Link>
          <Link
            href="/admin/products"
            className={`flex flex-col items-center p-2 rounded-lg ${
              isActive("/admin/products") ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <Box className="w-6 h-6" />
            <span className="text-xs mt-1">Products</span>
          </Link>
        </div>
      </div>

      <div className="md:ml-64 pb-16 md:pb-0">
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
