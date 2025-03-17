import { useState } from "react";
import { XCircleIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  initialPreview?: string[] | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  initialPreview,
}) => {
  const [previews, setPreviews] = useState<string[]>(initialPreview || []);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      onImageSelect([...files, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onImageSelect(updatedFiles);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center relative">
      {previews.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <XCircleIcon size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <label className="cursor-pointer">
          <div className="py-6 text-gray-500">
            Перетащите изображения сюда или кликните для загрузки
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
