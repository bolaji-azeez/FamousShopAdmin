import { useState, useCallback } from "react";
import { FiUpload, FiX } from "react-icons/fi";

type ImageUploaderProps = {
  images: string[]; // always use array for consistency
  onImagesChange?: (images: string[]) => void;
  onFilesChange?: (files: File[]) => void;
  multiple?: boolean;
  aspectRatio?: number;
  uploadText?: string;
};

const ImageUploader = ({
  images = [],
  onImagesChange,
  onFilesChange,
  multiple = false,
  aspectRatio = 4 / 3,
  uploadText = "Upload Images",
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = useCallback(
    (fileList: FileList) => {
      const fileArray = Array.from(fileList);
      const newImages: string[] = [];
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target?.result as string);
          // When all files are read, update parent
          if (newImages.length === fileArray.length) {
            const updatedImages = multiple
              ? [...images, ...newImages]
              : [newImages[0]];
            onImagesChange?.(updatedImages);
            const updatedFiles = multiple
              ? [...files, ...fileArray]
              : [fileArray[0]];
            setFiles(updatedFiles);
            onFilesChange?.(updatedFiles);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [multiple, images, files, onImagesChange, onFilesChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange?.(newImages);

    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <FiUpload className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragging ? "Drop images here" : uploadText}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          <label className="cursor-pointer mt-2">
            <span className="px-2 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Select Files
            </span>
            <input
              type="file"
              multiple={multiple}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleFileChange(e.target.files)
              }
            />
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group"
              style={{ aspectRatio: aspectRatio.toString() }}
            >
              <img
                src={img}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;