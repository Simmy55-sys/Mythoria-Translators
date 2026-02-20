"use server";

import apiClientManager from "@/api/interface";
import { ACCESS_TOKEN_COOKIE_ID } from "@/global/utils";
import { cookies } from "next/headers";

export async function getAssignmentAction(assignmentId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getAssignment(
    assignmentId,
    accessToken
  );

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

export async function createSeriesAction(formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.createSeries(formData, accessToken);

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

export async function updateSeriesAction(seriesId: string, formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.updateSeries(
    seriesId,
    formData,
    accessToken
  );

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

export async function getTranslatorSeriesAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getTranslatorSeries(accessToken);

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

export async function getSeriesByIdAction(seriesId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getSeriesById(seriesId, accessToken);

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

export async function getSeriesChaptersAction(seriesId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getSeriesChapters(
    seriesId,
    accessToken
  );

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

export async function getChapterByIdAction(
  seriesId: string,
  chapterId: string
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getChapterById(
    seriesId,
    chapterId,
    accessToken
  );

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

export async function updateChapterAction(
  seriesId: string,
  chapterId: string,
  payload: {
    title?: string;
    content?: string;
    isPremium?: boolean;
    publishDate?: string;
    language?: string;
    priceInCoins?: number;
    chapterNumber?: number;
    notes?: string;
  }
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.updateChapter(
    seriesId,
    chapterId,
    payload,
    accessToken
  );

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

export async function deleteChapterAction(seriesId: string, chapterId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.deleteChapter(
    seriesId,
    chapterId,
    accessToken
  );

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

export async function createChapterAction(
  seriesId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.createChapter(
    seriesId,
    formData,
    accessToken
  );

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

export async function createBulkChaptersAction(
  seriesId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.createBulkChapters(
    seriesId,
    formData,
    accessToken
  );

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

export async function getDashboardStatsAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getDashboardStats(accessToken);

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

export async function getMostPopularChaptersAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getMostPopularChapters(accessToken);

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

export async function getRecentPurchasesAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getRecentPurchases(accessToken);

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

export async function getEarningsDataAction(year?: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getEarningsData(accessToken, year);

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

export async function uploadImageAction(file: File) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClientManager.uploadImage(formData, accessToken);

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
