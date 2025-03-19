import { useState } from "react";
import api from "@/utils/api";
import { blockUser, unblockUser } from "@/redux/slices/adminSlice";
import { useAppDispatch } from "@/redux/hooks";

interface User {
  id: number;
  email: string;
  name: string;
  is_blocked: boolean;
  role: string;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const dispatch = useAppDispatch();
  const [localUsers, setLocalUsers] = useState(users);

  const handleBlockUser = async (userId: number) => {
    try {
      await dispatch(blockUser(userId));
      setLocalUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_blocked: true } : user
        )
      );
    } catch (error) {
      console.error("Ошибка при блокировке пользователя:", error);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      await dispatch(unblockUser(userId));
      setLocalUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_blocked: false } : user
        )
      );
    } catch (error) {
      console.error("Ошибка при разблокировке пользователя:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
              Имя
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
              Роль
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
              Статус
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
              Действия
            </th>
          </tr>
        </thead>
        <tbody>
          {localUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b border-gray-200">
                {user.name}
              </td>
              <td className="px-6 py-4 border-b border-gray-200">
                {user.email}
              </td>
              <td className="px-6 py-4 border-b border-gray-200">
                {user.role}
              </td>
              <td className="px-6 py-4 border-b border-gray-200">
                {user.is_blocked ? "Заблокирован" : "Активен"}
              </td>
              <td className="px-6 py-4 border-b border-gray-200">
                {user.is_blocked ? (
                  <button
                    onClick={() => handleUnblockUser(user.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Разблокировать
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlockUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Заблокировать
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
