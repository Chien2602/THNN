// "use client"
// import { Button } from "@/components/ui/button"
// import { Clock, Heart, MoreHorizontal, Play, Pause, Music, Loader2, Trash2, Edit, X, Check } from 'lucide-react'
// import { usePlayer } from "../player-provider"
// import { useEffect, useState } from "react"
// import { cn } from "@/lib/utils"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

// export default function PlaylistPage() {
//   const { currentPlaylist, currentTrack, isPlaying, togglePlayPause, playTrack, setCurrentSong, setCurrentPlaylist } = usePlayer()

//   const [playlistData, setPlaylistData] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
//   const [newPlaylistName, setNewPlaylistName] = useState("")
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)

//   useEffect(() => {
//     if (currentPlaylist) {
//       const fetchPlaylistData = async () => {
//         setIsLoading(true)
//         try {
//           const response = await fetch(`http://localhost:3001/api/detailPlaylist?id=${currentPlaylist.encodeId}`)
//           if (!response.ok) {
//             throw new Error("Failed to fetch playlist data")
//           }
//           const data = await response.json()
//           setPlaylistData(data.data)
//           setNewPlaylistName(currentPlaylist.title)
//           setError(null)
//         } catch (error) {
//           console.error("Error fetching playlist data:", error)
//           setError("Không thể tải danh sách phát. Vui lòng thử lại sau.")
//         } finally {
//           setIsLoading(false)
//         }
//       }
//       fetchPlaylistData()
//     }
//   }, [currentPlaylist])

//   const handlePlaySong = (song) => {
//     playTrack(song)
//   }

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = ("0" + (seconds % 60)).slice(-2)
//     return `${minutes}:${remainingSeconds}`
//   }

//   const formatListeners = (count) => {
//     if (count >= 1000000) {
//       return `${(count / 1000000).toFixed(1)}M`
//     } else if (count >= 1000) {
//       return `${(count / 1000).toFixed(1)}K`
//     }
//     return count
//   }

//   // Function to rename playlist
//   const handleRenamePlaylist = async () => {
//     if (!newPlaylistName.trim()) return
    
//     try {
//       // API call to rename playlist
//       const response = await fetch(`http://localhost:3001/api/updatePlaylist`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: currentPlaylist.encodeId,
//           title: newPlaylistName
//         }),
//       })
      
//       if (!response.ok) {
//         throw new Error("Failed to rename playlist")
//       }
      
//       // Update local state
//       setCurrentPlaylist({
//         ...currentPlaylist,
//         title: newPlaylistName
//       })
      
//       setIsRenameDialogOpen(false)
//     } catch (error) {
//       console.error("Error renaming playlist:", error)
//       // You could add error handling UI here
//     }
//   }

//   // Function to delete playlist
//   const handleDeletePlaylist = async () => {
//     try {
//       // API call to delete playlist
//       const response = await fetch(`http://localhost:3001/api/deletePlaylist`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: currentPlaylist.encodeId
//         }),
//       })
      
//       if (!response.ok) {
//         throw new Error("Failed to delete playlist")
//       }
      
//       // Clear current playlist
//       setCurrentPlaylist(null)
//       setIsDeleteDialogOpen(false)
//     } catch (error) {
//       console.error("Error deleting playlist:", error)
//       // You could add error handling UI here
//     }
//   }

//   // Function to remove song from playlist
//   const handleRemoveSong = async (songId, event) => {
//     event.stopPropagation() // Prevent triggering the row click
    
//     try {
//       // API call to remove song from playlist
//       const response = await fetch(`http://localhost:3001/api/removeSongFromPlaylist`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           playlistId: currentPlaylist.encodeId,
//           songId: songId
//         }),
//       })
      
//       if (!response.ok) {
//         throw new Error("Failed to remove song from playlist")
//       }
      
//       // Update local state
//       setPlaylistData(prev => ({
//         ...prev,
//         song: {
//           ...prev.song,
//           items: prev.song.items.filter(song => song.encodeId !== songId),
//           total: prev.song.total - 1
//         }
//       }))
      
//     } catch (error) {
//       console.error("Error removing song:", error)
//       // You could add error handling UI here
//     }
//   }

//   // Function to clear all songs from playlist
//   const handleClearPlaylist = async () => {
//     try {
//       // API call to clear playlist
//       const response = await fetch(`http://localhost:3001/api/clearPlaylist`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: currentPlaylist.encodeId
//         }),
//       })
      
//       if (!response.ok) {
//         throw new Error("Failed to clear playlist")
//       }
      
//       // Update local state
//       setPlaylistData(prev => ({
//         ...prev,
//         song: {
//           ...prev.song,
//           items: [],
//           total: 0
//         }
//       }))
      
//       setIsClearDialogOpen(false)
//     } catch (error) {
//       console.error("Error clearing playlist:", error)
//       // You could add error handling UI here
//     }
//   }

//   if (!currentPlaylist) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <Music className="h-16 w-16 mx-auto text-zinc-400 mb-4" />
//           <h2 className="text-xl font-semibold mb-2">Không có danh sách phát nào được chọn</h2>
//           <p className="text-zinc-400">Vui lòng chọn một danh sách phát từ thư viện của bạn</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <main className="flex-1 overflow-y-auto pb-24">
//       <div className="bg-gradient-to-b from-emerald-900/80 to-zinc-900/90 p-6 md:p-8">
//         <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 max-w-7xl mx-auto">
//           <div className="w-48 h-48 md:w-56 md:h-56 shadow-xl rounded-md overflow-hidden flex-shrink-0 group relative">
//             <img
//               src={currentPlaylist?.thumbnail || "/placeholder.svg?height=224&width=224"}
//               alt={currentPlaylist?.title}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//             />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//               <Button
//                 size="icon"
//                 className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
//                 onClick={() => togglePlayPause()}
//               >
//                 {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
//               </Button>
//             </div>
//           </div>
//           <div className="flex flex-col items-center md:items-start text-center md:text-left">
//             <span className="text-xs uppercase font-bold tracking-wider bg-zinc-800 px-2 py-1 rounded-sm">
//               Playlist
//             </span>
//             <h1 className="text-3xl md:text-5xl font-bold mt-3 mb-4 leading-tight">{currentPlaylist?.title}</h1>
//             <p className="text-sm text-zinc-300 md:max-w-2xl line-clamp-2 md:line-clamp-3">
//               {currentPlaylist?.sortDescription}
//             </p>
//             <div className="flex items-center gap-2 mt-4 text-sm text-zinc-400">
//               <span className="font-semibold text-white">{playlistData?.artist?.name || "Various Artists"}</span>
//               <span>•</span>
//               <span>{playlistData?.song?.total || 0} bài hát</span>
//               {playlistData?.like && (
//                 <>
//                   <span>•</span>
//                   <span>{formatListeners(playlistData.like)} lượt thích</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
//         <div className="flex items-center gap-4 mb-8">
//           <Button
//             size="lg"
//             className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg px-8"
//             onClick={() => togglePlayPause()}
//           >
//             {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 ml-0.5 mr-2" />}
//             {isPlaying ? "Tạm dừng" : "Phát"}
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
//           >
//             <Heart className="h-5 w-5" />
//           </Button>
          
//           {/* Playlist actions dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
//               >
//                 <MoreHorizontal className="h-5 w-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
//               <DropdownMenuItem 
//                 className="cursor-pointer flex items-center gap-2 text-zinc-200 focus:text-white focus:bg-zinc-800"
//                 onClick={() => setIsRenameDialogOpen(true)}
//               >
//                 <Edit className="h-4 w-4" />
//                 Đổi tên playlist
//               </DropdownMenuItem>
//               <DropdownMenuItem 
//                 className="cursor-pointer flex items-center gap-2 text-zinc-200 focus:text-white focus:bg-zinc-800"
//                 onClick={() => setIsClearDialogOpen(true)}
//               >
//                 <X className="h-4 w-4" />
//                 Xóa tất cả bài hát
//               </DropdownMenuItem>
//               <DropdownMenuSeparator className="bg-zinc-800" />
//               <DropdownMenuItem 
//                 className="cursor-pointer flex items-center gap-2 text-red-500 focus:text-red-400 focus:bg-zinc-800"
//                 onClick={() => setIsDeleteDialogOpen(true)}
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Xóa playlist
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
//             <span className="ml-3 text-zinc-400">Đang tải danh sách phát...</span>
//           </div>
//         ) : error ? (
//           <div className="text-center py-12">
//             <p className="text-zinc-400">{error}</p>
//             <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
//               Thử lại
//             </Button>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
//                   <th className="px-4 py-3 w-12">#</th>
//                   <th className="px-4 py-3">Tiêu đề</th>
//                   <th className="px-4 py-3 hidden md:table-cell">Album</th>
//                   <th className="px-4 py-3 text-right">
//                     <Clock className="h-4 w-4 inline" />
//                   </th>
//                   <th className="px-4 py-3 w-12"></th> {/* New column for remove button */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {playlistData?.song?.items?.map((song, index) => (
//                   <tr
//                     key={song.encodeId}
//                     className={cn(
//                       "group border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors",
//                       currentTrack?.encodeId === song.encodeId && "bg-zinc-800/70",
//                     )}
//                     onClick={() => handlePlaySong(song)}
//                   >
//                     <td className="px-4 py-3 w-12">
//                       <div className="relative w-5 h-5 flex items-center justify-center">
//                         <span className="group-hover:hidden">
//                           {currentTrack?.encodeId === song.encodeId ? (
//                             <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
//                           ) : (
//                             index + 1
//                           )}
//                         </span>
//                         <Play className="h-4 w-4 hidden group-hover:block" />
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
//                           <img
//                             src={song.thumbnail || "/placeholder.svg"}
//                             alt={song.title}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div>
//                           <div
//                             className={cn(
//                               "font-medium line-clamp-1",
//                               currentTrack?.encodeId === song.encodeId && "text-emerald-500",
//                             )}
//                           >
//                             {song.title}
//                           </div>
//                           <div className="text-sm text-zinc-400 line-clamp-1">{song.artistsNames}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 hidden md:table-cell text-zinc-400 text-sm">
//                       <span className="line-clamp-1 max-w-[200px]">{song.album?.title || "—"}</span>
//                     </td>
//                     <td className="px-4 py-3 text-right text-zinc-400 text-sm">{formatDuration(song.duration)}</td>
//                     <td className="px-4 py-3 w-12 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700"
//                         onClick={(e) => handleRemoveSong(song.encodeId, e)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                         <span className="sr-only">Xóa bài hát</span>
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {playlistData?.sections && playlistData.sections.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-xl font-bold mb-6">Bạn có thể thích</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//               {playlistData.sections[0]?.items?.slice(0, 6).map((item) => (
//                 <div key={item.encodeId} className="group cursor-pointer">
//                   <div className="aspect-square rounded-md overflow-hidden bg-zinc-800 mb-3 relative">
//                     <img
//                       src={item.thumbnail || "/placeholder.svg"}
//                       alt={item.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                       <Button
//                         size="icon"
//                         className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
//                       >
//                         <Play className="h-5 w-5 ml-0.5" />
//                       </Button>
//                     </div>
//                   </div>
//                   <h3 className="font-medium line-clamp-1">{item.title}</h3>
//                   <p className="text-sm text-zinc-400 line-clamp-2">{item.sortDescription || item.artistsNames}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Rename Playlist Dialog */}
//       <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
//         <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
//           <DialogHeader>
//             <DialogTitle>Đổi tên playlist</DialogTitle>
//             <DialogDescription className="text-zinc-400">
//               Nhập tên mới cho playlist của bạn
//             </DialogDescription>
//           </DialogHeader>
//           <Input
//             value={newPlaylistName}
//             onChange={(e) => setNewPlaylistName(e.target.value)}
//             placeholder="Nhập tên playlist"
//             className="bg-zinc-800 border-zinc-700 text-white"
//           />
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
//               Hủy
//             </Button>
//             <Button 
//               className="bg-emerald-500 hover:bg-emerald-400 text-black"
//               onClick={handleRenamePlaylist}
//             >
//               <Check className="h-4 w-4 mr-2" />
//               Lưu
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Playlist Dialog */}
//       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Xóa playlist</AlertDialogTitle>
//             <AlertDialogDescription className="text-zinc-400">
//               Bạn có chắc chắn muốn xóa playlist "{currentPlaylist?.title}"? Hành động này không thể hoàn tác.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
//               Hủy
//             </AlertDialogCancel>
//             <AlertDialogAction 
//               className="bg-red-500 hover:bg-red-600 text-white"
//               onClick={handleDeletePlaylist}
//             >
//               Xóa
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Clear Playlist Dialog */}
//       <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
//         <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Xóa tất cả bài hát</AlertDialogTitle>
//             <AlertDialogDescription className="text-zinc-400">
//               Bạn có chắc chắn muốn xóa tất cả bài hát khỏi playlist "{currentPlaylist?.title}"? Hành động này không thể hoàn tác.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
//               Hủy
//             </AlertDialogCancel>
//             <AlertDialogAction 
//               className="bg-red-500 hover:bg-red-600 text-white"
//               onClick={handleClearPlaylist}
//             >
//               Xóa tất cả
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </main>
//   )
// }
