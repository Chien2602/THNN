import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  encodeId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artistsNames: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  }
}, { _id: false }); // Không tạo _id phụ cho mỗi bài hát

const playlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  playlistName: {
    type: String,
    required: true,
    trim: true,
  },
  songs: [songSchema] // <- Là mảng các bài hát
}, {
  timestamps: true,
});

export default mongoose.model('Playlist', playlistSchema, 'playlist');
