import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAttributes, resetAttributes } from "@/redux/slices/productsSlice";
import Button from "@/components/Button";
import { Loader2 } from "lucide-react";

interface AttributeFormProps {
  productId: number | null;
  subcategoryId: number | null;
  onSubmit: (attributes: { attribute_id: number; value: string }[]) => void;
  isSubmitting?: boolean;
}

const AttributeForm = ({
  productId,
  subcategoryId,
  onSubmit,
  isSubmitting = false,
}: AttributeFormProps) => {
  const dispatch = useAppDispatch();
  const { attributes } = useAppSelector((state) => state.products);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues({});
    if (subcategoryId) {
      dispatch(fetchAttributes(subcategoryId));
    } else {
      dispatch(resetAttributes());
    }
  }, [subcategoryId, dispatch]);

  useEffect(() => {
    if (attributes.length > 0) {
      const initialValues: Record<string, string> = {};
      attributes.forEach((attr) => {
        initialValues[attr.id.toString()] = "";
      });
      setValues(initialValues);
    }
  }, [attributes]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    attributes.forEach((attr) => {
      if (!values[attr.id.toString()]?.trim()) {
        newErrors[attr.id.toString()] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedAttributes = Object.entries(values).map(([id, value]) => ({
      attribute_id: Number(id),
      value,
    }));
    onSubmit(formattedAttributes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {attributes.map((attr) => (
        <div key={attr.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {attr.name}*
          </label>
          <input
            type={attr.type === "number" ? "number" : "text"}
            value={values[attr.id.toString()] || ""}
            onChange={(e) => {
              setValues((prev) => ({
                ...prev,
                [attr.id.toString()]: e.target.value,
              }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {errors[attr.id.toString()] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[attr.id.toString()]}
            </p>
          )}
        </div>
      ))}
      <div className="pt-6">
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
          ) : (
            "Save Attributes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AttributeForm;
