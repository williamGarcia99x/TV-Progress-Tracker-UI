import Image from "next/image";
import { Card, CardContent, CardTitle } from "./ui/card";

import { ShowSummary } from "@/lib/tmdb";
import Link from "next/link";

function truncateTitle(title: string, maxLength: number = 38): string {
  if (title.length > maxLength) {
    return title.slice(0, maxLength - 1) + "…";
  }
  return title;
}

function TvShowCard({ show }: { show: ShowSummary }) {
  return (
    <Link href={`/shows/${show.id}`}>
      <Card className=" gap-y-0 p-0 m-0  bg-black/0 rounded-md border-gray-500 hover:border-gold-main">
        <CardContent className="relative p-0">
          {/* It's possible that the poster path is null. Choose alternative behavior when this happens */}
          <div className="relative w-[150px] h-[255px] ">
            <Image
              alt={`${show.name} Poster`}
              src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
              className="rounded-t-md rounded-tr-md object-cover"
              fill
              sizes="150x255"
            />
          </div>
        </CardContent>
        <CardTitle className="text-sm rounded-b-md h-[55px] w-[150px] bg-cinematic-charcoal text-heading-secondary leading-4 flex justify-center items-center text-center  ">
          {truncateTitle(show.name)}
        </CardTitle>
      </Card>
    </Link>
  );
}

export default TvShowCard;
