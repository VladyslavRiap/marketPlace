import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import api from "@/utils/api";
import { useAppDispatch } from "@/redux/hooks";
import { addReview, updateReview } from "@/redux/slices/reviewSlice";

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

    if (rating === 0) {
      showMessage("Пожалуйста, поставьте оценку", "error");
      return;
    }

    try {
      if (review) {
        await dispatch(
          updateReview({ reviewId: review.id, rating, comment })
        ).unwrap();
        showMessage("Отзыв успешно изменен", "success");
        onSuccess();
      } else {
        await dispatch(addReview({ productId, rating, comment })).unwrap();
        showMessage("Отзыв успешно добавлен", "success");
      }
      onClose();
    } catch (error: any) {
      showMessage(
        `Ошибка при ${review ? "изменении" : "добавлении"} отзыва: ${
          error.message
        }`,
        "error"
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {review ? "Редактировать отзыв" : "Добавить отзыв"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Оценка</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-full ${
                  rating >= star ? "text-yellow-500" : "text-gray-300"
                } hover:text-yellow-500 transition`}
              >
                <Star className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Комментарий
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Напишите ваш отзыв..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {review ? "Изменить отзыв" : "Добавить отзыв"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewModal;
