/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistiques et analytics
 */

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authMiddleware } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Récupère les statistiques du dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Nombre de jours à analyser
 *     responses:
 *       200:
 *         description: Statistiques du dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period_days:
 *                   type: integer
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total_tasks:
 *                       type: integer
 *                     completed_tasks:
 *                       type: integer
 *                     completion_rate:
 *                       type: number
 *                     total_minutes:
 *                       type: integer
 *                     current_streak:
 *                       type: integer
 *                 by_category:
 *                   type: array
 *                 daily_activity:
 *                   type: array
 *                 top_activities:
 *                   type: array
 */
router.get(
  "/stats",
  authMiddleware,
  dashboardController.getDashboardStats
);

module.exports = router;

