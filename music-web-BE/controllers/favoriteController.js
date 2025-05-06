import Favorite from "../models/favoriteSongModel.js";

import mongoose from "mongoose";

const getFavorites = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error: error.message });
  }
};


const getFavoriteById = async (req, res) => {
  const { userId, songId } = req.params;

  if (!userId || !songId) {
    return res.status(400).json({ message: "User ID and Song ID are required" });
  }

  try {
    const favorite = await Favorite.findOne({ userId, songId });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.status(200).json(favorite);
  } catch (error) {
    console.error("Error fetching favorite:", error);
    return res.status(500).json({
      message: "Error fetching favorite",
      error: error.message,
    });
  }
};



const createFavorite = async (req, res) => {
  const {
    userId,
    encodeId,
    title,
    thumbnail,
    artistsNames,
    duration,
  } = req.body;

  if (!userId || !encodeId || !title || !thumbnail || !artistsNames || !duration) {
    return res.status(400).json({ message: "userId and songId are required" });
  }

  try {
    const exists = await Favorite.findOne({ userId, encodeId, });
    if (exists) {
      return res.status(409).json({ message: "Song already in favorites" });
    }

    const newFavorite = new Favorite({
      userId,
      encodeId,
      title,
      thumbnail,
      artistsNames,
      duration,
    });

    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating favorite", error: error.message });
  }
};


const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { songId} = req.body;

  try {
    const updated = await Favorite.findByIdAndUpdate(
      id,
      { songId},
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating favorite", error: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  const { userId, encodeId } = req.params;

  if (!userId || !encodeId) {
    return res.status(400).json({ message: "userId and songId are required" });
  }

  try {
    const deleted = await Favorite.findOneAndDelete({ userId, encodeId });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting favorite",
      error: error.message,
    });
  }
};

const deleteAllFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    await Favorite.deleteMany({ userId });
    res.status(200).json({ message: "All favorites deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting all favorites", error: error.message });
  }
};

export {
  getFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  deleteAllFavorites,
};