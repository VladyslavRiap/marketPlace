import { Star } from "lucide-react";

import Button from "@/components/Button";
import { Product, ProductAttribute, Review } from "../../../../types/prod";

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
  colorAttributes: ProductAttribute[];
  sizeAttributes: ProductAttribute[];
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

export const ProductInfo = ({
  product,
  reviews,
  colorAttributes,
  sizeAttributes,
  selectedImage,
  setSelectedImage,
}: ProductInfoProps) => {
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

      {colorAttributes.length > 0 && (
        <div>
          <div className="font-medium mb-2">Color:</div>
          <div className="flex gap-2">
            {colorAttributes.map((attr) => (
              <button
                key={attr.attribute_id}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selectedImage.includes(attr.attribute_value.toLowerCase())
                    ? "border-[#DB4444]"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: attr.attribute_value }}
                title={attr.attribute_value}
                onClick={() => {
                  const colorImage = product.images.find((img) =>
                    img
                      .toLowerCase()
                      .includes(attr.attribute_value.toLowerCase())
                  );
                  if (colorImage) setSelectedImage(colorImage);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {sizeAttributes.length > 0 && (
        <div>
          <div className="font-medium mb-2">Size:</div>
          <div className="flex gap-2 flex-wrap">
            {sizeAttributes.map((attr) => (
              <Button
                key={attr.attribute_id}
                variant="secondary"
                size="sm"
                className="rounded-md px-3 py-1"
              >
                {attr.attribute_value}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
