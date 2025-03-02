import { GetServerSideProps } from "next";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "@/redux/slices/cartSlice";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { useSnackbarContext } from "@/context/SnackBarContext";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  image_url: string;
}

interface CartPageProps {
  initialCart: {
    items: CartItem[];
    totalAmount: number;
  };
}

const CartPage = ({ initialCart }: CartPageProps) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();

  const [localCart, setLocalCart] = useState(initialCart.items);
  const [totalAmount, setTotalAmount] = useState(initialCart.totalAmount);

  const handleRemove = async (productId: number) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      const updatedCart = localCart.filter((item) => item.id !== productId);
      setLocalCart(updatedCart);
      setTotalAmount(
        updatedCart.reduce((acc, item) => acc + item.total_price, 0)
      );
      showMessage("Товар удален из корзины", "success");
    } catch (error: any) {
      showMessage("Ошибка: " + error.message, "error");
    }
  };

  const handleUpdateQuantity = async (productId: number, change: number) => {
    try {
      const updatedCart = localCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
              total_price: Number(
                ((item.quantity + change) * item.price).toFixed(2)
              ),
            }
          : item
      );

      setLocalCart(updatedCart);
      setTotalAmount(
        updatedCart.reduce((acc, item) => acc + Number(item.total_price), 0)
      );

      await dispatch(
        updateCartQuantity({ productId, quantityChange: change })
      ).unwrap();
      showMessage("Количество обновлено", "info");
    } catch (error: any) {
      showMessage("Ошибка: " + error.message, "error");
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      setLocalCart([]);
      setTotalAmount(0);
      showMessage("Корзина очищена", "success");
    } catch (error: any) {
      showMessage("Ошибка: " + error.message, "error");
    }
  };

  return (
    <motion.div className="w-full p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Корзина
        </h1>

        {localCart.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-gray-600 text-xl">Ваша корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-white rounded-lg shadow-xl mb-6">
              <p className="md:col-span-2 text-lg font-semibold text-gray-800">
                Товар
              </p>
              <p className="text-center text-lg font-semibold text-gray-800">
                Количество
              </p>
              <p className="text-center text-lg font-semibold text-gray-800">
                Цена
              </p>
              <p className="text-center text-lg font-semibold text-gray-800">
                Удалить
              </p>
            </div>

            <div className="space-y-6">
              {localCart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-5 items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out"
                >
                  <Link
                    href={`/products/${item.id}`}
                    className="flex items-center space-x-6 md:col-span-2"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <p className="text-xl font-medium text-gray-900">
                      {item.name}
                    </p>
                  </Link>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <span className="text-xl font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-center text-xl font-bold text-gray-900">
                    ${Number(item.total_price).toFixed(2)}
                  </p>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col items-center md:flex-row md:justify-between">
              <p className="text-3xl font-bold text-gray-900">
                Итого:{" "}
                <span className="text-red-600">
                  ${Number(totalAmount).toFixed(2)}
                </span>
              </p>
              <button
                onClick={handleClearCart}
                className="mt-4 md:mt-0 bg-red-500 text-white px-8 py-4 rounded-lg hover:bg-red-600 transition text-xl"
              >
                Очистить корзину
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data } = await api.get("/cart", {
    headers: { cookie: req.headers.cookie || "" },
  });
  return { props: { initialCart: data } };
};

export default CartPage;
