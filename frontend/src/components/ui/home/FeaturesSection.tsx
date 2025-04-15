import React from "react";
import DeliveryIcon from "@/utils/icons/deliveryIcon";
import CustomerServiceIcon from "@/utils/icons/customerServiceIcon";
import MoneyBackIcon from "@/utils/icons/moneyBackIcon";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItem> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center space-y-2">
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black border-4 border-gray-400">
      {icon}
    </div>
    <p className="font-semibold uppercase text-sm">{title}</p>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features: FeatureItem[] = [
    {
      icon: <DeliveryIcon className="w-6 h-6 text-white" />,
      title: "Free and fast delivery",
      description: "Free delivery for all orders over $140",
    },
    {
      icon: <CustomerServiceIcon className="w-6 h-6 text-white" />,
      title: "24/7 Customer Service",
      description: "Friendly 24/7 customer support",
    },
    {
      icon: <MoneyBackIcon className="w-6 h-6 text-white" />,
      title: "Money Back Guarantee",
      description: "We return money within 30 days",
    },
  ];

  return (
    <div className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
