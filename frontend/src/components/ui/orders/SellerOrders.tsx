import { useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import {
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaClipboardList,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import api from "@/utils/api";
import {
  CONFIRM_CANCEL_MODAL_ID,
  CONFIRM_STATUS_MODAL_ID,
  useModal,
} from "@/redux/context/ModalContext";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import StatusBadge from "./OrderStatus";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  status: string;
  images: string[];
  cancel_reason?: string;
  color_id?: number;
  color_name?: string;
  size_id?: number;
  size_name?: string;
}

interface Order {
  id: number;
  user_id: number;
  delivery_address: string;
  phone: string;
  first_name: string;
  last_name: string;
  city: string;
  region: string;
  created_at: string;
  estimated_delivery_date: string;
  items: OrderItem[];
}

interface SellerOrdersProps {
  orders: Order[];
}

const SellerOrders: React.FC<SellerOrdersProps> = ({ orders }) => {
  const router = useRouter();
  const { openModal } = useModal();
  const statusSteps = [
    { key: "registered", label: "Registered", icon: <FaClipboardList /> },
    { key: "paid", label: "Paid", icon: <FaCheckCircle /> },
    { key: "prepared", label: "Prepared", icon: <FaBoxOpen /> },
    { key: "shipped", label: "Shipped", icon: <FaTruck /> },
    { key: "in_transit", label: "In Transit", icon: <FaTruck /> },
    { key: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
    { key: "received", label: "Received", icon: <FaCheckCircle /> },
  ];

  const getNextStatus = (currentStatus: string) => {
    const index = statusSteps.findIndex((s) => s.key === currentStatus);
    return index < statusSteps.length - 1 ? statusSteps[index + 1] : null;
  };

  const canCancel = (status: string) => {
    return ["registered", "paid", "prepared"].includes(status);
  };

  const showStatusConfirmation = (
    orderId: number,
    productId: number,
    currentStatus: string
  ) => {
    openModal(CONFIRM_STATUS_MODAL_ID, {
      orderId,
      productId,
      currentStatus,
    });
  };

  const showCancelConfirmation = (orderId: number, productId: number) => {
    openModal(CONFIRM_CANCEL_MODAL_ID, {
      orderId,
      productId,
      cancelType: "seller",
    });
  };

  return (
    <div className="space-y-4 p-2 sm:p-0">
      {orders
        .slice()
        .reverse()
        .map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaClock className="text-gray-400" />
                  <span>
                    Delivery:{" "}
                    {new Date(
                      order.estimated_delivery_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-200 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {order.first_name} {order.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-200 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 line-clamp-2">
                          {order.delivery_address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.city}, {order.region}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => {
                  const nextStatus = getNextStatus(item.status);
                  const isCancelled = item.status.includes("cancelled");

                  return (
                    <div
                      key={item.product_id}
                      className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {item.images?.[0] && (
                        <div className="flex-shrink-0 w-full sm:w-20 sm:h-20 h-40 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={item.images[0]}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h4 className="font-medium text-gray-900">
                            {item.product_name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-medium  text-gray-900">
                          total: ${(item.quantity * item.price).toFixed(2)}
                        </p>
                        <StatusBadge
                          status={item.status}
                          cancelReason={item.cancel_reason}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.color_name && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-1">Color:</span>
                            <div
                              className="w-4 h-4 rounded-full border border-gray-200 mr-1"
                              style={{
                                backgroundColor: item.color_name.toLowerCase(),
                              }}
                            />
                            <span>{item.color_name}</span>
                          </div>
                        )}
                        {item.size_name && (
                          <div className="text-sm text-gray-600">
                            <span className="mr-1">Size:</span>
                            <span>{item.size_name}</span>
                          </div>
                        )}
                      </div>
                      {!isCancelled && nextStatus && (
                        <div className="flex flex-row gap-2 self-center">
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() =>
                              showStatusConfirmation(
                                order.id,
                                item.product_id,
                                item.status
                              )
                            }
                            className="whitespace-nowrap"
                          >
                            {nextStatus.label}
                          </Button>
                          {canCancel(item.status) && (
                            <Button
                              variant="secondary"
                              size="md"
                              iconPosition="right"
                              className="text-red-500 hover:text-red-700 hover:border-red-900"
                              onClick={() =>
                                showCancelConfirmation(
                                  order.id,
                                  item.product_id
                                )
                              }
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  );
};

export default SellerOrders;
