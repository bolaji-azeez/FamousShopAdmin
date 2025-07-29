import { FiArrowUp, FiArrowDown } from "react-icons/fi";

type StatsCardProps = {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: "up" | "down" | "neutral";
  change?: string;
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  change,
}: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {change && (
        <div
          className={`mt-4 flex items-center text-sm ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}>
          {trend === "up" ? (
            <FiArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <FiArrowDown className="h-4 w-4 mr-1" />
          )}
          <span>{change}</span>
          <span className="text-gray-500 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
