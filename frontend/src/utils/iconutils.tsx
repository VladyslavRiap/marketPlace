import {
  Info,
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
  Laptop,
  Tv,
  Gamepad2,
  Refrigerator,
  Plug,
  Shirt,
  Heart,
  Home,
  Baby,
  Dumbbell,
  Car,
  Book,
} from "lucide-react";
import { JSX } from "react";
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
export const categoryIcons: Record<string, JSX.Element> = {
  "Phones, Tablets and Laptops": (
    <Smartphone className="w-6 h-6 text-gray-700" />
  ),
  "Computers and Peripheral Devices": (
    <Laptop className="w-6 h-6 text-gray-700" />
  ),
  "TV, Audio and Photo": <Tv className="w-6 h-6 text-gray-700" />,
  Game: <Gamepad2 className="w-6 h-6 text-gray-700" />,
  "Large Electrical Appliances": (
    <Refrigerator className="w-6 h-6 text-gray-700" />
  ),
  "Small Electrical Appliances": <Plug className="w-6 h-6 text-gray-700" />,
  Fashion: <Shirt className="w-6 h-6 text-gray-700" />,
  "Health and Beauty": <Heart className="w-6 h-6 text-gray-700" />,
  "Home, Garden and Pet Shop": <Home className="w-6 h-6 text-gray-700" />,
  "Toys and Children’s Products": <Baby className="w-6 h-6 text-gray-700" />,
  "Sports and Leisure": <Dumbbell className="w-6 h-6 text-gray-700" />,
  "Auto and DIY": <Car className="w-6 h-6 text-gray-700" />,
  "Books, Office and Food": <Book className="w-6 h-6 text-gray-700" />,
};
