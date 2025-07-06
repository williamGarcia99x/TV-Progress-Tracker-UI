import TvShowCard from "@/components/TvShowCard";
import { ShowSummary } from "@/lib/tmdb";

export default function ShowCardGrid({ shows }: { shows: ShowSummary[] }) {
  return (
    <div className="flex flex-wrap gap-4 justify-start px-4 py-6">
      {shows.map((show) => (
        <TvShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}
