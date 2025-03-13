import { useState } from "react";
import { XCircleIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  initialPreview?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  initialPreview,
}) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      onImageSelect(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    onImageSelect(null);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center relative">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-500 hover:text-white transition"
          >
            <XCircleIcon size={20} />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer">
          <div className="py-6 text-gray-500">
            Перетащите изображение сюда или кликните для загрузки
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
