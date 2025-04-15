import { cn } from "@/utils/utils";

interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "secondary",
  className,
  children,
}) => {
  const variantClasses = {
    primary: "bg-indigo-100 text-indigo-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
