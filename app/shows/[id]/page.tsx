// app/shows/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
// import TrackSidebar from "./TrackSidebar";
import { getShowDetails, ShowDetails } from "@/lib/tmdb";
import { cookies } from "next/headers";

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
  //If the user is not logged in, we cannot fetch the tracking information for the show.

  //Perform error handling on the showId using a try-catch block
  let show: ShowDetails | null = null;
  try {
    show = await getShowDetails(showId);
  } catch (error) {
    //The notFound page should display the error message passed
    console.error("Error fetching show details:", error);

    //navigate to the notFound page
    return notFound();
  }

  if (!show) return notFound();

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
    <main className="h-full flex justify-center items-center">
      {/* The flex settings do not apply to the element below because it's absolute */}
      <div className="absolute inset-0 -z-50">
        <Image
          src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
          alt="backdrop blur background"
          fill
          className="blur-xl"
        />
        {/* dark overlay over backdrop */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="information-card">
        {/* Show information Card. Centered on page */}
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
            fill
            alt="backdrop path"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative flex w-full gap-10 ">
            {/* Poster */}
            <Link
              href={`https://www.themoviedb.org/tv/${show.id}`}
              target="_blank"
              className="shrink-0 outline-none focus-visible:ring-2 ring-yellow-400"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
                alt={`${show.name} poster`}
                width={280}
                height={420}
                priority
                className="rounded-lg shadow-xl object-cover h-auto w-[180px] md:w-[230px] lg:w-[280px]"
              />
            </Link>

            {/* Show Details */}
            <div className="text-salty-white max-h-full overflow-hidden flex flex-col justify-center">
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

              <p className="text-sm leading-relaxed line-clamp-[10] md:line-clamp-[12] mb-6">
                {show.overview || "No description available."}
              </p>
              <p className="text-sm">
                {isLoggedIn ? "You are logged in" : "You are not logged in"}
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
    </main>
  );
}
