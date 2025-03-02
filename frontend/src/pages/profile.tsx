import { useEffect, useState } from "react";
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
  Camera,
} from "lucide-react";
import { useSnackbarContext } from "@/context/SnackBarContext";
import { clearCartRedux, fetchCart } from "@/redux/slices/cartSlice";
import { clearFavorites, fetchFavorites } from "@/redux/slices/favoriteSlice";

const ProfilePage = ({ user: initialUser }: { user: any }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showMessage } = useSnackbarContext();

  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newName, setNewName] = useState(initialUser.name || "");
  const [newPhone, setNewPhone] = useState(initialUser.mobnumber || "");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    dispatch(fetchFavorites());
    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCartRedux());
    dispatch(clearFavorites());
    router.push("/login");
  };

  const handleUpdateName = async () => {
    if (!newName) {
      showMessage("Имя не может быть пустым", "error");
      return;
    }
    try {
      await api.put("/users/me", { name: newName });
      setEditName(false);
      setUser((prevUser: any) => ({ ...prevUser, name: newName }));
      showMessage("Имя обновлено успешно!", "success");
      router.replace(router.asPath);
    } catch (error: any) {
      showMessage("Ошибка при обновлении имени: " + error.message, "error");
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.match(/^\+?\d{10,15}$/)) {
      showMessage(
        "Номер телефона должен содержать от 10 до 15 цифр, включая код страны",
        "error"
      );
      return;
    }

    try {
      await api.put("/users/me/update-mobnumber", { mobnumber: newPhone });
      setEditPhone(false);
      setUser((prevUser: any) => ({ ...prevUser, mobnumber: newPhone }));
      showMessage("Номер телефона обновлен успешно!", "success");
      router.replace(router.asPath);
    } catch (error: any) {
      console.error("Ошибка при обновлении телефона:", error.message);
      showMessage("Ошибка при обновлении телефона: " + error.message, "error");
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      showMessage("Все поля должны быть заполнены", "error");
      return;
    }
    try {
      await api.put("/users/me/password", { oldPassword, newPassword });
      setEditPassword(false);
      showMessage("Пароль обновлен успешно!", "success");
      router.replace(router.asPath);
    } catch (error: any) {
      showMessage("Ошибка при обновлении пароля: " + error.message, "error");
    }
  };

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;

    const formData = new FormData();
    formData.append("avatar", event.target.files[0]);

    setLoading(true);

    try {
      const { data } = await api.put("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser({ ...user, avatar_url: data.avatarUrl });
      setLoading(false);
      showMessage("Аватар обновлен успешно!", "success");
      router.replace(router.asPath);
    } catch (error: any) {
      console.error("Ошибка при загрузке аватара:", error.message);
      setLoading(false);
      showMessage("Ошибка при загрузке аватара. Попробуйте снова.", "error");
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

        <div className="flex flex-col items-center mb-6 relative">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Аватар"
              className="w-52 h-52 rounded-full border-2"
            />
          ) : (
            <User className="w-28 h-28 text-blue-600 bg-blue-100 p-3 rounded-full mb-4" />
          )}
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer"
          >
            <Camera className="w-6 h-6 text-blue-600" />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleUploadAvatar}
            className="hidden"
          />
          {loading && <p className="mt-2 text-gray-500">Загрузка...</p>}
        </div>

        <div className="flex flex-col items-center mb-6">
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
