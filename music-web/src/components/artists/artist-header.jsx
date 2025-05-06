import { usePlayer } from "../player-provider"

export function ArtistHeader() {
  const { currentArtist, setCurrentSong } = usePlayer()
  return (
    <div className="relative pt-16">
      <div className="absolute inset-0 z-0 h-[400px] overflow-hidden">
        <div className="relative h-full w-full">
          <img
            src={currentArtist?.thumbnailM || "/placeholder.svg?height=800&width=1600"}
            alt="Artist Cover"
            width={1600}
            height={800}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
        </div>
      </div>

      <div className="relative z-10 pt-24">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
          <div className="h-56 w-56 overflow-hidden rounded-full shadow-2xl ring-2 ring-neutral-800">
            <img
              src={currentArtist?.thumbnail || "/placeholder.svg?height=800&width=1600"}
              alt="Artist"
              width={400}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center">
              <span className="mr-2 flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs font-bold uppercase">
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified Artist
              </span>
            </div>
            <h1 className="text-5xl font-bold md:text-7xl lg:text-8xl">{currentArtist?.name}</h1>
            <p className="mt-4 text-lg text-neutral-300">{currentArtist?.totalFollow} follower</p>
          </div>
        </div>
      </div>
    </div>
  )
}