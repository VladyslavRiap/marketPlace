import { GetServerSideProps } from "next";
import AdminLayout from "@/components/ui/layout/AdminLayout";
import ProductTable from "@/components/ui/tables/ProductTable";
import api from "@/utils/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string;
}

interface ProductsPageProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  totalPages,
  currentPage,
}) => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Управление продуктами
      </h1>
      <ProductTable products={products} />
      <div className="mt-6 flex justify-center">
        <span>
          Страница {currentPage} из {totalPages}
        </span>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data: userData } = await api.get("/users/me", {
      headers: { cookie: req.headers.cookie || "" },
    });
    if (userData.role !== "admin") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    const { data } = await api.get("/products");

    const products = data.products || [];
    const currentPage = data.currentPage;
    const totalPages = data.totalPages;
    return {
      props: {
        products,
        currentPage,
        totalPages,
      },
    };
  } catch (error) {
    return {
      props: {
        products: [],
      },
    };
  }
};

export default ProductsPage;
