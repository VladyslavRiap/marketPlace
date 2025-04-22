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
  FaChevronRight,
  FaTimesCircle,
} from "react-icons/fa";

import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { Order } from "@/redux/slices/orderSlice";

interface OrderPageProps {
  order: Order;
}

const statusSteps = [
  {
    key: "registered",
    label: "Registered",
    icon: <FaClipboardList />,
  },
  { key: "paid", label: "Paid", icon: <FaCheckCircle /> },
  {
    key: "prepared",
    label: "Products Prepared",
    icon: <FaBoxOpen />,
  },
  { key: "shipped", label: "Shipped", icon: <FaTruck /> },
  { key: "in_transit", label: "In Transit", icon: <FaTruck /> },
  { key: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
  { key: "received", label: "Received", icon: <FaCheckCircle /> },
];

const OrderPage: React.FC<OrderPageProps> = ({ order }) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  console.log(order);
  if (!order || !order.items) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  const isCancelled = (status: string) => {
    return (
      status === "cancelled" ||
      status === "cancelled_by_buyer" ||
      status === "cancelled_by_seller"
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <motion.h1
        className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Order Tracking #{order.id}
      </motion.h1>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Order Information
        </h2>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              <span className="text-gray-500">Date:</span>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              <span className="text-gray-500">Address:</span>{" "}
              {order.delivery_address}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <FaClock className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              <span className="text-gray-500">Delivery:</span>{" "}
              {new Date(order.estimated_delivery_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Products ({order.items.length})
        </h2>

        <div className="space-y-4">
          {order.items.map((item) => {
            const activeStatusIndex = getStatusIndex(item.status);
            const currentStatus = statusSteps.find(
              (step) => step.key === item.status
            );
            const cancelled = isCancelled(item.status);

            return (
              <div
                key={item.product_id}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start space-x-3 mb-3">
                  {item.images?.length > 0 && (
                    <Link href={`/products/${item.product_id}`} passHref>
                      <img
                        src={item.images[0]}
                        alt="Product"
                        className="w-16 h-16 rounded-lg object-contain border border-gray-100"
                      />
                    </Link>
                  )}
                  <div className="flex-1">
                    <Link href={`/products/${item.product_id}`} passHref>
                      <p className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                        {item.product_name}
                      </p>
                    </Link>
                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Price: {item.price} $
                    </p>
                  </div>
                </div>

                {isMobile && (
                  <div className="mt-2">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        item.status === "delivered" ||
                        item.status === "received"
                          ? "bg-green-100 text-green-800"
                          : item.status === "shipped" ||
                            item.status === "in_transit"
                          ? "bg-blue-100 text-blue-800"
                          : cancelled
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status === "cancelled_by_buyer"
                        ? "Cancelled by Buyer"
                        : item.status === "cancelled_by_seller"
                        ? "Cancelled by Seller"
                        : currentStatus?.label || item.status}
                    </div>
                  </div>
                )}

                {!isMobile && (
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute w-full h-1.5 top-3/4 bg-gray-200 transform -translate-y-1/2 rounded-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            cancelled
                              ? "bg-gradient-to-r from-gray-500 to-gray-400"
                              : "bg-gradient-to-r from-[#E07575]  to-[#DB4444]"
                          }`}
                          style={{
                            width: `${
                              6 +
                              (activeStatusIndex / (statusSteps.length - 1)) *
                                94
                            }%`,
                          }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-7 gap-4 relative z-10">
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
                                    ? cancelled
                                      ? "bg-gradient-to-br from-gray-500 to-gray-400 text-white shadow-sm"
                                      : "bg-gradient-to-br  from-[#E07575]  to-[#DB4444] text-white shadow-sm"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {cancelled &&
                                isActive &&
                                index === activeStatusIndex ? (
                                  <FaTimesCircle />
                                ) : (
                                  step.icon
                                )}
                              </div>
                              <p
                                className={`mt-8 text-xs ${
                                  isActive
                                    ? cancelled
                                      ? "font-medium text-red-600"
                                      : "font-medium text-gray-800"
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
                )}

                {isMobile && (
                  <div className="mt-4 space-y-3">
                    <h3 className="font-medium text-gray-700 text-sm">
                      Delivery Status:
                    </h3>
                    <div className="space-y-2">
                      {statusSteps.map((step, index) => {
                        const isActive = index <= activeStatusIndex;
                        const isCurrent = index === activeStatusIndex;

                        return (
                          <div
                            key={`mobile-${item.product_id}-${step.key}`}
                            className={`flex items-start space-x-3 p-2 rounded-lg ${
                              isCurrent
                                ? cancelled
                                  ? "bg-red-50"
                                  : "bg-blue-50"
                                : ""
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full ${
                                isActive
                                  ? cancelled
                                    ? "bg-red-500 text-white"
                                    : "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {cancelled && isCurrent ? (
                                <FaTimesCircle />
                              ) : (
                                step.icon
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  isActive
                                    ? cancelled
                                      ? "font-medium text-red-600"
                                      : "font-medium text-gray-800"
                                    : "text-gray-500"
                                }`}
                              >
                                {step.label}
                              </p>
                              {isCurrent && (
                                <p
                                  className={`text-xs mt-1 ${
                                    cancelled ? "text-red-600" : "text-blue-600"
                                  }`}
                                >
                                  {cancelled
                                    ? "Order Cancelled"
                                    : "Current Status"}
                                </p>
                              )}
                            </div>
                            {isActive &&
                              (cancelled ? (
                                <FaTimesCircle className="text-red-500 mt-2 flex-shrink-0" />
                              ) : (
                                <FaCheckCircle className="text-green-500 mt-2 flex-shrink-0" />
                              ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Delivery Information
        </h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              <span className="text-gray-500">Delivery Date:</span>{" "}
              {new Date(order.estimated_delivery_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              <span className="text-gray-500">Address:</span>{" "}
              {order.delivery_address}
            </p>
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
