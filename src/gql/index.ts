export const GET_ANIME_DETAILS = (season: string) => {
  if (!/^\d{4}-(spring|summer|autumn|winter)$/.test(season)) {
    throw new Error("Invalid season");
  }
  return {
    query: `
    query {
      searchWorks(orderBy: { field: WATCHERS_COUNT, direction: DESC }, seasons: [${JSON.stringify(season)}],) {
        nodes {
          __typename
          annictId
          officialSiteUrl
          title
          twitterUsername
          watchersCount
          media
          image {
            __typename
            recommendedImageUrl
            facebookOgImageUrl
          }
        }
      }
    }
  `,
  };
};

export const GET_ANIME_DETAILS_BY_IDS = (annictIds: number[]) => {
  if (annictIds.length > 500 || !annictIds.every((id) => Number.isSafeInteger(id) && id > 0 && id <= 2147483647)) {
    throw new Error("Invalid anime IDs");
  }
  return {
    query: `
    query {
      searchWorks(orderBy: { field: WATCHERS_COUNT, direction: DESC }, annictIds: [${annictIds}]) {
        nodes {
          __typename
          annictId
          officialSiteUrl
          title
          twitterUsername
          watchersCount
          media
          image {
            __typename
            recommendedImageUrl
            facebookOgImageUrl
          }
        }

      }
    }
  `,
  };
};
