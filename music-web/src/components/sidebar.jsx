import { Home, Search, PlusCircle, Heart, History } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link } from "react-router";
import logo from "../assets/react.svg";
import CreatePlaylistModal from "./modal/create-playlist-modal";

export function Sidebar() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="w-60 bg-black p-6 hidden md:flex flex-col h-full border-r border-gray-800/30">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <img src={logo} alt="Logo" className="w-8 h-8 mr-2" />
          MusicWeb
        </h1>
        <nav className="space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-white hover:text-green-500 transition group"
          >
            <div className="bg-white/5 p-2 rounded-md group-hover:bg-white/10 transition">
              <Home size={20} />
            </div>
            <span className="font-medium">Trang chủ</span>
          </Link>

          <Link
            to="/search"
            className="flex items-center gap-3 text-white hover:text-green-500 transition group"
          >
            <div className="bg-white/5 p-2 rounded-md group-hover:bg-white/10 transition">
              <Search size={20} />
            </div>
            <span className="font-medium">Tìm kiếm</span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2 text-white hover:text-green-500 transition cursor-pointer mb-4 group">
        <div className="bg-white/10 p-2 rounded-md group-hover:bg-green-500/20 transition">
          <PlusCircle size={18} />
        </div>
        <span
          className="font-medium"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Tạo playlist
        </span>
      </div>
      <Link to="/favorite" className="flex items-center gap-2 text-white mb-4 hover:text-green-500 transition cursor-pointer group">
        <div className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 p-2 rounded-md group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition">
          <Heart size={18} className="text-purple-300" />
        </div>
        <span className="font-medium">Bài hát đã thích</span>
      </Link>
      <Link to="/history" className="flex items-center gap-2 text-white mb-4 hover:text-green-500 transition cursor-pointer group">
      <div className="bg-gradient-to-br from-white/30 to-green-500/30 p-2 rounded-md group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition">
          <History size={18} className="text-purple-300" />
        </div>
        <span className="font-medium">Bài hát đã nghe</span>
      </Link>

      <div className="mt-6 border-t border-gray-800/30 pt-6 flex-1 overflow-auto">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">
          Playlist của bạn
        </h3>
        <ul className="space-y-3">
          {[
            "Nhạc Việt Hay Nhất",
            "Chill Mix",
            "Top Hits 2023",
            "Acoustic Favorites",
            "Workout Mix",
            "Nhạc Trữ Tình",
            "V-Pop Rising",
            "Rap Việt",
          ].map((playlist, index) => (
            <li
              key={playlist}
              className="text-gray-400 hover:text-white transition cursor-pointer truncate text-sm py-1"
            >
              {playlist}
            </li>
          ))}
        </ul>
      </div>
      <CreatePlaylistModal open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}
