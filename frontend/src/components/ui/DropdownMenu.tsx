import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";

interface DropdownItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  className?: string;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  children: React.ReactNode;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={cn(
            "inline-flex justify-center items-center focus:outline-none",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {children}
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                    item.className
                  )}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                >
                  {Icon && <Icon className="w-4 h-4 mr-3" />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
