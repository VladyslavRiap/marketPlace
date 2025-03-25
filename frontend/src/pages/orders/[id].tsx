import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import api from "@/utils/api";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaClipboardList,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { Order } from ".";
import Link from "next/link";

interface OrderPageProps {
  order: Order;
}

const statusSteps = [
  {
    key: "registered",
    label: "Зарегистрирован",
    icon: <FaClipboardList />,
  },
  { key: "paid", label: "Оплачен", icon: <FaCheckCircle /> },
  {
    key: "prepared",
    label: "Продукты подготовлены для доставки",
    icon: <FaBoxOpen />,
  },
  { key: "shipped", label: "Отправленные продукты", icon: <FaTruck /> },
  { key: "in_transit", label: "В пути на адрес", icon: <FaTruck /> },
  { key: "delivered", label: "Доставлен на адрес", icon: <FaCheckCircle /> },
  { key: "received", label: "Принятый продукт", icon: <FaCheckCircle /> },
];

const OrderPage: React.FC<OrderPageProps> = ({ order }) => {
  const router = useRouter();

  if (!order || !order.items) {
    return <div>Загрузка...</div>;
  }

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-100">
      <motion.h1
        className="text-3xl font-bold text-gray-800 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Отследить доставку заказа №{order.id}
      </motion.h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <p className="text-gray-600">
              Зарегистрирован: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <p className="text-gray-600">Адрес: {order.delivery_address}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-500" />
            <p className="text-gray-600">
              Ожидаемая доставка:{" "}
              {new Date(order.estimated_delivery_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Товары в заказе</h2>
        {order.items.map((item) => {
          const activeStatusIndex = getStatusIndex(item.status);
          const progressPercentage =
            6 + (activeStatusIndex / (statusSteps.length - 1)) * 94;
          const imagePosition =
            (activeStatusIndex / (statusSteps.length - 1)) * 88;

          return (
            <div key={item.product_id} className="mb-8">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-2 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  {item.images?.length > 0 && (
                    <Link href={`/products/${item.product_id}`} passHref>
                      <img
                        src={item.images[0]}
                        alt="Товар"
                        className="w-16 h-16 rounded object-cover"
                      />
                    </Link>
                  )}
                  <div>
                    <p className="text-lg font-medium">{item.product_name}</p>
                    <p className="text-gray-500 text-sm">
                      Количество: {item.quantity}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Цена: {item.price} $
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    item.status === "delivered" || item.status === "received"
                      ? "bg-green-200 text-green-800"
                      : item.status === "shipped" ||
                        item.status === "in_transit"
                      ? "bg-blue-200 text-blue-800"
                      : item.status === "cancelled" ||
                        item.status === "cancelled_by_buyer" ||
                        item.status === "cancelled_by_seller"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {item.status === "cancelled_by_buyer"
                    ? "Отменено покупателем"
                    : item.status === "cancelled_by_seller"
                    ? "Отменено продавцом"
                    : statusSteps.find((step) => step.key === item.status)
                        ?.label || item.status}
                </span>
              </div>

              <div className="mt-4 relative">
                <div className="relative">
                  <div className="absolute w-full h-1 -top-1/4 bg-gray-300 transform -translate-y-1/2">
                    <div
                      className="h-1 bg-blue-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-7 gap-4 relative z-10 mt-8">
                    {statusSteps.map((step, index) => {
                      const isActive = index <= activeStatusIndex;

                      return (
                        <div
                          key={`${item.product_id}-${step.key}`}
                          className="flex flex-col items-center text-center"
                        >
                          <div
                            className={`p-2 rounded-full ${
                              isActive
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {step.icon}
                          </div>
                          <p
                            className={`mt-2 text-xs ${
                              isActive
                                ? "font-bold text-gray-800"
                                : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Информация о доставке</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <p className="text-gray-600">
              Дата доставки:{" "}
              {new Date(order.estimated_delivery_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <p className="text-gray-600">Адрес: {order.delivery_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  try {
    const { data } = await api.get(`/orders/${params?.id}`, {
      headers: { cookie: req.headers.cookie || "" },
    });

    if (!data.order || !data.items) {
      return { notFound: true };
    }

    const order = {
      ...data.order,
      items: data.items,
    };

    return { props: { order } };
  } catch (error) {
    return { notFound: true };
  }
};

export default OrderPage;
