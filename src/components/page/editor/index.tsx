"use client";

import { useState, useEffect, useCallback } from "react";
import MagicEditor from "@/components/page/add-chapter/global/inbuilt-editor";
import { Button } from "@/components/ui/button";
import {
  Save,
  Download,
  FileText,
  Type,
  AlignLeft,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import SuccessToast from "@/global/toasts/success";
import ErrorToast from "@/global/toasts/error";

export default function EditorComponent() {
  const [content, setContent] = useState<string>("");
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("editor-content");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (content) {
      localStorage.setItem("editor-content", content);
    }
  }, [content]);

  // Calculate word and character count
  useEffect(() => {
    const text = content.trim();
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(text.length);
  }, [content]);

  const handleContentSave = useCallback((savedContent: string) => {
    setContent(savedContent);
  }, []);

  const handleSave = useCallback(() => {
    if (!content.trim()) {
      toast.custom(
        (t) => <ErrorToast text="No content to save" toastId={t} />,
        { duration: 3000 }
      );
      return;
    }

    setIsSaving(true);
    // Simulate save (you can add actual save logic here)
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
      toast.custom((t) => <SuccessToast text="Document saved!" toastId={t} />, {
        duration: 2000,
      });
    }, 500);
  }, [content]);

  const handleExport = useCallback(() => {
    if (!content.trim()) {
      toast.custom(
        (t) => <ErrorToast text="No content to export" toastId={t} />,
        { duration: 3000 }
      );
      return;
    }

    // Create a blob and download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.custom(
      (t) => <SuccessToast text="Document exported!" toastId={t} />,
      { duration: 2000 }
    );
  }, [content]);

  const handleClear = useCallback(() => {
    if (
      confirm(
        "Are you sure you want to clear all content? This cannot be undone."
      )
    ) {
      setContent("");
      localStorage.removeItem("editor-content");
      toast.custom(
        (t) => <SuccessToast text="Document cleared" toastId={t} />,
        { duration: 2000 }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Toolbar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">
                  Document Editor
                </h1>
              </div>
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground mr-4">
                <div className="flex items-center gap-1">
                  <Type className="h-4 w-4" />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlignLeft className="h-4 w-4" />
                  <span>{characterCount} characters</span>
                </div>
              </div>

              {/* Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="gap-2"
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{characterCount} chars</span>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Editor */}
          <div className="bg-card rounded-lg border border-border shadow-sm">
            <MagicEditor onSave={handleContentSave} initialContent={content} />
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Your document is automatically saved to your browser's local
              storage.
            </p>
            <p className="mt-1">
              Use the magic tags toolbar to add special formatting and effects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
