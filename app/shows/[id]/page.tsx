// app/shows/[id]/page.tsx
import Image from "next/image";

import { notFound } from "next/navigation";
// import TrackSidebar from "./TrackSidebar";
import { getShowDetails, ShowDetails } from "@/lib/tmdb";
import { cookies } from "next/headers";
import { getTrackingByUserAndShow, UserTvTracker } from "@/lib/trackerService";
import ShowDetailsContent from "./ShowDetailsContent";

// ---------- helpers ----------

//If user is logged in when they navigate to this page, we can check to see if show is tracked. This way, the tracking information
//can be displayed in the information card. This same data can also be passed to the TrackSidebar component.

export default async function ShowDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: showId } = await params;

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("token");

  let show: ShowDetails | null = null;
  let trackingInfo: UserTvTracker | null = null;

  try {
    show = await getShowDetails(showId);
    if (!show) return notFound();

    if (isLoggedIn) {
      //if the user is logged in, we can fetch the tracking information for the show
      trackingInfo = await getTrackingByUserAndShow(
        cookieStore.get("userId")?.value as string,
        showId,
        cookieStore.get("token")?.value as string
      );
    }
  } catch (error) {
    //The notFound page should display the error message passed
    console.error(error.message);

    //navigate to the notFound page
    return notFound();
  }

  //as long as the show exists, we return the page

  //TODO Need fallbacks for backdrop and poster images. Will do later

  return (
    // Content for page
    <div className="h-full">
      {/* The flex settings do not apply to the element below because it's absolute */}
      <div className="page-background fixed inset-0 -z-50">
        <Image
          src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
          alt="backdrop blur background"
          fill
          className="blur-xl"
        />
        {/* dark overlay over backdrop */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <ShowDetailsContent
        show={show}
        trackingInfo={trackingInfo}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
