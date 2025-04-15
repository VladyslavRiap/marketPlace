import { GetServerSideProps } from "next";
import AdminLayout from "@/components/ui/layout/AdminLayout";
import StatsCard from "@/components/ui/cards/StatsCard";
import api from "@/utils/api";

interface StatsPageProps {
  totalUsers: number;
  totalProducts: number;
}

const StatsPage: React.FC<StatsPageProps> = ({ totalUsers, totalProducts }) => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Statistics
        </h1>
        <p className="text-gray-500 mt-2">System overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <StatsCard title="Users" value={totalUsers} icon="users" />
        <StatsCard title="Products" value={totalProducts} icon="products" />
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data: userData } = await api.get("/users/me", {
      headers: { cookie: req.headers.cookie || "" },
    });
    if (userData.role !== "admin") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { data } = await api.get("/admin/stats", {
      headers: { cookie: req.headers.cookie || "" },
    });
    return {
      props: {
        totalUsers: data.totalUsers,
        totalProducts: data.totalProducts,
      },
    };
  } catch (error) {
    return {
      props: {
        totalUsers: 0,
        totalProducts: 0,
      },
    };
  }
};

export default StatsPage;
