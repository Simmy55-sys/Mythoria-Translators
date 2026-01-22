"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { MagicTags } from "./magic-tags/extension";
import Toolbar from "./magic-tags/toolbar";
import { useState } from "react";
import MagicRenderer from "./magic-tags/renderer";
import { toast } from "sonner";
import InfoToast from "@/global/toasts/info";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";
import { uploadImageAction } from "@/server-actions/translator";
export default function MagicEditor({
  onSave,
  initialContent = "",
  onImagesReady,
}: {
  onSave: (content: string) => void;
  initialContent?: string;
  onImagesReady?: (
    images: Array<{ src: string; file: File; alt?: string }>
  ) => void;
}) {
  const [previewMode, setPreviewMode] = useState(false);
  const editorRef = React.useRef<any>(null);
  // Store file references for images (keyed by base64 src)
  const imageFileMap = React.useRef<Map<string, File>>(new Map());

  const handleImageUpload = React.useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.custom(
        (t) => <ErrorToast text="Please upload an image file" toastId={t} />,
        { duration: 3000 }
      );
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.custom(
        (t) => (
          <ErrorToast text="Image size must be less than 10MB" toastId={t} />
        ),
        { duration: 3000 }
      );
      return;
    }

    // Convert to base64 for preview (will upload to Cloudinary on chapter save)
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      // Store file reference in map
      imageFileMap.current.set(src, file);
      // Insert image
      editorRef.current?.chain().focus().setImage({ src }).run();
      toast.custom(
        (t) => (
          <InfoToast text="Image added (will upload on save)" toastId={t} />
        ),
        { duration: 2000 }
      );
    };
    reader.onerror = () => {
      toast.custom(
        (t) => <ErrorToast text="Failed to read image file" toastId={t} />,
        { duration: 3000 }
      );
    };
    reader.readAsDataURL(file);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      MagicTags,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-xs h-auto rounded-lg my-4 image-editable mx-auto block",
        },
      }),
      Placeholder.configure({
        placeholder: "Start translating your novel here...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px]",
      },
      handleDrop: (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file);
            }
            return true;
          }
        }
        return false;
      },
    },
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      editorRef.current = editor;
    },
  });

  // Store editor reference
  React.useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

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
        // Check if line contains an image markdown syntax ![alt](url)
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
          // If there's content before the image, add it as a paragraph
          const beforeImage = line.substring(0, imageMatch.index || 0).trim();
          if (beforeImage) {
            currentParagraph.push(processLine(beforeImage));
          }
          if (currentParagraph.length > 0) {
            result.push(`<p>${currentParagraph.join("<br>")}</p>`);
            currentParagraph = [];
          }
          // Add image
          const alt = imageMatch[1];
          const url = imageMatch[2];
          result.push(
            `<p><img src="${url}" alt="${alt}" class="max-w-xs h-auto rounded-lg my-4 image-editable mx-auto block" /></p>`
          );
          // Check if there's content after the image
          const afterImage = line
            .substring((imageMatch.index || 0) + imageMatch[0].length)
            .trim();
          if (afterImage) {
            currentParagraph.push(processLine(afterImage));
          }
        } else {
          // Process markdown formatting and add to current paragraph
          currentParagraph.push(processLine(line));
        }
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

        if (tagName === "img") {
          const src = element.getAttribute("src") || "";
          const alt = element.getAttribute("alt") || "";
          return `![${alt}](${src})\n`;
        } else if (tagName === "strong" || tagName === "b") {
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

  // Extract images from content and prepare for upload
  const extractImages = (
    htmlContent: string
  ): Array<{ src: string; file: File; alt?: string }> => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const images = tempDiv.querySelectorAll("img");
    const imageArray: Array<{ src: string; file: File; alt?: string }> = [];

    images.forEach((img) => {
      const src = img.getAttribute("src") || "";
      // Only include images that are base64 (local images not yet uploaded)
      if (src.startsWith("data:")) {
        const file = imageFileMap.current.get(src);
        if (file) {
          const alt = img.getAttribute("alt") || "";
          imageArray.push({ src, file, alt });
        }
      }
    });

    return imageArray;
  };

  const saveHandler = async () => {
    // Get HTML content and convert to markdown-style text to preserve formatting
    // Format: **bold** for bold, *italic* for italic
    let htmlContent = editor?.getHTML() ?? "";

    // Extract images that need to be uploaded
    const images = extractImages(htmlContent);

    // Upload images and replace base64 URLs with Cloudinary URLs
    if (images.length > 0) {
      const uploadPromises = images.map(async (image) => {
        const notificationId = toast.loading(
          `Uploading image: ${image.file.name}...`
        );
        try {
          const result = await uploadImageAction(image.file);
          if (result.success && result.data?.url) {
            toast.custom(
              (t) => (
                <SuccessToast
                  text={`Image ${image.file.name} uploaded!`}
                  toastId={t}
                />
              ),
              { id: notificationId }
            );
            return { oldSrc: image.src, newUrl: result.data.url };
          } else {
            throw new Error(result.error || "Failed to upload image");
          }
        } catch (error: any) {
          toast.custom(
            (t) => (
              <ErrorToast
                text={`Failed to upload image ${image.file.name}: ${
                  error.message || "Unknown error"
                }`}
                toastId={t}
              />
            ),
            { id: notificationId }
          );
          return null; // Indicate failure
        }
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(
        Boolean
      ); // Filter out failed uploads

      // Replace base64 URLs with Cloudinary URLs in HTML content
      uploadedImages.forEach((img) => {
        if (img) {
          // Escape special regex characters in the base64 URL
          const escapedSrc = img.oldSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          htmlContent = htmlContent.replace(
            new RegExp(escapedSrc, "g"),
            img.newUrl
          );

          // Remove old file reference from map since it's now uploaded
          imageFileMap.current.delete(img.oldSrc);
        }
      });

      // Update editor content with new URLs so user sees Cloudinary URLs
      if (editor) {
        editor.commands.setContent(htmlContent, { emitUpdate: false });
      }
    }

    // Convert HTML to markdown and save
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
      <div className="sticky top-[100px] md:top-[73px] z-45 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-2 -mx-6 px-6 border-b border-border/40 mb-4 shadow-sm">
        <Toolbar editor={editor} />

        <div className="flex justify-between items-center mt-2">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
                // Reset input
                e.target.value = "";
              }}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-3 py-2 bg-green-700 rounded text-white cursor-pointer inline-block hover:bg-green-600"
            >
              📷 Add Image
            </label>
          </div>
          <div className="flex gap-2">
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
