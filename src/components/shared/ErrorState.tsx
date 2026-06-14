import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface ErrorStateProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ErrorState({
  title,
  description,
  retryLabel = "Try Again",
  onRetry,
  children,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h2 className="text-xl font-bold text-[#181725]">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-[#7C7C7C]">{description}</p>

      {onRetry && !children && (
        <button
          onClick={onRetry}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-[#E2E2E2] bg-white px-8 font-semibold text-[#181725] transition hover:bg-[#F2F3F2] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
        >
          {retryLabel}
        </button>
      )}

      {children && <div className="mt-8 w-full">{children}</div>}
    </motion.div>
  );
}
