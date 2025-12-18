interface ApiError {
  message: string;
  statusCode?: number;
}

export type ApiResponse<T, E = ApiError> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

interface AuthenticatedUser {
  username: string;
  email: string;
  role: "translator" | "reader" | "admin";
}

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

export interface AssignmentResponse {
  assignmentId: string;
  seriesName: string;
}

export interface SeriesResponse {
  id: string;
  title: string;
  translatorName: string;
  slug: string;
  author: string;
  description: string;
  novelType: string;
  originalLanguage: string;
  featuredImage: string;
}

export interface PopularChaptersResponse {
  id: string;
  title: string;
  chapterNumber: number;
  seriesTitle: string;
  purchaseCount: number;
  revenue: number;
}

export interface RecentChapterPurchases {
  id: string;
  purchaseDate: string;
  createdAt: string;
  chapterTitle: string;
  chapterNumber: number;
  chapterId: string;
  seriesTitle: string;
  seriesId: string;
  buyerUsername: string;
  revenue: number;
}

export interface DashboardStatsResponse {
  seriesPublished: number;
  totalChapters: number;
  revenue: number;
  chapterSales: number;
  comments: number;
  averageRating: number;
}
