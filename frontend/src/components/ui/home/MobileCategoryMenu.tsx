import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, ShoppingBag } from "lucide-react";

import { Category, Subcategory } from "../../../../types/category";
import CategoryItem from "./CategoryItem";

interface MobileCategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  subcategories: Record<number, Subcategory[]>;
  selectedCategory: number | null;
  toggleCategory: (categoryId: number) => void;
  handleSubcategoryClick: (subcategoryName: string, categoryId: number) => void;
}

const MobileCategoryMenu: React.FC<MobileCategoryMenuProps> = ({
  isOpen,
  onClose,
  categories,
  subcategories,
  selectedCategory,
  toggleCategory,
  handleSubcategoryClick,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-y-0 left-0 w-full bg-white shadow-lg z-40 lg:hidden overflow-y-auto"
          >
            <div className="p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Все категории</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1 ">
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    subcategories={subcategories[category.id]}
                    isSelected={selectedCategory === category.id}
                    onClick={() => toggleCategory(category.id)}
                    onSubcategoryClick={(subcategoryName) =>
                      handleSubcategoryClick(subcategoryName, category.id)
                    }
                    variant="mobile"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileCategoryMenu;
