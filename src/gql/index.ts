export const GET_ANIME_DETAILS = {
  query: `
  query {
    searchWorks(orderBy: { field: WATCHERS_COUNT, direction: DESC }, seasons: ["2023-winter"], first: 10) {
      nodes {
        __typename
        annictId
        officialSiteUrl
        title
        twitterUsername
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
