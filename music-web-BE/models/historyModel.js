import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    encodeId: {
        type: String,
        ref: 'songFavorites',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    artistNames: {
        type: String,
        required: true,
    },
    thumbnailM: {
        type: String,
        required: true,
    },
    albumName: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('History', historySchema, 'history');