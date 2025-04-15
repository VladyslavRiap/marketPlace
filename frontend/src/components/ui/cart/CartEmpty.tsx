import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Button from "@/components/Button";

const CartEmpty = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
    <h2 className="text-xl font-medium text-gray-600 mb-2">
      Your cart is empty
    </h2>
    <Button href="/products" variant="primary" size="lg">
      Start shopping
    </Button>
  </motion.div>
);

export default CartEmpty;
