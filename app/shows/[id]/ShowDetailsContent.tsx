"use client";
import { ShowDetails } from "@/lib/tmdb";
import { UserTvTracker } from "@/lib/trackerService";
import Image from "next/image";
import Link from "next/link";
import { TrackingInfoForm } from "./TrackingInfoForm";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function ShowDetailsContent({
  show,
  trackingInfo,
  isLoggedIn,
}: {
  show: ShowDetails;
  trackingInfo: UserTvTracker | null;
  isLoggedIn: boolean;
}) {
  const [showForm, setShowForm] = useState(() => (trackingInfo ? true : false));
  const router = useRouter();
  const trackerId = trackingInfo?.trackerId || 0;
  const tvTrackerInput: UserTvTracker = trackingInfo
    ? trackingInfo
    : {
        trackerId: trackerId,
        userId: 0,
        showId: show.id,
        status: "PLANNING",
        episodesWatched: null,
        currentSeason: null,
        userRating: null,
        notes: null,
        dateAdded: "",
        dateStarted: null,
        dateCompleted: null,
      };

  const handleTrackClick = () => {
    if (!isLoggedIn) {
      //redirect components are meant for Server components or Route handlers
      //redirect("/login");
      router.push(`/login?next=/shows/${show.id}`); // adds entry to history
      return;
    }

    setShowForm(true);
  };

  return (
    <>
      <main className="information-card relative h-full w-full flex justify-center items-center ">
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
                  <span className="font-semibold">Genres:</span>{" "}
                  {show.genres.map((g) => g.name).join(", ")}
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
              {/* If user is not logged in, clicking the Track button should redirect users to the login
              page.  */}

              <button
                className={cn(
                  "bg-gold-main p-2 rounded-lg text-black block hover:cursor-pointer",
                  (trackingInfo || showForm) && "hidden"
                )}
                onClick={handleTrackClick}
              >
                Track
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Key props forces the component to remount and reread all prop values with fresh data */}
      {showForm && (
        <TrackingInfoForm
          trackingInfo={tvTrackerInput}
          showDetails={show}
          key={trackerId}
        />
      )}
    </>
  );
}

export default ShowDetailsContent;
