import { useState } from "react";
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
  Edit,
} from "lucide-react";

const ProfilePage = ({ user: initialUser }: { user: any }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newName, setNewName] = useState(initialUser.name || "");
  const [newPhone, setNewPhone] = useState(initialUser.mobnumber || "");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(initialUser); // Локальное состояние для пользователя

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  const handleUpdateName = async () => {
    if (!newName) {
      setError("Имя не может быть пустым");
      return;
    }
    try {
      await api.put("/users/me", { name: newName });
      setEditName(false);
      setError("");
      // Обновляем локальное состояние
      setUser((prevUser: any) => ({ ...prevUser, name: newName }));
    } catch (error: any) {
      setError("Ошибка при обновлении имени: " + error.message);
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.match(/^\+?\d{10,15}$/)) {
      setError(
        "Номер телефона должен содержать от 10 до 15 цифр, включая код страны"
      );
      return;
    }

    try {
      await api.put("/users/me/update-mobnumber", {
        mobnumber: newPhone,
      });
      setEditPhone(false);
      setError("");
      // Обновляем локальное состояние
      setUser((prevUser: any) => ({ ...prevUser, mobnumber: newPhone }));
    } catch (error: any) {
      console.error(
        "Ошибка при обновлении телефона:",
        error.response?.data || error.message
      );
      setError("Ошибка при обновлении телефона: " + error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      setError("Все поля должны быть заполнены");
      return;
    }
    try {
      await api.put("/users/me/password", { oldPassword, newPassword });
      setEditPassword(false);
      setError("");
    } catch (error: any) {
      setError("Ошибка при обновлении пароля: " + error.message);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen bg-gray-100 p-6"
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
            {!editName && (
              <button
                onClick={() => setEditName(true)}
                className="ml-2 text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </h2>
          {editName && (
            <div className="flex mt-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="p-2 border rounded-md"
              />
              <button
                onClick={handleUpdateName}
                className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Сохранить
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <p className="text-gray-700">{user.email}</p>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <p className="text-gray-700">{user.mobnumber || "Не указан"}</p>

            <button
              onClick={() => setEditPhone(true)}
              className="ml-2 text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {editPhone && (
            <div className="flex mt-2">
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="p-2 border rounded-md"
              />
              <button
                onClick={handleUpdatePhone}
                className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Сохранить
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 mr-1 text-gray-500" />
            <p className="text-gray-700">{user.role}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setEditPassword(true)}
            className="flex items-center justify-center w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-300"
          >
            Изменить пароль
          </button>
        </div>

        {editPassword && (
          <div className="mt-4">
            <input
              type="password"
              placeholder="Старый пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-2 border rounded-md w-full mb-2"
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border rounded-md w-full mb-2"
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg"
            >
              Сохранить новый пароль
            </button>
          </div>
        )}

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

    return { props: { user: data } };
  } catch (error) {
    return { redirect: { destination: "/login", permanent: false } };
  }
};

export default ProfilePage;
