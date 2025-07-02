import ShowCarousel from "@/components/ShowCarousel";

import { getPopularMultiplePages, getTopRated, getTrending } from "@/lib/tmdb";

export default async function Home() {
  //Try to fetch trending shows from TMDB using tmdb.ts. Fetch on server
  const { results: trendingShows } = await getTrending("week");
  const { results: popularShows } = await getPopularMultiplePages([1, 2]);
  const { results: topRatedShows } = await getTopRated([1, 2, 3]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-10 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-slate-100 mb-4 pl-2 tracking-tight">
            Trending Shows
          </h2>
          <ShowCarousel
            shows={trendingShows}
            className="rounded-xl shadow-xl bg-slate-800/80"
          />
        </section>
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-slate-100 mb-4 pl-2 tracking-tight">
            Popular Shows
          </h2>
          <ShowCarousel
            shows={popularShows}
            className="rounded-xl shadow-xl bg-slate-800/80"
          />
        </section>
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-slate-100 mb-4 pl-2 tracking-tight">
            Top Rated
          </h2>
          <ShowCarousel
            shows={topRatedShows}
            className="rounded-xl shadow-xl bg-slate-800/80"
          />
        </section>
      </div>
    </main>
  );

  // return (
  //   <div>
  //     {/* Three horizontal carousel of TV cards will be here */}
  //     {/* Each carousel will get its source from different API endpoints */}
  //     {/* One carousel for trending shows */}
  //     <section>
  //       <h2>Trending Shows</h2>
  //       <ShowCarousel shows={trendingShows} />
  //     </section>
  //     <section>
  //       <h2>Popular Shows</h2>
  //       <ShowCarousel shows={popularShows} />
  //     </section>
  //     <section>
  //       <h2>Top Rated</h2>
  //       <ShowCarousel shows={topRatedShows} />
  //     </section>
  //   </div>
  // );
}
