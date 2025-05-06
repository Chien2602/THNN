import { Sidebar } from "../components/sidebar"
import Player from "../components/player"
import { MainView } from "../components/main-view"

export default function HomePage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainView />
      </div>
    </div>
  )
}
