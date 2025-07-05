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

// function TrackingInfo({ trackingInfo }: { trackingInfo: UserTvTracker }) {
//   const infoItems = [
//     {
//       label: "Status:",
//       value: trackingInfo.status,
//     },
//     {
//       label: "Episodes Watched:",
//       value: trackingInfo.episodesWatched?.toString() ?? "N/A",
//     },
//     {
//       label: "Seasons Watched:",
//       value: trackingInfo.currentSeason?.toString() ?? "N/A",
//     },
//     {
//       label: "Personal Rating:",
//       value: trackingInfo.userRating?.toString() ?? "N/A",
//     },
//     {
//       label: "Started At:",
//       value: trackingInfo.dateStarted
//         ? new Date(trackingInfo.dateStarted).toLocaleDateString()
//         : "N/A",
//     },
//     {
//       label: "Finished At:",
//       value: trackingInfo.dateCompleted
//         ? new Date(trackingInfo.dateCompleted).toLocaleDateString()
//         : "N/A",
//     },
//   ];

//   return (
//     <div className="rounded-xl border border-gray-600 bg-gradient-to-br from-0% via-[#40330172] to-100% bg-black   p-6 text-slate-100  backdrop-blur-md">
//       <h3 className="text-3xl font-bold mb-4 ">Your Tracking</h3>
//       <ul className="flex flex-wrap gap-y-4">
//         {infoItems.map((item, idx) => (
//           <ListItem
//             key={idx}
//             label={item.label}
//             value={item.value}
//             className="basis-1/3 text-xl"
//           />
//         ))}
//       </ul>
//       {trackingInfo.notes && (
//         <div className="mt-6">
//           <span className="font-semibold ">Notes:</span>
//           <div className="whitespace-pre-line mt-2 text-sm bg-slate-800/60 text-slate-200 rounded p-3 border border-slate-700">
//             {trackingInfo.notes}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function ListItem({
//   label,
//   value,
//   className = "",
// }: {
//   label: string;
//   value: string;
//   className?: string;
// }) {
//   return (
//     <li className={` ${className}`}>
//       <span className="leading-snug ">
//         <span className="font-medium">{label}</span>
//         <span className="text-slate-200 ml-1">{value}</span>
//       </span>
//     </li>
//   );
// }
