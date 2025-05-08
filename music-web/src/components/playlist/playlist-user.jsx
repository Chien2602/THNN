"use client"
import { Button } from "@/components/ui/button"
import { Clock, Heart, MoreHorizontal, Play, Pause, Music, Loader2, Share2 } from 'lucide-react'
import { usePlayer } from "../player-provider"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function PlaylistPage() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playTrack,
    setCurrentSong,
    currentPlaylistUser,
    currentPlaylist,
    currentUser
  } = usePlayer()

  const [playlistData, setPlaylistData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {}, [currentUser])

  useEffect(() => {
    if (currentPlaylistUser) {
      const fetchPlaylistData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`http://localhost:3001/api/playlists/${currentPlaylistUser._id}/songs`)
          if (!response.ok) throw new Error("Failed to fetch playlist data")
          const data = await response.json()
          setPlaylistData(data)
          setError(null)
        } catch (error) {
          console.error("Error fetching playlist data:", error)
          setError("Không thể tải danh sách phát. Vui lòng thử lại sau.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchPlaylistData()
    }
  }, [currentPlaylistUser])

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = ("0" + (seconds % 60)).slice(-2)
    return `${minutes}:${remainingSeconds}`
  }

  const formatListeners = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count
  }

  const handleClickSong = (song) => {
    setCurrentSong(song)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  if (!currentPlaylist) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-8">
        <div className="text-center max-w-md mx-auto bg-zinc-900/60 p-8 rounded-xl backdrop-blur-sm shadow-xl">
          <Music className="h-20 w-20 mx-auto text-emerald-500/80 mb-6" />
          <h2 className="text-2xl font-bold mb-3">Không có danh sách phát nào được chọn</h2>
          <p className="text-zinc-400 mb-6">Vui lòng chọn một danh sách phát từ thư viện của bạn</p>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium">
            Khám phá danh sách phát
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto pb-24 bg-gradient-to-b from-zinc-900 to-black">
      <div className="bg-gradient-to-b from-emerald-900/80 to-zinc-900/90 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="w-48 h-48 md:w-60 md:h-60 shadow-2xl rounded-md overflow-hidden flex-shrink-0 group relative">
            {currentPlaylist?.thumbnailM ? (
              <img 
                src={currentPlaylist.thumbnailM || "/placeholder.svg"} 
                alt={currentPlaylist.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Music className="h-20 w-20 text-emerald-500/80" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                onClick={() => togglePlayPause()}
              >
                {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-wider bg-zinc-800/80 px-3 py-1 rounded-full text-emerald-400 mb-2">Playlist</span>
            <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-4 leading-tight">{currentPlaylist?.title}</h1>
            <p className="text-sm text-zinc-300 md:max-w-2xl line-clamp-2 md:line-clamp-3">
              {currentPlaylist?.sortDescription || "Thưởng thức những bản nhạc tuyệt vời trong danh sách phát này."}
            </p>
            <div className="flex items-center gap-3 mt-4 text-sm">
              <span className="font-semibold text-white">{currentUser?.username || "Various Artists"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* <div className="flex items-center gap-4 mb-8">
          <Button
            size="lg"
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg px-8 font-medium"
            onClick={() => togglePlayPause()}
          >
            {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 ml-0.5 mr-2" />}
            {isPlaying ? "Tạm dừng" : "Phát"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full border-zinc-700 hover:bg-zinc-800 transition-colors",
              isLiked ? "text-emerald-500 border-emerald-500/50 bg-emerald-500/10" : "text-zinc-400 hover:text-white"
            )}
            onClick={toggleLike}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-emerald-500")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div> */}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/30 rounded-xl backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
            <span className="text-zinc-400">Đang tải danh sách phát...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-xl backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <Music className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
              <p className="text-zinc-400 mb-6">{error}</p>
              <Button variant="outline" className="bg-zinc-800/50 hover:bg-zinc-800" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-zinc-900/30 rounded-xl backdrop-blur-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                    <th className="px-4 py-3 w-12">#</th>
                    <th className="px-4 py-3">Tiêu đề</th>
                    <th className="px-4 py-3 hidden md:table-cell">Album</th>
                    <th className="px-4 py-3 text-right">
                      <Clock className="h-4 w-4 inline" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playlistData?.map((song, index) => (
                    <tr
                      key={song.encodeId}
                      className={cn(
                        "group border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer",
                        currentTrack?.encodeId === song.encodeId && "bg-emerald-900/20"
                      )}
                      onClick={() => handleClickSong(song)}
                    >
                      <td className="px-4 py-3 w-12">
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <span className="group-hover:hidden">
                            {currentTrack?.encodeId === song.encodeId ? (
                              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            ) : (
                              <span className={currentTrack?.encodeId === song.encodeId ? "text-emerald-500" : "text-zinc-400"}>
                                {index + 1}
                              </span>
                            )}
                          </span>
                          <Play className="h-4 w-4 hidden group-hover:block text-white" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
                            <img
                              src={song.thumbnail || "/placeholder.svg?height=40&width=40"}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div
                              className={cn(
                                "font-medium line-clamp-1",
                                currentTrack?.encodeId === song.encodeId && "text-emerald-500"
                              )}
                            >
                              {song.title}
                            </div>
                            <div className="text-sm text-zinc-400 line-clamp-1">{song.artistsNames}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-zinc-400 text-sm">
                        <span className="line-clamp-1 max-w-[200px] hover:text-white transition-colors">
                          {song.album || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-400 text-sm">{formatDuration(song.duration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {playlistData?.sections?.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <span>Bạn có thể thích</span>
                  <div className="h-px flex-grow bg-zinc-800/50 ml-4"></div>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {playlistData.sections[0]?.items?.slice(0, 6).map((item) => (
                    <div key={item.encodeId} className="group cursor-pointer">
                      <div className="aspect-square rounded-md overflow-hidden bg-zinc-800 mb-3 relative shadow-md">
                        <img
                          src={item.thumbnail || "/placeholder.svg?height=200&width=200"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="icon"
                            className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg transform scale-0 group-hover:scale-100 transition-transform"
                          >
                            <Play className="h-5 w-5 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-xs text-zinc-400 line-clamp-1 mt-1">{item.artistsNames}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
