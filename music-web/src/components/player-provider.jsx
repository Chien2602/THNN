"use client";

import { createContext, useContext, useState } from "react";

export const PlayerContext = createContext({
  currentSong: null,
  setCurrentSong: () => {},

  currentPlaylist: null,
  setCurrentPlaylist: () => {},

  currentArtist: null,
  setCurrentArtist: () => {},

  currentUser: null,
  setCurrentUser: () => {},
});

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,

        currentPlaylist,
        setCurrentPlaylist,

        currentArtist,
        setCurrentArtist,
        
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
