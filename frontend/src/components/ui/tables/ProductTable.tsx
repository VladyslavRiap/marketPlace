import { useState } from "react";
import { Trash2, Edit, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { deleteProduct } from "@/redux/slices/adminSlice";
import DropdownMenu from "../DropdownMenu";
import { Product } from "../../../../types/product";

const ProductTable: React.FC<{ products?: Product[] }> = ({
  products = [],
}) => {
  const dispatch = useAppDispatch();
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProduct(id));
      setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100">
          <div className="col-span-2 font-medium text-gray-500">
            Изображение
          </div>
          <div className="col-span-3 font-medium text-gray-500">Название</div>
          <div className="col-span-2 font-medium text-gray-500">Цена</div>
          <div className="col-span-3 font-medium text-gray-500">Категория</div>
          <div className="col-span-2 font-medium text-gray-500">Действия</div>
        </div>

        {localProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="col-span-2">
              <div className="w-12 h-12 rounded-lg overflow-hidden border relative">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-span-3 font-medium text-gray-900">
              {product.name}
            </div>
            <div className="col-span-2 text-indigo-600 font-semibold">
              ${Number(product.price || 0).toFixed(2)}
            </div>
            <div className="col-span-3 text-gray-600">{product.category}</div>
            <div className="col-span-2 flex gap-2">
              <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 text-gray-500 hover:text-red-600 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {localProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-xs border border-gray-100"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden border relative">
                  <Image
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <DropdownMenu
                    items={[
                      { label: "Редактировать", icon: Edit, onClick: () => {} },
                      {
                        label: "Удалить",
                        icon: Trash2,
                        onClick: () => handleDelete(product.id),
                        className: "text-red-600",
                      },
                    ]}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </DropdownMenu>
                </div>
                <div className="mt-1 text-indigo-600 font-semibold">
                  ${Number(product.price || 0).toFixed(2)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {product.category}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;
