export const GET_ANIME_DETAILS = (season: string) => {
  return {
    query: `
    query {
      searchWorks(orderBy: { field: WATCHERS_COUNT, direction: DESC }, seasons: ["${season}"],) {
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
  }
}

export const GET_ANIME_DETAILS_BY_IDS = (annictIds: number[]) => {
  return {
    query: `
    query {
      searchWorks(annictIds: [${annictIds}]) {
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
  }
}
