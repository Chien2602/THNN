import { Sidebar } from "../components/sidebar"
import FavoriteView from "../components/favorites/favorite-view"

export default function ArtistPage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <FavoriteView />
      </div>
    </div>
  )
}