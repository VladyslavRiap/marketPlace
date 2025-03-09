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
      showMessage("Product sucsessfull deleted", "success");
    } catch (error) {
      console.error("Ошибка при удалении товара", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Мои товары</h1>

      <button
        onClick={() => openModal("productModal", { productToEdit: null })}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Добавить новый товар
      </button>

      {sellerItems.length === 0 && status !== "loading" ? (
        <div className="bg-yellow-100 p-6 rounded-lg text-center text-xl font-semibold text-gray-700">
          У вас нет товаров на продажу. Добавьте новые товары!
        </div>
      ) : status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sellerItems.map((product) => (
            <ProductCard
              product={product}
              onEdit={(id) => handleEdit(id)}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </div>
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
