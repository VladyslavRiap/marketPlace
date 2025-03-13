import { useState, useEffect } from "react";
import api from "@/utils/api";

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
  const [attributes, setAttributes] = useState<
    { id: number; name: string; type: string }[]
  >([]);
  const [values, setValues] = useState<
    { attribute_id: number; value: string }[]
  >([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (subcategoryId) {
        try {
          const { data } = await api.get(
            `/products/subcategories/${subcategoryId}/attributes`
          );
          setAttributes(data);
          setValues(
            data.map((attr: any) => ({ attribute_id: attr.id, value: "" }))
          );
        } catch (error) {
          console.error("Ошибка загрузки атрибутов:", error);
        }
      }
    };
    fetchAttributes();
  }, [subcategoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
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
