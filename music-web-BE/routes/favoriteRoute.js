import express from "express";
import {
  getFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  deleteAllFavorites,
} from "../controllers/favoriteController.js";

const router = express.Router();

/**
 * @swagger
 * /api/favorites/{userId}:
 *   get:
 *     summary: Get all favorite songs of a user
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of favorite songs
 *       500:
 *         description: Server error
 */
router.get("/:userId", getFavorites);

/**
 * @swagger
 * /api/favorites/{userId}/{songId}:
 *   get:
 *     summary: Get a favorite song by its song ID and user ID
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Favorite song found
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.get("/:userId/:encodeId", getFavoriteById);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a new favorite song
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - songId
 *             properties:
 *               userId:
 *                 type: string
 *               songId:
 *                 type: string
 *               songName:
 *                 type: string
 *               artistName:
 *                 type: string
 *               albumName:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Favorite song added
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Song already in favorites
 *       500:
 *         description: Server error
 */
router.post("/", createFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   put:
 *     summary: Update a favorite song
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Favorite song document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               songId:
 *                 type: string
 *               songName:
 *                 type: string
 *               artistName:
 *                 type: string
 *               albumName:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Favorite updated
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Delete a specific favorite song
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Favorite song document ID
 *     responses:
 *       200:
 *         description: Favorite deleted
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.delete("/:userId/:encodeId", deleteFavorite);

/**
 * @swagger
 * /api/favorites/user/{userId}:
 *   delete:
 *     summary: Delete all favorite songs of a user
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID whose favorites will be deleted
 *     responses:
 *       200:
 *         description: All favorites deleted
 *       500:
 *         description: Server error
 */
router.delete("/user/:userId", deleteAllFavorites);

export default router;