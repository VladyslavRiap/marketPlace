import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-white shadow-md p-4 mb-6 rounded-lg">
        <div className="flex space-x-4">
          <Link
            href="/admin"
            className="text-lg font-semibold text-gray-700 hover:text-indigo-600"
          >
            Статистика
          </Link>
          <Link
            href="/admin/users"
            className="text-lg font-semibold text-gray-700 hover:text-indigo-600"
          >
            Пользователи
          </Link>
          <Link
            href="/admin/products"
            className="text-lg font-semibold text-gray-700 hover:text-indigo-600"
          >
            Продукты
          </Link>
        </div>
      </nav>
      <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
    </div>
  );
};

export default AdminLayout;
