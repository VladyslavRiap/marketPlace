import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Button from "@/components/Button";

interface ClearCartModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ClearCartModal = ({
  onClose,
  onConfirm,
  isLoading = false,
}: ClearCartModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
    >
      <div className="border-b border-gray-100 p-4 md:p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Clear Cart</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition p-1"
          aria-label="Close"
          disabled={isLoading}
        >
          X
        </button>
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-4">
          <p className="text-gray-700">
            Are you sure you want to remove all items from the cart? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="primary"
            size="md"
            fullWidth
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            size="md"
            fullWidth
            disabled={isLoading}
            icon={isLoading ? Loader2 : undefined}
          >
            {isLoading ? "Clearing..." : "Clear Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClearCartModal;
