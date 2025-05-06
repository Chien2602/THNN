import {Link} from "react-router"
import { Play, Clock, MoreHorizontal, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for favorite songs
const favoriteSongs = [
  {
    id: 1,
    title: "Hoa Nở Không Màu",
    artist: "Hoài Lâm",
    album: "Single",
    cover: "/placeholder.svg?height=40&width=40",
    duration: "04:17",
    liked: false,
  },
  {
    id: 2,
    title: "Có Chàng Trai Viết Lên Cây",
    artist: "Phan Mạnh Quỳnh",
    album: "Single",
    cover: "/placeholder.svg?height=40&width=40",
    duration: "04:36",
    liked: true,
  },
  {
    id: 3,
    title: "Chạy Ngay Đi",
    artist: "Sơn Tùng M-TP",
    album: "Single",
    cover: "/placeholder.svg?height=40&width=40",
    duration: "04:08",
    liked: true,
  },
  {
    id: 4,
    title: "Hãy Trao Cho Anh",
    artist: "Sơn Tùng M-TP",
    album: "Sky Tour",
    cover: "/placeholder.svg?height=40&width=40",
    duration: "04:05",
    liked: true,
  },
  {
    id: 5,
    title: "Nơi Này Có Anh",
    artist: "Sơn Tùng M-TP",
    album: "m-tp M-TP",
    cover: "/placeholder.svg?height=40&width=40",
    duration: "04:16",
    liked: true,
  },
  {
    id: 6,
    title: "Có Chắc Yêu Là Đây",
    artist: "Sơn Tùng M-TP",
    album: "Single",
    cover: "/placeholder.svg?height=40&width=40",
    duration: "04:12",
    liked: true,
  },
  {
    id: 7,
    title: "Lạc Trôi",
    artist: "Sơn Tùng M-TP",
    album: "m-tp M-TP",
    cover: "/placeholder.svg?height=40&width=40",
    duration: "04:24",
    liked: true,
  },
]

export default function FavoritesPage() {
  return (
    <div className="w-full overflow-y-auto p-6 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="flex items-center gap-6 mb-8 w-full overflow-auto">
        <div className="w-60 h-60 bg-gradient-to-br from-pink-600 z-50 to-pink-400 flex items-center justify-center rounded shadow-lg">
          <Heart className="h-28 w-28 text-white" fill="white" />
        </div>
        <div>
          <div className="text-sm font-bold uppercase mb-2">Playlist</div>
          <h1 className="text-7xl font-bold mb-6">Bài Hát Đã Thích</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-bold text-white">Tên người dùng</span>
            <span className="mx-1">•</span>
            <span>{favoriteSongs.length} bài hát</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-black p-4 rounded-t-lg">
        <div className="flex items-center gap-4 mb-6">
          <Button className="rounded-full bg-spotify-green hover:bg-spotify-green hover:scale-105 h-14 w-14 flex items-center justify-center shadow-lg">
            <Play className="h-8 w-8 text-black" fill="currentColor" />
          </Button>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-muted-foreground">
              <th className="w-12 pb-2">#</th>
              <th className="pb-2">Tiêu đề</th>
              <th className="pb-2">Album</th>
              <th className="pb-2 text-right">
                <Clock className="h-4 w-4 inline" />
              </th>
            </tr>
          </thead>
          <tbody>
            {favoriteSongs.map((song, index) => (
              <tr key={song.id} className="group hover:bg-black/20 hover:rounded-2xl hover:p-2">
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center w-8 h-8 group-hover:hidden">{index + 1}</div>
                  <div className="hidden group-hover:flex items-center justify-center w-8 h-8">
                    <Play className="h-4 w-4" />
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    <img
                      src={song.cover || "/placeholder.svg"}
                      alt={song.title}
                      width={40}
                      height={40}
                      className="mr-4 rounded"
                    />
                    <div>
                      <Link href={`/lyrics/${song.id}`} className="hover:underline">
                        <div className="font-medium">{song.title}</div>
                      </Link>
                      <div className="text-muted-foreground">{song.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">{song.album}</td>
                <td className="py-3 text-right text-muted-foreground">
                  <div className="flex items-center justify-end gap-4">
                    <Heart
                      className="h-4 w-4 text-spotify-green opacity-0 group-hover:opacity-100"
                      fill="currentColor"
                    />
                    <span>{song.duration}</span>
                    {/* <MoreHorizontal className="h-4 w-4 opacity-0 group-hover:opacity-100" /> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
