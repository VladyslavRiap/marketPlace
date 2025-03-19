import { GetServerSideProps } from "next";
import AdminLayout from "@/components/ui/layout/AdminLayout";
import UserTable from "@/components/ui/tables/UserTable";
import api from "@/utils/api";

interface User {
  id: number;
  email: string;
  name: string;
  is_blocked: boolean;
  role: string;
}

interface UsersPageProps {
  users: User[];
}

const UsersPage: React.FC<UsersPageProps> = ({ users }) => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Управление пользователями
      </h1>
      <UserTable users={users} />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data: users } = await api.get("/admin/users", {
      headers: { cookie: req.headers.cookie || "" },
    });
    return {
      props: {
        users,
      },
    };
  } catch (error) {
    return {
      props: {
        users: [],
      },
    };
  }
};

export default UsersPage;
