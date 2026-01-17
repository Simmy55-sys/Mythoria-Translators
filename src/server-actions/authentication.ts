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

export async function forgotPasswordAction(email: string) {
  const response = await apiClientManager.forgotPassword(email);

  if (!response.success) {
    return {
      success: false,
      error: response.error.message,
    } as const;
  }

  return {
    success: true,
    message: response.data.message,
  } as const;
}

export async function resetPasswordAction(token: string, newPassword: string) {
  const response = await apiClientManager.resetPassword(token, newPassword);

  if (!response.success) {
    return {
      success: false,
      error: response.error.message,
    } as const;
  }

  return {
    success: true,
    message: response.data.message,
  } as const;
}

export async function validateResetTokenAction(token: string) {
  const response = await apiClientManager.validateResetToken(token);

  if (!response.success) {
    return {
      success: false,
      valid: false,
      error: response.error.message,
    } as const;
  }

  return {
    success: true,
    valid: response.data.valid,
    message: response.data.message,
  } as const;
}
