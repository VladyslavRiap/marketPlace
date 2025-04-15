import {
  CheckCircle,
  Truck,
  Package,
  ClipboardList,
  Clock,
  X,
} from "lucide-react";

const StatusBadge = ({
  status,
  cancelReason,
}: {
  status: string;
  cancelReason?: string;
}) => {
  const statusConfig = {
    registered: {
      color: "bg-gray-300 text-gray-800",
      label: "Registered",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    paid: {
      color: "bg-blue-100 text-blue-800",
      label: "Paid",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    prepared: {
      color: "bg-purple-100 text-purple-800",
      label: "Prepared",
      icon: <Package className="w-4 h-4" />,
    },
    shipped: {
      color: "bg-yellow-100 text-yellow-800",
      label: "Shipped",
      icon: <Truck className="w-4 h-4" />,
    },
    in_transit: {
      color: "bg-amber-100 text-amber-800",
      label: "In Transit",
      icon: <Truck className="w-4 h-4" />,
    },
    delivered: {
      color: "bg-green-100 text-green-800",
      label: "Delivered",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    received: {
      color: "bg-emerald-100 text-emerald-800",
      label: "Received",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    cancelled_by_buyer: {
      color: "bg-red-100 text-red-800",
      label: "Cancelled by Buyer",
      icon: <X className="w-4 h-4" />,
    },
    cancelled_by_seller: {
      color: "bg-orange-100 text-orange-800",
      label: "Cancelled by Seller",
      icon: <X className="w-4 h-4" />,
    },
    cancelled: {
      color: "bg-gray-200 text-gray-800",
      label: "Cancelled",
      icon: <X className="w-4 h-4" />,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    color: "bg-gray-100 text-gray-800",
    label: status,
    icon: null,
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
      {cancelReason && (
        <span className="text-xs text-gray-500 mt-1 sm:mt-0">
          ({cancelReason})
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
