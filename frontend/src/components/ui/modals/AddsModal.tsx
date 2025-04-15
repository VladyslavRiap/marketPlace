import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { useAppDispatch } from "@/redux/hooks";
import { addAd } from "@/redux/slices/adminSlice";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { X } from "lucide-react";
import Button from "@/components/Button";

interface AddAdModalProps {
  onClose: () => void;
  position: string;
}

const AddAdModal: React.FC<AddAdModalProps> = ({ onClose, position }) => {
  const [newAdImage, setNewAdImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();

  const handleAddAd = async () => {
    if (!newAdImage) {
      showMessage("Please select an image to upload", "info");
      return;
    }

    try {
      await dispatch(
        addAd({
          image: newAdImage,
          position,
          title,
          linkUrl,
        })
      ).unwrap();
      showMessage("Ad successfully added", "success");
      onClose();
    } catch (error) {
      showMessage("Error while adding ad", "error");
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-xl w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Add Advertisement for {position}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ad title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com"
            />
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 transition hover:border-indigo-300">
            <ImageUploader
              onImageSelect={(files) => setNewAdImage(files[0])}
              initialPreview={null}
              multiple={false}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <Button onClick={onClose} variant="secondary" size="md" fullWidth>
            Cancel
          </Button>
          <Button
            onClick={handleAddAd}
            variant="primary"
            size="md"
            fullWidth
            disabled={!newAdImage}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAdModal;
