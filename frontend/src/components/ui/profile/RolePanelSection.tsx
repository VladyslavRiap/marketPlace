import Button from "@/components/Button";
import { Store, ShieldUser } from "lucide-react";

interface RolePanelSectionProps {
  user: any;
  handleGoToSeller: () => void;
  handleGoToAdmin: () => void;
}

export const RolePanelSection = ({
  user,
  handleGoToSeller,
  handleGoToAdmin,
}: RolePanelSectionProps) => {
  if (!(user.role === "seller" || user.role === "admin")) return null;

  return (
    <div className="w-full lg:w-1/2">
      <div
        onClick={user.role === "seller" ? handleGoToSeller : handleGoToAdmin}
        className="bg-white rounded-xl shadow-lg overflow-hidden h-full cursor-pointer hover:shadow-xl transition-transform hover:-translate-y-1"
      >
        <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-6 text-white">
          <h1 className="text-2xl font-bold">
            {user.role === "seller" ? "Seller Dashboard" : "Admin Dashboard"}
          </h1>
          <p className="text-indigo-100">
            {user.role === "seller"
              ? "Manage your products and orders"
              : "Manage the entire store"}
          </p>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="mb-6 p-4 bg-indigo-100 rounded-full">
            {user.role === "seller" ? (
              <Store className="w-16 h-16 text-indigo-600" />
            ) : (
              <ShieldUser className="w-16 h-16 text-indigo-600" />
            )}
          </div>
          <p className="text-center text-gray-700 mb-6">
            {user.role === "seller"
              ? "Go to the seller dashboard to manage your products, orders, and sales statistics."
              : "Go to the admin dashboard to manage the entire store, users, and system settings."}
          </p>
          <Button variant="primary" size="lg" fullWidth className="mt-auto">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
