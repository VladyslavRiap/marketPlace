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
import {
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Home,
  ChevronRight,
} from "lucide-react";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import Link from "next/link";
import { CLEAR_CART_MODAL, useModal } from "@/redux/context/ModalContext";
import Button from "@/components/Button";

import CartEmpty from "@/components/ui/cart/CartEmpty";
import CartItem from "@/components/ui/cart/CartItem";
import CartTotal from "@/components/ui/cart/CartTotal";
import { CartPageProps } from "../../types/cart";

const CartPage = ({ initialCart }: CartPageProps) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const [localCart, setLocalCart] = useState(initialCart.items);
  const [totalAmount, setTotalAmount] = useState(initialCart.totalAmount);
  const { openModal, closeModal } = useModal();
  console.log(initialCart);
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
      showMessage("Item removed from cart", "success");
    } catch (error: any) {
      showMessage("Error: " + error.message, "error");
    }
  };

  const handleUpdateQuantity = async (productId: number, change: number) => {
    try {
      const updatedCart = localCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + change),
              total_price:
                Number(
                  ((item.quantity + change) * (item.price || 0)).toFixed(2)
                ) || 0,
            }
          : item
      );

      const itemToUpdate = updatedCart.find((item) => item.id === productId);
      if (itemToUpdate && itemToUpdate.quantity === 0) {
        await handleRemove(productId);
        return;
      }

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
      showMessage("Quantity updated", "info");
    } catch (error: any) {
      showMessage("Error: " + error.message, "error");
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      setLocalCart([]);
      setTotalAmount(0);
      showMessage("Cart cleared", "success");
      closeModal(CLEAR_CART_MODAL);
    } catch (error: any) {
      showMessage("Error: " + error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-[#E07575]">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/profile" className="hover:text-[#E07575]">
              My Account
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />

            <span className="text-[#E07575]">Cart</span>
          </div>
        </div>
      </div>

      <div className="lg:hidden sticky top-0 z-10 bg-gray-50 shadow-sm p-4 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Cart</h1>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 max-w-7xl">
        {localCart.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="flex flex-col">
            <div className="w-full mb-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b">
                  <div className="col-span-5 font-medium text-gray-500">
                    Product
                  </div>
                  <div className="col-span-2 font-medium text-gray-500 text-center">
                    Price
                  </div>
                  <div className="col-span-2 font-medium text-gray-500 text-center">
                    Quantity
                  </div>
                  <div className="col-span-3 font-medium text-gray-500 text-center">
                    Total
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {localCart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full flex  md:flex-row justify-between gap-4 mb-8">
              <Button
                href="/products"
                variant="secondary"
                size="lg"
                icon={ArrowLeft}
              >
                Back to shop
              </Button>
              <Button
                onClick={() =>
                  openModal(CLEAR_CART_MODAL, {
                    onConfirm: handleClearCart,
                  })
                }
                variant="secondary"
                size="lg"
              >
                Clear cart
              </Button>
            </div>

            <div className="w-full flex justify-end">
              <div className="w-full lg:w-1/3">
                <CartTotal
                  totalAmount={totalAmount}
                  itemCount={localCart.length}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data } = await api.get("/cart", {
      headers: { cookie: req.headers.cookie || "" },
      withCredentials: true,
    });
    return { props: { initialCart: data } };
  } catch (error) {
    return { redirect: { destination: "/login", permanent: false } };
  }
};

export default CartPage;
