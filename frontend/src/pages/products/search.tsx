import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/api";
import { Product } from "@/redux/slices/productsSlice";
import ProductCard from "@/components/ProductCard";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api
        .get("/products/search", { params: { query } })
        .then((response) => {
          setSearchResults(response.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Search Results</h1>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found for "{query}"</p>
      )}
    </div>
  );
};

export default SearchPage;
