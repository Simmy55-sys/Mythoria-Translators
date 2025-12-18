"use client";

// Fix the image upload (use the hustlepay's example)
import { useState } from "react";
import {
  getAssignmentAction,
  createSeriesAction,
} from "@/server-actions/translator";
import { toast } from "sonner";
import LoadingToast from "@/global/toasts/loading";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";
import AssignmentInformation from "./assignment-information";
import BasicInformation from "./basic-information";
import Description from "./description";
import AdditionalDetails from "./additional-details";
import SelectCategories from "./select-categories";
import ImageUploadAndCreateSeries from "./image-upload-and-create-series";

export default function AddNovelSeriesComponent() {
  const [formData, setFormData] = useState({
    assignmentId: "",
    title: "",
    slug: "",
    author: "",
    description: "",
    categories: [] as string[],
    status: "Ongoing",
    novelType: "novel" as "novel" | "manga" | "manhwa",
    featuredImage: null as File | null,
    coverImage: null as File | null,
    rating: 3.0,
    views: 0,
    likes: 0,
    bookmarks: 0,
    totalChapters: 0,
    language: "English",
    translator: "",
    originalLanguage: "Korean",
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const searchAssignment = async (assignmentId: string) => {
    if (!assignmentId.trim()) {
      setAssignmentError("");
      return;
    }

    setSearching(true);
    setAssignmentError("");

    try {
      const result = await getAssignmentAction(assignmentId);

      if (!result.success) {
        setAssignmentError(result.error || "Failed to fetch assignment");
        return;
      }

      const data = result.data;

      // Auto-fill title from assignment
      setFormData((prev) => ({
        ...prev,
        title: data.seriesName || prev.title,
        assignmentId: data.assignmentId || assignmentId,
      }));

      // Auto-generate slug from title
      if (data.seriesName) {
        const slug = data.seriesName
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        setFormData((prev) => ({ ...prev, slug }));
      }
    } catch (error: any) {
      setAssignmentError(error.message || "Assignment not found");
      console.error("Error searching assignment:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleAssignmentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, assignmentId: value }));
    setAssignmentError("");
  };

  const handleAssignmentIdBlur = () => {
    if (formData.assignmentId.trim()) {
      searchAssignment(formData.assignmentId);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const getFileType = (
    file: File
  ): "image" | "video" | "document" | "other" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("word")
    )
      return "document";
    return "other";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileUpload = (
    files: FileList | null,
    type: "featured" | "cover"
  ) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    // Validate file type
    if (getFileType(file) !== "image") {
      setFileError("Only image files are allowed");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setFileError(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }

    setFileError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setFormData((prev) => ({
        ...prev,
        [type === "featured" ? "featuredImage" : "coverImage"]: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "featured" | "cover"
  ) => {
    handleFileUpload(e.target.files, type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, type: "featured" | "cover") => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files, type);
  };

  const removeFile = () => {
    setPreviewImage("");
    setFormData((prev) => ({
      ...prev,
      featuredImage: null,
      coverImage: null,
    }));
    setFileError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let notificationId: string | number = "";
    toast.custom(
      (t) => {
        notificationId = t;
        return (
          <LoadingToast text="Creating your assigned series. This will be quick, please hold on" />
        );
      },
      { duration: Infinity }
    );

    try {
      const formDataToSubmit = new FormData();

      // Map status to backend format
      const statusMap: Record<string, "ongoing" | "completed"> = {
        Ongoing: "ongoing",
        Completed: "completed",
        Hiatus: "ongoing", // Default hiatus to ongoing
      };

      formDataToSubmit.append("assignmentId", formData.assignmentId);
      formDataToSubmit.append("slug", formData.slug);
      formDataToSubmit.append("author", formData.author);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("categories", formData.categories.join(","));
      formDataToSubmit.append(
        "status",
        statusMap[formData.status] || "ongoing"
      );
      formDataToSubmit.append("novelType", formData.novelType);
      formDataToSubmit.append("originalLanguage", formData.originalLanguage);
      if (formData.featuredImage) {
        formDataToSubmit.append("featuredImage", formData.featuredImage);
      }

      const result = await createSeriesAction(formDataToSubmit);

      if (!result.success) {
        toast.custom(
          (t) => (
            <ErrorToast
              text={result.error || "Failed to create series."}
              toastId={t}
            />
          ),
          { id: notificationId }
        );
        return;
      }

      toast.custom(
        (t) => (
          <SuccessToast
            text="Your assigned series has been created successfully!"
            toastId={t}
          />
        ),
        { id: notificationId }
      );

      // Reset form
      setFormData({
        assignmentId: "",
        title: "",
        slug: "",
        author: "",
        description: "",
        categories: [],
        status: "Ongoing",
        novelType: "novel",
        featuredImage: null,
        coverImage: null,
        rating: 3.0,
        views: 0,
        likes: 0,
        bookmarks: 0,
        totalChapters: 0,
        language: "English",
        translator: "",
        originalLanguage: "Korean",
      });
      setPreviewImage("");
      setAssignmentError("");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(error.message || "Failed to create series. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden pt-10 md:pt-20 pb-10 container">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <AssignmentInformation
            handleAssignmentIdBlur={handleAssignmentIdBlur}
            handleAssignmentIdChange={handleAssignmentIdChange}
            searching={searching}
            assignmentError={assignmentError}
            assignmentId={formData.assignmentId}
          />

          <BasicInformation
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <Description
            description={formData.description}
            handleInputChange={handleInputChange}
          />

          <SelectCategories
            formData={formData}
            handleCategoryToggle={handleCategoryToggle}
          />

          <AdditionalDetails
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
          />
        </div>

        {/* Sidebar - Image Upload */}
        <div className="lg:col-span-1">
          {/* Featured Image Upload */}
          <ImageUploadAndCreateSeries
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            setFormData={setFormData}
            handleImageUpload={handleImageUpload}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            removeFile={removeFile}
            fileError={fileError}
            isDragging={isDragging}
            formData={formData}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
