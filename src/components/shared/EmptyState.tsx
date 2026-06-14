import { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F2F3F2] text-[#7C7C7C]">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-bold text-[#181725]">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-[#7C7C7C]">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#53B175] px-8 font-semibold text-white transition hover:bg-[#53B175]/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
