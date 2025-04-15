import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonGridProps {
  count?: number;
  cardSize?: "small" | "medium" | "large";
}

const SkeletonGrid = ({
  count = 12,
  cardSize = "medium",
}: SkeletonGridProps) => {
  const sizeClasses = {
    small: {
      grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6",
      height: "h-40",
    },
    medium: {
      grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      height: "h-48",
    },
    large: {
      grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      height: "h-64",
    },
  };

  return (
    <div className={`grid gap-4 ${sizeClasses[cardSize].grid}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden shadow-sm"
        >
          <Skeleton className={`w-full ${sizeClasses[cardSize].height}`} />
          <div className="p-3">
            <Skeleton count={2} className="mb-2" />
            <div className="flex justify-between items-center">
              <Skeleton width={60} />
              <Skeleton width={80} height={30} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
