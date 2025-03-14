import {
  Info,
  Star,
  Package,
  Ruler,
  Cpu,
  HardDrive,
  Battery,
  ALargeSmall,
  Component,
  MemoryStick,
  Smartphone,
  Camera,
} from "lucide-react";

const getAttributeIcon = (attributeName: string) => {
  if (!attributeName) return <Info className="w-6 h-6 text-gray-600" />;

  switch (attributeName.toLowerCase()) {
    case "weight":
      return <Package className="w-6 h-6 text-teal-500" />;
    case "screen size":
      return <Ruler className="w-6 h-6 text-indigo-600" />;
    case "processor":
      return <Cpu className="w-6 h-6 text-orange-500" />;
    case "storage":
      return <HardDrive className="w-6 h-6 text-yellow-600" />;
    case "battery capacity":
      return <Battery className="w-6 h-6 text-red-600" />;
    case "brand":
      return <ALargeSmall className="w-6 h-6 text-pink-500" />;
    case "model":
      return <Component className="w-6 h-6 text-purple-600" />;
    case "ram":
      return <MemoryStick className="w-6 h-6 text-lime-500" />;
    case "operating system":
      return <Smartphone className="w-6 h-6 text-blue-500" />;
    case "camera (mp)":
      return <Camera className="w-6 h-6 text-rose-500" />;
    default:
      return <Info className="w-6 h-6 text-gray-600" />;
  }
};

export default getAttributeIcon;
