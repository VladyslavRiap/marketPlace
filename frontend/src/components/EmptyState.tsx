import { LucideIcon } from "lucide-react";
import Button from "./Button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };

  actionText?: string;
  actionLink?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  actionText,
  actionLink,
}) => {
  const finalAction =
    action ||
    (actionText && actionLink
      ? {
          label: actionText,
          href: actionLink,
        }
      : undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12 px-4"
    >
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-50 mb-6">
        <div className="text-gray-400">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-base leading-relaxed">
        {description}
      </p>
      {finalAction && (
        <Button
          href={finalAction.href}
          variant="primary"
          size="lg"
          className="px-8"
        >
          {finalAction.label}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
