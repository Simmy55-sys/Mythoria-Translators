"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { MagicTags } from "./magic-tags/extension";
import Toolbar from "./magic-tags/toolbar";
import { useState } from "react";
import MagicRenderer from "./magic-tags/renderer";
import { toast } from "sonner";
import InfoToast from "@/global/toasts/info";

export default function MagicEditor({
  onSave,
  initialContent = "",
}: {
  onSave: (content: string) => void;
  initialContent?: string;
}) {
  const [previewMode, setPreviewMode] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      MagicTags,
      Placeholder.configure({
        placeholder: "Start translating your novel here...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px]",
      },
    },
    content: initialContent,
    immediatelyRender: false,
  });

  // Helper function to convert plain text with line breaks to HTML
  const convertTextToHTML = (text: string): string => {
    if (!text) return "";
    
    // Check if it's already HTML
    if (text.trim().startsWith("<")) {
      return text;
    }
    
    // Convert plain text with line breaks to HTML
    // Split by lines and preserve structure
    const lines = text.split(/\n/);
    const result: string[] = [];
    let currentParagraph: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Empty line indicates a new paragraph
      if (line === "") {
        if (currentParagraph.length > 0) {
          result.push(`<p>${currentParagraph.join("<br>")}</p>`);
          currentParagraph = [];
        }
        // Add an empty paragraph for spacing
        if (i < lines.length - 1 && lines[i + 1]?.trim()) {
          result.push("<p></p>");
        }
      } else {
        // Add line to current paragraph
        currentParagraph.push(line);
      }
    }
    
    // Add remaining paragraph
    if (currentParagraph.length > 0) {
      result.push(`<p>${currentParagraph.join("<br>")}</p>`);
    }
    
    return result.length > 0 ? result.join("") : "";
  };

  // Update editor content when initialContent changes (for edit mode)
  React.useEffect(() => {
    if (editor && initialContent) {
      // Use a flag to track if we've loaded initial content
      const hasLoaded = (editor as any).__hasLoadedInitialContent;
      
      if (!hasLoaded && initialContent.trim()) {
        // Convert plain text to HTML to preserve line breaks
        const htmlContent = convertTextToHTML(initialContent);
        editor.commands.setContent(htmlContent, { emitUpdate: false });
        (editor as any).__hasLoadedInitialContent = true;
      } else if (hasLoaded && !editor.isFocused) {
        // Only update if content changed externally and editor is not focused
        const currentText = editor.getText().trim();
        const initialText = initialContent.trim();
        
        if (currentText !== initialText && initialText) {
          const htmlContent = convertTextToHTML(initialContent);
          editor.commands.setContent(htmlContent, { emitUpdate: false });
        }
      }
    }
  }, [editor, initialContent]);

  const saveHandler = () => {
    const text = editor?.getText() ?? "";
    onSave(text); // call the on save function
    toast.custom((t) => (
      <InfoToast
        text="Chapter content has been saved successfully for upload."
        toastId={t}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <Toolbar editor={editor} />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="px-3 py-2 bg-blue-700 rounded text-white"
        >
          {previewMode ? "Editing Mode" : "Preview Mode"}
        </button>
        <button
          onClick={saveHandler}
          className="px-3 py-2 bg-amber-600 rounded text-white font-bold"
        >
          💾 Save Chapter
        </button>
      </div>

      {!previewMode ? (
        <EditorContent
          editor={editor}
          className="min-h-[400px] bg-slate-900 text-white p-6 rounded-xl"
        />
      ) : (
        <div className="bg-black p-6 rounded-xl min-h-[400px] overflow-y-auto">
          <MagicRenderer content={editor?.getText() ?? ""} />
        </div>
      )}
    </div>
  );
}
