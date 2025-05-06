"use client"

import { Link } from "react-router-dom"
import { Play, Clock, Calendar, Trash2, MoreHorizontal, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useState, useEffect } from "react"
import { usePlayer } from "../player-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function HistoryPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser, setCurrentSong } = usePlayer()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    if (currentUser?._id) {
      fetchHistory()
    }
  }, [currentUser])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/history/user/${currentUser._id}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử nghe nhạc",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteHistoryItem = async (songId) => {
    try {
      await fetch(`http://localhost:3001/api/history/${currentUser._id}/${songId}`, {
        method: "DELETE",
      })
      console.log("Deleted history item with ID:", songId)
      setData((prevData) => prevData.filter((song) => song.encodeId !== songId))

      toast({
        title: "Đã xóa",
        description: "Đã xóa bài hát khỏi lịch sử",
      })
    } catch (error) {
      console.error("Error deleting history item:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài hát",
        variant: "destructive",
      })
    }
  }

  const clearAllHistory = async () => {
    try {
      await fetch(`http://localhost:3001/api/history/user/${currentUser._id}/all`, {
        method: "DELETE",
      })
      
      setData([])

      toast({
        title: "Đã xóa",
        description: "Đã xóa toàn bộ lịch sử nghe nhạc",
      })
    } catch (error) {
      console.error("Error clearing history:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa lịch sử",
        variant: "destructive",
      })
    } finally {
      setShowClearConfirm(false)
    }
  }

  const handlePlaySong = (song) => {
    setCurrentSong(song)
    console.log("Playing song:", song)
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black w-full text-white p-6 rounded-lg min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <div className="w-48 h-48 md:w-60 md:h-60 bg-gradient-to-br from-purple-600 to-blue-400 flex items-center justify-center rounded-lg shadow-lg">
          <Clock className="h-24 w-24 text-white opacity-90" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Playlist</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Lịch Sử Nghe Nhạc</h1>
          <div className="flex items-center text-sm text-gray-400">
            <span className="font-medium text-white">{currentUser?.username}</span>
            <span className="mx-1">•</span>
            <span>{data?.length || 0} bài hát</span>
          </div>

          <div className="mt-6 flex items-center gap-4">

            <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full px-5 py-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 border-0"
                  disabled={!data?.length}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa tất cả
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa lịch sử nghe nhạc?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Bạn có chắc chắn muốn xóa toàn bộ lịch sử nghe nhạc? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 rounded-full font-medium transition-all duration-200">
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllHistory}
                    className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full font-medium transition-all duration-200 border-0"
                  >
                    Xóa tất cả
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : data?.length > 0 ? (
        <div className="bg-black/30 p-4 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="w-12 pb-3">#</th>
                <th className="pb-3">Tiêu đề</th>
                <th className="pb-3 hidden md:table-cell">Album</th>
                <th className="pb-3">
                  <Calendar className="h-4 w-4 inline" />
                </th>
                <th className="w-12 pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((song, index) => (
                <tr key={song.encodeId || song._id} className="group hover:bg-white/10 rounded-md">
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center w-8 h-8 group-hover:hidden">{index + 1}</div>
                    <div onClick={() => handlePlaySong(song)} className="hidden group-hover:flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full hover:bg-green-400 transition-all duration-200 cursor-pointer">
                      <Play className="h-4 w-4 ml-0.5" />
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <img
                        src={song.thumbnailM || "/placeholder.svg?height=40&width=40"}
                        alt={song.title}
                        width={40}
                        height={40}
                        className="mr-4 rounded object-cover"
                      />
                      <div>
                        <Link to={`/lyrics/${song.encodeId}`} className="hover:underline">
                          <div className="font-medium">{song.title}</div>
                        </Link>
                        <div className="text-gray-400">{song.artistNames}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-400 hidden md:table-cell">{song.albumName || "—"}</td>
                  <td className="py-3 text-gray-400">
                    {song.createdAt
                      ? formatDistanceToNow(new Date(song.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })
                      : "Không rõ thời gian"}
                  </td>
                  <td className="py-3 pr-2">
                    <AlertDialog
                      open={itemToDelete === song.songId}
                      onOpenChange={(open) => !open && setItemToDelete(null)}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:text-white transition-all duration-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                          <DropdownMenuItem
                            className="text-red-400 hover:text-red-300 cursor-pointer"
                            onClick={() => setItemToDelete(song.songId)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa khỏi lịch sử
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa khỏi lịch sử?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Bạn có chắc chắn muốn xóa "{song.songName}" khỏi lịch sử nghe nhạc?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 rounded-full font-medium transition-all duration-200">
                            Hủy
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteHistoryItem(song.songId)
                              setItemToDelete(null)
                            }}
                            className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full font-medium transition-all duration-200 border-0"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <X className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-xl font-medium">Lịch sử nghe nhạc trống</p>
          <p className="mt-2">Bài hát bạn nghe sẽ xuất hiện ở đây</p>
        </div>
      )}
    </div>
  )
}
