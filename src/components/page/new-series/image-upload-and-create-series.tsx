import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dashboard } from "@/routes/client";
import { Upload, X } from "lucide-react";
import Link from "next/link";

export default function ImageUploadAndCreateSeries({
  previewImage,
  setPreviewImage,
  setFormData,
  handleImageUpload,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  removeFile,
  fileError,
  isDragging,
  formData,
  loading,
}: {
  previewImage: string;
  setPreviewImage: (image: string) => void;
  setFormData: (data: any) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "featured" | "cover"
  ) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, type: "featured" | "cover") => void;
  removeFile: () => void;
  fileError: string;
  isDragging: boolean;
  formData: {
    assignmentId: string;
    title: string;
    slug: string;
    author: string;
    description: string;
    categories: string[];
    rating: number;
  };
  loading: boolean;
}) {
  return (
    <Card className="p-6 border border-border/50 backdrop-blur-sm bg-[#27272A]/30 sticky top-20">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Featured Image
      </h3>

      <div className="mb-4">
        <label htmlFor="featured-image" className="block">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-[#27272A] hover:border-primary"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "featured")}
          >
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground/50">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>
        </label>
        <input
          id="featured-image"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "featured")}
          className="hidden"
        />
        {fileError && (
          <p className="text-sm text-destructive mt-1">{fileError}</p>
        )}
      </div>

      {/* Stats Summary */}
      <div className="space-y-3 mt-6 pt-6 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Initial Rating</span>
          <span className="font-semibold text-primary">{formData.rating}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Categories</span>
          <span className="font-semibold text-primary">
            {formData.categories.length}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          loading ||
          !formData.title ||
          !formData.description ||
          !formData.assignmentId ||
          formData.categories.length === 0
        }
        className="w-full mt-6 bg-linear-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-30"
      >
        {loading ? "Creating Series..." : "Create Series"}
      </Button>

      <Link href={dashboard}>
        <Button
          type="button"
          variant="outline"
          className="w-full mt-2 bg-transparent border-[#27272A]"
        >
          Cancel
        </Button>
      </Link>
    </Card>
  );
}
