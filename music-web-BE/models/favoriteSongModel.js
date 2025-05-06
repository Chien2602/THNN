// Save Song Favorites
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    encodeId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    artistsNames: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Favorites', favoriteSchema, 'songFavorites');