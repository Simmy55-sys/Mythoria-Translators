"use client";

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
}: {
  onSave: (content: string) => void;
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
    content: "",
    immediatelyRender: false,
  });

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
