import { GetServerSideProps } from "next";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import {
  LogOut,
  User,
  Mail,
  Phone,
  BadgePlus,
  ShoppingCart,
} from "lucide-react";

const ProfilePage = ({ user }: { user: any }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <motion.div
      className="flex   min-h-screen bg-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-center mb-6 text-3xl font-bold text-gray-800">
          Данные аккаунта
        </h2>

        <div className="flex flex-col items-center mb-6">
          <User className="w-28 h-28 text-blue-600 bg-blue-100 p-3 rounded-full mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            {user.name || (
              <button className="flex items-center text-blue-600 hover:text-blue-800 transition">
                <BadgePlus className="w-5 h-5 mr-1" /> Добавить имя
              </button>
            )}
          </h2>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <p className="text-gray-700">{user.email}</p>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <p className="text-gray-700">
              {user.phone || (
                <button className="flex items-center text-blue-600 hover:text-blue-800 transition">
                  <BadgePlus className="w-5 h-5 mr-1" /> Добавить телефон
                </button>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 mr-1 text-gray-500" />
            <p className="text-gray-700">{user.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Выйти
        </button>
      </div>
    </motion.div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data } = await api.get("/users/me", {
      headers: { cookie: req.headers.cookie || "" },
    });

    return {
      props: { user: data },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default ProfilePage;
