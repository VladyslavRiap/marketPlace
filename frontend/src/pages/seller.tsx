import { GetServerSideProps } from "next";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteProduct,
  fetchSellerProducts,
  Product,
} from "@/redux/slices/productsSlice";
import ProductCard from "@/components/ProductCard";
import { useEffect } from "react";
import api from "@/utils/api";
import { useModal } from "@/context/ModalContext";
import { useSnackbarContext } from "@/context/SnackBarContext";
import { motion } from "framer-motion";
import { PlusCircle, Loader } from "lucide-react";

interface SellerDashboardProps {
  initialProducts: Product[];
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({
  initialProducts,
}) => {
  const dispatch = useAppDispatch();
  const { sellerItems, status } = useAppSelector((state) => state.products);
  const { openModal } = useModal();
  const { showMessage } = useSnackbarContext();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSellerProducts());
    }
  }, [dispatch, status]);

  const handleEdit = async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      openModal("productModal", { productToEdit: response.data });
    } catch (error) {
      console.error("Ошибка при загрузке товара для редактирования", error);
      showMessage("Не удалось загрузить данные товара", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      showMessage("Товар успешно удален", "success");
    } catch (error) {
      console.error("Ошибка при удалении товара", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Мои товары
      </motion.h1>

      <motion.button
        onClick={() => openModal("productModal", { productToEdit: null })}
        className="mb-8 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PlusCircle className="w-5 h-5" />
        Добавить новый товар
      </motion.button>

      {sellerItems.length === 0 && status !== "loading" ? (
        <motion.div
          className="bg-yellow-100 p-6 rounded-lg text-center text-xl font-semibold text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          У вас нет товаров на продажу. Добавьте новые товары!
        </motion.div>
      ) : status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sellerItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(id) => handleEdit(id)}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const token = req.cookies.token;
    const res = await api.get("/products/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data) {
      return {
        props: { initialProducts: res.data },
      };
    }

    throw new Error("No data found");
  } catch (error) {
    console.error("Ошибка при получении данных продавца:", error);
    return {
      props: { initialProducts: [] },
    };
  }
};

export default SellerDashboard;
