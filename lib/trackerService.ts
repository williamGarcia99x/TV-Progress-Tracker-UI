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
  tracker_id: number;

  /** FK → users.id (always present) */
  user_id: number;

  /** FK → shows.id (TMDB or local) */
  show_id: number;

  /** Current progress state */
  watch_status: "PLANNING" | "WATCHING" | "COMPLETED";

  /** Episodes watched so far (can be null / undefined if unknown) */
  episodes_watched: number | null;

  /** Season the user is currently on */
  current_season: number | null;

  /**
   * Personal rating 1.0 – 10.0
   * (nullable until the user rates)
   */
  user_rating: number | null;

  /** Free‑form personal notes */
  notes: string | null;

  /** When the tracker entry was created */
  date_added: Date | string; // TIMESTAMP defaults to now

  /** When the user started watching (nullable) */
  date_started?: Date | string | null;

  /** When the user finished the show (nullable) */
  date_completed?: Date | string | null;
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

  console.log(url.toString());

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

  const data = await res.json();

  //If an empty object was sent from the backend, the resource requested does not exist
  if (Object.keys(data).length === 0) return null;

  return data;
};
