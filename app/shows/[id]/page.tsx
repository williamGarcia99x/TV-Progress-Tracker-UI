// app/shows/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
// import TrackSidebar from "./TrackSidebar";
import { getShowDetails, ShowDetails } from "@/lib/tmdb";
import { cookies } from "next/headers";
import { get } from "http";
import { getTrackingByUserAndShow, UserTvTracker } from "@/lib/trackerService";
import { cn } from "@/lib/utils";
import { TrackingInfoForm } from "./TrackingInfoForm";
import { createTracker } from "@/lib/trackerActions";
import { useFormState, useFormStatus } from "react-dom";

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

  //Need fallbacks for backdrop and poster images. Will do later
  //   // ----- FALLBACKS -----
  //   const backdropURL = show.backdrop_path
  //     ? TMDB_IMG(show.backdrop_path, "w1280")
  //     : "/fallback-backdrop.jpg";
  //   const posterURL = show.poster_path
  //     ? TMDB_IMG(show.poster_path, "w500")
  //     : "/fallback-poster.jpg";

  // ----- GENRES -----
  const genreList = show.genres?.map((g) => g.name).join(", ") || "N/A";

  return (
    // Content for page
    <main className="h-full">
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

      <div className="information-card relative h-full w-full flex justify-center items-center ">
        {/* Show information Card. Centered on page */}
        {/* backdrop image in card */}
        {/* This is centered on page thanks to the div.information-card  */}
        <div className="relative flex justify-between   h-3/4 w-11/12">
          {/* Poster */}
          {/* adding w-full forces the div to take up the full width alloted to it from its flex parent */}
          <div className="relative basis-[40%] shrink-0">
            <Link
              href={`https://www.themoviedb.org/tv/${show.id}`}
              target="_blank"
              className="shrink-0 outline-none focus-visible:ring-2 ring-yellow-400"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
                alt={`${show.name} poster`}
                fill
                priority
                className="rounded-lg shadow-xl object-cover"
              />
            </Link>
          </div>

          {/* Show Details */}
          <div className="relative text-salty-white flex ">
            <Image
              src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
              fill
              alt="backdrop path"
              className="absolute z-0 object-cover"
            />
            <div className="absolute z-0 inset-0 bg-black/75"></div>
            <div className="z-10 ">
              <h1 className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold mb-1 leading-tight">
                {show.name}
              </h1>
              {show.name !== show.original_name && (
                <p className="text-sm text-gray-300 italic mb-2">
                  Original Title: {show.original_name}
                </p>
              )}

              <ul className="text-sm space-y-1 mb-4">
                <li>
                  <span className="font-semibold">Genres:</span> {genreList}
                </li>
                <li>
                  <span className="font-semibold">First Aired:</span>{" "}
                  {show.first_air_date || "Unknown"}
                </li>
                <li>
                  <span className="font-semibold">Last Aired:</span>{" "}
                  {show.last_air_date || "Unknown"}
                </li>
                <li>
                  <span className="font-semibold">Seasons:</span>{" "}
                  {show.number_of_seasons ?? "?"} |{" "}
                  <span className="font-semibold">Episodes:</span>{" "}
                  {show.number_of_episodes ?? "?"}
                </li>
                <li>
                  <span className="font-semibold">Language:</span>{" "}
                  {show.original_language.toUpperCase()}
                </li>
                <li>
                  <span className="font-semibold">Rating:</span>{" "}
                  {show.vote_average.toFixed(1)} (
                  {show.vote_count.toLocaleString()} votes)
                </li>
                {show.popularity && (
                  <li>
                    <span className="font-semibold">Popularity Score:</span>{" "}
                    {Math.round(show.popularity)}
                  </li>
                )}
              </ul>

              <p className="text-sm leading-relaxed line-clamp-[10]  mb-6">
                {show.overview || "No description available."}
              </p>
              <p className="text-sm">
                {isLoggedIn ? "You are logged in" : "You are not logged in"}
              </p>
              <p className="text-sm">
                {trackingInfo
                  ? "Tracking information available"
                  : "No tracking info"}
              </p>

              {/* <div className="flex items-center gap-4">
            <TrackSidebar showId={id} showName={name} />
            <Link
              href={`https://www.themoviedb.org/tv/${id}`}
              target="_blank"
              className="text-sm underline decoration-theater-red decoration-2 underline-offset-4 hover:opacity-90"
            >
              View full TMDB page →
            </Link>
          </div> */}
            </div>
          </div>
        </div>
      </div>
      {trackingInfo && (
        <TrackingInfoForm trackingInfo={trackingInfo} showDetails={show} />
      )}
    </main>
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
