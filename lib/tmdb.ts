// ─── lib/tmdb.ts ────────────────────────────────────────────────
type TMDBResponse<T> = T & { status_message?: string; status_code?: number };

// — private config —
const TMDB_BASE = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // set in .env.local

if (!TMDB_KEY) {
  throw new Error(
    "TMDB api key missing. Add NEXT_PUBLIC_TMDB_KEY in .env.local"
  );
}

// — centralised fetch wrapper —
async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  const url = new URL(TMDB_BASE + endpoint);

  //For each key-value pair in params, set it as a search parameter
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      //The accept header tells the server what kind of response we expect
      accept: "application/json",
      //The authorization header is used to authenticate the request
      Authorization: `Bearer ${TMDB_KEY}`,
    },
  }); // cache 60 s on server

  //TODO figure out the structure of the error response from TMDB
  if (!res.ok) {
    const err = (await res.json()) as TMDBResponse<{}>;
    throw new Error(err.status_message || "TMDB request failed");
  }
  return res.json() as Promise<T>;
}

// — public helpers ————————————————————————————————————————————
export const getTrending = (timeWindow: "day" | "week" = "day") =>
  tmdbFetch<TMDBFetchListResponse>(`/trending/tv/${timeWindow}`);

export const getTopRated = async (pages: number[] = [1, 2]) => {
  const results = await Promise.all(
    pages.map((pgNumber) =>
      tmdbFetch<TMDBFetchListResponse>("/tv/top_rated", { page: pgNumber })
    )
  );

  results.sort((a, b) => a.page - b.page); // Ensure results are in order by page

  // Combine all results into a single array
  return {
    results: results.flatMap((r) => r.results),
    pages: pages,
  };
};

export const getPopular = (page = 1) =>
  tmdbFetch<TMDBFetchListResponse>("/tv/popular", { page });

export const getPopularMultiplePages = async (pages: number[] = [1, 2]) => {
  //Promise.all is used to execute multiple asynchronous operations in parallel.
  //It takes an array of promises and returns a single array of results
  // where each element corresponds to the resolved value of each promise in the input array.
  const results = await Promise.all(pages.map((page) => getPopular(page)));

  results.sort((a, b) => a.page - b.page); // Ensure results are in order by page

  // Combine all results into a single array
  return {
    results: results.flatMap((r) => r.results),
    pages: pages,
  };
};

export const searchShows = (query: string, page = 1) =>
  tmdbFetch<SearchResponse>("/search/tv", { query, page });

export const getShowDetails = (id: number) =>
  tmdbFetch<ShowDetails>(`/tv/${id}`);

// — example response typings (simplified) —
export interface TMDBFetchListResponse {
  page: number;
  results: ShowSummary[];
}
export interface SearchResponse {
  results: ShowSummary[];
  page: number;
}
export interface ShowSummary {
  backdrop_path: string | null;
  /** TMDB numeric ID */
  id: number;
  /** Localised title */
  name: string;
  /** Title in original language */
  original_name: string;
  overview: string;
  poster_path: string | null;
  /** Always "tv" for this endpoint variant */
  media_type: "tv";
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}
export interface ShowDetails {
  id: number;
  name: string;
  overview: string;
}

// ────────────────────────────────────────────────────────────────
