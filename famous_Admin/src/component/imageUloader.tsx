"use client";
import { useState, useCallback, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import ImageUploader from "./ImageUploader";
export function ImageUploader({
  onImagesSelected,
}: {
  onImagesSelected: (files: File[]) => void;
}) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const processFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.match(/image\/(jpeg|png|gif)/)) {
        alert(`${file.name} is not a supported image type (PNG, JPG, GIF)`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit`);
        return;
      }
      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      onImagesSelected(validFiles);
    }
  };

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    // You might want to also update the parent component about removed images
  };

  return (
    <div className="space-y-2">
      <Label>Product Images</Label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}>
        <div className="relative">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/jpeg,image/png,image/gif"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Image previews */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <ImageUploader
                  images={images}
                  onImagesChange={setImages}
                  onFilesChange={setImageFiles}
                  multiple
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
