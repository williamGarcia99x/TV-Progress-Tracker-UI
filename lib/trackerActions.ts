"use server";

import { revalidateTag } from "next/cache";
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

  const body = {
    userTvTracker: {
      ...Object.fromEntries(
        formData
          .entries()
          .filter(
            ([k, v]) => k !== "genreIds" && k !== "originalName" && [k, v]
          )
      ),
      userId,
    },
    tvShow: {
      showId: formData.get("showId")?.toString(),
      originalName: formData.get("originalName")?.toString(),
      genreIds: formData
        .get("genreIds")
        ?.toString()
        .split(",")
        .map((id) => Number(id)),
    },
  };

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
    ...Object.fromEntries(
      formData
        .entries()
        .filter(([k, v]) => k !== "genreIds" && k !== "originalName" && [k, v])
    ),
    userId,

    //The information below is not needed when updating a tracking
    // tvShow: {
    //   showId: formData.get("showId")?.toString(),
    //   originalName: formData.get("originalName")?.toString(),
    //   genreIds: formData
    //     .get("genreIds")
    //     ?.toString()
    //     .split(",")
    //     .map((id) => Number(id)),
    // },
  };
  console.log("IN UPDATE TRACKING");
  console.log(body);

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
