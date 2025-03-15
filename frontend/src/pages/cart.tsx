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
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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
  const [isClearCartOpen, setIsClearCartOpen] = useState(false);

  const handleRemove = async (productId: number) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      const updatedCart = localCart.filter((item) => item.id !== productId);
      setLocalCart(updatedCart);
      setTotalAmount(
        updatedCart.reduce(
          (acc, item) => acc + (Number(item.total_price) || 0),
          0
        )
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
              total_price:
                Number(
                  ((item.quantity + change) * (item.price || 0)).toFixed(2)
                ) || 0,
            }
          : item
      );

      setLocalCart(updatedCart);
      setTotalAmount(
        updatedCart.reduce(
          (acc, item) => acc + (Number(item.total_price) || 0),
          0
        )
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
      setIsClearCartOpen(false);
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
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col items-center md:flex-row md:justify-between">
              <p className="text-3xl font-bold text-gray-900">
                Итого:
                <span className="text-red-600">
                  ${isNaN(totalAmount) ? "0.00" : totalAmount.toFixed(2)}
                </span>
              </p>

              <button
                onClick={() => setIsClearCartOpen(true)}
                className="mt-4 md:mt-0 bg-red-500 text-white px-8 py-4 rounded-lg hover:bg-red-600 transition text-xl"
              >
                Очистить корзину
              </button>
            </div>
          </>
        )}
      </div>

      <Transition appear show={isClearCartOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsClearCartOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Очистить корзину
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Вы уверены, что хотите очистить корзину?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={() => setIsClearCartOpen(false)}
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={handleClearCart}
                    >
                      Очистить
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data } = await api.get("/cart", {
      headers: { cookie: req.headers.cookie || "" },
    });
    return { props: { initialCart: data } };
  } catch (error) {
    return { redirect: { destination: "/login", permanent: false } };
  }
};

export default CartPage;
