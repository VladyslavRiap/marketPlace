import { GetServerSideProps } from "next";
import api from "@/utils/api";
import NotificationList from "@/components/ui/Notifications/NotificationList";
import { Notification } from "../../types/notification";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { fetchNotifications } from "@/redux/slices/notificationsSlice";

interface NotificationsPageProps {
  notifications: Notification[];
}

const NotificationsPage = ({ notifications }: NotificationsPageProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8 px-4">
      <NotificationList />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data } = await api.get<Notification[]>("/notifications", {
      headers: {
        cookie: req.headers.cookie || "",
      },
    });

    return {
      props: {
        notifications: data,
      },
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      props: {
        notifications: [],
      },
    };
  }
};

export default NotificationsPage;
