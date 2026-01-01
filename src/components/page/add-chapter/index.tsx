"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import AddChapterStepOne from "./step-one";
import AddChapterStepTwo from "./step-two";
import AddChapterStepThree from "./step-three";
import AddChapterStepFour from "./step-four";
import {
  getTranslatorSeriesAction,
  createChapterAction,
  getChapterByIdAction,
  updateChapterAction,
} from "@/server-actions/translator";
import { toast } from "sonner";
import LoadingToast from "@/global/toasts/loading";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";
import WarnToast from "@/global/toasts/warn";
import { Spinner } from "@/components/ui/spinner";
import { manageSeriesChapterDetail } from "@/routes/client";

const { Stepper } = defineStepper(
  {
    id: "step-1",
    title: "Series selection",
    description: "Select a series to add a chapter to",
  },
  {
    id: "step-2",
    title: "Chapter details",
    description: "Add chapter information and content",
  },
  {
    id: "step-3",
    title: "Chapter settings",
    description: "Configure chapter access settings",
  },
  {
    id: "step-4",
    title: "Review",
    description: "Review and publish your chapter",
  }
);

export default function AddChapterComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterData, setChapterData] = useState({
    chapterNumber: "",
    chapterTitle: "",
    fileSource: "upload",
    fileUrl: "",
    chapterFile: null as File | null,
    chapterImage: null as File | null,
    chapterImagePreview: null as string | null,
    publishDate: new Date().toISOString().split("T")[0],
    isPremium: false,
    priceInCoins: 20,
    language: "English",
    notes: "",
    content: "", // For inbuilt editor
  });

  // Load translator's series
  useEffect(() => {
    const loadSeries = async () => {
      setLoadingSeries(true);
      try {
        const result = await getTranslatorSeriesAction();
        if (result.success) {
          const series = result.data || [];
          setSeriesList(series);

          // Auto-select series if seriesId is in query params
          const seriesIdFromQuery = searchParams.get("seriesId");
          if (seriesIdFromQuery) {
            const foundSeries = series.find(
              (s: any) => s.id === seriesIdFromQuery
            );
            if (foundSeries) {
              setSelectedSeries(foundSeries);
            } else {
              toast.custom(
                (t) => (
                  <ErrorToast
                    text="Series not found or you don't have access to it"
                    toastId={t}
                  />
                ),
                { duration: 5000 }
              );
            }
          }
        } else {
          toast.custom(
            (t) => (
              <ErrorToast
                text={result.error || "Failed to load series"}
                toastId={t}
              />
            ),
            { duration: 5000 }
          );
        }
      } catch (error) {
        toast.custom(
          (t) => <ErrorToast text="Failed to load series" toastId={t} />,
          { duration: 5000 }
        );
        console.error("Error loading series:", error);
      } finally {
        setLoadingSeries(false);
      }
    };
    loadSeries();
  }, [searchParams]);

  // Load chapter data if in edit mode
  useEffect(() => {
    const loadChapterData = async () => {
      const editMode = searchParams.get("edit") === "true";
      const chapterId = searchParams.get("chapterId");
      const seriesId = searchParams.get("seriesId");

      if (editMode && chapterId && seriesId) {
        setIsEditMode(true);
        setEditingChapterId(chapterId);
        setLoadingChapter(true);

        try {
          const result = await getChapterByIdAction(seriesId, chapterId);
          if (result.success && result.data) {
            const chapter = result.data;
            setChapterData({
              chapterNumber: String(chapter.chapterNumber || ""),
              chapterTitle: chapter.title || "",
              fileSource: "inbuilt", // Always use inbuilt editor for editing
              fileUrl: "",
              chapterFile: null,
              chapterImage: null,
              chapterImagePreview: null,
              publishDate: chapter.publishDate
                ? new Date(chapter.publishDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              isPremium: chapter.isPremium || false,
              priceInCoins: chapter.priceInCoins || 20,
              language: (chapter.language || "english").toLowerCase(),
              notes: chapter.notes || "",
              content: chapter.content || "",
            });
          } else {
            toast.custom(
              (t) => (
                <ErrorToast
                  text={result.error || "Failed to load chapter data"}
                  toastId={t}
                />
              ),
              { duration: 5000 }
            );
          }
        } catch (error) {
          toast.custom(
            (t) => (
              <ErrorToast text="Failed to load chapter data" toastId={t} />
            ),
            { duration: 5000 }
          );
          console.error("Error loading chapter:", error);
        } finally {
          setLoadingChapter(false);
        }
      }
    };

    loadChapterData();
  }, [searchParams]);

  // Validation functions for each step
  const isStep1Valid = () => {
    return selectedSeries !== null;
  };

  const isStep2Valid = () => {
    if (!chapterData.chapterNumber || !chapterData.chapterTitle) {
      return false;
    }
    // In edit mode, content already exists, so we don't need to validate content source
    if (isEditMode) {
      return true;
    }
    // Check if content source is provided for new chapters
    if (chapterData.fileSource === "upload" && !chapterData.chapterFile) {
      return false;
    }
    if (chapterData.fileSource === "inbuilt" && !chapterData.content) {
      return false;
    }
    return true;
  };

  const isStep3Valid = () => {
    return (
      chapterData.language &&
      chapterData.publishDate &&
      (chapterData.isPremium ? chapterData.priceInCoins > 0 : true)
    );
  };

  const canProceedToNext = (currentStep: string) => {
    switch (currentStep) {
      case "step-1":
        return isStep1Valid();
      case "step-2":
        return isStep2Valid();
      case "step-3":
        return isStep3Valid();
      default:
        return true;
    }
  };

  const handlePublish = async () => {
    if (!selectedSeries) {
      toast.custom(
        (t) => <WarnToast text="Please select a series" toastId={t} />,
        { duration: 5000 }
      );
      return;
    }

    if (!isStep2Valid()) {
      toast.custom(
        (t) => (
          <WarnToast
            text="Please complete all required fields in step 2"
            toastId={t}
          />
        ),
        { duration: 5000 }
      );
      return;
    }

    setPublishing(true);

    let notificationId: string | number = "";
    toast.custom(
      (t) => {
        notificationId = t;
        return (
          <LoadingToast
            text={
              isEditMode
                ? "Updating chapter. This will be quick, please hold on"
                : "Publishing chapter. This will be quick, please hold on"
            }
          />
        );
      },
      { duration: Infinity }
    );

    try {
      // Handle edit mode
      if (isEditMode && editingChapterId) {
        const updatePayload: {
          title?: string;
          content?: string;
          isPremium?: boolean;
          publishDate?: string;
          language?: string;
          priceInCoins?: number;
          chapterNumber?: number;
          notes?: string;
        } = {
          title: chapterData.chapterTitle,
          chapterNumber: parseInt(chapterData.chapterNumber, 10),
          publishDate: new Date(chapterData.publishDate).toISOString(),
          language: chapterData.language,
          isPremium: chapterData.isPremium,
        };

        if (chapterData.fileSource === "inbuilt") {
          updatePayload.content = chapterData.content;
        }
        // Note: File upload updates are not supported in edit mode
        // User would need to use inbuilt editor

        // Always include isPremium to allow switching between premium and free
        // If switching to free, priceInCoins should not be included or set to 0
        if (chapterData.isPremium) {
          updatePayload.priceInCoins = chapterData.priceInCoins || 20;
        } else {
          // Explicitly set priceInCoins to 0 or undefined when switching to free
          updatePayload.priceInCoins = 0;
        }

        if (chapterData.notes) {
          updatePayload.notes = chapterData.notes;
        }

        const result = await updateChapterAction(
          selectedSeries.id,
          editingChapterId,
          updatePayload
        );

        if (!result.success) {
          toast.custom(
            (t) => (
              <ErrorToast
                text={result.error || "Failed to update chapter."}
                toastId={t}
              />
            ),
            { id: notificationId }
          );
          return;
        }

        toast.custom(
          (t) => (
            <SuccessToast text="Chapter updated successfully!" toastId={t} />
          ),
          { id: notificationId }
        );

        router.push(
          manageSeriesChapterDetail(selectedSeries.id, editingChapterId)
        );
        return;
      }

      // Create new chapter
      const formDataToSubmit = new FormData();

      // Add all chapter data to FormData
      formDataToSubmit.append("title", chapterData.chapterTitle);
      formDataToSubmit.append("chapterNumber", chapterData.chapterNumber);
      formDataToSubmit.append(
        "publishDate",
        new Date(chapterData.publishDate).toISOString()
      );
      formDataToSubmit.append("language", chapterData.language);
      formDataToSubmit.append("isPremium", chapterData.isPremium.toString());

      // Handle content based on source
      if (chapterData.fileSource === "upload" && chapterData.chapterFile) {
        // Upload file - server will extract text and upload to Cloudinary
        formDataToSubmit.append("chapterFile", chapterData.chapterFile);
        // For file upload, content can be empty or a placeholder
        // Server will extract the actual content from the file
        formDataToSubmit.append("content", "");
      } else {
        // Inbuilt editor - send text content
        formDataToSubmit.append("content", chapterData.content);
      }

      // Optional fields
      if (chapterData.isPremium) {
        formDataToSubmit.append(
          "priceInCoins",
          (chapterData.priceInCoins || 20).toString()
        );
      }
      if (chapterData.notes) {
        formDataToSubmit.append("notes", chapterData.notes);
      }

      const result = await createChapterAction(
        selectedSeries.id,
        formDataToSubmit
      );

      if (!result.success) {
        toast.custom(
          (t) => (
            <ErrorToast
              text={result.error || "Failed to publish chapter."}
              toastId={t}
            />
          ),
          { id: notificationId }
        );
        return;
      }

      toast.custom(
        (t) => (
          <SuccessToast text="Chapter published successfully!" toastId={t} />
        ),
        { id: notificationId }
      );

      // Reset form
      router.push(manageSeriesChapterDetail(selectedSeries.id, result.data.id));
      // setSelectedSeries(null);
      // setChapterData({
      //   chapterNumber: "",
      //   chapterTitle: "",
      //   fileSource: "upload",
      //   fileUrl: "",
      //   chapterFile: null,
      //   chapterImage: null,
      //   chapterImagePreview: null,
      //   publishDate: new Date().toISOString().split("T")[0],
      //   isPremium: false,
      //   language: "English",
      //   notes: "",
      //   content: "",
      // });
    } catch (error: any) {
      console.error("Error publishing chapter:", error);
      toast.custom(
        (t) => (
          <ErrorToast
            text={
              error.message || "Failed to publish chapter. Please try again."
            }
            toastId={t}
          />
        ),
        { id: notificationId }
      );
    } finally {
      setPublishing(false);
    }
  };

  const updateChapterData = (updates: any) => {
    setChapterData({ ...chapterData, ...updates });
  };

  if (loadingChapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center flex items-center gap-2">
            <Spinner />
            <p className="text-muted-foreground">Loading chapter data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isEditMode && (
        <div className="mb-6 p-4 bg-card border border-primary/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Edit Chapter
          </h2>
          <p className="text-sm text-muted-foreground">
            Editing chapter in:{" "}
            <span className="font-medium">{selectedSeries?.title}</span>
          </p>
        </div>
      )}
      <Stepper.Provider className="space-y-4" variant="circle">
        {({ methods }) => (
          <React.Fragment>
            <Stepper.Navigation>
              <Stepper.Step of={methods.current.id}>
                <Stepper.Title>
                  {isEditMode && methods.current.id === "step-1"
                    ? "Edit Chapter"
                    : methods.current.title}
                </Stepper.Title>
                <Stepper.Description className="wrap-break-word max-w-full min-w-0">
                  {methods.current.description}
                </Stepper.Description>
              </Stepper.Step>
            </Stepper.Navigation>
            {methods.when(methods.current.id, () => (
              <Stepper.Panel className="mt-10 mb-8">
                {methods.current.id === "step-1" && !isEditMode && (
                  <AddChapterStepOne
                    selectedSeries={selectedSeries}
                    onSelectSeries={setSelectedSeries}
                    seriesList={seriesList}
                    loadingSeries={loadingSeries}
                  />
                )}
                {methods.current.id === "step-1" && isEditMode && (
                  <div className="p-6 bg-card border border-border rounded-lg">
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Series:</span>{" "}
                      {selectedSeries?.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You are editing a chapter in this series. Click Continue
                      to proceed to chapter details.
                    </p>
                  </div>
                )}
                {methods.current.id === "step-2" && (
                  <AddChapterStepTwo
                    selectedSeries={selectedSeries}
                    chapterData={chapterData}
                    updateChapterData={updateChapterData}
                  />
                )}
                {methods.current.id === "step-3" && (
                  <AddChapterStepThree
                    chapterData={chapterData}
                    updateChapterData={updateChapterData}
                  />
                )}
                {methods.current.id === "step-4" && (
                  <AddChapterStepFour
                    selectedSeries={selectedSeries}
                    chapterData={chapterData}
                  />
                )}
              </Stepper.Panel>
            ))}
            <Stepper.Controls>
              <Button
                type="button"
                variant="outline"
                onClick={methods.prev}
                disabled={methods.isFirst}
                className="border-[#27272A] bg-[#27272A] hover:bg-[#27272A] hover:text-white"
              >
                Previous
              </Button>

              <Button
                onClick={
                  methods.isLast
                    ? handlePublish
                    : () => {
                        if (canProceedToNext(methods.current.id)) {
                          methods.next();
                        } else {
                          toast.custom(
                            (t) => (
                              <WarnToast
                                text="Please complete all required fields before continuing"
                                toastId={t}
                              />
                            ),
                            { duration: 5000 }
                          );
                        }
                      }
                }
                disabled={publishing || (methods.isLast && !isStep2Valid())}
              >
                {publishing
                  ? isEditMode
                    ? "Updating..."
                    : "Publishing..."
                  : methods.isLast
                  ? isEditMode
                    ? "Update Chapter"
                    : "Publish Chapter"
                  : "Continue"}
              </Button>
            </Stepper.Controls>
          </React.Fragment>
        )}
      </Stepper.Provider>
    </div>
  );
}
