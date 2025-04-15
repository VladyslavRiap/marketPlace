import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

import { subcategoryIcons } from "@/utils/iconutils";
import { Subcategory } from "../../../../types/category";

interface SubcategoryListProps {
  subcategories?: Subcategory[];
  onSubcategoryClick: (subcategoryName: string) => void;
  variant?: "desktop" | "mobile";
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subcategories,
  onSubcategoryClick,
  variant = "desktop",
}) => {
  if (variant === "desktop") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute left-full top-0 bg-white shadow-xl rounded-lg p-4 min-w-[220px] z-50 max-h-[80vh] overflow-y-auto"
      >
        {subcategories?.length ? (
          subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="flex items-center gap-2 py-2 px-3 text-gray-700 cursor-pointer hover:bg-gray-50 rounded hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                onSubcategoryClick(subcategory.name);
              }}
            >
              {subcategoryIcons[subcategory.name] || (
                <ShoppingBag className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm">{subcategory.name}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm p-2">Нет подкатегорий</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="pl-8 overflow-hidden"
    >
      {subcategories?.length ? (
        subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSubcategoryClick(subcategory.name)}
          >
            {subcategoryIcons[subcategory.name] || (
              <ShoppingBag className="w-4 h-4 text-gray-500" />
            )}
            <span>{subcategory.name}</span>
          </div>
        ))
      ) : (
        <div className="p-2 text-gray-400 text-sm">Нет подкатегорий</div>
      )}
    </motion.div>
  );
};

export default SubcategoryList;
