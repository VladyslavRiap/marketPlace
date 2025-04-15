import { GetServerSideProps } from "next";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteProduct,
  fetchProductForEdit,
  fetchSellerProducts,
} from "@/redux/slices/productsSlice";
import ProductCard from "@/components/ui/cards/ProductCard";
import { useEffect } from "react";
import api from "@/utils/api";
import { useModal } from "@/redux/context/ModalContext";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { motion } from "framer-motion";
import { PlusCircle, Box, BarChart2 } from "lucide-react";
import Head from "next/head";
import StatsCard from "@/components/StatsCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/Button";
import { Product } from "../../types/product";
import Link from "next/link";

interface SellerDashboardProps {
  initialProducts: Product[];
}

const SellerDashboard = ({ initialProducts }: SellerDashboardProps) => {
  const dispatch = useAppDispatch();
  const { sellerItems, status } = useAppSelector((state) => state.products);
  const { openModal } = useModal();
  const { showMessage } = useSnackbarContext();

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const handleEdit = async (id: number) => {
    try {
      const product = await dispatch(fetchProductForEdit(id)).unwrap();
      openModal("productModal", { productToEdit: product });
    } catch (error) {
      showMessage(`Edit product error:${error}`, "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      showMessage("Product deleted successfully", "success");
    } catch (error) {
      showMessage(`Delete product error:${error}`, "error");
    }
  };

  return (
    <>
      <Head>
        <title>Seller Dashboard</title>
        <meta name="description" content="Manage your products" />
      </Head>

      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Seller Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatsCard
                icon={<Box className="w-5 h-5 text-blue-600" />}
                iconBg="bg-blue-100"
                title="Products"
                value={sellerItems.length.toString()}
              />
              <StatsCard
                icon={<BarChart2 className="w-5 h-5 text-green-600" />}
                iconBg="bg-green-100"
                title="Sales"
                value="24"
              />
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-800">My Products</h2>
            <Link href="/products/add">
              <Button icon={PlusCircle} variant="primary">
                Add Product
              </Button>
            </Link>
          </div>

          {status === "loading" ? (
            <LoadingSpinner />
          ) : sellerItems.length === 0 ? (
            <EmptyState
              icon={<Box className="w-12 h-12 text-gray-400 mx-auto" />}
              title="You don't have any products yet"
              description="Start adding products to showcase in your store"
            />
          ) : (
            <ProductGrid>
              {sellerItems.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  size="medium"
                />
              ))}
            </ProductGrid>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const token = req.cookies.token;
    const res = await api.get<Product[]>("/products/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      props: { initialProducts: res.data || [] },
    };
  } catch (error) {
    return {
      props: { initialProducts: [] },
    };
  }
};

export default SellerDashboard;
