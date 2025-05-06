"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { usePlayer } from "./player-provider"
import { useNavigate } from "react-router"
import api from "@/api/AxiosInstance"

export function SearchView() {
  const Navigation = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setCurrentSong, setCurrentPlaylist, setCurrentArtist } = usePlayer()

  const genres = [
    /* giữ nguyên danh sách genres như trước */
  ]

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(() => {
      searchMusic(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const searchMusic = async (query) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get(`/search?keyword=${query}`)

      const data = await response.data
      // Handle all result types
      const allResults = [
        ...(data.data.songs || []).map((item) => ({ ...item, type: "song" })),
        ...(data.data.artists || []).map((item) => ({ ...item, type: "artist" })),
        ...(data.data.playlists || []).map((item) => ({ ...item, type: "playlist" })),
      ]
      setSearchResults(allResults)
    } catch (err) {
      console.error("Search error:", err)
      setError(err.message)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Group results by type for better organization
  const groupedResults = searchResults.reduce((acc, item) => {
    const type = item.type || "song"
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {})

  const handleSongClick = (song) => {
    setCurrentSong(song)
  }

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist)
    Navigation("/playlist")
  }

  const handleArtistClick = (artist) => {
    setCurrentArtist(artist)
    Navigation("/artist")
  }
  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900/80 to-black p-6 overflow-auto animate-fade-in">
      <div className="mb-6">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Bạn muốn nghe gì?"
            className="bg-white/10 border-none pl-10 py-6 text-white placeholder:text-gray-400 focus-visible:ring-0 rounded-full shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery.trim() && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Kết quả tìm kiếm</h2>

            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-white/70" />
              </div>
            )}

            {error && <div className="bg-red-500/20 text-white p-4 rounded-lg mb-6">{error}</div>}

            {!isLoading && !error && searchResults.length > 0 && (
              <div className="space-y-8">
                {/* Songs section */}
                {groupedResults.song && groupedResults.song.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Bài hát</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {groupedResults.song.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-800/40 rounded-md p-4 transition-all duration-300 hover:bg-gray-700/60 group cursor-pointer"
                          onClick={() => handleSongClick(item)}
                        >
                          <div className="relative mb-4">
                            <img
                              src={item.thumbnailM || item.image || "/placeholder.svg?height=160&width=160"}
                              alt={item.title}
                              className="w-full aspect-square object-cover rounded-md shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <Play fill="black" size={20} className="ml-1" />
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-white truncate">{item.title}</h4>
                          <p className="text-gray-400 text-sm mt-1 truncate">{item.artistsNames}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artists section */}
                {groupedResults.artist && groupedResults.artist.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Nghệ sĩ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7">
                      {groupedResults.artist.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-800/40 rounded-md p-4 transition-all duration-300 hover:bg-gray-700/60 group cursor-pointer text-center"
                          onClick={() => handleArtistClick(item)}
                        >
                          <div className="relative mb-4 mx-auto">
                            <img
                              src={item.thumbnailM || item.image || "/placeholder.svg?height=160&width=160"}
                              alt={item.name || item.title}
                              className="w-40 h-40 object-cover rounded-full shadow-lg mx-auto"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                <Play fill="black" size={20} className="ml-1" />
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-white truncate">{item.name || item.title}</h4>
                          <p className="text-gray-400 text-sm mt-1">Nghệ sĩ</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playlists section */}
                {groupedResults.playlist && groupedResults.playlist.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Playlist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {groupedResults.playlist.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-800/40 rounded-md p-4 transition-all duration-300 hover:bg-gray-700/60 group cursor-pointer"
                          onClick={() => handlePlaylistClick(item)}
                        >
                          <div className="relative mb-4">
                            <img
                              src={item.thumbnailM || item.image || "/placeholder.svg?height=160&width=160"}
                              alt={item.title}
                              className="w-full aspect-square object-cover rounded-md shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <Play fill="black" size={20} className="ml-1" />
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-white truncate">{item.title}</h4>
                          <p className="text-gray-400 text-sm mt-1 truncate">
                            {item.artistsNames ||
                              (item.song?.items?.length ? `${item.song.items.length} bài hát` : "Playlist")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Albums section */}
                {groupedResults.album && groupedResults.album.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Album</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {groupedResults.album.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-800/40 rounded-md p-4 transition-all duration-300 hover:bg-gray-700/60 group cursor-pointer"
                        >
                          <div className="relative mb-4">
                            <img
                              src={item.thumbnailM || item.image || "/placeholder.svg?height=160&width=160"}
                              alt={item.title}
                              className="w-full aspect-square object-cover rounded-md shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <Play fill="black" size={20} className="ml-1" />
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-white truncate">{item.title}</h4>
                          <p className="text-gray-400 text-sm mt-1 truncate">{item.artistsNames}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* If there are results but they don't fit into the above categories */}
                {Object.keys(groupedResults).length === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-800/40 rounded-md p-4 transition-all duration-300 hover:bg-gray-700/60 group cursor-pointer"
                      >
                        <div className="relative mb-4">
                          <img
                            src={item.thumbnailM || item.image || "/placeholder.svg?height=160&width=160"}
                            alt={item.title || item.name}
                            className="w-full aspect-square object-cover rounded-md shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                              <Play fill="black" size={20} className="ml-1" />
                            </div>
                          </div>
                        </div>
                        <h4 className="font-semibold text-white truncate">{item.title || item.name}</h4>
                        <p className="text-gray-400 text-sm mt-1 truncate">{item.artistsNames || item.type || ""}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isLoading && !error && searchResults.length === 0 && (
              <div className="text-center py-10 text-gray-400">Không tìm thấy kết quả nào cho "{searchQuery}"</div>
            )}
          </div>
        )}

        {!searchQuery.trim() && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center animate-slide-up">Tìm kiếm bài hát yêu thích</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {genres.map((genre, index) => (
                <div
                  key={genre.id}
                  className="rounded-lg overflow-hidden relative cursor-pointer transition-all hover:scale-105 shadow-lg animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-90`} />
                  <div className="absolute bottom-0 right-0 opacity-30 text-6xl font-bold rotate-12 translate-x-2 translate-y-2">
                    <img src={genre.image || "/placeholder.svg"} alt="" className="w-24 h-24 object-cover" />
                  </div>
                  <div className="relative z-10 p-5 h-52 flex flex-col justify-between">
                    <h3 className="text-2xl font-bold text-white">{genre.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-sm">Thể loại</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
