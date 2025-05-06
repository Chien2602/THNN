import { Sidebar } from "../components/sidebar"
import PlaylistView from "../components/playlist/playlist-view"

export default function PlaylistPage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <PlaylistView />
      </div>
    </div>
  )
}
