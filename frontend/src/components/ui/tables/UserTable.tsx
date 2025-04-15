import { useState } from "react";
import { Ban, Unlock, MoreVertical, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import { blockUser, unblockUser } from "@/redux/slices/adminSlice";
import Badge from "../Badge";
import DropdownMenu from "../DropdownMenu";

interface User {
  id: number;
  email: string;
  name: string;
  is_blocked: boolean;
  role: string;
}

const UserTable: React.FC<{ users: User[] }> = ({ users = [] }) => {
  const dispatch = useAppDispatch();
  const [localUsers, setLocalUsers] = useState(users);

  const handleBlock = async (id: number) => {
    try {
      await dispatch(blockUser(id));
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_blocked: true } : u))
      );
    } catch (error) {
      console.error("Block error:", error);
    }
  };

  const handleUnblock = async (id: number) => {
    try {
      await dispatch(unblockUser(id));
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_blocked: false } : u))
      );
    } catch (error) {
      console.error("Unblock error:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100">
          <div className="col-span-3 font-medium text-gray-500">Имя</div>
          <div className="col-span-4 font-medium text-gray-500">Email</div>
          <div className="col-span-2 font-medium text-gray-500">Роль</div>
          <div className="col-span-1 font-medium text-gray-500">Статус</div>
          <div className="col-span-2 font-medium text-gray-500">Действия</div>
        </div>

        {localUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="col-span-3 font-medium text-gray-900">
              {user.name}
            </div>
            <div className="col-span-4 text-gray-600">{user.email}</div>
            <div className="col-span-2">
              <Badge variant={user.role === "admin" ? "primary" : "secondary"}>
                {user.role}
              </Badge>
            </div>
            <div className="col-span-1">
              <Badge variant={user.is_blocked ? "danger" : "success"}>
                {user.is_blocked ? "Заблокирован" : "Активен"}
              </Badge>
            </div>
            <div className="col-span-2">
              {user.is_blocked ? (
                <button
                  onClick={() => handleUnblock(user.id)}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
                >
                  <Unlock className="w-4 h-4" />
                  Разблокировать
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(user.id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Ban className="w-4 h-4" />
                  Заблокировать
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {localUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-xs border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant={user.role === "admin" ? "primary" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                  <Badge variant={user.is_blocked ? "danger" : "success"}>
                    {user.is_blocked ? "Заблокирован" : "Активен"}
                  </Badge>
                </div>
              </div>
              <DropdownMenu
                items={[
                  user.is_blocked
                    ? {
                        label: "Разблокировать",
                        icon: Unlock,
                        onClick: () => handleUnblock(user.id),
                        className: "text-green-600",
                      }
                    : {
                        label: "Заблокировать",
                        icon: Ban,
                        onClick: () => handleBlock(user.id),
                        className: "text-red-600",
                      },
                ]}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
