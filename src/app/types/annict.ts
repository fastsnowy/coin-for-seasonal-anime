type Work = {
  __typename: 'Work';
  annictId: number;
  officialSiteUrl: string;
  title: string;
  twitterUsername: string;
  watchersCount: number;
  media: "TV" | "OVA" | "MOVIE" | "WEB";
  image: {
    __typename: 'WorkImage';
    recommendedImageUrl: string;
    facebookOgImageUrl: string;
  };
};

export type AnnictWorks = Work[];
