import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { X } from "lucide-react";
import {
  updateProduct,
  fetchSellerProducts,
} from "@/redux/slices/productsSlice";
import {
  fetchCategories,
  fetchSubcategories,
} from "@/redux/slices/categorySlice";
import ProductForm from "../forms/ProductForm";
import { Product } from "../../../../types/product";

interface ProductModalProps {
  onClose: () => void;
  productToEdit: Product;
  onSuccess?: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  onClose,
  productToEdit,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.products);
  const { categories, subcategories } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (productToEdit.subcategory) {
      dispatch(fetchSubcategories(Number(productToEdit.subcategory)));
    }
  }, [productToEdit.subcategory, dispatch]);

  const handleProductSubmit = async (productData: FormData) => {
    try {
      const editFormData = new FormData();
      editFormData.append("name", productData.get("name") as string);
      editFormData.append(
        "description",
        productData.get("description") as string
      );
      editFormData.append("price", productData.get("price") as string);

      const images = productData.getAll("images");
      images.forEach((image) => {
        editFormData.append("images", image);
      });

      if (productToEdit.subcategory) {
        editFormData.append(
          "subcategory_id",
          productToEdit.subcategory.toString()
        );
      }

      await dispatch(
        updateProduct({ id: productToEdit.id, product: editFormData })
      ).unwrap();

      onSuccess?.();
      dispatch(fetchSellerProducts());
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90dvh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <ProductForm
            initialProduct={productToEdit}
            onSubmit={handleProductSubmit}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
