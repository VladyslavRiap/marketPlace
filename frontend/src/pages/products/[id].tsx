import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { useModal } from "@/redux/context/ModalContext";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Home, Share2 } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";
import {
  addToFavorites,
  fetchFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { addToCart, fetchCart } from "@/redux/slices/cartSlice";
import { ProductPageProps } from "../../../types/prod";
import { ProductNotFound } from "@/components/ui/product/ProductNotFound";
import { ProductInfo } from "@/components/ui/product/ProductInfo";
import { ProductAttributes } from "@/components/ui/product/ProductAttributes";
import { ProductActions } from "@/components/ui/product/ProductActions";
import { ProductReviews } from "@/components/ui/product/ProductReviews";
import { ProductImages } from "@/components/ui/product/ProductImages";
import ExploreOurProducts from "@/components/ui/home/ExploreOurProducts";

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  reviews,
  recommendedProducts,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const favorites = useAppSelector((state) => state.favorite.favorites);
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(
    product?.colors?.[0]?.id || null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(
    product?.sizes?.[0]?.id || null
  );
  if (!product) {
    return <ProductNotFound />;
  }
  const [selectedImage, setSelectedImage] = useState<string>(
    product!.images?.[0] || ""
  );

  useEffect(() => {
    if (product && user) {
      const trackCategoryView = async () => {
        try {
          await api.post(
            `/recommendations/track-category/${product.category_id}`
          );
        } catch (error) {
          console.error("Error tracking category:", error);
        }
      };

      trackCategoryView();
    }
  }, [product, user]);

  useEffect(() => {
    if (product) {
      setIsInCart(cartItems.some((item) => item.id === product.id));
      setIsFavorite(favorites.some((fav) => fav.id === product.id));
    }
  }, [cartItems, favorites, product]);
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!isInCart) {
        const cartPayload = {
          productId: product.id,
          quantity: 1,
          colorId: selectedColorId,
          sizeId: selectedSizeId,
        };

        await api.post("/cart", cartPayload);
        showMessage("Product added to cart", "success");
        dispatch(fetchCart());
      }
    } catch (error) {
      showMessage("Error adding to cart", "error");
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(product.id)).unwrap();
        showMessage("Removed from favorites", "success");
      } else {
        await dispatch(addToFavorites(product.id)).unwrap();
        showMessage("Added to favorites", "success");
      }
      dispatch(fetchFavorites());
    } catch (error) {
      showMessage("Error updating favorites", "error");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on our website`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showMessage("Link copied to clipboard", "success");
    }
  };

  const colorAttributes =
    product.attributes?.filter(
      (attr) =>
        attr.attribute_name &&
        (attr.attribute_name.toLowerCase().includes("color") ||
          attr.attribute_name.toLowerCase().includes("colour"))
    ) || [];

  const sizeAttributes =
    product.attributes?.filter(
      (attr) =>
        attr.attribute_name &&
        attr.attribute_name.toLowerCase().includes("size")
    ) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="flex items-center hover:text-[#DB4444]">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              href={`/products?page=1&category=${encodeURIComponent(
                product.category
              )}`}
              className="hover:text-[#DB4444]"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              href={`/products?page=1&category=${encodeURIComponent(
                product.category
              )}&subcategory=${encodeURIComponent(product.subcategory)}`}
              className="hover:text-[#DB4444]"
            >
              {product.subcategory}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#DB4444]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="md:hidden sticky top-0 z-10 bg-gray-50 shadow-sm p-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-gray-700">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
          {product.name}
        </h1>
        <button onClick={handleShare} className="text-gray-700">
          <Share2 size={20} />
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ProductImages
            images={product!.images}
            image_url={product!.image_url}
            old_price={product!.old_price}
            price={product!.price}
          />

          <div className="flex flex-col gap-6">
            <ProductInfo
              product={product}
              reviews={reviews}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              selectedColorId={selectedColorId}
              setSelectedColorId={setSelectedColorId}
              selectedSizeId={selectedSizeId}
              setSelectedSizeId={setSelectedSizeId}
            />

            <ProductActions
              isInCart={isInCart}
              isFavorite={isFavorite}
              onAddToCart={handleAddToCart}
              onFavoriteToggle={handleFavoriteToggle}
              showMessage={showMessage}
              userRole={user?.role}
            />
          </div>
        </div>
        {recommendedProducts && recommendedProducts.length > 0 && (
          <div className="mt-12">
            <ExploreOurProducts
              exploreProducts={{ products: recommendedProducts }}
            />
          </div>
        )}
        {product.attributes?.length > 0 && (
          <ProductAttributes
            attributes={product.attributes.filter(
              (attr) =>
                !colorAttributes.includes(attr) &&
                !sizeAttributes.includes(attr)
            )}
          />
        )}

        <ProductReviews reviews={reviews} productId={product.id} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const [
      { data: productData },
      { data: reviewsData },
      { data: recommendedData },
    ] = await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/reviews`),
      api.get(`/products`),
    ]);

    return {
      props: {
        product: productData,
        reviews: reviewsData,
        recommendedProducts: recommendedData.products || [],
      },
    };
  } catch (error) {
    console.error("Error loading product:", error);
    return {
      props: {
        product: null,
        reviews: [],
        recommendedProducts: [],
      },
    };
  }
};

export default ProductPage;
