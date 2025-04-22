import { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import Head from "next/head";

import FavoritesGrid from "@/components/ui/favorites/FavoritesGrid";
import PersonalizedProducts from "@/components/ui/favorites/PersonalizedProducts";
import api from "@/utils/api";
import { Product } from "../../types/product";

interface FavoritesPageProps {
  initialFavorites: Product[];
  personalizedProducts: Product[];
}

const FavoritesPage = ({
  initialFavorites,
  personalizedProducts,
}: FavoritesPageProps) => {
  console.log(initialFavorites);
  return (
    <>
      <Head>
        <title>Wishlist</title>
        <meta name="description" content="Your wishlist items" />
      </Head>

      <motion.div
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-full mx-auto ">
          <FavoritesGrid initialFavorites={initialFavorites} />
          <PersonalizedProducts initialProducts={personalizedProducts} />
        </div>
      </motion.div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const [favoritesRes, personalizedRes] = await Promise.all([
      api.get<Product[]>("/favorites", {
        headers: { cookie: req.headers.cookie || "" },
        withCredentials: true,
      }),
      api.get<Product[]>("/recommendations/personalized-products?limit=10", {
        headers: { cookie: req.headers.cookie || "" },
        withCredentials: true,
      }),
    ]);

    return {
      props: {
        initialFavorites: favoritesRes.data,
        personalizedProducts: personalizedRes.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default FavoritesPage;
