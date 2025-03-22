import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Trash2 } from "lucide-react";
import { fetchAds, addAd, deleteAd } from "@/redux/slices/adminSlice";
import { ADD_AD_MODAL_ID, useModal } from "@/redux/context/ModalContext";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";

const AdSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { ads } = useAppSelector((state: RootState) => state.admin);
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const { openModal } = useModal();
  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  const handleDeleteAd = async (id: number) => {
    dispatch(deleteAd(id));
    showMessage("add's success deleted", "success");
  };

  const isAdmin = user?.role === "admin";

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <div className="w-full ml-8">
      <div className="relative">
        {ads.length > 0 && (
          <>
            <img
              src={ads[currentSlide].image_url}
              alt={`Ad ${ads[currentSlide].id}`}
              className=" w-full h-[800px] object-cover"
            />
            {isAdmin && (
              <button
                onClick={() => handleDeleteAd(ads[currentSlide].id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 hover:bg-red-700 rounded-full"
              >
                <Trash2 />
              </button>
            )}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 w-10 rounded-full"
            >
              &#10094;
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2  w-10 rounded-full"
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      {ads.length > 0 && (
        <div className="flex justify-center space-x-2 mt-4">
          {ads.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                currentSlide === index ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="mt-4">
          <button
            onClick={() => openModal(ADD_AD_MODAL_ID, {})}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Добавить рекламу
          </button>
        </div>
      )}
    </div>
  );
};

export default AdSlider;
