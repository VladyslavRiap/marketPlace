import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Product } from "@/redux/slices/productsSlice";
import ProductCard from "@/components/ProductCard";
import api from "@/utils/api";
import Slider from "@mui/material/Slider";
import { FaStar } from "react-icons/fa";

const validCategories = [
  "Phones, tablets and laptops",
  "Computers and peripheral devices",
  "TV, audio and photo",
  "Game",
  "Large electrical appliances",
  "Small electrical appliances",
  "Fashion",
  "Health and Beauty",
  "Home, Garden and Pet Shop",
  "Toys and children’s products",
  "Sports and Leisure",
  "Auto and DIY",
  "Books, office and food",
];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  try {
    const { data } = await api.get("/products", { params: query });
    return { props: { initialProducts: data } };
  } catch (error) {
    return { props: { initialProducts: [] } };
  }
};

interface HomeProps {
  initialProducts: Product[];
}

const Home: React.FC<HomeProps> = ({ initialProducts }) => {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [category, setCategory] = useState(router.query.category || "");
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(router.query.minPrice) || 0,
    Number(router.query.maxPrice) || 10000,
  ]);
  const [rating, setRating] = useState<number | null>(
    router.query.rating ? Number(router.query.rating) : null
  );
  const [sortBy, setSortBy] = useState(router.query.sortBy || "id");
  const [order, setOrder] = useState(router.query.order || "asc");
  const limit = 12;
  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();

    if (category) queryParams.set("category", category as string);
    if (priceRange) {
      queryParams.set("minPrice", priceRange[0].toString());
      queryParams.set("maxPrice", priceRange[1].toString());
    }
    if (rating) queryParams.set("rating", rating.toString());
    if (sortBy) queryParams.set("sortBy", sortBy as string);
    if (order) queryParams.set("order", order as string);
    if (limit) queryParams.set("limit", limit.toString());
    router.replace(
      { pathname: "/products/", query: queryParams.toString() },
      undefined,
      {
        shallow: true,
      }
    );
  };

  useEffect(() => {
    updateQueryParams();
  }, [category, priceRange, rating, sortBy, order, limit]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const { data } = await api.get("/products", { params: router.query });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchFilteredProducts();
  }, [router.query]);

  const handleStarClick = (starValue: number) => {
    setRating((prevRating) => (prevRating === starValue ? null : starValue));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Products
      </h1>

      <div className="flex flex-wrap gap-4 mb-6 justify-between">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {validCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex flex-col items-center">
          <span>Price Range</span>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            sx={{ width: 250 }}
          />
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-xl ${
                star <= (rating || 0) ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[50vh]">
          <p className="text-3xl font-bold text-gray-800 text-center">
            No products found
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
