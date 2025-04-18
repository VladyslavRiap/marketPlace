import { useState, useEffect } from "react";
import { PlusCircle, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchColors, fetchSizes } from "@/redux/slices/productsSlice";

interface ColorSizeProps {
  onColorsChange: (colors: number[]) => void;
  onSizesChange: (sizes: number[]) => void;
  initialColors?: number[];
  initialSizes?: number[];
}

const ColorSizeSelector = ({
  onColorsChange,
  onSizesChange,
  initialColors = [],
  initialSizes = [],
}: ColorSizeProps) => {
  const dispatch = useAppDispatch();
  const { colors, sizes, status } = useAppSelector((state) => state.products);
  const [selectedColors, setSelectedColors] = useState<number[]>(initialColors);
  const [selectedSizes, setSelectedSizes] = useState<number[]>(initialSizes);

  useEffect(() => {
    dispatch(fetchColors());
    dispatch(fetchSizes());
  }, [dispatch]);

  const handleColorToggle = (colorId: number) => {
    const newSelectedColors = selectedColors.includes(colorId)
      ? selectedColors.filter((id) => id !== colorId)
      : [...selectedColors, colorId];

    setSelectedColors(newSelectedColors);
    onColorsChange(newSelectedColors);
  };

  const handleSizeToggle = (sizeId: number) => {
    const newSelectedSizes = selectedSizes.includes(sizeId)
      ? selectedSizes.filter((id) => id !== sizeId)
      : [...selectedSizes, sizeId];

    setSelectedSizes(newSelectedSizes);
    onSizesChange(newSelectedSizes);
  };

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading options...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Colors
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => handleColorToggle(color.id)}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                selectedColors.includes(color.id)
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: color.hex_code || color.name }}
              />
              {color.name}
              {selectedColors.includes(color.id) && (
                <XCircle className="w-4 h-4 ml-1 text-blue-600" />
              )}
            </button>
          ))}
          {colors.length === 0 && (
            <span className="text-sm text-gray-500">No colors available</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => handleSizeToggle(size.id)}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                selectedSizes.includes(size.id)
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {size.name}
              {selectedSizes.includes(size.id) && (
                <XCircle className="w-4 h-4 ml-1 text-blue-600" />
              )}
            </button>
          ))}
          {sizes.length === 0 && (
            <span className="text-sm text-gray-500">No sizes available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorSizeSelector;
