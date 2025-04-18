import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart, Truck, Undo2 } from "lucide-react";
import Button from "@/components/Button";

interface ProductActionsProps {
  isInCart: boolean;
  isFavorite: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  showMessage: (
    message: string,
    variant: "error" | "default" | "success" | "warning" | "info"
  ) => void;
  userRole?: string;
}

export const ProductActions = ({
  isInCart,
  isFavorite,
  onAddToCart,
  onFavoriteToggle,
  showMessage,
  userRole,
}: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99));
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const isSeller = userRole === "seller" || null;

  return (
    <>
      <div className="flex lg:flex-row flex-col items-center gap-4">
        {!isSeller && (
          <div className="flex items-center">
            <button
              onClick={decreaseQuantity}
              className="px-6 py-3 text-lg hover:bg-gray-300 rounded-l border border-gray-400"
            >
              <Minus size={20} />
            </button>
            <span className="px-6 py-2 text-lg text-center border-b border-t border-gray-400">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              className="px-6 py-3 text-lg bg-[#DB4444] hover:bg-[#E07575] rounded-r border border-gray-400"
            >
              <Plus size={20} color="white" />
            </button>
          </div>
        )}
        <div className="gap-8 flex">
          {!isSeller && (
            <Button
              onClick={onAddToCart}
              variant={isInCart ? "primary" : "secondary"}
              size="lg"
              className="rounded-lg"
            >
              <ShoppingCart />
              {isInCart ? "In cart" : "Buy now"}
            </Button>
          )}
          <Button
            onClick={onFavoriteToggle}
            variant={isFavorite ? "primary" : "secondary"}
            size="lg"
            className="rounded-lg py-3.5"
          >
            <Heart />
          </Button>
        </div>
      </div>

      {!isSeller && (
        <div className="rounded-xl p-4 flex flex-col text-lg text-gray-700 bg-gray-50 border-gray-300">
          <div className="py-4 px-4 flex items-center gap-3 border border-b-0 border-gray-300">
            <Truck size={50} className="text-[#DB4444]" />
            <span className="flex flex-col justify-start">
              Free shipping
              <button
                onClick={() => showMessage("Enter your postal code", "info")}
                className="underline"
              >
                Check
              </button>
            </span>
          </div>
          <div className="py-4 px-4 text-lg flex border border-gray-300 items-center gap-3">
            <Undo2 size={50} className="text-[#DB4444]" />
            <span className="flex flex-col justify-start">
              Product return
              <button
                onClick={() =>
                  showMessage("Return conditions: 30 days", "info")
                }
                className="underline"
              >
                More info
              </button>
            </span>
          </div>
        </div>
      )}
    </>
  );
};
