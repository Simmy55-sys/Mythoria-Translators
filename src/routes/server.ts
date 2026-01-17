export const translatorLogin = "/account/translator/login";
export const profile = "/user/profile";
export const translatorSeries = "/translator/series";
export const createChapter = (seriesId: string) =>
  `/translator/series/chapter/${seriesId}`;
export const assignment = (assignmentId: string) =>
  `/translator/assignment/${assignmentId}`;
export const seriesCreate = "/translator/series/create";
export const translatorForgotPasswordRoute = "/account/translator/forgot-password";
export const translatorResetPasswordRoute = "/account/translator/reset-password";
export const translatorValidateResetTokenRoute =
  "/account/translator/validate-reset-token";
