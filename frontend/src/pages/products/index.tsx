import { GetServerSideProps } from "next";
import { fetchProducts, Product } from "../../redux/slices/productsSlice";
import { store } from "../../redux/store";
import ProductCard from "../../components/ProductCard";

export const getServerSideProps: GetServerSideProps = async () => {
  await store.dispatch(fetchProducts());
  const state = store.getState();

  return {
    props: {
      products: state.products.items,
    },
  };
};

interface HomeProps {
  products: Product[];
}

const Home: React.FC<HomeProps> = ({ products }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
