export interface Movie {
  movie: {
    _id: string;
    name: string;
    origin_name: string;
    thumb_url: string;
    poster_url: string;
    content: string;
    year: number;
    category: Array<{id: string, name: string}>;
    type: string;
    sub_docquyen: boolean;
    chieurap: boolean;
    time: string;
    episode_current: string;
    quality: string;
    lang: string;
    slug: string;
    description: string;
  },
  episodes: [
    {server_name: string, server_data: Array<string>}
  ]
}
export interface ApiResponse {
  items: Movie[];
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export async function getMovies(page = 1): Promise<ApiResponse> {
  const response = await fetch(`https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
}

export async function getMovie(slug: string): Promise<Movie> {
  const response = await fetch(`https://phimapi.com/phim/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie');
  }
  return response.json();
}