import { useState } from "react";
import api from "@/utils/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { deleteProduct } from "@/redux/slices/adminSlice";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string;
}

interface ProductTableProps {
  products?: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products = [] }) => {
  const dispatch = useAppDispatch();
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  const handleDeleteProduct = async (productId: number) => {
    try {
      await dispatch(deleteProduct(productId));
      setLocalProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
    }
  };

  return (
    <motion.div
      className="overflow-x-auto bg-white shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Изображение
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Название
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Цена
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Категория
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 ">
              Действия
            </th>
          </tr>
        </thead>
        <tbody>
          {localProducts.map((product) => (
            <motion.tr
              key={product.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <td className="px-6 py-4 flex items-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden border">
                  <Image
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "/placeholder.png"
                    }
                    alt={product.name}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4 text-gray-900">{product.name}</td>
              <td className="px-6 py-4 text-gray-700 font-medium">
                ${product.price}
              </td>
              <td className="px-6 py-4 text-gray-600">{product.category}</td>
              <td className="px-6 py-4 text-left">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductTable;
