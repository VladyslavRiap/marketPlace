import { Star } from "lucide-react";
import { Product, Review } from "../../../../types/prod";

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
  selectedImage: string;
  setSelectedImage: (image: string) => void;
  selectedColorId: number | null;
  setSelectedColorId: (id: number | null) => void;
  selectedSizeId: number | null;
  setSelectedSizeId: (id: number | null) => void;
}

export const ProductInfo = ({
  product,
  reviews,
  selectedImage,
  setSelectedImage,
  selectedColorId,
  setSelectedColorId,
  selectedSizeId,
  setSelectedSizeId,
}: ProductInfoProps) => {
  const handleColorSelect = (colorId: number, colorName: string) => {
    setSelectedColorId(colorId);

    const colorImage = product.images.find((img) =>
      img.toLowerCase().includes(colorName.toLowerCase())
    );

    if (colorImage) setSelectedImage(colorImage);
  };

  return (
    <div className="flex flex-col gap-6 text-sm text-gray-700">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex text-yellow-400 text-base">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating || 0)
                    ? "fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-500">({reviews.length} reviews)</span>
          <span className="text-green-600 ml-2 font-medium">In stock</span>
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      <div className="flex items-center gap-4">
        {product.old_price && (
          <span className="text-gray-400 line-through text-xl">
            ${product.old_price}
          </span>
        )}
        <span className="text-3xl font-bold text-[#DB4444]">
          ${product.price}
        </span>
      </div>

      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="font-medium mb-2">Color:</div>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorSelect(color.id, color.name)}
                className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center 
                  ${
                    selectedColorId === color.id
                      ? "border-2 border-[#DB4444]"
                      : "border border-gray-300"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full`}
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="font-medium mb-2">Size:</div>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSizeId(size.id)}
                className={`px-3 py-1 rounded-md transition-all text-sm font-medium
                  ${
                    selectedSizeId === size.id
                      ? "bg-[#DB4444] text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
