import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchCategories,
  fetchSubcategories,
} from "@/redux/slices/categorySlice";

interface CategorySelectorProps {
  categoryId: number;
  subcategoryId: number;
  onCategoryChange: (categoryId: number) => void;
  onSubcategoryChange: (subcategoryId: number) => void;
  required?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categoryId,
  subcategoryId,
  required = false,
  onCategoryChange,
  onSubcategoryChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const subcategories = useSelector(
    (state: RootState) => state.categories.subcategories[categoryId] || []
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  useEffect(() => {
    if (categoryId && !subcategories.length) {
      dispatch(fetchSubcategories(categoryId));
      onSubcategoryChange(0);
    }
  }, [categoryId, dispatch, subcategories, onSubcategoryChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-50">Category</label>
      <select
        value={categoryId}
        onChange={(e) => onCategoryChange(parseInt(e.target.value, 10))}
        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value={0}>Choose category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Subcatery
      </label>
      <select
        value={subcategoryId}
        onChange={(e) => onSubcategoryChange(parseInt(e.target.value, 10))}
        className="w-full px-4  bg-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        disabled={!categoryId}
        required
      >
        <option value={0}>Choose Subcategory</option>
        {subcategories.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
