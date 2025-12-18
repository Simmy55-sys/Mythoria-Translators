export const dashboard = "/";
export const newSeries = "/add-series";
export const newChapter = "/add-chapter";
export const bulkChapters = newChapter + "/bulk";
export const bulkSeries = "/add-bulk-series";

export const login = "/account/login";

export const manageSeries = "/manage";
export const manageSeriesDetail = (series: string) =>
  `/manage/series/${series}`;
export const manageSeriesChapterDetail = (series: string, chapter: string) =>
  `/manage/series/${series}/chapter/${chapter}`;
