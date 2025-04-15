import { useState } from "react";
import { updateOrderStatus } from "@/redux/slices/orderSlice";
import Button from "@/components/Button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";

interface ConfirmStatusModalProps {
  orderId: number;
  productId: number;
  currentStatus: string;
  title: string;
  message: string;
  onClose: () => void;
}

const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({
  orderId,
  productId,
  currentStatus,
  title = "Confirm Status Change",
  message = "Are you sure you want to change the status of this item?",
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const getNextStatus = (status: string) => {
    const statusSteps = [
      { key: "registered", label: "Registered" },
      { key: "paid", label: "Paid" },
      { key: "prepared", label: "Prepared" },
      { key: "shipped", label: "Shipped" },
      { key: "in_transit", label: "In Transit" },
      { key: "delivered", label: "Delivered" },
      { key: "received", label: "Received" },
    ];

    const index = statusSteps.findIndex((s) => s.key === status);
    return index < statusSteps.length - 1 ? statusSteps[index + 1] : null;
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const nextStatus = getNextStatus(currentStatus);

      if (!nextStatus) {
        throw new Error("Failed to determine the next status");
      }

      await dispatch(
        updateOrderStatus({
          orderId,
          productId,
          status: nextStatus.key,
        })
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
    >
      <div className="border-b border-gray-100 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-6">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            fullWidth
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="md"
            fullWidth
            disabled={isLoading}
            icon={isLoading ? Loader2 : undefined}
          >
            {isLoading ? "Updating..." : "Confirm"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmStatusModal;
