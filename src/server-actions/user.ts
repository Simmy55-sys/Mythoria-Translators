"use server";

import apiClientManager from "@/api/interface";
import { ACCESS_TOKEN_COOKIE_ID } from "@/global/utils";
import { cookies } from "next/headers";

export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_ID)?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    } as const;
  }

  const response = await apiClientManager.getUserProfile(accessToken);

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
