import { motion } from "motion/react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const variantStyles = {
  primary:
    "bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white",
  secondary:
    "bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 text-white",
  danger:
    "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white",
  ghost:
    "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  outline:
    "bg-transparent border-2 border-primary-600 dark:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400",
};

const sizeStyles = {
  sm: "text-sm px-4 py-2 rounded-md",
  md: "text-base px-6 py-3 rounded-lg",
  lg: "text-lg px-8 py-4 rounded-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <motion.button
      className={`font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer shadow-sm hover:shadow-md"
      }`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
