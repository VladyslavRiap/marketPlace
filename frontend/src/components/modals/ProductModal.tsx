import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { XCircle } from "lucide-react";
import {
  addProduct,
  updateProduct,
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
  const { error } = useSelector((state: RootState) => state.products);
  const { categories, subcategories } = useSelector(
    (state: RootState) => state.categories
  );

  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState<number | null>(
    productToEdit?.id || null
  );
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  useEffect(() => {
    if (productToEdit) {
      const categoryArray = Object.values(categories).flat();
      const category = categoryArray.find(
        (cat) => cat.name === productToEdit.category
      );

      if (category) {
        if (!subcategories[category.id]) {
          dispatch(fetchSubcategories(category.id));
        }

        const subcategoryArray = Object.values(subcategories).flat();
        const subcategory = subcategoryArray.find(
          (sub) => sub.name === productToEdit.subcategory
        );
        if (subcategory) {
          setSubcategoryId(subcategory.id);
        }
      }
    }
  }, [productToEdit, categories, subcategories, dispatch]);

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
          setProductId(resultAction.payload.id);
          setStep(2);
        }
      }
    } catch (error) {
      console.error("Ошибка при сохранении продукта:", error);
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
            categories={Object.values(categories).flat()}
            subcategories={Object.values(subcategories).flat()}
            onSubmit={handleProductSubmit}
          />
        ) : (
          <AttributeForm
            productId={productId}
            subcategoryId={subcategoryId}
            onSubmit={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default ProductModal;
