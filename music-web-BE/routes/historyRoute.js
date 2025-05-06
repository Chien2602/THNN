import express from "express";
import {
  getHistory,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
  deleteAllHistory,
  deleteHistoryBySongId,
  getRecommendedHistory,
} from "../controllers/historyController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: History
 *   description: API for managing song listening history
 */

/**
 * @swagger
 * /api/history/user/{userId}:
 *   get:
 *     summary: Get user's listening history
 *     tags: [History]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of history records
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", getHistory);

/**
 * @swagger
 * /api/history/{id}:
 *   get:
 *     summary: Get a history record by ID
 *     tags: [History]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: History record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History record
 *       404:
 *         description: History not found
 */
router.get("/:id", getHistoryById);

/**
 * @swagger
 * /api/history:
 *   post:
 *     summary: Create a new history record
 *     tags: [History]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - songId
 *               - songName
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
 *         description: History created
 *       500:
 *         description: Server error
 */
router.post("/", createHistory);

/**
 * @swagger
 * /api/history/{id}:
 *   put:
 *     summary: Update a history record by ID
 *     tags: [History]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: History record ID
 *         schema:
 *           type: string
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
 *         description: History updated
 *       404:
 *         description: History not found
 */
router.put("/:id", updateHistory);

/**
 * @swagger
 * /api/history/{id}:
 *   delete:
 *     summary: Delete a history record by ID
 *     tags: [History]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: History record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History deleted
 *       404:
 *         description: History not found
 */
router.delete("/:userId/:songId", deleteHistory);

/**
 * @swagger
 * /api/history/user/{userId}/all:
 *   delete:
 *     summary: Delete all history records for a user
 *     tags: [History]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All history deleted
 *       500:
 *         description: Server error
 */
router.delete("/user/:userId/all", deleteAllHistory);

/**
 * @swagger
 * /api/history/user/{userId}/song/{songId}:
 *   delete:
 *     summary: Delete a history record by song ID and user ID
 *     tags: [History]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - name: songId
 *         in: path
 *         required: true
 *         description: Song ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History deleted
 *       404:
 *         description: History not found
 */

router.delete("/user/:userId/song/:songId", deleteHistoryBySongId);
/**
 * @swagger
 * /api/history/user/{userId}/recommended:
 *   get:
 *     summary: Get recommended songs based on user's listening history
 *     tags:
 *       - History
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to fetch song recommendations for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved recommended songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   artist:
 *                     type: string
 *                   album:
 *                     type: string
 *                   genre:
 *                     type: string
 *                   duration:
 *                     type: number
 *       404:
 *         description: No history found or no recommended songs available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error while fetching recommended songs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get("/user/:userId/recommended", getRecommendedHistory);

export default router;