import { motion } from "framer-motion";
import Button from "@/components/Button";
import Reviews from "@/components/Review";
import { REVIEW_MODAL_ID } from "@/redux/context/ModalContext";
import { useModal } from "@/redux/context/ModalContext";
import { Review } from "../../../../types/prod";

interface ProductReviewsProps {
  reviews: Review[];
  productId: number;
}

export const ProductReviews = ({ reviews, productId }: ProductReviewsProps) => {
  const { openModal } = useModal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="mt-12"
    >
      <div className="flex flex-col md:flex-row justify-between  items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          Reviews ({reviews.length})
        </h2>
        <Button
          onClick={() => openModal(REVIEW_MODAL_ID, { productId })}
          variant="secondary"
          size="lg"
        >
          Leave feedback
        </Button>
      </div>
      <Reviews initialReviews={reviews} productId={productId} />
    </motion.div>
  );
};
