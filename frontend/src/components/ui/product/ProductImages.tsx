import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  image_url: string;
  old_price?: number;
  price: number;
}

export const ProductImages = ({
  images,
  image_url,
  price,
  old_price,
}: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(images?.[0] || "");

  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-3 max-h-[500px] pr-1">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === image ? "border-[#DB4444]" : "border-gray-200"
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
        <Image
          src={selectedImage || image_url}
          alt="Product image"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {old_price && (
          <div className="absolute top-4 left-4 bg-[#DB4444] text-white px-3 py-1 rounded-full text-sm font-bold">
            -{Math.round((1 - price / old_price) * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};
