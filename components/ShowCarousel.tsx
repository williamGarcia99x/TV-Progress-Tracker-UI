import { cn } from "@/lib/utils";
import TvShowCard from "@/components/TvShowCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ShowSummary } from "@/lib/tmdb";
import Link from "next/link";

interface ShowCarouselProps {
  shows: ShowSummary[];
  className?: string;
  opts?: Record<string, any>; // Allow passing options to Carousel
}

export default function ShowCarousel({
  shows,
  className,
  opts,
}: ShowCarouselProps) {
  return (
    <Carousel className={cn(className)} opts={opts}>
      <CarouselContent className="px-4 h-[340px]   ">
        {shows.map((show) => (
          <CarouselItem key={show.id} className="basis-auto pl-2 ">
            <div className=" flex   ">
              <TvShowCard show={show} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
