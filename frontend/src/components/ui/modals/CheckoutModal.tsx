import { FC, useState } from "react";
import { motion } from "framer-motion";

interface CheckoutModalProps {
  onClose: () => void;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    total_price: number;
  }>;
  totalAmount: number;
  onCheckout: (deliveryAddress: string) => Promise<void>;
}

const CheckoutModal: FC<CheckoutModalProps> = ({
  onClose,
  items,
  totalAmount,
  onCheckout,
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) return;
    setIsSubmitting(true);
    try {
      await onCheckout(deliveryAddress);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-lg p-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>

      <div className="mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.price} $ × {item.quantity}
              </p>
            </div>
            <p className="font-semibold">{item.total_price} $</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-lg font-bold mb-4">
        <span>Итого:</span>
        <span>{totalAmount.toFixed(2)} $</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Адрес доставки
          </label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Оформляем..." : "Оформить заказ"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutModal;
