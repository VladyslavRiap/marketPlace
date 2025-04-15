import Button from "@/components/Button";
import { motion } from "framer-motion";

interface LogoutModalProps {
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal = ({ onClose, onLogout }: LogoutModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to log out of your account?
      </p>
      <div className="flex justify-end space-x-4">
        <Button
          variant="ghost"
          size="md"
          onClick={onClose}
          className="text-gray-700"
        >
          Cancel
        </Button>
        <Button variant="danger" size="md" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </motion.div>
  );
};

export default LogoutModal;
