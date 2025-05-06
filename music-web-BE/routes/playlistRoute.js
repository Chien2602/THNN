import express from "express";
import {
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
} from "../controllers/playlistController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: Playlist management
 */

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Get all playlists
 *     tags: [Playlists]
 *     responses:
 *       200:
 *         description: List of playlists
 */
router.get("/playlists", getPlaylists);

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     summary: Get a playlist by ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Playlist ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist data
 *       404:
 *         description: Playlist not found
 */
router.get("/playlists/:id", getPlaylistById);

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               songs:
 *                 type: array
 *                 items:
 *                   type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Playlist created
 */
router.post("/playlists", createPlaylist);

/**
 * @swagger
 * /api/playlists/{id}:
 *   put:
 *     summary: Update a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Playlist ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               songs:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Playlist updated
 *       404:
 *         description: Playlist not found
 */
router.put("/:id", updatePlaylist);

/**
 * @swagger
 * /api/playlists/{id}:
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Playlist ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted
 *       404:
 *         description: Playlist not found
 */
router.delete("/playlists/:id", deletePlaylist);

/**
 * @swagger
 * /api/playlists/{id}/songs:
 *   post:
 *     summary: Add song to playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Playlist ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song added to playlist
 *       404:
 *         description: Playlist not found
 */
router.post("/playlists/:id/songs", addSongToPlaylist);

/**
 * @swagger
 * /api/playlists/{id}/songs:
 *   delete:
 *     summary: Remove song from playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Playlist ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song removed from playlist
 *       404:
 *         description: Playlist not found
 */
router.delete("/playlists/:id/songs", removeSongFromPlaylist);

/**
 * @swagger
 * /api/playlists/user/{userId}:
 *   get:
 *     summary: Get playlists by user ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's playlists
 */
router.get("/playlists/user/:userId", getPlaylistsByUserId);

/**
 * @swagger
 * /api/playlists/{id}/songs:
 *   get:
 *     summary: Get songs in a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Playlist ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Songs in playlist
 *       404:
 *         description: Playlist not found
 */
router.get("/:id/songs", getPlaylistSongs);

/**
 * @swagger
 * /api/playlists/search/{name}:
 *   get:
 *     summary: Search playlists by name
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Playlist name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matched playlists
 *       404:
 *         description: No playlists found
 */
router.get("/search/:name", getPlaylistByName);

export default router;