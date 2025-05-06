import { Play, MoreHorizontal, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtistHeader } from "@/components/artists/artist-header";
import { PopularTracks } from "@/components/artists/popular-tracks";
import Player from "../player";

export default function ArtistPage() {
  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden">
      <div
        className="flex-1 overflow-y-auto"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="mx-auto max-w-7xl px-4 pb-20">
          <ArtistHeader />
          <div className="mt-6 flex items-center gap-6">
            <Button
              size="lg"
              className="rounded-full bg-green-500 hover:bg-green-600"
            >
              <Play className="mr-1 h-6 w-6 fill-black text-black" />
              Play
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-neutral-700"
            >
              <Heart className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-neutral-400 hover:text-white"
            >
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>

          <PopularTracks />
        </div>
      </div>
    </div>
  );
}