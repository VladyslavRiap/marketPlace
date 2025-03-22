import { Slider } from "@mui/material";
import { FaStar, FaSync } from "react-icons/fa";
import SortSelect from "./SortSelect";

interface FiltersProps {
  category: string;
  setCategory: (value: string) => void;
  subcategory: string;
  setSubcategory: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  rating: number | null;
  setRating: (value: number | null) => void;
  categories: string[];
  subcategories: string[];
}

const Filters: React.FC<FiltersProps> = ({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  priceRange,
  setPriceRange,
  rating,
  setRating,
  categories,
  subcategories,
}) => {
  const resetCategory = () => setCategory("");
  const resetSubcategory = () => setSubcategory("");
  const resetPriceRange = () => setPriceRange([0, 10000]);
  const resetRating = () => setRating(null);

  return (
    <div className="flex  gap-6 bg-white rounded-xl">
      <div className="flex items-center gap-2">
        <SortSelect
          value={category}
          onChange={(value) => {
            setCategory(value);
            setSubcategory("");
          }}
          options={categories.map((cat) => ({ value: cat, label: cat }))}
          placeholder="All Categories"
        />
        <button
          onClick={resetCategory}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FaSync />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <SortSelect
          value={subcategory}
          onChange={setSubcategory}
          options={subcategories.map((sub) => ({ value: sub, label: sub }))}
          placeholder="All Subcategories"
        />
        <button
          onClick={resetSubcategory}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FaSync />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <span className=" font-medium text-gray-700">Price Range</span>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            sx={{ width: 250 }}
          />
        </div>
        <button
          onClick={resetPriceRange}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FaSync />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-2xl transition duration-200 ease-in-out ${
                star <= (rating || 0)
                  ? "text-yellow-500"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
              onClick={() => setRating(rating === star ? null : star)}
            />
          ))}
        </div>
        <button onClick={resetRating} className="p-2 hover:bg-gray-100 rounded">
          <FaSync />
        </button>
      </div>
    </div>
  );
};

export default Filters;
