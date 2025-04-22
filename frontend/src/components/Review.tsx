import { Edit, Star, Trash } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { REVIEW_MODAL_ID, useModal } from "@/redux/context/ModalContext";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { deleteReview, fetchReviews } from "@/redux/slices/reviewSlice";
import Button from "@/components/Button";

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string | null;
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

  const { reviews, loading, error } = useAppSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [productId, dispatch]);

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      showMessage("Review successfully deleted", "success");
    } catch (error: any) {
      showMessage("Error deleting review: " + error.message, "error");
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
      onSuccess: () => dispatch(fetchReviews(productId)),
    });
  };

  const getUserInitial = (userName: string | null): string => {
    if (!userName || userName.trim() === "") {
      return "?";
    }
    return userName.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      className="mt-8 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Customer Reviews
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DB4444]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          Error loading reviews: {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center space-y-4">
          <p className="text-gray-500">No reviews yet. Be the first!</p>
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              openModal(REVIEW_MODAL_ID, {
                productId,
                onSuccess: () => dispatch(fetchReviews(productId)),
              })
            }
          >
            Write a Review
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              className="p-4 bg-gray-50 rounded-lg transition-all hover:shadow-xs"
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.1 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {review.user_avatar_url ? (
                      <Image
                        src={review.user_avatar_url}
                        alt={review.user_name || "Anonymous"}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium">
                        {getUserInitial(review.user_name)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user_name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {currentUserId === review.user_id && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReview(review)}
                          className="p-1.5 text-gray-500 hover:text-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-1.5 text-red-500 hover:text-red-600"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex mt-2">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Reviews;
