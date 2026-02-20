"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import {
  getTranslatorSeriesAction,
  createBulkChaptersAction,
} from "@/server-actions/translator";
import { toast } from "sonner";
import LoadingToast from "@/global/toasts/loading";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";
import WarnToast from "@/global/toasts/warn";
import AddBulkChaptersStepOne from "./step-one";
import AddBulkChaptersStepTwo from "./step-two";
import AddBulkChaptersStepThree from "./step-three";
import AddBulkChaptersStepFour from "./step-four";

const { Stepper } = defineStepper(
  {
    id: "step-1",
    title: "Series selection",
    description: "Select a series to add chapters to",
  },
  {
    id: "step-2",
    title: "Upload chapters",
    description: "Upload or manually add chapters",
  },
  {
    id: "step-3",
    title: "Configure settings",
    description: "Set default settings for all chapters",
  },
  {
    id: "step-4",
    title: "Review & Publish",
    description: "Review all chapters before publishing",
  }
);

interface ChapterItem {
  id: string;
  chapterNumber: string;
  chapterTitle: string;
  chapterFile: File | null;
  content: string;
  fileSource: "upload" | "inbuilt";
  fileUrl: string;
  isPremium: boolean;
  priceInCoins: number;
}

export default function AddBulkChaptersComponent() {
  const searchParams = useSearchParams();
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [nextChapterNumber, setNextChapterNumber] = useState<string>("1");

  // Bulk settings that apply to all chapters
  const [bulkSettings, setBulkSettings] = useState({
    language: "English",
    isPremium: false,
    publishDate: new Date().toISOString().split("T")[0],
    notes: "",
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
              // Set next chapter number based on existing chapters
              setNextChapterNumber(String((foundSeries.chapters || 0) + 1));
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

  // Add new chapter item
  const addChapter = () => {
    const newChapter: ChapterItem = {
      id: Math.random().toString(36).substr(2, 9),
      chapterNumber: nextChapterNumber,
      chapterTitle: "",
      chapterFile: null,
      content: "",
      fileSource: "upload",
      fileUrl: "",
      isPremium: bulkSettings.isPremium,
      priceInCoins: 20,
    };
    setChapters([...chapters, newChapter]);
    setNextChapterNumber(String(parseInt(nextChapterNumber) + 1));
  };

  // Remove chapter item
  const removeChapter = (id: string) => {
    setChapters(chapters.filter((ch) => ch.id !== id));
  };

  // Update chapter item
  const updateChapter = (id: string, updates: Partial<ChapterItem>) => {
    setChapters(
      chapters.map((ch) => (ch.id === id ? { ...ch, ...updates } : ch))
    );
  };

  // Handle multiple file upload
  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newChapters: ChapterItem[] = [];
    Array.from(files).forEach((file, index) => {
      const chapterNumber = String(parseInt(nextChapterNumber) + index);
      newChapters.push({
        id: Math.random().toString(36).substr(2, 9),
        chapterNumber,
        chapterTitle: `Chapter ${chapterNumber}`,
        chapterFile: file,
        content: "",
        fileSource: "upload",
        fileUrl: "",
        isPremium: bulkSettings.isPremium,
        priceInCoins: 20,
      });
    });

    setChapters([...chapters, ...newChapters]);
    setNextChapterNumber(String(parseInt(nextChapterNumber) + files.length));
  };

  // Validation
  const isStep1Valid = () => {
    return selectedSeries !== null;
  };

  const isStep2Valid = () => {
    if (chapters.length === 0) return false;
    return chapters.every(
      (ch) =>
        ch.chapterNumber &&
        ch.chapterTitle &&
        (ch.chapterFile || ch.content) &&
        (!ch.isPremium || (ch.isPremium && ch.priceInCoins > 0))
    );
  };

  const isStep3Valid = () => {
    return bulkSettings.language && bulkSettings.publishDate;
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

  // Handle bulk publish
  const handleBulkPublish = async () => {
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
            text="Please complete all required fields for all chapters"
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
            text={`Publishing ${chapters.length} chapters. This may take a while...`}
          />
        );
      },
      { duration: Infinity }
    );

    try {
      // Build payload for bulk endpoint: same shape as CreateChapterDto per chapter
      const chaptersPayload = chapters.map((ch) => ({
        title: ch.chapterTitle,
        chapterNumber: parseInt(ch.chapterNumber, 10),
        publishDate: new Date(bulkSettings.publishDate).toISOString(),
        language: bulkSettings.language,
        isPremium: ch.isPremium,
        priceInCoins: ch.isPremium ? (ch.priceInCoins || 20) : 20,
        notes: bulkSettings.notes || undefined,
        content:
          ch.fileSource === "inbuilt" || (ch.fileSource === "upload" && !ch.chapterFile)
            ? ch.content
            : "",
        fileUrl: ch.fileUrl || undefined,
      }));

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("chapters", JSON.stringify(chaptersPayload));

      // Append files in same order as chapters that need a file (upload source with file)
      for (const chapter of chapters) {
        if (chapter.fileSource === "upload" && chapter.chapterFile) {
          formDataToSubmit.append("chapterFiles", chapter.chapterFile);
        }
      }

      const result = await createBulkChaptersAction(
        selectedSeries.id,
        formDataToSubmit
      );

      if (!result.success) {
        toast.custom(
          (t) => (
            <ErrorToast
              text={result.error || "Failed to publish chapters"}
              toastId={t}
            />
          ),
          { id: notificationId }
        );
      } else {
        const data = result.data!;
        const successCount = data.successful;
        const errorCount = data.failed;

        toast.custom(
          (t) => (
            <SuccessToast
              text={`Successfully published ${successCount} chapter(s)${
                errorCount > 0 ? `. ${errorCount} failed.` : "!"
              }`}
              toastId={t}
            />
          ),
          { id: notificationId }
        );

        if (errorCount > 0) {
          const failed = data.results.filter((r) => !r.success);
          failed.forEach((r) => {
            if (!r.success) {
              console.error(
                `Chapter ${r.chapterNumber} "${r.title}": ${r.error}`
              );
            }
          });
        }

        // Reset form after successful bulk response
        setSelectedSeries(null);
        setChapters([]);
        setNextChapterNumber("1");
        setBulkSettings({
          language: "English",
          isPremium: false,
          publishDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
      }
    } catch (error: any) {
      console.error("Error publishing chapters:", error);
      toast.custom(
        (t) => (
          <ErrorToast
            text={
              error.message || "Failed to publish chapters. Please try again."
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Stepper.Provider className="space-y-4" variant="circle">
        {({ methods }) => (
          <React.Fragment>
            <Stepper.Navigation>
              <Stepper.Step of={methods.current.id}>
                <Stepper.Title>{methods.current.title}</Stepper.Title>
                {/* Break words for smaller screens */}
                <Stepper.Description className="wrap-break-word max-w-full min-w-0">
                  {methods.current.description}
                </Stepper.Description>
              </Stepper.Step>
            </Stepper.Navigation>

            {methods.when(methods.current.id, () => (
              <Stepper.Panel className="mt-10 mb-8">
                {/* Step 1: Series Selection */}
                {methods.current.id === "step-1" && (
                  <AddBulkChaptersStepOne
                    loadingSeries={loadingSeries}
                    seriesList={seriesList}
                    selectedSeries={selectedSeries}
                    setSelectedSeries={setSelectedSeries}
                    setNextChapterNumber={setNextChapterNumber}
                  />
                )}

                {/* Step 2: Upload Chapters */}
                {methods.current.id === "step-2" && selectedSeries && (
                  <AddBulkChaptersStepTwo
                    selectedSeries={selectedSeries}
                    chapters={chapters}
                    addChapter={addChapter}
                    removeChapter={removeChapter}
                    updateChapter={updateChapter}
                    handleMultipleFileUpload={handleMultipleFileUpload}
                  />
                )}

                {/* Step 3: Bulk Settings */}
                {methods.current.id === "step-3" && (
                  <AddBulkChaptersStepThree
                    bulkSettings={bulkSettings}
                    setBulkSettings={setBulkSettings}
                  />
                )}

                {/* Step 4: Review */}
                {methods.current.id === "step-4" && selectedSeries && (
                  <AddBulkChaptersStepFour
                    selectedSeries={selectedSeries}
                    chapters={chapters}
                    bulkSettings={bulkSettings}
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
                    ? handleBulkPublish
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
                disabled={
                  publishing ||
                  (methods.isLast && (!isStep2Valid() || chapters.length === 0))
                }
              >
                {publishing
                  ? "Publishing..."
                  : methods.isLast
                  ? `Publish ${chapters.length} Chapter(s)`
                  : "Continue"}
              </Button>
            </Stepper.Controls>
          </React.Fragment>
        )}
      </Stepper.Provider>
    </div>
  );
}
