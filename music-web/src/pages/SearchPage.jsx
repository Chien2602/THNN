import { Sidebar } from "../components/sidebar"
import { SearchView } from "../components/search-view"

export default function SearchPage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <SearchView />
      </div>
    </div>
  )
}