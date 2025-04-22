import { motion, HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "button3" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
  href?: string;
};

type ButtonProps = ButtonBaseProps &
  (
    | (Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof ButtonBaseProps | "onAnimationStart"
      > & {
        as?: "button";
      })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
        as?: "link";
        href: string;
      })
  );

const Button = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  children,
  href,
  as = href ? "link" : "button",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none   disabled:opacity-50 disabled:cursor-not-allowed ";

  const variantClasses = {
    primary: "bg-black text-white hover:bg-[#A0BCE0] shadow-sm",
    secondary: "bg-[#DB4444] text-white hover:bg-[#E07575] shadow-sm",
    button3: "bg-[#00FF66] text-white hover:bg-[#00CC55] shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${
    sizeClasses[size]
  } ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon className={`${iconSizeClasses[size]} mr-2`} />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className={`${iconSizeClasses[size]} lg:ml-2 ml:-1`} />
      )}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    className: buttonClasses,
  };

  if (as === "link" && href) {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={fullWidth ? "w-full" : "inline-block"}
      >
        <Link
          href={href}
          className={buttonClasses}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button {...motionProps} {...(props as HTMLMotionProps<"button">)}>
      {content}
    </motion.button>
  );
};

export default Button;
