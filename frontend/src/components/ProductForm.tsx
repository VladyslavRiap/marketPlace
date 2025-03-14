import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import CategorySelector from "./CategorySelector";
import { Product } from "@/redux/slices/productsSlice";
import PriceInput from "./PriceInput";

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: { id: number; name: string }[];
  subcategories: { id: number; name: string }[];
  onSubmit: (formData: FormData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  categories,
  subcategories,
  onSubmit,
}) => {
  const [product, setProduct] = useState({
    name: initialProduct?.name || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || 0,
    category_id: 0,
    subcategory_id: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialProduct?.image_url || null
  );

  useEffect(() => {
    if (initialProduct) {
      setProduct((prev) => ({
        ...prev,
        category_id:
          categories.find((cat) => cat.name === initialProduct.category)?.id ||
          0,
        subcategory_id:
          subcategories.find((sub) => sub.name === initialProduct.subcategory)
            ?.id || 0,
      }));
    }
  }, [initialProduct, categories, subcategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());
    formData.append("subcategory_id", product.subcategory_id.toString());
    if (image) formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="Название"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <textarea
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
        placeholder="Описание"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <PriceInput
        value={product.price}
        onChange={(val) => setProduct({ ...product, price: val })}
      />
      <ImageUploader onImageSelect={setImage} initialPreview={preview} />
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
      <button
        type="submit"
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        {initialProduct ? "Сохранить" : "Далее"}
      </button>
    </form>
  );
};

export default ProductForm;
