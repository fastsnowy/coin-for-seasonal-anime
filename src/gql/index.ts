export const GET_ANIME_DETAILS = {
  query: `
  query {
    searchWorks(orderBy: { field: WATCHERS_COUNT, direction: DESC }, seasons: ["2023-winter"],) {
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
