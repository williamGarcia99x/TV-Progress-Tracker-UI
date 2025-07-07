import ShowCarousel from "@/components/ShowCarousel";

import { getPopularMultiplePages, getTopRated, getTrending } from "@/lib/tmdb";

export default async function Home() {
  //Try to fetch trending shows from TMDB using tmdb.ts. Fetch on server
  const { results: trendingShows } = await getTrending("week");
  const { results: popularShows } = await getPopularMultiplePages([1, 2]);
  const { results: topRatedShows } = await getTopRated([1, 2, 3]);

  return (
    <main className="min-h-screen py-10  ">
      <div className="flex flex-col gap-y-0">
        <section className="">
          <h2 className="text-2xl font-semibold text-heading-secondary mb-2 pl-2 tracking-tight">
            Trending Shows
          </h2>
          <ShowCarousel shows={trendingShows} className=" " />
        </section>
        <section className="">
          <h2 className="text-2xl font-semibold text-heading-secondary mb-2 pl-2 tracking-tight">
            Popular Shows
          </h2>
          <ShowCarousel shows={popularShows} className=" " />
        </section>
        <section className="">
          <h2 className="text-2xl font-semibold text-heading-secondary mb-2 pl-2 tracking-tight">
            Top Rated
          </h2>
          <ShowCarousel shows={topRatedShows} className=" " />
        </section>
      </div>
    </main>
  );
}
