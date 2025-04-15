import { useState, useCallback } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  initialPreview?: string[] | null;
  multiple?: boolean;
  maxFiles?: number;
  required?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  initialPreview = null,
  multiple = true,
  maxFiles = 10,
  required = false,
}) => {
  const [previews, setPreviews] = useState<string[]>(initialPreview || []);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        const newFiles = acceptedFiles.slice(0, maxFiles - files.length);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

        setFiles((prev) => [...prev, ...newFiles]);
        setPreviews((prev) => [...prev, ...newPreviews]);
        onImageSelect([...files, ...newFiles]);
      }
    },
    [files, maxFiles, onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple,
    maxFiles,
  });

  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    URL.revokeObjectURL(previews[index]);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onImageSelect(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className: `border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300"
          } cursor-pointer`,
        })}
      >
        <input {...getInputProps()} />
        {previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload className="w-10 h-10 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {isDragActive ? "Drop to upload" : "Drag images here"}
              </p>
              <p className="text-xs text-gray-500">Or click to select files</p>
              <p className="text-xs text-gray-400 mt-2">
                Supported: JPG, PNG, WEBP (max. {maxFiles} files)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">
              {isDragActive ? "Add more" : "Click or drag to add more"}
            </span>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs text-white truncate">
                  {files[index]?.name || `Image ${index + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <div className="text-sm text-gray-500">
          Uploaded: {previews.length} of {maxFiles} files
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
