import History from "../models/historyModel.js";
import { getInfo } from "./musicController.js";

const getHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await History.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy lịch sử", error: error.message });
  }
};

const getHistoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await History.findById(id);
    if (!history) {
      return res.status(404).json({ message: "Không tìm thấy lịch sử" });
    }
    res.status(200).json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết lịch sử", error: error.message });
  }
};

const createHistory = async (req, res) => {
  const { userId, encodeId, title, thumbnailM, artistNames, albumName, duration } =
    req.body;
  try {
    const findHistory = await History.findOne({ userId, encodeId });
    if (findHistory) {
      return res.status(400).json({ message: "Lịch sử đã tồn tại" });
    }
    const newHistory = new History({
      userId,
      encodeId,
      title,
      thumbnailM,
      artistNames,
      albumName,
      duration,
    });
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo lịch sử", error: error.message });
  }
};

const updateHistory = async (req, res) => {
  const { id } = req.params;
  const { songId, songName, artistName, albumName, duration } = req.body;
  try {
    const updated = await History.findByIdAndUpdate(
      id,
      { songId, songName, artistName, albumName, duration },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch sử để cập nhật" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật lịch sử", error: error.message });
  }
};

const deleteHistory = async (req, res) => {
  const { userId, encodeId } = req.params;
  try {
    const deleted = await History.deleteOne({userId, encodeId});
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy lịch sử để xóa" });
    }
    res.status(200).json({ message: "Đã xóa bản ghi lịch sử", data: deleted });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa lịch sử", error: error.message });
  }
};

const deleteAllHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    await History.deleteMany({ userId });
    res.status(200).json({ message: "Đã xóa toàn bộ lịch sử thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa toàn bộ lịch sử", error: error.message });
  }
};

const deleteHistoryBySongId = async (req, res) => {
  const { userId, songId } = req.params;
  try {
    const deleted = await History.findOneAndDelete({ userId, songId });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi để xóa" });
    }
    res.status(200).json({ message: "Đã xóa bản ghi", data: deleted });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa bản ghi", error: error.message });
  }
};

const getRecommendedHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await History.find({ userId }).sort({ createdAt: -1 });

    if (history.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch sử để gợi ý" });
    }

    const artistCountMap = {};
    history.forEach((item) => {
      const artists = item.artistNames.split(", ").map((a) => a.trim());
      artists.forEach((artist) => {
        artistCountMap[artist] = (artistCountMap[artist] || 0) + 1;
      });
    });

    const sortedArtists = Object.entries(artistCountMap).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedArtists.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có nghệ sĩ nào để gợi ý bài hát" });
    }

    const topArtist = sortedArtists[0][0];

    // Bước 3: Gọi API lấy bài hát từ nghệ sĩ đó
    const artistInfo = await getInfo(topArtist);
    const songs = artistInfo.songs || [];

    const recommended = songs.slice(0, 5);

    if (recommended.length === 0) {
      return res
        .status(404)
        .json({ message: `Không có bài hát nào từ nghệ sĩ: ${topArtist}` });
    }

    res.status(200).json({ topArtist, recommended });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy gợi ý bài hát từ nghệ sĩ phổ biến",
      error: error.message,
    });
  }
};


export {
  getHistory,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
  deleteAllHistory,
  deleteHistoryBySongId,
  getRecommendedHistory,
};