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

  // Helper function to convert markdown-style text to HTML for editor
  const convertMarkdownToHTML = (text: string): string => {
    if (!text) return "";

    // Check if it's already HTML
    if (text.trim().startsWith("<")) {
      return text;
    }

    // Split by lines and process each line
    const lines = text.split(/\n/);
    const result: string[] = [];
    let currentParagraph: string[] = [];

    // Function to convert markdown formatting in a line
    const processLine = (line: string): string => {
      // First, escape any existing HTML to prevent XSS
      const tempDiv = document.createElement("div");
      tempDiv.textContent = line;
      const escapedLine = tempDiv.innerHTML;

      // Process bold (**text**) - must be done first to handle nested formatting
      // Match **text** and process any italic inside
      let processed = escapedLine.replace(
        /\*\*([^*]+(?:\*[^*]+)*)\*\*/g,
        (match, content) => {
          // Process italic inside bold: *text* becomes <em>text</em>
          const italicProcessed = content.replace(
            /\*([^*]+)\*/g,
            "<em>$1</em>"
          );
          return `<strong>${italicProcessed}</strong>`;
        }
      );

      // Process standalone italic (*text*) - not part of **
      // Only match *text* that is not inside <strong> tags and not part of **
      processed = processed.replace(
        /(?<!<strong[^>]*>)(?<!\*)\*([^*]+)\*(?!\*)(?!<\/strong>)/g,
        "<em>$1</em>"
      );

      return processed;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Empty line indicates a new paragraph
      if (line.trim() === "") {
        if (currentParagraph.length > 0) {
          result.push(`<p>${currentParagraph.join("<br>")}</p>`);
          currentParagraph = [];
        }
        // Add an empty paragraph for spacing
        if (i < lines.length - 1 && lines[i + 1]?.trim()) {
          result.push("<p></p>");
        }
      } else {
        // Process markdown formatting and add to current paragraph
        currentParagraph.push(processLine(line));
      }
    }

    // Add remaining paragraph
    if (currentParagraph.length > 0) {
      result.push(`<p>${currentParagraph.join("<br>")}</p>`);
    }

    return result.length > 0 ? result.join("") : "";
  };

  // Helper function to convert HTML to markdown-style text for storage
  const convertHTMLToMarkdown = (html: string): string => {
    if (!html) return "";

    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Recursively process nodes to convert formatting
    const processNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();
        const children = Array.from(node.childNodes).map(processNode).join("");

        if (tagName === "strong" || tagName === "b") {
          return `**${children}**`;
        } else if (tagName === "em" || tagName === "i") {
          return `*${children}*`;
        } else if (tagName === "p") {
          return `${children}\n`;
        } else if (tagName === "br") {
          return "\n";
        } else {
          return children;
        }
      }

      return "";
    };

    return Array.from(tempDiv.childNodes).map(processNode).join("").trim();
  };

  // Update editor content when initialContent changes (for edit mode)
  React.useEffect(() => {
    if (editor && initialContent) {
      // Use a flag to track if we've loaded initial content
      const hasLoaded = (editor as any).__hasLoadedInitialContent;

      if (!hasLoaded && initialContent.trim()) {
        // Convert markdown-style text to HTML to preserve formatting
        const htmlContent = convertMarkdownToHTML(initialContent);
        editor.commands.setContent(htmlContent, { emitUpdate: false });
        (editor as any).__hasLoadedInitialContent = true;
      } else if (hasLoaded && !editor.isFocused) {
        // Only update if content changed externally and editor is not focused
        const currentText = editor.getText().trim();
        const initialText = initialContent.trim();

        if (currentText !== initialText && initialText) {
          const htmlContent = convertMarkdownToHTML(initialContent);
          editor.commands.setContent(htmlContent, { emitUpdate: false });
        }
      }
    }
  }, [editor, initialContent]);

  const saveHandler = () => {
    // Get HTML content and convert to markdown-style text to preserve formatting
    // Format: **bold** for bold, *italic* for italic
    const htmlContent = editor?.getHTML() ?? "";
    const markdownText = convertHTMLToMarkdown(htmlContent);
    onSave(markdownText); // call the on save function
    toast.custom((t) => (
      <InfoToast
        text="Chapter content has been saved successfully for upload."
        toastId={t}
      />
    ));
  };

  return (
    <div className="space-y-4">
      {/* Sticky Toolbar - positioned below the top toolbar */}
      <div className="sticky top-[100px] md:top-[73px] z-[45] bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-2 -mx-6 px-6 border-b border-border/40 mb-4 shadow-sm">
        <Toolbar editor={editor} />

        <div className="flex justify-end gap-2 mt-2">
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
      </div>

      {!previewMode ? (
        <EditorContent
          editor={editor}
          className="min-h-[400px] bg-slate-900 text-white p-6 rounded-xl"
        />
      ) : (
        <div className="bg-black p-6 rounded-xl min-h-[400px] overflow-y-auto">
          <MagicRenderer
            content={convertHTMLToMarkdown(editor?.getHTML() ?? "")}
          />
        </div>
      )}
    </div>
  );
}
