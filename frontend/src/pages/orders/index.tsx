import { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { ShoppingBag, Package, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrders } from "@/redux/slices/orderSlice";
import EmptyState from "@/components/EmptyState";
import SellerOrders from "@/components/ui/orders/SellerOrders";
import BuyerOrders from "@/components/ui/orders/BuyerOrders";
import { useEffect } from "react";
import api from "@/utils/api";

const OrdersPage: React.FC<{ userRole: string }> = ({ userRole = "buyer" }) => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const isSeller = userRole === "seller";
  console.log(orders);
  useEffect(() => {
    dispatch(fetchOrders(userRole as "buyer" | "seller"));
  }, [dispatch, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              {isSeller ? (
                <>
                  <Package className="w-7 h-7 text-[#DB4444]" />
                  Customer Orders
                </>
              ) : (
                <>
                  <ShoppingBag className="w-7 h-7 text-[#DB4444]" />
                  My Orders
                </>
              )}
            </h1>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {isSeller ? "Seller" : "Buyer"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <EmptyState
              icon={<ShoppingBag className="w-12 h-12 text-gray-400" />}
              title={isSeller ? "No orders" : "You have no orders"}
              description={
                isSeller
                  ? "Orders for your products will be displayed here"
                  : "Start shopping to see your orders here"
              }
              action={
                !isSeller
                  ? {
                      label: "Go to Products",
                      href: "/products",
                    }
                  : undefined
              }
            />
          </motion.div>
        ) : isSeller ? (
          <SellerOrders orders={orders} />
        ) : (
          <BuyerOrders orders={orders} />
        )}
      </div>
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
