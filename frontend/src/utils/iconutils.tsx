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
  Tablet,
  Monitor,
  Keyboard,
  Mouse,
  Printer,
  Speaker,
  Headphones,
  Gamepad,
  Joystick,
  WashingMachine,
  Coffee,
  Watch,
  HeartPulse,
  Scissors,
  SprayCan,
  Sofa,
  Lamp,
  TreePine,
  Bone,
  Blocks,
  BookOpen,
  Bike,
  Tent,
  Wrench,
  ClipboardList,
  Utensils,
  Microwave,
} from "lucide-react";

import { JSX } from "react";
const getAttributeIcon = (attributeName: string) => {
  if (!attributeName) return <Info className="icon-attribute text-gray-600" />;

  switch (attributeName.toLowerCase()) {
    case "weight":
      return <Package className="icon-attribute text-teal-500" />;
    case "screen size":
      return <Ruler className="icon-attribute text-indigo-600" />;
    case "processor":
      return <Cpu className="icon-attribute text-orange-500" />;
    case "storage":
      return <HardDrive className="icon-attribute text-yellow-600" />;
    case "battery capacity":
      return <Battery className="icon-attribute text-red-600" />;
    case "brand":
      return <ALargeSmall className="icon-attribute text-pink-500" />;
    case "model":
      return <Component className="icon-attribute text-purple-600" />;
    case "ram":
      return <MemoryStick className="icon-attribute text-lime-500" />;
    case "operating system":
      return <Smartphone className="icon-attribute text-blue-500" />;
    case "camera (mp)":
      return <Camera className="icon-attribute text-rose-500" />;
    default:
      return <Info className="icon-attribute text-gray-600" />;
  }
};

export default getAttributeIcon;
export const categoryIcons: Record<string, JSX.Element> = {
  "Phones, Tablets and Laptops": (
    <Smartphone className="icon-category text-blue-500" />
  ),
  "Computers and Peripheral Devices": (
    <Laptop className="icon-category text-gray-700" />
  ),
  "TV, Audio and Photo": <Tv className="icon-category text-indigo-600" />,
  Game: <Gamepad2 className="icon-category text-red-500" />,
  "Large Electrical Appliances": (
    <Refrigerator className="icon-category text-teal-600" />
  ),
  "Small Electrical Appliances": (
    <Plug className="icon-category text-yellow-600" />
  ),
  Fashion: <Shirt className="icon-category text-pink-500" />,
  "Health and Beauty": <Heart className="icon-category text-rose-500" />,
  "Home, Garden and Pet Shop": (
    <Home className="icon-category text-green-600" />
  ),
  "Toys and Children’s Products": (
    <Baby className="icon-category text-orange-500" />
  ),
  "Sports and Leisure": <Dumbbell className="icon-category text-purple-600" />,
  "Auto and DIY": <Car className="icon-category text-gray-700" />,
  "Books, Office and Food": <Book className="icon-category text-blue-700" />,
};

export const subcategoryIcons: { [key: string]: JSX.Element } = {
  Smartphones: <Smartphone className="icon-subcategory text-blue-500" />,
  Tablets: <Tablet className="icon-subcategory text-blue-400" />,
  Laptops: <Laptop className="icon-subcategory text-gray-700" />,
  Desktops: <Monitor className="icon-subcategory text-gray-700" />,
  Monitors: <Monitor className="icon-subcategory text-gray-700" />,
  Keyboards: <Keyboard className="icon-subcategory text-gray-600" />,
  Mice: <Mouse className="icon-subcategory text-gray-600" />,
  Printers: <Printer className="icon-subcategory text-gray-700" />,
  "Storage Devices": <HardDrive className="icon-subcategory text-yellow-600" />,
  Televisions: <Tv className="icon-subcategory text-indigo-600" />,
  Speakers: <Speaker className="icon-subcategory text-indigo-500" />,
  Headphones: <Headphones className="icon-subcategory text-indigo-400" />,
  Cameras: <Camera className="icon-subcategory text-rose-500" />,
  "Game Consoles": <Gamepad className="icon-subcategory text-red-500" />,
  "Video Games": <Joystick className="icon-subcategory text-red-400" />,
  "Gaming Accessories": <Gamepad className="icon-subcategory text-red-300" />,
  Refrigerators: <Refrigerator className="icon-subcategory text-teal-600" />,
  "Washing Machines": (
    <WashingMachine className="icon-subcategory text-teal-500" />
  ),
  Dishwashers: <WashingMachine className="icon-subcategory text-teal-400" />,
  Ovens: <Microwave className="icon-subcategory text-yellow-500" />,
  "Coffee Machines": <Coffee className="icon-subcategory text-yellow-600" />,
  Clothing: <Shirt className="icon-subcategory text-pink-500" />,
  Skincare: <HeartPulse className="icon-subcategory text-rose-500" />,
  Haircare: <Scissors className="icon-subcategory text-gray-700" />,
  Perfumes: <SprayCan className="icon-subcategory text-gray-600" />,
  Furniture: <Sofa className="icon-subcategory text-green-700" />,
  Lighting: <Lamp className="icon-subcategory text-green-600" />,
  "Garden Tools": <TreePine className="icon-subcategory text-green-500" />,
  "Pet Supplies": <Bone className="icon-subcategory text-orange-500" />,
  Dolls: <Baby className="icon-subcategory text-orange-400" />,
  "Building Sets": <Blocks className="icon-subcategory text-orange-300" />,
  Books: <Book className="icon-subcategory text-blue-700" />,
};
