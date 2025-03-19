import { Slider } from "@mui/material";
import { FaStar } from "react-icons/fa";
import SortSelect from "./SortSelect";

interface FiltersProps {
  category: string;
  setCategory: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  rating: number | null;
  setRating: (value: number | null) => void;
  categories: string[];
}

const Filters: React.FC<FiltersProps> = ({
  category,
  setCategory,
  priceRange,
  setPriceRange,
  rating,
  setRating,
  categories,
}) => {
  return (
    <div className="flex flex-wrap gap-16  justify-between bg-white  rounded-xl ">
      <SortSelect
        value={category}
        onChange={setCategory}
        options={categories.map((cat) => ({ value: cat, label: cat }))}
        placeholder="All Categories"
      />

      <div className="flex flex-col items-center">
        <span className="text-lg font-medium text-gray-700">Price Range</span>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          sx={{ width: 250 }}
        />
      </div>

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
    </div>
  );
};

export default Filters;
