import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchAttributes,
  addProductAttributes,
} from "@/redux/slices/productsSlice";

interface AttributeFormProps {
  productId: number | null;
  subcategoryId: number | null;
  onSubmit: (attributes: any[]) => void;
}

const AttributeForm: React.FC<AttributeFormProps> = ({
  productId,
  subcategoryId,
  onSubmit,
}) => {
  const dispatch = useAppDispatch();
  const { attributes } = useAppSelector((state) => state.products);
  const [values, setValues] = useState<
    { attribute_id: number; value: string }[]
  >([]);

  useEffect(() => {
    if (subcategoryId) {
      dispatch(fetchAttributes(subcategoryId));
    }
  }, [subcategoryId, dispatch]);

  useEffect(() => {
    if (attributes.length > 0) {
      setValues(
        attributes.map((attr) => ({ attribute_id: attr.id, value: "" }))
      );
    }
  }, [attributes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId) {
      dispatch(addProductAttributes({ productId, attributes: values })).then(
        () => onSubmit(values)
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {attributes.map((attr, index) => (
        <input
          key={attr.id}
          type={attr.type === "number" ? "number" : "text"}
          placeholder={attr.name}
          value={values[index]?.value || ""}
          onChange={(e) => {
            const updatedValues = [...values];
            updatedValues[index].value = e.target.value;
            setValues(updatedValues);
          }}
          className="w-full px-4 py-2 border rounded-lg"
        />
      ))}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Добавить атрибуты
      </button>
    </form>
  );
};

export default AttributeForm;
