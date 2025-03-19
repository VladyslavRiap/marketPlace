import { useState } from "react";

const PriceInput: React.FC<{
  value: number;
  onChange: (val: number) => void;
}> = ({ value, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = Number(rawValue);
    setDisplayValue(numericValue.toLocaleString("ru-RU"));
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        $
      </span>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className="w-full pl-8 pr-4 py-2 border rounded-lg text-right"
      />
    </div>
  );
};

export default PriceInput;
