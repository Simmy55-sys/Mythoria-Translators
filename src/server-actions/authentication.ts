"use server";

import apiClientManager from "@/api/interface";
import { ACCESS_TOKEN_COOKIE_ID } from "@/global/utils";
import { cookies } from "next/headers";

export async function LoginUserAction(email: string, password: string) {
  const response = await apiClientManager.logTranslatorIntoAccount(
    email,
    password
  );

  if (!response.success)
    return {
      success: false,
      error: response.error.message,
    } as const;

  // Save access token to cookie
  const cookieStore = await cookies();
  const { accessToken, user } = response.data;

  // Set cookie
  cookieStore.set(ACCESS_TOKEN_COOKIE_ID, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 29),
    path: "/",
  });
  return { success: true, data: user } as const;
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE_ID);
  return { success: true } as const;
}
