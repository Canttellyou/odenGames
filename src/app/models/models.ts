export interface GameInterface {
  background_image: string;
  name: string;
  released: string;
  metacritic_url: string;
  description: string;
  metacritic: number;
  genres: Array<Genre>;
  parent_platforms: Array<ParentPlatform>;
  publishers: Array<Publishers>;
  ratings: Array<Rating>;
  screenshots: Array<Screenshots>;
  trailers: Array<Trailer>;
  id: string;
  website: string;
}

export interface APIResponse<T> {
  results: Array<T>;
  next: string;
  previous: string;
}

interface Genre {
  name: string;
}

interface ParentPlatform {
  platform: {
    slug: string;
    name: string;
  };
}

interface Publishers {
  name: string;
}

interface Rating {
  id: number;
  count: number;
  title: string;
}

interface Screenshots {
  image: string;
}

interface Trailer {
  data: {
    max: string;
  };
}
