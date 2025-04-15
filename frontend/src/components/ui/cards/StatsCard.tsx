import { Users, Box, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: "users" | "products";
  trend?: "up" | "down";
  percentage?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  percentage,
}) => {
  const Icon = icon === "users" ? Users : Box;
  const formattedValue = value.toLocaleString();

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            {formattedValue}
          </h3>
        </div>
        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && percentage && (
        <div
          className={`flex items-center mt-4 text-sm ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          <span>
            {percentage}% {trend === "up" ? "рост" : "снижение"}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
