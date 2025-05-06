import { Sidebar } from "../components/sidebar"
import ArtistView from "../components/artists/artists-view"

export default function ArtistPage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ArtistView />
      </div>
    </div>
  )
}