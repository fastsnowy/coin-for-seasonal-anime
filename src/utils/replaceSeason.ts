export const replaceSeasonName = (seasonName: string) => {
  return seasonName
    .replace("winter", "冬")
    .replace("spring", "春")
    .replace("summer", "夏")
    .replace("autumn", "秋")
    .replace("-", "");
};
