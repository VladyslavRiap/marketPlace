import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, User, ChevronRight } from "lucide-react";
import StatusBadge from "./OrderStatus";
import {
  CONFIRM_CANCEL_MODAL_ID,
  useModal,
} from "@/redux/context/ModalContext";
import Button from "@/components/Button";

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
  phone: string;
  first_name: string;
  last_name: string;
  city: string;
  region: string;
  created_at: string;
  estimated_delivery_date: string;
  items: OrderItem[];
}

interface BuyerOrdersProps {
  orders: Order[];
}

const BuyerOrders = ({ orders }: BuyerOrdersProps) => {
  const { openModal } = useModal();

  const canCancel = (status: string) => {
    return ["registered", "paid", "prepared"].includes(status);
  };

  const showCancelConfirmation = (orderId: number, productId: number) => {
    openModal(CONFIRM_CANCEL_MODAL_ID, {
      orderId,
      productId,
      cancelType: "buyer",
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={`/orders/${order.id}`} passHref>
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      Order #{order.id}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      Estimated Delivery:{" "}
                      {new Date(
                        order.estimated_delivery_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Delivery Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-200 p-2 rounded-full">
                          <User className="w-4 h-4 text-gray-600" />
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
                          <MapPin className="w-4 h-4 text-gray-600" />
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
                    const canCancelItem = canCancel(item.status);
                    const isCancelled = item.status.includes("cancelled");

                    return (
                      <div
                        key={item.product_id}
                        className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.images?.[0] && (
                          <div className="flex-shrink-0 w-full sm:w-20 lg:h-20 h-40 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={item.images[0]}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h4 className="font-medium text-gray-900 line-clamp-2">
                              {item.product_name}
                            </h4>
                            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <StatusBadge
                              status={item.status}
                              cancelReason={item.cancel_reason}
                            />
                            {!isCancelled && canCancelItem && (
                              <Button
                                variant="secondary"
                                size="md"
                                iconPosition="right"
                                className="text-red-500 hover:text-red-700 hover:border-red-900"
                                onClick={(e: any) => {
                                  e.preventDefault();
                                  showCancelConfirmation(
                                    order.id,
                                    item.product_id
                                  );
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
    </div>
  );
};

export default BuyerOrders;
