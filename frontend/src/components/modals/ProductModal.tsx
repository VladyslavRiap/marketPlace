import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { XCircle } from "lucide-react";
import {
  addProduct,
  updateProduct,
  addProductAttributes,
  Product,
} from "@/redux/slices/productsSlice";
import {
  fetchCategories,
  fetchSubcategories,
} from "@/redux/slices/categorySlice";
import ProductForm from "../ProductForm";
import AttributeForm from "../AttributeForm";

interface ProductModalProps {
  onClose: () => void;
  productToEdit?: Product | null;
  onSuccess?: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  onClose,
  productToEdit,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sellerStatus, error } = useSelector(
    (state: RootState) => state.products
  );
  const { categories, subcategories } = useSelector(
    (state: RootState) => state.categories
  );

  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState<number | null>(
    productToEdit?.id || null
  );
  const [subcategoryId, setSubcategoryId] = useState<number | null>(
    productToEdit?.subcategory ? Number(productToEdit.subcategory) : null
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (subcategoryId) {
      console.log(subcategoryId);
      dispatch(fetchSubcategories(Number(subcategoryId)));
    } else if (productToEdit?.subcategory) {
      dispatch(fetchSubcategories(Number(productToEdit.subcategory)));
    }
  }, [subcategoryId, productToEdit, dispatch]);

  const handleProductSubmit = async (productData: FormData) => {
    try {
      if (productToEdit) {
        await dispatch(
          updateProduct({ id: productToEdit.id, product: productData })
        ).unwrap();
        onSuccess?.();
        onClose();
      } else {
        const resultAction = await dispatch(addProduct(productData));
        if (addProduct.fulfilled.match(resultAction)) {
          const newProductId = resultAction.payload.id;
          setProductId(newProductId);
          const subcategoryId = Number(productData.get("subcategory_id"));
          setSubcategoryId(subcategoryId);
          setStep(2);
        }
      }
    } catch (error) {
      console.error("Ошибка при сохранении продукта:", error);
    }
  };

  const handleAttributesSubmit = async (attributes: any[]) => {
    if (productId && subcategoryId) {
      try {
        await dispatch(
          addProductAttributes({ productId, attributes })
        ).unwrap();
        onSuccess?.();
        onClose();
      } catch (error) {
        console.error("Ошибка при добавлении атрибутов:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold text-center">
          {productToEdit
            ? "Редактировать продукт"
            : step === 1
            ? "Добавить продукт"
            : "Добавить атрибуты"}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {step === 1 ? (
          <ProductForm
            initialProduct={productToEdit}
            onSubmit={handleProductSubmit}
          />
        ) : (
          <AttributeForm
            productId={productId}
            subcategoryId={subcategoryId}
            onSubmit={handleAttributesSubmit}
          />
        )}

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
