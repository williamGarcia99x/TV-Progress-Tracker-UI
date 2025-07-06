import { ShowSummary } from "./tmdb";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!backendUrl) {
  throw new Error(
    "NEXT_API_BASE_URL is not defined in the environment variables."
  );
}
const baseUrl = `${backendUrl}/tracker`;

/**
 * Matches the MySQL table  ❯  user_tv_tracker
 */
export interface UserTvTracker {
  /** Auto‑increment primary key */
  trackerId: number;

  /** FK → users.id (always present) */
  userId: number;

  /** FK → shows.id (TMDB or local) */
  showId: number;

  /** Current progress state */
  status: "PLANNING" | "WATCHING" | "COMPLETED";

  /** Episodes watched so far (can be null / undefined if unknown) */
  episodesWatched: number | null;

  /** Season the user is currently on */
  currentSeason: number | null;

  /**
   * Personal rating 1.0 – 10.0
   * (nullable until the user rates)
   */
  userRating: number | null;

  /** Free‑form personal notes */
  notes: string | null;

  /** When the tracker entry was created */
  dateAdded: Date | string; // TIMESTAMP defaults to now

  /** When the user started watching (nullable) */
  dateStarted?: Date | string | null;

  /** When the user finished the show (nullable) */
  dateCompleted?: Date | string | null;
}

export const getTrackingByUserAndShow = async (
  userId: string,
  showId: string,
  token: string
): Promise<UserTvTracker | null> => {
  if (!userId || !showId || !token) {
    throw new Error("Missing required parameters: userId, showId, or token");
  }

  const url = new URL(`${baseUrl}`);

  url.searchParams.append("user-id", userId);
  url.searchParams.append("show-id", showId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      //The accept header tells the server what kind of response we expect
      accept: "application/json",
      //The authorization header is used to authenticate the request
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: ["tracker_data"],
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to fetch tracking data");
  }

  const data = await res.json();

  //If an empty object was sent from the backend, the resource requested does not exist
  if (Object.keys(data).length === 0) return null;

  return data;
};

export const getAllUserTrackings = async (
  token: string,
  params: Record<string, any> = {}
): Promise<ShowSummary[]> => {
  if (!token) {
    throw new Error("Missing required parameters: token");
  }

  const url = new URL(`${baseUrl}`);

  Object.entries(params).forEach(([key, val]) =>
    url.searchParams.set(key, val)
  );

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      //The accept header tells the server what kind of response we expect
      accept: "application/json",
      //The authorization header is used to authenticate the request
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to fetch tracking data");
  }

  return await res.json();
};
