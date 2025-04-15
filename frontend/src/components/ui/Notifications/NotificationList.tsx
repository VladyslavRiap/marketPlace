import { useEffect } from "react";
import { useRouter } from "next/router";
import { Bell, Check, Trash2, RefreshCw, BellOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  deleteNotification,
} from "@/redux/slices/notificationsSlice";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";

interface NotificationListProps {
  isDropdown?: boolean;
  onClose?: () => void;
}

const NotificationList = ({
  isDropdown = false,
  onClose,
}: NotificationListProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: notifications, loading } = useAppSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleMarkAsRead = async (id: number) => {
    await dispatch(markAsRead(id));
    dispatch(fetchUnreadCount());
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteNotification(id));
    dispatch(fetchUnreadCount());
  };

  if (isDropdown) {
    return (
      <div className="w-100 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-[#DB4444]">
            <Bell className="w-5 h-5 text-[#DB4444]" />
            Notifications
          </h3>
        </div>

        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center text-indigo-600">
            <RefreshCw className="w-8 h-8 animate-spin mb-2" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-gray-500">
            <BellOff className="w-8 h-8 mb-2 text-gray-400" />
            <p>No new notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.li
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 hover:bg-indigo-50 cursor-pointer transition-colors ${
                    !notification.is_read
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.id);
                    }
                    router.push("/notifications");
                    onClose?.();
                  }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          !notification.is_read
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-green-600 hover:bg-green-50"
                        iconPosition="right"
                        title="Mark as read"
                      >
                        <Check />
                      </Button>
                      <Button
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        iconPosition="right"
                        title="Delete notification"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        <div className="sticky bottom-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-t border-gray-200 p-3 text-center">
          <Button
            onClick={() => {
              router.push("/notifications");
              onClose?.();
            }}
            variant="ghost"
            className="text-[#DB4444] hover:text-[#E07575] hover:bg-indigo-100"
          >
            Show all notifications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#DB4444] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#DB4444]" />
            My notifications
          </h2>
          <p className="text-sm text-[#DB4444]">
            {notifications.length} notifications
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => dispatch(fetchNotifications())}
            variant="ghost"
            size="sm"
            className="border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            icon={RefreshCw}
            iconPosition="right"
            disabled={loading}
          >
            {loading ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center text-indigo-600">
          <RefreshCw className="w-8 h-8 animate-spin mb-2" />
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 flex flex-col items-center justify-center text-gray-500">
          <BellOff className="w-8 h-8 mb-2 text-gray-400" />
          <p>No notifications</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.li
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-4 hover:bg-indigo-50 transition-colors ${
                  !notification.is_read
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        !notification.is_read
                          ? "text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 sm:gap-3 justify-between">
                    {!notification.is_read && (
                      <Button
                        onClick={() => handleMarkAsRead(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="border border-green-200 text-green-700 hover:bg-green-50"
                        icon={Check}
                        iconPosition="right"
                      >
                        <span className="hidden sm:inline">Read</span>
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(notification.id)}
                      variant="ghost"
                      size="sm"
                      className="border border-red-200 text-red-700 hover:bg-red-50"
                      icon={Trash2}
                      iconPosition="right"
                    >
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
};

export default NotificationList;
