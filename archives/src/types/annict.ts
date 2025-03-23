export type annictWorks = {
  nodes: nodes[];
};

export type nodes = {
  __typename: string;
  annictId: number;
  media: string;
  image: _images | undefined;
  officialSiteUrl: string | undefined;
  title: string;
  twitterUsername: string | undefined;
  watchersCount: number;
};

type _images = {
  __typename: string;
  recommendedImageUrl: string;
  facebookOgImageUrl: string;
  twitterAvatarUrl: string;
};
