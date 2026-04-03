import { cn } from "@/lib/utils";

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
  reserved: {
    label: "Reserved",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  sold: {
    label: "Sold",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border border-red-200",
    dot: "bg-red-500",
  },
  pending: {
    label: "Pending",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
