"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  updateSeriesAction,
  getSeriesByIdAction,
} from "@/server-actions/translator";
import { toast } from "sonner";
import LoadingToast from "@/global/toasts/loading";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";
const CATEGORIES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "School Life",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
  "Thriller",
  "Wuxia",
  "Martial Arts",
];

interface EditSeriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seriesId: string;
  onSuccess?: () => void;
}

export default function EditSeriesDialog({
  open,
  onOpenChange,
  seriesId,
  onSuccess,
}: EditSeriesDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    slug: "",
    author: "",
    status: "ongoing" as "ongoing" | "completed",
    novelType: "novel" as "novel" | "manga" | "manhwa",
    originalLanguage: "",
    categories: [] as string[],
    featuredImage: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (open && seriesId) {
      loadSeriesData();
    }
  }, [open, seriesId]);

  const loadSeriesData = async () => {
    setLoadingData(true);
    try {
      const result = await getSeriesByIdAction(seriesId);
      if (result.success && result.data) {
        const series = result.data;
        setFormData({
          description: series.description || "",
          slug: series.slug || "",
          author: series.author || "",
          status: series.status || "ongoing",
          novelType: series.novelType || "novel",
          originalLanguage: series.originalLanguage || "",
          categories: series.categories || [],
          featuredImage: null,
        });
        setPreviewImage(series.featuredImage || "");
      }
    } catch (error) {
      console.error("Failed to load series data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featuredImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let notificationId: string | number = "";
    toast.custom(
      (t) => {
        notificationId = t;
        return <LoadingToast text="Updating series. Please wait..." />;
      },
      { duration: Infinity }
    );

    try {
      const formDataToSend = new FormData();
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.slug) {
        formDataToSend.append("slug", formData.slug);
      }
      if (formData.author) {
        formDataToSend.append("author", formData.author);
      }
      if (formData.status) {
        formDataToSend.append("status", formData.status);
      }
      if (formData.novelType) {
        formDataToSend.append("novelType", formData.novelType);
      }
      if (formData.originalLanguage) {
        formDataToSend.append("originalLanguage", formData.originalLanguage);
      }
      if (formData.categories.length > 0) {
        formDataToSend.append("categories", formData.categories.join(","));
      }
      if (formData.featuredImage) {
        formDataToSend.append("featuredImage", formData.featuredImage);
      }

      const result = await updateSeriesAction(seriesId, formDataToSend);

      if (!result.success) {
        toast.custom(
          (t) => (
            <ErrorToast
              text={result.error || "Failed to update series."}
              toastId={t}
            />
          ),
          { id: notificationId }
        );
        return;
      }

      toast.custom(
        (t) => <SuccessToast text="Series updated successfully!" toastId={t} />,
        { id: notificationId }
      );

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Error updating series:", err);
      toast.custom(
        (t) => (
          <ErrorToast
            text={err.message || "Failed to update series. Please try again."}
            toastId={t}
          />
        ),
        { id: notificationId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#27272A]">
        <DialogHeader>
          <DialogTitle>Edit Series</DialogTitle>
          <DialogDescription>
            Update your series information. Leave fields empty to keep current
            values.
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading series data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="series-slug"
              />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "ongoing" | "completed") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="novelType">Novel Type</Label>
                <Select
                  value={formData.novelType}
                  onValueChange={(value: "novel" | "manga" | "manhwa") =>
                    setFormData((prev) => ({ ...prev, novelType: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novel">Novel</SelectItem>
                    <SelectItem value="manga">Manga</SelectItem>
                    <SelectItem value="manhwa">Manhwa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="originalLanguage">Original Language</Label>
              <Input
                id="originalLanguage"
                name="originalLanguage"
                value={formData.originalLanguage}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="e.g., Korean, Japanese, Chinese"
              />
            </div>

            <div>
              <Label>Categories</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={
                      formData.categories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="featuredImage">Featured Image</Label>
              <Input
                id="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
              />
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-48 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Series"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
