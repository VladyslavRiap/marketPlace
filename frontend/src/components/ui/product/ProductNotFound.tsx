import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useRouter } from "next/router";

export const ProductNotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <motion.div
        className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, the requested product does not exist or has been
          removed.
        </p>
        <Button
          onClick={() => router.push("/")}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Go back to homepage
        </Button>
      </motion.div>
    </div>
  );
};
