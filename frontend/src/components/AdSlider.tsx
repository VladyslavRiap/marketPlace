import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Trash2, Plus, ArrowRight } from "lucide-react";
import { fetchAdsByPosition, addAd, deleteAd } from "@/redux/slices/adminSlice";
import { ADD_AD_MODAL_ID, useModal } from "@/redux/context/ModalContext";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { motion, AnimatePresence } from "framer-motion";

interface AdSliderProps {
  position: string;
}

interface Ad {
  id: number;
  image_url: string;
  link_url: string;
  title: string;
}

const AdSlider = ({ position }: AdSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const ads = useAppSelector(
    (state: RootState) =>
      (state.admin.ads as Record<string, Ad[]>)[position] || []
  );
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const { openModal } = useModal();

  useEffect(() => {
    dispatch(fetchAdsByPosition(position));
  }, [dispatch, position]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && ads.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % ads.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, ads.length]);

  const handleDeleteAd = async (id: number) => {
    try {
      await dispatch(deleteAd(id)).unwrap();
      showMessage("Ad successfully deleted", "success");
      if (currentSlide >= ads.length - 1) {
        setCurrentSlide(0);
      }
    } catch (error) {
      showMessage("Error deleting the ad", "error");
    }
  };

  const isAdmin = user?.role === "admin";

  if (ads.length === 0) {
    return isAdmin ? (
      <div className="relative w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
        <button
          onClick={() => openModal(ADD_AD_MODAL_ID, { position })}
          className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
        >
          <div className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Add Ad
          </div>
        </button>
      </div>
    ) : null;
  }

  return (
    <div className="w-full h-full">
      <div className="relative h-full overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative"
          >
            <img
              src={ads[currentSlide]?.image_url}
              alt={ads[currentSlide]?.title || `Ad ${position}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-ad.jpg";
              }}
            />

            {isAdmin && (
              <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
                <button
                  onClick={() => openModal(ADD_AD_MODAL_ID, { position })}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-colors z-10"
                  aria-label="Add ad"
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={() => handleDeleteAd(ads[currentSlide]?.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors z-10"
                  aria-label="Delete ad"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}

            {ads[currentSlide]?.link_url && (
              <div className="absolute bottom-6 right-6">
                <a
                  href={ads[currentSlide].link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 hover:bg-[#E07575] hover:text-white text-gray-900  px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Shop Now
                  <ArrowRight size={16} />
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {ads.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {ads.map((_: Ad, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                  currentSlide === index
                    ? "bg-red-500 border-2 border-white"
                    : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdSlider;
