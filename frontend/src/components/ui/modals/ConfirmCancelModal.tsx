import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import { updateOrderStatus } from "@/redux/slices/orderSlice";
import { useAppDispatch } from "@/redux/hooks";

interface ConfirmCancelModalProps {
  orderId: number;
  productId: number;
  cancelType: "buyer" | "seller";
  title?: string;
  message?: string;
  onClose: () => void;
}

const ConfirmCancelModal = ({
  orderId,
  productId,
  cancelType = "buyer",
  title = "Cancel Confirmation",
  message = "Are you sure you want to cancel this item in the order?",
  onClose,
}: ConfirmCancelModalProps) => {
  const dispatch = useAppDispatch();
  const [cancelReason, setCancelReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setError("Please provide a reason for the cancellation");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const status =
        cancelType === "buyer" ? "cancelled_by_buyer" : "cancelled_by_seller";

      await dispatch(
        updateOrderStatus({
          orderId,
          productId,
          status,
          cancelReason: cancelReason.trim(),
        })
      ).unwrap();

      onClose();
    } catch (err) {
      console.error("Cancel error:", err);
      setError("An error occurred while canceling the order");
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
      <div className="border-b border-gray-100 p-4 md:p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {cancelType === "seller" ? "Seller Cancellation" : title}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition p-1"
          aria-label="Close"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Cancellation <span className="text-red-500">*</span>
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder={`Provide the reason for cancellation by the ${
              cancelType === "seller" ? "seller" : "buyer"
            }`}
            rows={3}
            disabled={isLoading}
            className={`w-full px-3 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
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
            onClick={handleCancel}
            variant={cancelType === "seller" ? "danger" : "primary"}
            size="md"
            fullWidth
            disabled={isLoading}
            icon={isLoading ? Loader2 : undefined}
          >
            {isLoading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmCancelModal;
