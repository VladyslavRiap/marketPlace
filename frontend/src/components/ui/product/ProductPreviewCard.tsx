import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utils/api";

interface ProductPreviewCardProps {
  productId: number;
}

const ProductPreviewCard = ({ productId }: ProductPreviewCardProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <div className="text-gray-500">Product not found</div>;

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>
      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#DB4444]">
          ${product.price}
        </span>
        {product.old_price && (
          <span className="text-sm text-gray-400 line-through">
            ${product.old_price}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductPreviewCard;
