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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Статистика</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard title="Пользователи" value={totalUsers} />
        <StatsCard title="Продукты" value={totalProducts} />
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
