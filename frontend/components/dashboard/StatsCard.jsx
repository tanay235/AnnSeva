import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, icon: Icon, color = "green", trend }) {
  const colorMap = {
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      iconBg: "bg-green-100",
      value: "text-green-700",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      iconBg: "bg-amber-100",
      value: "text-amber-700",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      value: "text-blue-700",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      iconBg: "bg-purple-100",
      value: "text-purple-700",
    },
  };

  const c = colorMap[color] || colorMap.green;

  return (
    <div
      className={cn(
        "rounded-2xl p-5 border border-border bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className={cn("text-3xl font-bold mt-1", c.value)}>{value}</p>
          {trend && (
            <p className="text-xs text-gray-400 mt-1.5">{trend}</p>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", c.iconBg)}>
          <Icon className={cn("w-5 h-5", c.icon)} />
        </div>
      </div>
    </div>
  );
}
