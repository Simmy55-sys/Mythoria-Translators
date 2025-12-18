"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createCommentAction } from "@/server-actions/comment";
import { toast } from "sonner";
import LoadingToast from "@/global/toasts/loading";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";

interface CommentFormProps {
  seriesId?: string;
  chapterId?: string;
  onCommentAdded?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  seriesId,
  chapterId,
  onCommentAdded,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!seriesId && !chapterId) {
      toast.error("Series or chapter ID is required");
      return;
    }

    setIsSubmitting(true);
    let notificationId: string | number = "";

    toast.custom(
      (t) => {
        notificationId = t;
        return <LoadingToast text="Posting comment..." />;
      },
      { duration: Infinity }
    );

    try {
      const result = await createCommentAction({
        content: content.trim(),
        seriesId,
        chapterId,
      });

      if (!result.success) {
        toast.custom(
          (t) => (
            <ErrorToast
              text={result.error || "Failed to post comment."}
              toastId={t}
            />
          ),
          { id: notificationId }
        );
        return;
      }

      toast.custom(
        (t) => <SuccessToast text="Comment posted successfully" toastId={t} />,
        { id: notificationId }
      );

      setContent("");
      onCommentAdded?.();
    } catch (error) {
      toast.custom(
        (t) => <ErrorToast text="An unexpected error occurred" toastId={t} />,
        { id: notificationId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 border-[#27272A]">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none border-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
