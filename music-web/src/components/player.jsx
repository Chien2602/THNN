"use client"

import { useState, useEffect, useRef } from "react"
import {
  Play,
  Pause,
  Volume2,
  Repeat,
  Repeat1,
  Heart,
  MoreHorizontal,
  ListMusic,
  VolumeX,
  Maximize2,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { usePlayer } from "@/components/player-provider"
import Replay10Icon from "@mui/icons-material/Replay10"
import Forward10Icon from "@mui/icons-material/Forward10"
import api from "@/api/AxiosInstance"

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isLiked, setIsLiked] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const activeRef = useRef(null)
  const { currentSong, currentUser } = usePlayer()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPlaylistAdd, setShowPlaylistAdd] = useState(false)
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!currentUser?._id) return

      try {
        const response = await api.get(`/playlists/user/${currentUser._id}`)
        if (response.data && Array.isArray(response.data)) {
          setPlaylists(response.data)
          console.log("Fetched playlists:", response.data)
        }
      } catch (error) {
        console.error("Error fetching playlists:", error)
      }
    }

    fetchPlaylists()
  }, [currentUser?._id])

  const [lyrics, setLyrics] = useState([])
  const [repeat, setRepeat] = useState(false)
  const hasReported = useRef(false)

  useEffect(() => {
    const loadAndPlay = async () => {
      if (currentSong && audioRef.current) {
        try {
          let url = currentSong.url
          if (!url) {
            const res = await api.get(`/song?id=${currentSong.encodeId}`)
            url = res.data?.data?.["128"]
          }

          if (url) {
            audioRef.current.src = url
            await audioRef.current.load()
            await audioRef.current.play()
            setIsPlaying(true)
          } else {
            console.error("No playable URL found for the song.")
          }
        } catch (error) {
          console.error("Error loading or playing audio:", error)
        }
      }
    }

    loadAndPlay()
  }, [currentSong?.encodeId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      setIsMuted(volume === 0)
    }
  }, [volume])

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("ended", handleEnded)
    }
  }, [repeat])

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0)
    } else {
      setVolume(70)
    }
  }

  useEffect(() => {}, [currentUser])

  const handleSeek = (value) => {
    const seekTime = value[0]
    setCurrentTime(seekTime)
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleAddToPlaylist = async (playlistId) => {
    if (!currentSong?.encodeId || !currentUser?._id) {
      console.error("Cannot add to playlist: Missing song ID or user ID")
      return
    }

    try {
      await api.post(`/playlists/${playlistId}/songs`, {
        encodeId: currentSong.encodeId,
        title: currentSong.title,
        thumbnail: currentSong.thumbnail,
        artistsNames: currentSong.artistsNames,
        duration: currentSong.duration,
      })

      console.log(`Added song ${currentSong.title} to playlist ${playlistId}`)
      setShowPlaylistAdd(false)
    } catch (error) {
      console.error("Error adding song to playlist:", error)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleSkip10Seconds = (forward = true) => {
    if (!audioRef.current) return

    const newTime = currentTime + (forward ? 10 : -10)
    const boundedTime = Math.min(Math.max(0, newTime), currentSong?.duration)

    audioRef.current.currentTime = boundedTime
    setCurrentTime(boundedTime)
  }

  useEffect(() => {
    if (!currentSong?.encodeId) return

    api
      .get(`/lyric?id=${currentSong.encodeId}`)
      .then((res) => res.data)
      .then((data) => {
        console.log("Fetched lyrics:", data?.data?.sentences)
        if (data?.data?.sentences) {
          setLyrics(data.data.sentences)
        } else {
          setLyrics([])
        }
      })
      .catch((err) => {
        console.error("Error fetching lyrics:", err)
        setLyrics([])
      })
  }, [currentSong?.encodeId])

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentTime])

  const handelRepeat = () => {
    setRepeat(!repeat)
  }

  const handleToggleFavorite = async () => {
    if (!currentSong?.encodeId || !currentUser?._id) {
      console.error("Cannot add to favorites: Missing song ID or user ID")
      return
    }

    try {
      if (isLiked) {
        await api.delete(`/favorites/${currentUser._id}/${currentSong.encodeId}`)
        console.log("Removed from favorites:", currentSong.title)
        setIsLiked(false)
      } else {
        await api.post("/favorites", {
          encodeId: currentSong.encodeId,
          userId: currentUser._id,
          title: currentSong.title,
          thumbnail: currentSong.thumbnail,
          artistsNames: currentSong.artistsNames,
          duration: currentSong.duration,
        })
        console.log("Added to favorites:", currentSong.title)
        setIsLiked(true)
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error)
    }
  }

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!currentSong?.encodeId || !currentUser?._id) return

      try {
        const response = await api.get(`/favorites/${currentUser._id}/${currentSong.encodeId}`)
        console.log("Favorite status response:", response.data)
        setIsLiked(!!response.data)
      } catch (error) {
        console.error("Error checking favorite status:", error)
        setIsLiked(false)
      }
    }

    checkFavoriteStatus()
  }, [currentSong?.encodeId, currentUser?._id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong?.encodeId || !currentUser?._id) return

    const onTimeUpdate = () => {
      if (!hasReported.current && audio.currentTime >= audio.duration / 2) {
        api
          .post("/history", {
            userId: currentUser._id,
            encodeId: currentSong.encodeId,
            title: currentSong.title,
            thumbnailM: currentSong.thumbnail || currentSong.thumbnailM,
            artistsNames: currentSong.artistsNames,
            albumName: currentSong.album?.title || "Unknown Album",
            duration: currentSong.duration,
          })
          .then(() => {
            console.log("History reported successfully")
            hasReported.current = true
          })
          .catch((err) => {
            console.error("Error reporting history:", err)
          })
      }
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    hasReported.current = false

    return () => audio.removeEventListener("timeupdate", onTimeUpdate)
  }, [currentSong, currentUser?._id])

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-start overflow-hidden bg-black/95 backdrop-blur-xl"
          : "bg-gradient-to-r from-black to-zinc-900 border-t border-gray-800/30 px-4 flex items-center"
      } justify-between transition-all duration-500 ${isFullscreen ? "h-screen" : isExpanded ? "h-80" : "h-24"}`}
    >
      {isFullscreen && (
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: `url(${
              currentSong?.thumbnailM ||
              currentSong?.thumbnail ||
              "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/2/6/2/7/2627c10c924237d129a289cc89cd695c.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(30px) brightness(0.7)",
          }}
        />
      )}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 bg-black/30 p-2 rounded-full backdrop-blur-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      )}
      <audio ref={audioRef} />

      {isFullscreen ? (
        <div className="w-full h-full flex flex-col">
          {/* Top section with title in fullscreen */}
          <div className="text-center mt-8 mb-4">
            <h2 className="text-white text-2xl font-bold tracking-tight">
              {currentSong?.title || currentSong?.songName}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{currentSong?.artistsNames || currentSong?.artistsName}</p>
          </div>

          {/* Main content area with album art and lyrics side by side */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
            {/* Album art section */}
            <div className="relative group flex-shrink-0">
              <img
                src={
                  currentSong?.thumbnail ||
                  "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/2/6/2/7/2627c10c924237d129a289cc89cd695c.jpg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt="Album cover"
                className="rounded-lg shadow-2xl group-hover:brightness-90 transition-all duration-300 h-64 w-64 md:h-80 md:w-80 border border-white/10 object-cover"
              />
            </div>

            {/* Lyrics section */}
            <div className="flex-1 max-w-xl h-80 md:h-96 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-400"
                >
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
                <h3 className="text-white text-lg font-semibold">Lyrics</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {lyrics.length > 0 ? (
                  <div className="space-y-4">
                    {lyrics.map((sentence, i) => {
                      // Convert currentTime to milliseconds for comparison with lyric timestamps
                      const currentTimeMs = currentTime * 1000
                      const isActive = sentence.words.some(
                        (word) => word.startTime <= currentTimeMs && currentTimeMs <= word.endTime,
                      )

                      return (
                        <p
                          key={i}
                          ref={isActive ? activeRef : null}
                          className={`text-base leading-relaxed transition-all duration-300 ${
                            isActive ? "text-green-400 text-lg font-semibold" : "text-gray-300"
                          }`}
                        >
                          {sentence.words.map((w) => w.data).join(" ")}
                        </p>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-4 opacity-50"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className="italic text-center">Lyrics not available for this song</p>
                    <p className="text-sm mt-2 text-gray-600">Try another song or check back later</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls in fullscreen */}
          <div className="w-full max-w-3xl mx-auto px-4 pb-8 mt-auto">
            <div className="flex items-center justify-center gap-8 mb-4">
              <Heart
                className={`cursor-pointer transition-all hover:scale-110 ${
                  isLiked ? "text-green-500 fill-green-500" : "text-gray-400"
                }`}
                size={24}
                onClick={handleToggleFavorite}
              />
              <button
                className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center hover:scale-110"
                onClick={() => handleSkip10Seconds(false)}
              >
                <Replay10Icon style={{ fontSize: 28 }} />
              </button>
              <button
                className={`bg-green-500 rounded-full p-4 hover:scale-110 transition-all duration-300 shadow-lg shadow-green-500/30`}
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause size={24} className="text-white" />
                ) : (
                  <Play size={24} className="text-white ml-0.5" />
                )}
              </button>
              <button
                className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center hover:scale-110"
                onClick={() => handleSkip10Seconds(true)}
              >
                <Forward10Icon style={{ fontSize: 28 }} />
              </button>
              {repeat ? (
                <Repeat1
                  size={24}
                  className="text-green-500 cursor-pointer hover:text-white transition-colors"
                  onClick={handelRepeat}
                />
              ) : (
                <Repeat
                  size={24}
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={handelRepeat}
                />
              )}
            </div>

            <div className="flex items-center w-full gap-2">
              <span className="text-sm text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={currentSong?.duration || 100}
                step={0.1}
                className="w-full h-2"
                onValueChange={handleSeek}
              />
              <span className="text-sm text-gray-400 w-10">
                {formatTime(currentSong?.duration != null ? currentSong.duration : duration)}
              </span>
            </div>

            <div className="flex items-center justify-center mt-4 gap-6">
              <div className="flex items-center gap-2">
                {volume === 0 ? (
                  <VolumeX size={18} className="text-gray-400 cursor-pointer" onClick={toggleMute} />
                ) : (
                  <Volume2 size={18} className="text-gray-400 cursor-pointer" onClick={toggleMute} />
                )}
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-24"
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>
              <ListMusic
                size={18}
                onClick={() => setShowPlaylistAdd(!showPlaylistAdd)}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              />
              {showPlaylistAdd && (
                <div className="absolute bottom-24 right-1/2 transform translate-x-1/2 bg-zinc-800/90 backdrop-blur-md rounded-xl shadow-lg p-2 w-64 z-10 border border-white/10">
                  <p className="text-white text-xs font-medium mb-2 px-2">Add to playlist</p>
                  <div className="max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {playlists.map((playlist) => (
                      <button
                        key={playlist._id || playlist.id}
                        className="w-full text-left text-gray-300 hover:bg-zinc-700 text-xs py-2 px-2 rounded mb-1"
                        onClick={() => handleAddToPlaylist(playlist._id || playlist.id)}
                      >
                        {playlist.playlistName || playlist.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Non-fullscreen layout
        <>
          <div className={`flex ${isExpanded ? "flex-col items-start gap-4" : "items-center"} w-1/4`}>
            <div className="relative group">
              <img
                src={
                  currentSong?.thumbnail ||
                  "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/2/6/2/7/2627c10c924237d129a289cc89cd695c.jpg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt="Album cover"
                className={`rounded-lg shadow-2xl group-hover:brightness-90 transition-all duration-300 ${
                  isExpanded ? "h-full w-full" : "h-14 w-14"
                } mr-3`}
                onClick={toggleExpanded}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium hover:underline cursor-pointer">
                {currentSong?.title || "No song playing"}
              </h4>
              <p className="text-gray-400 text-xs hover:text-white hover:underline cursor-pointer transition-colors">
                {currentSong?.artistsNames || currentSong?.artistNames || "Unknown Artist"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center w-2/4">
            <div className="flex items-center gap-5 mb-4">
              <Heart
                className={`cursor-pointer transition-all hover:scale-110 ${
                  isLiked ? "text-green-500 fill-green-500" : "text-gray-400"
                }`}
                size={16}
                onClick={handleToggleFavorite}
              />
              <button
                className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center hover:scale-110"
                onClick={() => handleSkip10Seconds(false)}
              >
                <Replay10Icon style={{ fontSize: 20 }} />
              </button>
              <button
                className={`bg-white rounded-full p-2 hover:scale-110 transition-all duration-300 shadow-lg`}
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause size={18} className="text-black" />
                ) : (
                  <Play size={18} className="text-black ml-0.5" />
                )}
              </button>
              <button
                className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center hover:scale-110"
                onClick={() => handleSkip10Seconds(true)}
              >
                <Forward10Icon style={{ fontSize: 20 }} />
              </button>
              {repeat ? (
                <Repeat1
                  size={18}
                  className="text-green-500 cursor-pointer hover:text-white transition-colors"
                  onClick={handelRepeat}
                />
              ) : (
                <Repeat
                  size={18}
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={handelRepeat}
                />
              )}
            </div>

            <div className="flex items-center w-full gap-2">
              <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={currentSong?.duration || 100}
                step={0.1}
                className="w-full"
                onValueChange={handleSeek}
              />
              <span className="text-xs text-gray-400 w-10">
                {formatTime(currentSong?.duration != null ? currentSong.duration : duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end w-1/4 gap-3">
            <Maximize2
              size={16}
              className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={toggleFullscreen}
            />
            <ListMusic
              size={16}
              onClick={() => setShowPlaylistAdd(!showPlaylistAdd)}
              className="text-gray-400 hover:text-white cursor-pointer transition-colors"
            />
            {showPlaylistAdd && (
              <div className="absolute bottom-full right-10 mb-2 bg-zinc-800 rounded-xl shadow-lg p-2 w-48 z-10">
                <p className="text-white text-xs font-medium mb-2 px-2">Add to playlist</p>
                <div className="max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist._id || playlist.id}
                      className="w-full text-left text-gray-300 hover:bg-zinc-700 text-xs py-2 px-2 rounded mb-1"
                      onClick={() => handleAddToPlaylist(playlist._id || playlist.id)}
                    >
                      {playlist.playlistName || playlist.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 w-24">
              {volume === 0 ? (
                <VolumeX size={16} className="text-gray-400 cursor-pointer" onClick={toggleMute} />
              ) : (
                <Volume2 size={16} className="text-gray-400 cursor-pointer" onClick={toggleMute} />
              )}
              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="w-20"
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
