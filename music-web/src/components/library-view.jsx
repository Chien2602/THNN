import { Search, List, Grid, PlayCircle, Plus, Clock, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LibraryView() {
  // Mock data for playlists with improved visuals
  const playlists = [
    {
      id: 1,
      title: "Nhạc Việt Hay Nhất",
      songs: 50,
      creator: "Musicify",
      color: "from-purple-600 to-blue-700",
      gradient: "bg-gradient-to-br from-purple-600/20 to-blue-700/20",
    },
    {
      id: 2,
      title: "Chill Mix",
      songs: 25,
      creator: "Musicify",
      color: "from-green-500 to-emerald-700",
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-700/20",
    },
    {
      id: 3,
      title: "Top Hits 2023",
      songs: 100,
      creator: "Musicify",
      color: "from-red-500 to-orange-700",
      gradient: "bg-gradient-to-br from-red-500/20 to-orange-700/20",
    },
    {
      id: 4,
      title: "Acoustic Favorites",
      songs: 30,
      creator: "Musicify",
      color: "from-blue-500 to-cyan-700",
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-700/20",
    },
    {
      id: 5,
      title: "Workout Mix",
      songs: 45,
      creator: "Musicify",
      color: "from-yellow-500 to-amber-700",
      gradient: "bg-gradient-to-br from-yellow-500/20 to-amber-700/20",
    },
    {
      id: 6,
      title: "Nhạc Trữ Tình",
      songs: 60,
      creator: "Musicify",
      color: "from-pink-500 to-rose-700",
      gradient: "bg-gradient-to-br from-pink-500/20 to-rose-700/20",
    },
    {
      id: 7,
      title: "V-Pop Rising",
      songs: 40,
      creator: "Musicify",
      color: "from-indigo-500 to-violet-700",
      gradient: "bg-gradient-to-br from-indigo-500/20 to-violet-700/20",
    },
    {
      id: 8,
      title: "Rap Việt",
      songs: 35,
      creator: "Musicify",
      color: "from-teal-500 to-green-700",
      gradient: "bg-gradient-to-br from-teal-500/20 to-green-700/20",
    },
  ]

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900/80 to-black p-6 overflow-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Thư viện</h1>
          <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-full p-2">
            <Plus size={18} className="text-white" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <Input
              placeholder="Tìm trong thư viện"
              className="bg-white/10 border-none pl-10 h-9 w-60 text-white placeholder:text-gray-400 focus-visible:ring-0 rounded-full"
            />
          </div>
          <Tabs defaultValue="grid" className="w-auto">
            <TabsList className="bg-black/20 h-9">
              <TabsTrigger value="list" className="h-7 px-2">
                <List size={18} />
              </TabsTrigger>
              <TabsTrigger value="grid" className="h-7 px-2">
                <Grid size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 text-sm font-medium">
          Playlists
        </button>
        <button className="text-gray-400 hover:text-white transition-colors rounded-full px-4 py-1.5 text-sm font-medium">
          Albums
        </button>
        <button className="text-gray-400 hover:text-white transition-colors rounded-full px-4 py-1.5 text-sm font-medium">
          Nghệ sĩ
        </button>
        <button className="text-gray-400 hover:text-white transition-colors rounded-full px-4 py-1.5 text-sm font-medium">
          Đã tải xuống
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-md p-4 hover:from-purple-500/40 hover:to-blue-500/40 transition cursor-pointer group animate-slide-up">
          <div className="relative mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-full aspect-square rounded-md shadow-lg flex items-center justify-center">
              <Heart className="text-white w-12 h-12" />
            </div>
          </div>
          <h3 className="font-medium text-white mb-1">Bài hát đã thích</h3>
          <p className="text-sm text-gray-300">Playlist • 128 bài hát</p>
        </div>

        {playlists.map((playlist, index) => (
          <div
            key={playlist.id}
            className={`${playlist.gradient} rounded-md p-4 hover:bg-white/10 transition cursor-pointer group playlist-card animate-slide-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="relative mb-4">
              <div
                className={`bg-gradient-to-br ${playlist.color} w-full aspect-square rounded-md shadow-lg opacity-80`}
              ></div>
              <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl play-button">
                <PlayCircle size={24} className="text-black" />
              </button>
            </div>
            <h3 className="font-medium text-white mb-1">{playlist.title}</h3>
            <p className="text-sm text-gray-300">Playlist • {playlist.songs} bài hát</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Gần đây</h2>
        <table className="w-full text-left text-gray-400">
          <thead className="border-b border-gray-800/50 text-sm">
            <tr>
              <th className="pb-3 w-10">#</th>
              <th className="pb-3">TIÊU ĐỀ</th>
              <th className="pb-3">NGÀY THÊM</th>
              <th className="pb-3 text-right">
                <Clock size={16} />
              </th>
            </tr>
          </thead>
          <tbody>
            {playlists.slice(0, 5).map((playlist, index) => (
              <tr key={playlist.id} className="hover:bg-white/5 group border-b border-gray-800/10">
                <td className="py-3 w-10">
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <span className="group-hover:hidden">{index + 1}</span>
                    <PlayCircle size={16} className="hidden group-hover:block text-white" />
                  </div>
                </td>
                <td>
                  <div className="flex items-center py-2">
                    <div className={`h-10 w-10 mr-3 rounded bg-gradient-to-br ${playlist.color}`}></div>
                    <div>
                      <p className="text-white font-medium">{playlist.title}</p>
                      <p className="text-sm">{playlist.creator}</p>
                    </div>
                  </div>
                </td>
                <td>Hôm nay</td>
                <td className="text-right">{playlist.songs} bài hát</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
