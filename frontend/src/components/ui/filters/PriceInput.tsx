import { useState, useEffect } from "react";

interface PriceInputProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  className?: string;
  required?: boolean;
}

const PriceInput = ({
  value,
  onChange,
  required = false,
  label,
  className = "",
}: PriceInputProps) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(value.toLocaleString("ru-RU"));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    onChange(numericValue);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          $
        </span>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          inputMode="numeric"
          required={required}
        />
      </div>
    </div>
  );
};

export default PriceInput;
