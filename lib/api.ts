export interface Episodes{
  _id: any;
  server_name: string;
  server_data: {
      name: string;
      link_embed: string;
  }[];
}

export interface Movie {
    movie: any;
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
    episodes: Episodes[];

}
export interface ApiResponse {
  items: Movie[];
  data: any;
  slug: string;
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface Genre {
  name: string;
  slug: string;
}

export interface Country {
  name: string;
  slug: string;
}

// export async function getMovies(page = 1): Promise<ApiResponse> {
//   const response = await fetch(`https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=${page}`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch movies');
//   }
//   return response.json();
// }

export async function getMoviesByParams({type_list, params, page = 1}: {type_list: string, params: string, page?: number}): Promise<ApiResponse> {
  const response = await fetch(`https://phimapi.com/v1/api/danh-sach/${type_list}?page=${page}${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
}

 export async function getMovie(slug: string): Promise<Movie> {
   const response = await fetch(`https:phimapi.com/phim/${slug}`);
   if (!response.ok) {
     throw new Error('Failed to fetch movie');
   }
   return response.json();
 }

export async function getMovies(page = 1, filters?: {
  genre?: string;
  year?: string;
  country?: string;
  minRating?: number;
  maxRating?: number;
}): Promise<ApiResponse> {
  let url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
  
  // If filters are provided, determine which specific API to use
  if (filters) {
    // Count how many filters are active
    const activeFilters = [filters.genre, filters.year, filters.country].filter(Boolean).length;
    
    // If only one filter is active, use the specific API for that filter
    if (activeFilters === 1) {
      if (filters.genre) {
        url = `https://phimapi.com/v1/api/the-loai/${filters.genre}?page=${page}`;
      } else if (filters.country) {
        url = `https://phimapi.com/v1/api/quoc-gia/${filters.country}?page=${page}`;
      } else if (filters.year) {
        url = `https://phimapi.com/v1/api/nam/${filters.year}?page=${page}`;
      }
    }
    // If multiple filters are active, just use one of them based on priority: genre > country > year
    else if (activeFilters > 1) {
      if (filters.genre) {
        url = `https://phimapi.com/v1/api/the-loai/${filters.genre}?country=${filters.country}&year=${filters.year}?page=${page}`;
      } else if (filters.country) {
        url = `https://phimapi.com/v1/api/quoc-gia/${filters.country}?category=${filters.genre}&year=${filters.year}?page=${page}`;
      } else if (filters.year) {
        url = `https://phimapi.com/v1/api/nam/${filters.year}?category=${filters.genre}&country=${filters.country}?page=${page}`;
      }
    }
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
}

export async function searchMovies(query: string, page = 1): Promise<ApiResponse> {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${encodedQuery}&page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }
  return response.json();
}

export async function getGenres(): Promise<Genre[]> {
  const response = await fetch('https://phimapi.com/the-loai');
  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }
  return response.json();
}

export async function getCountries(): Promise<Country[]> {
  const response = await fetch('https://phimapi.com/quoc-gia');
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
}