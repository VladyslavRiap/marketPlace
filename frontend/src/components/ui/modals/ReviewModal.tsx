import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { useAppDispatch } from "@/redux/hooks";
import {
  addReview,
  fetchReviews,
  updateReview,
} from "@/redux/slices/reviewSlice";
import Button from "@/components/Button";
import { motion } from "framer-motion";

interface ReviewModalProps {
  productId: number;
  onClose: () => void;
  review?: {
    id: number;
    rating: number;
    comment: string;
  };
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  productId,
  onClose,
  review,
  onSuccess,
}) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showMessage } = useSnackbarContext();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (rating === 0) {
      showMessage("Please provide a rating", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      if (review) {
        await dispatch(
          updateReview({ reviewId: review.id, rating, comment })
        ).unwrap();
        showMessage("Review successfully updated", "success");
        onSuccess();
      } else {
        await dispatch(addReview({ productId, rating, comment })).unwrap();
        showMessage("Review successfully submitted", "success");
        dispatch(fetchReviews(productId));
      }

      onClose();
    } catch (error: any) {
      showMessage(
        `Error while ${review ? "updating" : "submitting"} review: ${
          error.message
        }`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {review ? "Edit Review" : "Your Review"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 transition-all ${
                      rating >= star
                        ? "text-yellow-500 scale-110"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  >
                    <Star className="w-6 h-6 md:w-7 md:h-7" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows={4}
                placeholder="Share your thoughts about the product..."
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : review ? "Save" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewModal;
