import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ShoppingBag } from "lucide-react";
import SubcategoryList from "./SubcategoryList";

import { categoryIcons, subcategoryIcons } from "@/utils/iconutils";
import { Category, Subcategory } from "../../../../types/category";

interface CategoryItemProps {
  category: Category;
  subcategories?: Subcategory[];
  isHovered?: boolean;
  isSelected?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick: () => void;
  onSubcategoryClick: (subcategoryName: string) => void;
  variant: "desktop" | "mobile";
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  subcategories,
  isHovered = false,
  isSelected = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onSubcategoryClick,
  variant,
}) => {
  return (
    <motion.div
      className={`relative ${
        variant === "mobile" ? "border-b border-gray-100 last:border-0" : ""
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={variant === "desktop" ? { scale: 1.02 } : undefined}
    >
      <div
        className={`flex items-center justify-between p-2  ${
          variant === "desktop"
            ? "rounded-lg bg-gray-100 hover:bg-gray-200"
            : "hover:bg-gray-50"
        } cursor-pointer`}
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          {categoryIcons[category.name] || (
            <ShoppingBag className="w-5 h-5 text-gray-700" />
          )}
          <span className="font-small">{category.name}</span>
        </div>

        <ChevronRight
          className={`w-5 h-5 transition-transform ${
            isSelected ? "rotate-90" : ""
          }`}
        />
      </div>

      {variant === "desktop" && (
        <AnimatePresence>
          {isHovered && (
            <motion.div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
              <SubcategoryList
                subcategories={subcategories}
                onSubcategoryClick={onSubcategoryClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {variant === "mobile" && isSelected && (
        <SubcategoryList
          subcategories={subcategories}
          onSubcategoryClick={onSubcategoryClick}
          variant="mobile"
        />
      )}
    </motion.div>
  );
};

export default CategoryItem;
