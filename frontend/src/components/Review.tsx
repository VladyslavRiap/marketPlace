import { Edit, Star, Trash } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { REVIEW_MODAL_ID, useModal } from "@/context/ModalContext";
import { useSnackbarContext } from "@/context/SnackBarContext";
import { deleteReview, fetchReviews } from "@/redux/slices/reviewSlice";

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar_url?: string;
  user_id: number;
  product_id: number;
}

interface ReviewsProps {
  initialReviews: Review[];
  productId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ initialReviews, productId }) => {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const { openModal } = useModal();
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const refreshReviews = async () => {
    try {
      const { payload } = await dispatch(fetchReviews(productId));
      setReviews(payload);
    } catch (error) {
      console.error("Ошибка при обновлении отзывов:", error);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, [productId]);

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      showMessage("Отзыв успешно удален", "success");
      refreshReviews();
    } catch (error: any) {
      showMessage("Ошибка при удалении отзыва: " + error.message, "error");
    }
  };

  const handleEditReview = (review: Review) => {
    openModal(REVIEW_MODAL_ID, {
      productId: review.product_id,
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
      },
      onSuccess: refreshReviews,
    });
  };

  return (
    <motion.div
      className="mt-8 bg-white p-6 rounded-2xl shadow-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Отзывы о товаре
      </h3>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">Пока нет отзывов.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-5 bg-gray-50 rounded-xl shadow-sm flex items-start space-x-4"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {review.user_avatar_url ? (
                  <Image
                    src={review.user_avatar_url}
                    alt={review.user_name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    ?
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 font-medium">
                      {review.user_name}
                    </p>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}{" "}
                      {new Date(review.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {currentUserId === review.user_id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex mt-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Reviews;
