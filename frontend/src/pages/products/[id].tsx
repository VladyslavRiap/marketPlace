import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import api from "@/utils/api";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image_url: string;
  rating: number;
}

interface ProductPageProps {
  product: Product | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const { data } = await api.get(`products/${id}`);
    return {
      props: { product: data },
    };
  } catch (error) {
    console.error("Ошибка при загрузке продукта:", error);
    return {
      props: { product: null },
    };
  }
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const router = useRouter();

  if (!product) {
    return (
      <motion.div
        className="text-center text-red-500 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>Товар не найден</p>
        <motion.button
          onClick={() => router.push("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Вернуться на главную
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg shadow-md"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-96 object-cover rounded-lg"
        />
      </motion.div>

      <div>
        <motion.h1
          className="text-3xl font-bold text-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {product.name}
        </motion.h1>
        <p className="text-yellow-500 text-lg">⭐ {product.rating} / 5</p>

        <div className="mt-4">
          {product.oldPrice && (
            <span className="text-gray-500 line-through text-lg">
              ${product.oldPrice}
            </span>
          )}
          <span className="text-red-600 text-2xl font-bold ml-2">
            ${product.price}
          </span>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Выберите размер:</h3>
        </div>

        <div className="mt-6 flex gap-4">
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Добавить в корзину
          </motion.button>
          <motion.button
            className="border border-gray-400 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ❤️ В избранное
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;
