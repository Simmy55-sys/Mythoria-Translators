import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  assignment,
  seriesCreate,
  translatorLogin,
  translatorForgotPasswordRoute,
  translatorResetPasswordRoute,
  translatorValidateResetTokenRoute,
} from "@/routes/server";
import {
  ApiResponse,
  AssignmentResponse,
  DashboardStatsResponse,
  LoginResponse,
  PopularChaptersResponse,
  RecentChapterPurchases,
  SeriesResponse,
} from "./types";

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  private requestClient: AxiosInstance;

  constructor() {
    this.requestClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    });
  }

  /**
   * Make a request to mythoria's backend server.
   *
   * @param method - HTTP method
   * @param endpoint - API endpoint
   * @param data - Request data (for POST/PUT requests)
   * @param params - Query parameters
   * @param headers - request headers
   * @returns Promise resolving to API response
   */
  private async execute<T = any>(requestData: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    endpoint: string;
    data?: any;
    params?: Record<string, any>;
    headers?: AxiosRequestConfig["headers"];
  }): Promise<ApiResponse<T>> {
    const { endpoint, method, data, params, headers } = requestData;
    const url = `/${endpoint.replace(/^\//, "")}`;

    try {
      // If data is FormData, don't set Content-Type header (let browser set it with boundary)
      const requestHeaders = { ...headers };
      if (data instanceof FormData) {
        delete (requestHeaders as any)?.["Content-Type"];
      }

      const response: AxiosResponse<ApiResponse<T>> =
        await this.requestClient.request({
          method,
          url,
          data,
          params,
          headers: requestHeaders,
        });

      return response.data;
    } catch (err) {
      console.error(
        `An error occured when making request to the server.`,
        (err as any).response?.data.error.message
      );
      return {
        success: false,
        error: axios.isAxiosError(err)
          ? {
              statusCode: err.status,
              message: err.response?.data.error.message,
            }
          : {
              statusCode: 0, // Not a real status code, but since this was due to something along the way during request session, we put it here
              message: "Unable to complete request call.",
            },
      };
    }
  }

  /**
   * Log a user back into their account
   * @param email  - The user's account email.
   * @param password  - The user's account password.
   */
  async logTranslatorIntoAccount(email: string, password: string) {
    return this.execute<LoginResponse>({
      method: "POST",
      endpoint: translatorLogin,
      data: { email, password },
    });
  }

  /**
   * Get the authenticated user's profile
   * @param accessToken - The user's access token
   */
  async getUserProfile(accessToken: string) {
    return this.execute<any>({
      method: "GET",
      endpoint: "/user/profile",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Request password reset for translator
   */
  async forgotPassword(email: string) {
    return this.execute<{ message: string }>({
      method: "POST",
      endpoint: translatorForgotPasswordRoute,
      data: { email },
    });
  }

  /**
   * Reset password with token for translator
   */
  async resetPassword(token: string, newPassword: string) {
    return this.execute<{ message: string }>({
      method: "POST",
      endpoint: translatorResetPasswordRoute,
      data: { token, newPassword },
    });
  }

  /**
   * Validate reset token for translator
   */
  async validateResetToken(token: string) {
    return this.execute<{ valid: boolean; message?: string }>({
      method: "GET",
      endpoint: `${translatorValidateResetTokenRoute}?token=${encodeURIComponent(
        token
      )}`,
    });
  }

  /**
   * Get assignment details by assignment ID
   * @param assignmentId - The assignment ID
   * @param accessToken - The user's access token
   */
  async getAssignment(assignmentId: string, accessToken: string) {
    return this.execute<AssignmentResponse>({
      method: "GET",
      endpoint: assignment(assignmentId),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Create a new series
   * @param payload - The series creation payload
   * @param accessToken - The user's access token
   */
  async createSeries(payload: FormData, accessToken: string) {
    return this.execute<SeriesResponse>({
      method: "POST",
      endpoint: seriesCreate,
      data: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Update an existing series
   * @param seriesId - The series ID
   * @param payload - The series update payload
   * @param accessToken - The user's access token
   */
  async updateSeries(seriesId: string, payload: FormData, accessToken: string) {
    return this.execute<SeriesResponse>({
      method: "PATCH",
      endpoint: `/translator/series/${seriesId}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get translator's assigned series
   * @param accessToken - The user's access token
   */
  async getTranslatorSeries(accessToken: string) {
    return this.execute<any[]>({
      method: "GET",
      endpoint: "/translator/series",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get a single series by ID
   * @param seriesId - The series ID
   * @param accessToken - The user's access token
   */
  async getSeriesById(seriesId: string, accessToken: string) {
    return this.execute<any>({
      method: "GET",
      endpoint: `/translator/series/${seriesId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get all chapters for a series
   * @param seriesId - The series ID
   * @param accessToken - The user's access token
   */
  async getSeriesChapters(seriesId: string, accessToken: string) {
    return this.execute<any[]>({
      method: "GET",
      endpoint: `/translator/series/chapter/${seriesId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get a single chapter by ID
   * @param seriesId - The series ID
   * @param chapterId - The chapter ID
   * @param accessToken - The user's access token
   */
  async getChapterById(
    seriesId: string,
    chapterId: string,
    accessToken: string
  ) {
    return this.execute<any>({
      method: "GET",
      endpoint: `/translator/series/chapter/${seriesId}/${chapterId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Update a chapter
   * @param seriesId - The series ID
   * @param chapterId - The chapter ID
   * @param payload - The chapter update payload
   * @param accessToken - The user's access token
   */
  async updateChapter(
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
    },
    accessToken: string
  ) {
    return this.execute<any>({
      method: "PATCH",
      endpoint: `/translator/series/chapter/${seriesId}/${chapterId}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Delete a chapter
   * @param seriesId - The series ID
   * @param chapterId - The chapter ID
   * @param accessToken - The user's access token
   */
  async deleteChapter(
    seriesId: string,
    chapterId: string,
    accessToken: string
  ) {
    return this.execute<any>({
      method: "DELETE",
      endpoint: `/translator/series/chapter/${seriesId}/${chapterId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Create a new chapter
   * @param seriesId - The series ID
   * @param formData - FormData containing chapter data and optional file
   * @param accessToken - The user's access token
   */
  async createChapter(
    seriesId: string,
    formData: FormData,
    accessToken: string
  ) {
    return this.execute<any>({
      method: "POST",
      endpoint: `/translator/series/chapter/${seriesId}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    });
  }

  /**
   * Create multiple chapters in one request (bulk upload)
   * @param seriesId - The series ID
   * @param formData - FormData with "chapters" (JSON string) and optional "chapterFiles" (multiple files)
   * @param accessToken - The user's access token
   */
  async createBulkChapters(
    seriesId: string,
    formData: FormData,
    accessToken: string
  ) {
    return this.execute<{
      total: number;
      successful: number;
      failed: number;
      results: Array<
        | { success: true; data: any }
        | {
            success: false;
            error: string;
            chapterNumber: number;
            title: string;
          }
      >;
    }>({
      method: "POST",
      endpoint: `/translator/series/chapter/${seriesId}/bulk`,
      data: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get dashboard statistics
   * @param accessToken - The user's access token
   */
  async getDashboardStats(accessToken: string) {
    return this.execute<DashboardStatsResponse>({
      method: "GET",
      endpoint: "/translator/dashboard/stats",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Create a new comment
   * @param payload - The comment creation payload
   * @param accessToken - The user's access token
   */
  async createComment(
    payload: {
      content: string;
      seriesId?: string;
      chapterId?: string;
      parentCommentId?: string;
    },
    accessToken: string
  ) {
    return this.execute<any>({
      method: "POST",
      endpoint: "/comment",
      data: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get comments for a series
   * @param seriesId - The series ID
   */
  async getSeriesComments(seriesId: string) {
    return this.execute<any[]>({
      method: "GET",
      endpoint: `/comment/series/${seriesId}`,
    });
  }

  /**
   * Get comments for a chapter
   * @param chapterId - The chapter ID
   */
  async getChapterComments(chapterId: string) {
    return this.execute<any[]>({
      method: "GET",
      endpoint: `/comment/chapter/${chapterId}`,
    });
  }

  /**
   * Delete a comment
   * @param commentId - The comment ID
   * @param accessToken - The user's access token
   */
  async deleteComment(commentId: string, accessToken: string) {
    return this.execute<any>({
      method: "DELETE",
      endpoint: `/comment/${commentId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get most popular chapters
   * @param accessToken - The user's access token
   */
  async getMostPopularChapters(accessToken: string) {
    return this.execute<PopularChaptersResponse[]>({
      method: "GET",
      endpoint: "/translator/dashboard/popular-chapters",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get recent purchases
   * @param accessToken - The user's access token
   */
  async getRecentPurchases(accessToken: string) {
    return this.execute<RecentChapterPurchases[]>({
      method: "GET",
      endpoint: "/translator/dashboard/recent-purchases",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get earnings data
   * @param accessToken - The user's access token
   * @param year - Optional year to filter earnings (defaults to current year)
   */
  async getEarningsData(accessToken: string, year?: number) {
    const params = year ? `?year=${year}` : "";
    return this.execute<{
      monthlyData: Array<{ month: string; earned: number }>;
      lastMonthEarnings: number;
      thisWeekEarnings: number;
      lastWeekEarnings: number;
      totalEarnings: number;
    }>({
      method: "GET",
      endpoint: `/translator/dashboard/earnings${params}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async uploadImage(formData: FormData, accessToken: string) {
    return this.execute<{ url: string }>({
      method: "POST",
      endpoint: "/translator/upload-image",
      data: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

const apiClientManager = new ApiClient();
export default apiClientManager;
