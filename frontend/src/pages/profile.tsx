import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import {
  logoutUser,
  updateAvatar,
  updateName,
  updatePassword,
  updatePhone,
} from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import {
  LogOut,
  User,
  Mail,
  Phone,
  ShoppingCart,
  Edit,
  Camera,
  Store,
  Check,
  X,
  ShieldUser,
} from "lucide-react";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { clearCartRedux, fetchCart } from "@/redux/slices/cartSlice";
import { clearFavorites, fetchFavorites } from "@/redux/slices/favoriteSlice";
import {
  Dialog,
  DialogBackdrop,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFavorites());
    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCartRedux());
    dispatch(clearFavorites());
    router.push("/login");
    setIsLogoutModalOpen(false);
  };

  const handleUpdateName = async () => {
    if (!newName) {
      showMessage("Имя не может быть пустым", "error");
      return;
    }
    try {
      await dispatch(updateName(newName)).unwrap();
      setEditName(false);
      setUser((prevUser: any) => ({ ...prevUser, name: newName }));
      showMessage("Имя обновлено успешно!", "success");
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
      await dispatch(updatePhone(newPhone)).unwrap();
      setEditPhone(false);
      setUser((prevUser: any) => ({ ...prevUser, mobnumber: newPhone }));
      showMessage("Номер телефона обновлен успешно!", "success");
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
      await dispatch(updatePassword({ oldPassword, newPassword })).unwrap();
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
      const data = await dispatch(updateAvatar(formData)).unwrap();
      setLoading(false);
      setUser({ ...user, avatar_url: data.avatarUrl });
      showMessage("Аватар обновлен успешно!", "success");
    } catch (error: any) {
      console.error("Ошибка при загрузке аватара:", error.message);
      setLoading(false);
      showMessage("Ошибка при загрузке аватара. Попробуйте снова.", "error");
    }
  };

  const handleGoToSeller = () => {
    if (user.role === "seller") {
      router.push("/seller");
    }
  };
  const handleGoToAdmin = () => {
    if (user.role === "admin") {
      router.push("/admin");
    }
  };

  return (
    <motion.div
      className="flex  bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col justify-center md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-8 flex-1 max-w-md">
          <h2 className="text-center mb-6 text-3xl font-bold text-gray-800">
            Данные аккаунта
          </h2>

          <div className="flex flex-col items-center mb-6 relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Аватар"
                className="w-52 h-52 rounded-full border-4 border-blue-500 object-cover"
              />
            ) : (
              <User className="w-28 h-28 text-blue-600 bg-blue-100 p-3 rounded-full mb-4" />
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-50 transition"
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
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              {!editName ? (
                <>
                  {user.name || "Добавить имя"}
                  <button
                    onClick={() => setEditName(true)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleUpdateName}
                    className="ml-2 text-green-600 hover:text-green-800 transition"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditName(false)}
                    className="ml-2 text-red-600 hover:text-red-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
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
              {!editPhone ? (
                <>
                  <p className="text-gray-700">
                    {user.mobnumber || "Не указан"}
                  </p>
                  <button
                    onClick={() => setEditPhone(true)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    className="ml-2 text-green-600 hover:text-green-800 transition"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditPhone(false)}
                    className="ml-2 text-red-600 hover:text-red-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

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
                className="p-2 border rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 border rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUpdatePassword}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
              >
                Сохранить новый пароль
              </button>
            </div>
          )}

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="mt-6 flex items-center justify-center w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Выйти
          </button>
        </div>

        {user.role === "seller" && (
          <div
            onClick={handleGoToSeller}
            className="bg-white shadow-lg rounded-xl p-8 flex-1 cursor-pointer hover:shadow-xl transition-shadow max-w-md"
          >
            <h2 className="text-center mb-6 text-3xl font-bold text-gray-800">
              Панель продавца
            </h2>
            <div className="flex flex-col items-center">
              <Store className="w-28 h-28 text-blue-600 bg-blue-100 p-3 rounded-full mb-4" />
              <p className="text-gray-700 text-center">
                Перейти в панель управления продавца для управления товарами и
                заказами.
              </p>
            </div>
          </div>
        )}
        {user.role === "admin" && (
          <div
            onClick={handleGoToAdmin}
            className="bg-white shadow-lg rounded-xl p-8 flex-1 cursor-pointer hover:shadow-xl transition-shadow max-w-md"
          >
            <h2 className="text-center mb-6 text-3xl font-bold text-gray-800">
              Панель Администратора
            </h2>
            <div className="flex flex-col items-center">
              <ShieldUser className="w-28 h-28 text-blue-600 bg-blue-100 p-3 rounded-full mb-4" />
              <p className="text-gray-700 text-center">
                Перейти в панель управления администратора для управления
                товарами и заказами.
              </p>
            </div>
          </div>
        )}
      </div>

      <Transition appear show={isLogoutModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsLogoutModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
            </TransitionChild>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Выход из аккаунта
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Вы уверены, что хотите выйти из аккаунта?
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIsLogoutModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
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
