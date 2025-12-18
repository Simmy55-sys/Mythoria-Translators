"use server";

import apiClientManager from "@/api/interface";
import { ACCESS_TOKEN_COOKIE_ID } from "@/global/utils";
import { cookies } from "next/headers";

export async function createCommentAction(payload: {
  content: string;
  seriesId?: string;
  chapterId?: string;
  parentCommentId?: string;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.createComment(payload, accessToken);

  if (!response.success) {
    return {
      success: false,
      error: response.error.message,
    } as const;
  }

  return {
    success: true,
    data: response.data,
  } as const;
}

export async function getSeriesCommentsAction(seriesId: string) {
  const response = await apiClientManager.getSeriesComments(seriesId);

  if (!response.success) {
    return {
      success: false,
      error: response.error.message,
    } as const;
  }

  return {
    success: true,
    data: response.data,
  } as const;
}

export async function getChapterCommentsAction(chapterId: string) {
  const response = await apiClientManager.getChapterComments(chapterId);

  if (!response.success) {
    return {
      success: false,
      error: response.error.message,
    } as const;
  }

  return {
    success: true,
    data: response.data,
  } as const;
}

export async function deleteCommentAction(commentId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.deleteComment(commentId, accessToken);

  if (!response.success) {
    return {
      success: false,
      error: response.error.message,
    } as const;
  }

  return {
    success: true,
    data: response.data,
  } as const;
}
