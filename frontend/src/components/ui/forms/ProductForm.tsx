import { useState, useEffect } from "react";
import PriceInput from "../filters/PriceInput";
import ImageUploader from "@/components/ImageUploader";
import CategorySelector from "../filters/CategorySelector";

import Button from "@/components/Button";
import { Loader2 } from "lucide-react";
import ColorSizeSelector from "@/components/ColorSizeSelector";

interface ProductFormProps {
  onSubmit: (formData: FormData) => void;
  isSubmitting?: boolean;
  initialProduct?: any;
  isEditMode?: boolean;
}

const ProductForm = ({
  onSubmit,
  isSubmitting = false,
  initialProduct = null,
  isEditMode = false,
}: ProductFormProps) => {
  const [product, setProduct] = useState({
    name: initialProduct?.name || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || 0,
    category_id: initialProduct?.category_id || 0,
    subcategory_id: initialProduct?.subcategory_id || 0,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    initialProduct?.images || []
  );
  const [selectedColors, setSelectedColors] = useState<number[]>(
    initialProduct?.colors?.map((c: any) => c.id) || []
  );
  const [selectedSizes, setSelectedSizes] = useState<number[]>(
    initialProduct?.sizes?.map((s: any) => s.id) || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && initialProduct) {
      setProduct((prev) => ({
        ...prev,
        subcategory_id:
          initialProduct.subcategory_id || initialProduct.subcategory || 0,
      }));
    }
  }, [initialProduct, isEditMode]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!product.name.trim()) newErrors.name = "Name is required";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (!product.price || product.price <= 0)
      newErrors.price = "Price must be greater than 0";

    if (!isEditMode) {
      if (product.category_id === 0)
        newErrors.category_id = "Category is required";
      if (product.subcategory_id === 0)
        newErrors.subcategory_id = "Subcategory is required";
      if (images.length === 0 && previews.length === 0)
        newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());

    formData.append("subcategory_id", product.subcategory_id.toString());

    selectedColors.forEach((colorId) => {
      formData.append("colors[]", colorId.toString());
    });

    selectedSizes.forEach((sizeId) => {
      formData.append("sizes[]", sizeId.toString());
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name*
          </label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="e.g., iPhone 13"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Detailed product description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[120px]"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className={isEditMode ? "md:col-span-2" : ""}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price*
          </label>
          <PriceInput
            value={product.price}
            onChange={(val: number) => {
              const price = typeof val === "number" && !isNaN(val) ? val : 0;
              setProduct({ ...product, price });
            }}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {!isEditMode ? (
          <div>
            <CategorySelector
              categoryId={product.category_id}
              subcategoryId={product.subcategory_id}
              onCategoryChange={(id) =>
                setProduct({ ...product, category_id: id, subcategory_id: 0 })
              }
              onSubcategoryChange={(id) =>
                setProduct({ ...product, subcategory_id: id })
              }
            />
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
            )}
            {errors.subcategory_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.subcategory_id}
              </p>
            )}
          </div>
        ) : (
          <input
            type="hidden"
            name="subcategory_id"
            value={product.subcategory_id}
          />
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images{isEditMode ? "" : "*"}
          </label>
          <ImageUploader
            onImageSelect={setImages}
            initialPreview={previews}
            maxFiles={8}
          />
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
          )}
          {isEditMode && previews.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Add new images to replace existing ones
            </p>
          )}
        </div>

        <div className="md:col-span-2 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Product Variants
          </h3>
          <ColorSizeSelector
            onColorsChange={setSelectedColors}
            onSizesChange={setSelectedSizes}
            initialColors={selectedColors}
            initialSizes={selectedSizes}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
