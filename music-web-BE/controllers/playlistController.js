import Playlist from "../models/playlistModel.js";

const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({});
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlists", error });
  }
};

const getPlaylistById = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlist", error });
  }
};

const createPlaylist = async (req, res) => {
  const { playlistName, userId } = req.body;
  try {
    const newPlaylist = new Playlist({ playlistName, userId });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist", error });
  }
};

const updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const { playlistName, songs } = req.body;
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { playlistName, songs },
      { new: true }
    );
    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Error updating playlist", error });
  }
};

const deletePlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(id);
    if (!deletedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting playlist", error });
  }
};

const addSongToPlaylist = async (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { $addToSet: { songs: songId } },
      { new: true }
    );
    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Error adding song to playlist", error });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { $pull: { songs: songId } },
      { new: true }
    );
    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Error removing song from playlist", error });
  }
};

const getPlaylistsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const playlists = await Playlist.find({ userId });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlists by user", error });
  }
};

const getPlaylistSongs = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id).populate("songs");
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(playlist.songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlist songs", error });
  }
};

const getPlaylistByName = async (req, res) => {
  const { name } = req.params;
  try {
    const playlists = await Playlist.find({
      name: { $regex: name, $options: "i" },
    });
    if (playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found" });
    }
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Error searching playlists by name", error });
  }
};

export {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylistsByUserId,
  getPlaylistSongs,
  getPlaylistByName,
};
