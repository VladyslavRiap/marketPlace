import { motion } from "framer-motion";
import { Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CartItemProps } from "../../../../types/cart";

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border-b"
  >
    <div className="flex md:col-span-5 items-center gap-4">
      <div className="relative">
        <Link href={`/products/${item.id}`}>
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border">
            <Image
              src={item.images?.[0] || "/placeholder.png"}
              alt={item.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
      <div className="flex-1">
        <Link
          href={`/products/${item.id}`}
          className="text-sm font-medium text-gray-900 hover:text-[#E07575] transition"
        >
          {item.name}
        </Link>
        <div className="mt-1 text-sm text-gray-500 md:hidden">
          Price: ${Number(item.price || 0).toFixed(2)}
        </div>
        <div className="text-sm text-gray-500 md:hidden">
          Subtotal: ${Number(item.total_price || 0).toFixed(2)}
        </div>
      </div>
    </div>

    <div className="hidden md:flex md:col-span-2 items-center justify-center">
      <p className="font-medium text-gray-900">
        ${Number(item.price || 0).toFixed(2)}
      </p>
    </div>

    <div className="flex md:col-span-2 items-center justify-between md:justify-center">
      <div className="flex items-center border rounded-full overflow-hidden">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="p-2 text-gray-500"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="p-2 text-gray-500"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="md:hidden ml-4 p-2 text-red-500"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

    <div className="hidden md:flex md:col-span-3 items-center justify-center">
      <p className="font-bold text-gray-900">
        ${Number(item.total_price || 0).toFixed(2)}
      </p>
    </div>
  </motion.div>
);

export default CartItem;
