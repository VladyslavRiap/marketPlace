import { Category, Subcategory } from "../../../../types/category";
import CategoryItem from "./CategoryItem";

interface DesktopCategoryMenuProps {
  categories: Category[];
  subcategories: Record<number, Subcategory[]>;
  hoveredCategoryId: number | null;
  handleCategoryHover: (categoryId: number) => void;
  handleCategoryLeave: () => void;
  handleCategoryClick: (categoryName: string) => void;
  handleSubcategoryClick: (subcategoryName: string, categoryId: number) => void;
}

const DesktopCategoryMenu: React.FC<DesktopCategoryMenuProps> = ({
  categories,
  subcategories,
  hoveredCategoryId,
  handleCategoryHover,
  handleCategoryLeave,
  handleCategoryClick,
  handleSubcategoryClick,
}) => {
  return (
    <div className="hidden lg:block w-72 bg-white shadow-sm z-10 relative">
      <div className=" sticky top-0  overflow-visible">
        <div className="space-y-1 border-r border-gray-200 ">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              subcategories={subcategories[category.id]}
              isHovered={hoveredCategoryId === category.id}
              onMouseEnter={() => handleCategoryHover(category.id)}
              onMouseLeave={handleCategoryLeave}
              onClick={() => handleCategoryClick(category.name)}
              onSubcategoryClick={(subcategoryName) =>
                handleSubcategoryClick(subcategoryName, category.id)
              }
              variant="desktop"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopCategoryMenu;
