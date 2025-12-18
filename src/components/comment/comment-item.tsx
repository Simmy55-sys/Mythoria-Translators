"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Reply, Trash2 } from "lucide-react";
import {
  createCommentAction,
  deleteCommentAction,
} from "@/server-actions/comment";

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}
import { toast } from "sonner";
import LoadingToast from "@/global/toasts/loading";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";

export interface CommentData {
  id: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: {
    id: string;
    username: string;
  };
  replies?: CommentData[];
  seriesId?: string;
  chapterId?: string;
  parentCommentId?: string | null;
}

interface CommentItemProps {
  comment: CommentData;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
  currentUserId?: string;
  depth?: number;
}

export default function CommentItem({
  comment,
  onCommentAdded,
  onCommentDeleted,
  currentUserId,
  depth = 0,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Posting reply...", {
      description: LoadingToast({ text: "Posting reply..." }),
    });

    try {
      const result = await createCommentAction({
        content: replyContent.trim(),
        seriesId: comment.seriesId,
        chapterId: comment.chapterId,
        parentCommentId: comment.id,
      });

      if (!result.success) {
        toast.error("Failed to post reply", {
          description: ErrorToast({
            text: result.error,
            toastId: loadingToastId,
          }),
          id: loadingToastId,
        });
        return;
      }

      toast.success("Reply posted successfully", {
        description: SuccessToast({
          text: "Reply posted successfully",
          toastId: loadingToastId,
        }),
        id: loadingToastId,
      });

      setReplyContent("");
      setIsReplying(false);
      onCommentAdded?.();
    } catch (error) {
      toast.error("Failed to post reply", {
        description: ErrorToast({
          text: "An unexpected error occurred",
          toastId: loadingToastId,
        }),
        id: loadingToastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);
    let notificationId: string | number = "";
    toast.custom(
      (t) => {
        notificationId = t;
        return <LoadingToast text="Deleting comment..." />;
      },
      { duration: Infinity }
    );

    try {
      const result = await deleteCommentAction(comment.id);

      if (!result.success) {
        toast.custom(
          (t) => (
            <ErrorToast
              text={result.error || "Failed to delete comment."}
              toastId={t}
            />
          ),
          { id: notificationId }
        );
        return;
      }

      toast.custom(
        (t) => <SuccessToast text="Comment deleted successfully" toastId={t} />,
        { id: notificationId }
      );

      onCommentDeleted?.();
    } catch (error) {
      toast.custom(
        (t) => <ErrorToast text="An unexpected error occurred" toastId={t} />,
        { id: notificationId }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwnComment = currentUserId === comment.user.id;
  const maxDepth = 3; // Limit nesting depth
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4" : ""}`}>
      <Card className="p-4 border-[#27272A]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">
                {comment.user.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          {isOwnComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {canReply && (
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-8"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
        )}

        {isReplying && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              className="resize-none border-none"
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleReply}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Render nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onCommentAdded={onCommentAdded}
                onCommentDeleted={onCommentDeleted}
                currentUserId={currentUserId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
