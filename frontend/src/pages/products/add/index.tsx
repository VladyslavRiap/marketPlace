import { useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/redux/hooks";
import {
  addProduct,
  addProductColors,
  addProductSizes,
} from "@/redux/slices/productsSlice";

import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductForm from "@/components/ui/forms/ProductForm";

const AddProductPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const productResult = await dispatch(addProduct(formData)).unwrap();

      const colors = formData.getAll("colors[]").map(Number);
      const sizes = formData.getAll("sizes[]").map(Number);

      if (colors.length > 0) {
        await dispatch(
          addProductColors({
            productId: productResult.id,
            colors,
          })
        ).unwrap();
      }

      if (sizes.length > 0) {
        await dispatch(
          addProductSizes({
            productId: productResult.id,
            sizes,
          })
        ).unwrap();
      }

      router.push(
        `/products/add/attributes?productId=${
          productResult.id
        }&subcategoryId=${formData.get("subcategory_id")}`
      );
    } catch (err: any) {
      setError(err.message || "Ошибка при сохранении товара");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { name: "Мои товары", href: "/seller" },
    { name: "Добавить товар", href: "#" },
  ];

  return (
    <h1 title="Добавление товара">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-gray-500 mt-1">
                Fill in the basic product information
              </p>
            </div>
            <div className="bg-blue-50 text-[#DB4444] px-3 py-1 rounded-full text-sm font-medium">
              Step 1 of 2
            </div>
          </div>

          <div className="space-y-6">
            <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </h1>
  );
};

export default AddProductPage;
