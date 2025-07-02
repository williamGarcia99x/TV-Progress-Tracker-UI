import Image from "next/image";
import { Card, CardContent, CardTitle } from "./ui/card";

import { ShowSummary } from "@/lib/tmdb";

function TvShowCard({ show }: { show: ShowSummary }) {
  return (
    <Card className="w-[150px] shadow-lg gap-y-2 p-2">
      <CardContent className="relative p-0 m-0">
        {/* It's possible that the poster path is null. Choose alternative behavior when this happens */}
        <Image
          alt={`${show.name} Poster`}
          src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
          height={255}
          width={150}
        />
      </CardContent>
      <CardTitle className="text-sm leading-4 ">{show.name}</CardTitle>
    </Card>
  );
}

export default TvShowCard;
