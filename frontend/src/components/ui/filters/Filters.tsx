import { Slider } from "@mui/material";
import { FaStar } from "react-icons/fa";
import PriceInput from "./PriceInput";
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
  className?: string;
}

const Filters = ({
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
  className = "",
}: FiltersProps) => {
  return (
    <div className={`bg-gray-50 space-y-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <SortSelect
            value={category}
            onChange={setCategory}
            options={[
              { value: "", label: "All categories" },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory
          </label>
          <SortSelect
            value={subcategory}
            onChange={setSubcategory}
            options={[
              { value: "", label: "All subcategories" },
              ...subcategories.map((sub) => ({ value: sub, label: sub })),
            ]}
            disabled={!category}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price range
        </label>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          sx={{
            color: "#6366f1",
            "& .MuiSlider-valueLabel": {
              backgroundColor: "#6366f1",
            },
          }}
        />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <PriceInput
            label="From"
            value={priceRange[0]}
            onChange={(val) => setPriceRange([val, priceRange[1]])}
          />
          <PriceInput
            label="To"
            value={priceRange[1]}
            onChange={(val) => setPriceRange([priceRange[0], val])}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(rating === star ? null : star)}
              className="focus:outline-none"
              aria-label={`Rating ${star}`}
            >
              <FaStar
                className={`text-xl ${
                  star <= (rating || 0)
                    ? "text-yellow-500"
                    : "text-gray-300 lg:hover:text-yellow-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
