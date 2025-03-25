import { GetServerSideProps } from "next";
import { motion } from "framer-motion";

import api from "@/utils/api";
import SellerOrders from "@/components/ui/orders/SellerOrders";
import BuyerOrders from "@/components/ui/orders/BuyerOrders";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  status: string;
  images: string[];
  seller_id?: number;
  cancel_reason?: string;
}

export interface Order {
  id: number;
  user_id: number;
  delivery_address: string;
  created_at: string;
  estimated_delivery_date: string;
  items: OrderItem[];
  status: string;
  images: string[];
}

interface OrdersPageProps {
  orders: Order[];
  userRole: string;
}

const OrdersPage: React.FC<OrdersPageProps> = ({
  orders = [],
  userRole = "buyer",
}) => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <motion.h1
        className="text-3xl font-bold text-gray-800 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {userRole === "seller" ? "Заказы покупателей" : "Мои заказы"}
      </motion.h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">
          {userRole === "seller" ? "Нет заказов" : "У вас нет заказов"}
        </p>
      ) : userRole === "seller" ? (
        <SellerOrders orders={orders} />
      ) : (
        <BuyerOrders orders={orders} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data: userData } = await api.get("/users/me", {
      headers: { cookie: req.headers.cookie || "" },
    });

    const userRole = userData?.role || "buyer";

    const endpoint = userRole === "seller" ? "/orders/seller" : "/orders/buyer";
    const { data } = await api.get(endpoint, {
      headers: { cookie: req.headers.cookie || "" },
    });

    const orders = Array.isArray(data)
      ? data
      : Array.isArray(data?.orders)
      ? data.orders
      : [];

    return {
      props: {
        orders,
        userRole,
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      props: {
        orders: [],
        userRole: "buyer",
      },
    };
  }
};

export default OrdersPage;
