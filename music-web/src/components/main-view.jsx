"use client"

import { useState, useEffect } from "react"
import { Heart, MoreHorizontal, Play, ChevronRight, User } from "lucide-react"
import { usePlayer } from "./player-provider"
import {useNavigate } from "react-router"

import api from "../api/axiosInstance.jsx"

export function MainView() {
  const Navigation = useNavigate()
  const {setCurrentSong, setCurrentPlaylist, setCurrentArtist, setCurrentUser} = usePlayer()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataGenre, setDataGenre] = useState(null)
  const [dataArtist, setDataArtist] = useState(null)
  const [featuredPlaylists, setFeaturedPlaylists] = useState(null)
  const [releaseSongs, setReleaseSongs] = useState(null)
  const [dataSongTrending, setDataSongTrending] = useState(null)
  const [expandedPlaylists, setExpandedPlaylists] = useState(false)
  const [expandedArtists, setExpandedArtists] = useState(false)
  const [expandedTracks, setExpandedTracks] = useState(false)
  const [expandedReleases, setExpandedReleases] = useState(false)
  const [expandedGenres, setExpandedGenres] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/genre")
        const data = await response.data
        setDataGenre(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const response = await fetch("http://localhost:3001/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
  
        const data = await response.json();
        setUsername(data.username);
        setCurrentUser(data);
        console.log(data)
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isLoading) {
      fetchData();
    }
  }, [isLoading, setCurrentUser]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/artists/all")
        const data = await response.data
        setDataArtist(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/newReleaseChart")
        const data = await response.data
        setDataSongTrending(data.data.items)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/top100");
        const data = await response.data
        setFeaturedPlaylists(data.data[0].items)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/home");
        const data = await response.data
        setReleaseSongs(data.data.items[3].items.all)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSongClick = (song) => {
    setCurrentSong(song)
  }

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist)
    Navigation("/playlist");
  }

  const handleArtistClick = (artist) => {
    setCurrentArtist(artist)
    Navigation("/artist");
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-green-900/40 via-black/90 to-black p-6 overflow-auto animate-fade-in">
      <div className="flex items-center justify-end gap-2 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-white/20 transition-all cursor-pointer shadow-md">
          <User size={20} />
        </div>
        <span className="text-white font-medium select-none">
          Hi <b className="font-bold text-red-400 select-none">{username}</b>
        </span>
      </div>

      <div className="mb-6 mt-10">
        <h1 className="text-3xl font-bold text-white mb-6">
          {new Date().getHours() < 12
            ? "Chào buổi sáng"
            : new Date().getHours() < 18
              ? "Chào buổi chiều"
              : "Chào buổi tối"}
        </h1>
      </div>

      <section className="mb-10 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Playlist nổi bật</h2>
          <button
            onClick={() => setExpandedPlaylists(!expandedPlaylists)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {expandedPlaylists ? "Thu gọn" : "Xem tất cả"}{" "}
            <ChevronRight
              size={16}
              className={expandedPlaylists ? "rotate-90 transition-transform" : "transition-transform"}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {(expandedArtists ? (featuredPlaylists ?? []) : (featuredPlaylists ?? []).slice(0, 10)).map(
            (playlist, index) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist)}
                className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group playlist-card animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative mb-4 overflow-hidden rounded-md shadow-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} opacity-90`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={playlist.thumbnail || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square"></div>
                  <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl play-button">
                    <Play size={20} className="text-black ml-0.5" />
                  </button>
                </div>
                <h3 className="font-medium text-white mb-1 truncate">{playlist.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{playlist.sortDescription}</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Nghệ sĩ nổi bật</h2>
          <button
            onClick={() => setExpandedArtists(!expandedArtists)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {expandedArtists ? "Thu gọn" : "Xem tất cả"}{" "}
            <ChevronRight
              size={16}
              className={expandedArtists ? "rotate-90 transition-transform" : "transition-transform"}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {(expandedArtists ? (dataArtist ?? []) : (dataArtist ?? []).slice(0, 10)).map((artist, index) => (
            <div
              key={artist.id}
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleArtistClick(artist)}
            >
              <div className="relative mb-4 overflow-hidden rounded-full shadow-lg">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    artist.color || "from-purple-600 to-blue-400"
                  } opacity-90`}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={artist.thumbnail || "/placeholder.svg"}
                    alt={artist.name || "Artist"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square"></div>
                <button className="absolute bottom-6 right-7 bg-green-500 rounded-full p-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl play-button">
                  <Play size={20} className="text-black ml-0.5" />
                </button>
              </div>
              <h3 className="font-medium text-white mb-1 text-center">{artist.name}</h3>
              <p className="text-sm text-gray-400 text-center">Nghệ sĩ • {artist.totalFollow} người theo dõi</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Bài hát thịnh hành</h2>
          <button
            onClick={() => setExpandedTracks(!expandedTracks)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {expandedTracks ? "Thu gọn" : "Xem tất cả"}{" "}
            <ChevronRight
              size={16}
              className={expandedTracks ? "rotate-90 transition-transform" : "transition-transform"}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          {(Array.isArray(dataSongTrending)
            ? expandedTracks
              ? dataSongTrending
              : dataSongTrending.slice(0, 2)
            : []
          ).map((song, index) => (
            <div
              key={song.encodeId}
              className="flex items-center p-2 rounded-md hover:bg-white/10 group transition-colors cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleSongClick(song)}
            >
              <div className="mr-4 text-gray-400 w-4 text-center">{index + 1}</div>
              <div className="relative h-12 w-12 mr-3 overflow-hidden rounded">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                  <img src={song.thumbnail || "/placeholder.svg"} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{song.title}</p>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>
              <div className="ml-4 flex items-center gap-3">
                <span className="text-gray-400 text-sm">
                  {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
                </span>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSongClick(song)
                  }}
                >
                  <Play size={16} className="text-gray-400 hover:text-white" />
                </button>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={16} className="text-gray-400 hover:text-white" />
                </button>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Phát hành mới</h2>
          <button
            onClick={() => setExpandedReleases(!expandedReleases)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {expandedReleases ? "Thu gọn" : "Xem tất cả"}{" "}
            <ChevronRight
              size={16}
              className={expandedReleases ? "rotate-90 transition-transform" : "transition-transform"}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {(Array.isArray(releaseSongs) ? (expandedTracks ? releaseSongs : releaseSongs.slice(0, 6)) : []).map(
            (song, index) => (
              <div
                key={`new-${song.encodeId}`}
                className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group playlist-card animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleSongClick(song)}
              >
                <div className="relative mb-4 overflow-hidden rounded-md shadow-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${song.color} opacity-90`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={song.thumbnail || "/placeholder.svg"} className="w-full" alt="" srcset="" />
                  </div>
                  <div className="aspect-square"></div>
                  <div className="absolute top-2 left-2 bg-black/50 text-xs text-white px-2 py-1 rounded-full">Mới</div>
                  <button
                    className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl play-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSongClick(song)
                    }}
                  >
                    <Play size={20} className="text-black ml-0.5" />
                  </button>
                </div>
                <h3 className="font-medium text-white mb-1 truncate">{song.title}</h3>
                <p className="text-sm text-gray-400 truncate">Single • {song.artistsNames}</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Thể loại</h2>
          <button
            onClick={() => setExpandedGenres(!expandedGenres)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {expandedGenres ? "Thu gọn" : "Xem tất cả"}{" "}
            <ChevronRight
              size={16}
              className={expandedGenres ? "rotate-90 transition-transform" : "transition-transform"}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {dataGenre && Array.isArray(dataGenre) ? (
            (expandedGenres ? dataGenre : dataGenre.slice(0, 6)).map((genre, index) => (
              <div
                key={genre.encodeId}
                className="rounded-lg overflow-hidden relative cursor-pointer transition-all hover:scale-105 shadow-lg animate-slide-up h-32"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-70`}></div>
                <img
                  src={genre.thumbnail || "/placeholder.svg"}
                  alt={genre.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                  <h3 className="text-2xl font-bold text-white">{genre.title}</h3>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">Không có thể loại nào.</div>
          )}
        </div>
      </section>

      <div className="h-20"></div>
    </div>
  )
}