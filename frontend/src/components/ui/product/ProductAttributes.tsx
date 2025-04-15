import { motion } from "framer-motion";

import getAttributeIcon from "@/utils/iconutils";
import { ProductAttribute } from "../../../../types/prod";

interface ProductAttributesProps {
  attributes: ProductAttribute[];
}

export const ProductAttributes = ({ attributes }: ProductAttributesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mt-12 bg-gray-50 rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Feature</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes
          .filter((attr) => {
            if (!attr?.attribute_name) return false;
            const name = attr.attribute_name.toLowerCase();
            return !name.includes("color") && !name.includes("size");
          })
          .map((attr, index) => (
            <div
              key={`${attr.attribute_id || index}-${attr.attribute_name}`}
              className="flex items-start gap-4 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="bg-[#DB4444] bg-opacity-10 p-2 rounded-full text-[#DB4444]">
                {getAttributeIcon(attr.attribute_name)}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  {attr.attribute_name || "Характеристика"}
                </h3>
                <p className="text-gray-600">{attr.attribute_value || "—"}</p>
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
};
