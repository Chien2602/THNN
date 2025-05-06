import mongoose from 'mongoose';

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
    songs: [
        {
            type: String,
            ref: 'songFavorites',
        }
    ],
}, {
    timestamps: true,
});

export default mongoose.model('Playlist', playlistSchema, 'playlist');