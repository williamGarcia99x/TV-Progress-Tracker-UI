"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("baseUrl is trackerActions.ts is undefined");
}

const backendUrl = `${baseUrl}/tracker`;

export interface TrackerActionState {
  error?: string;
  success?: string;
}

//Cannot return NextResponses from server actions
//Use for either creating or mutating an existing tracker
export async function createTracker(
  prevState: TrackerActionState,
  formData: FormData
): Promise<TrackerActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (!token) {
    return { error: "You need to be logged in to track a show." };
  }

  if (!userId) return { error: "Missing userId from request" };

  const posterPathDirty = formData.get("posterPath")?.toString() as string;
  const posterPathClean = posterPathDirty.startsWith("/")
    ? posterPathDirty.substring(1)
    : posterPathDirty;

  const body = {
    userTvTracker: {
      userId,
      showId: formData.get("showId")?.toString(),
      status: formData.get("status")?.toString(), // "planning" | "watching" | "completed"
      episodesWatched: formData.get("episodesWatched")?.toString(),
      currentSeason: formData.get("currentSeason")?.toString(),
      userRating: formData.get("userRating")?.toString(),
      notes: formData.get("notes")?.toString(),
      dateStarted: formData.get("dateStarted")?.toString(),
      dateCompleted: formData.get("dateCompleted")?.toString(),
    },
    tvShow: {
      id: formData.get("showId")?.toString(),
      name: formData.get("name")?.toString(),
      original_name: formData.get("originalName")?.toString(),
      poster_path: posterPathClean,
      genreIds: formData
        .get("genreIds")
        ?.toString()
        .split(",")
        .map((id) => Number(id)),
    },
  };
  console.log(body);

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      //The authorization header is used to authenticate the request
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    if (res.status >= 500) {
      return {
        error: "An error occurred on our end 😢. Try again later.",
      };
    }

    const errorMessage = await res.text();

    return {
      error: errorMessage,
    };
  }
  console.log(body);
  revalidateTag("tracker_data");
  return { success: "Successfully tracked show 🚀" };
}

export async function updateTracker(
  prevState: TrackerActionState,
  formData: FormData
): Promise<TrackerActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (!token) {
    return { error: "You need to be logged in to track a show." };
  }

  if (!userId) return { error: "Missing userId from request" };

  const body = {
    userId,
    trackerId: formData.get("trackerId")?.toString(),
    showId: formData.get("showId")?.toString(),
    status: formData.get("status")?.toString(), // "planning" | "watching" | "completed"
    episodesWatched: formData.get("episodesWatched")?.toString(),
    currentSeason: formData.get("currentSeason")?.toString(),
    userRating: formData.get("userRating")?.toString(),
    notes: formData.get("notes")?.toString(),
    dateStarted: formData.get("dateStarted")?.toString(),
    dateCompleted: formData.get("dateCompleted")?.toString(),
  };

  const res = await fetch(`${backendUrl}/${body.showId}`, {
    method: "PUT",
    headers: {
      //The authorization header is used to authenticate the request
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    if (res.status >= 500) {
      return {
        error: "An error occurred on our end 😢. Try again later.",
      };
    }

    const errorMessage = await res.text();
    return {
      error: errorMessage,
    };
  }

  revalidateTag("tracker_data");
  return { success: "Successfully updated 🚀" };
}

export async function logoutUser() {
  const cookieStore = await cookies();

  if (cookieStore.has("token")) {
    cookieStore.delete("token");
  }
  // Remove authentication cookies

  if (cookieStore.has("userId")) {
    cookieStore.delete("userId");
  }

  redirect("/");
}
