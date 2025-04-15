import { Listbox, Transition } from "@headlessui/react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Fragment } from "react";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SortSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
}: SortSelectProps) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative ${className}`}>
        <Listbox.Button
          className={`relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
          }`}
        >
          <span className={`block truncate ${disabled ? "text-gray-500" : ""}`}>
            {selectedOption?.label || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronsUpDown className="w-5 h-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <Check className="w-5 h-5" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default SortSelect;
