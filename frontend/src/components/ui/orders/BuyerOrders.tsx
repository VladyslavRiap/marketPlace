import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { Transition } from "@headlessui/react";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import api from "@/utils/api";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  status: string;
  images: string[];
  cancel_reason?: string;
}

interface Order {
  id: number;
  user_id: number;
  delivery_address: string;
  created_at: string;
  estimated_delivery_date: string;
  items: OrderItem[];
}

interface BuyerOrdersProps {
  orders: Order[];
}

const BuyerOrders: React.FC<BuyerOrdersProps> = ({ orders }) => {
  const router = useRouter();
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const canCancel = (status: string) => {
    return ["registered", "paid", "prepared"].includes(status);
  };

  const handleCancel = async () => {
    if (!cancellingOrder || !activeProduct) return;

    try {
      await api.put("/orders/status", {
        orderId: cancellingOrder,
        productId: activeProduct,
        status: "cancelled_by_buyer",
        cancelReason: cancelReason || "Отменен покупателем",
      });
      router.replace(router.asPath);
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setCancellingOrder(null);
      setActiveProduct(null);
      setCancelReason("");
      setShowCancelConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <Transition show={showCancelConfirm}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              Подтверждение отмены заказа
            </h3>
            <p className="mb-2">
              Вы действительно хотите отменить этот товар в заказе?
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Причина отмены (необязательно)"
              className="w-full p-2 border rounded mb-4"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setCancelReason("");
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Нет
              </button>
              <button
                onClick={() => handleCancel()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {cancellingOrder ? "Отмена..." : "Да, отменить"}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      {orders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`} passHref>
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Заказ №{order.id}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-gray-500" />
                <p className="text-gray-600">
                  Создан: {new Date(order.created_at).toLocaleDateString()}
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

            <div className="mt-4 space-y-3">
              {order.items.map((item) => {
                const canCancelItem = canCancel(item.status);
                const isCancelling =
                  cancellingOrder === order.id &&
                  activeProduct === item.product_id;
                const isCancelled = item.status.includes("cancelled");

                return (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center space-x-4">
                      {item.images?.length > 0 && (
                        <img
                          src={item.images[0]}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-lg font-medium">
                          {item.product_name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Количество: {item.quantity} × ${item.price} = $
                          {(item.quantity * item.price).toFixed(2)}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            isCancelled ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          Статус:{" "}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded ${
                              item.status === "cancelled_by_buyer"
                                ? "bg-red-100 text-red-800"
                                : item.status === "cancelled_by_seller"
                                ? "bg-orange-100 text-orange-800"
                                : item.status.includes("cancelled")
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.status === "cancelled_by_buyer"
                              ? "Отменен покупателем"
                              : item.status === "cancelled_by_seller"
                              ? "Отменен продавцом"
                              : item.status.includes("cancelled")
                              ? "Отменен"
                              : item.status}
                            {item.cancel_reason && ` (${item.cancel_reason})`}
                          </span>
                        </p>
                      </div>
                    </div>

                    {!isCancelled && canCancelItem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCancellingOrder(order.id);
                          setActiveProduct(item.product_id);
                          setShowCancelConfirm(true);
                        }}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                        disabled={isCancelling}
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default BuyerOrders;
