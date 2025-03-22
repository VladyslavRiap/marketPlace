import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { useAppDispatch } from "@/redux/hooks";
import { addAd } from "@/redux/slices/adminSlice";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";

interface AddAdModalProps {
  onClose: () => void;
}

const AddAdModal: React.FC<AddAdModalProps> = ({ onClose }) => {
  const [newAdImages, setNewAdImages] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const handleAddAd = async () => {
    if (newAdImages.length === 0) {
      showMessage("Please select at least one image to upload.", "info");
      return;
    }

    dispatch(addAd(newAdImages));
    showMessage("Add's successfull", "success");
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Добавить рекламу</h2>

      <ImageUploader
        onImageSelect={(files) => setNewAdImages(files)}
        initialPreview={null}
      />
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Отмена
        </button>
        <button
          onClick={handleAddAd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Загрузить
        </button>
      </div>
    </div>
  );
};

export default AddAdModal;
