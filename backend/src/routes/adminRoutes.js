/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Routes d'administration (ADMIN uniquement)
 */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Statistiques globales (ADMIN uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales
 *       403:
 *         description: Accès refusé
 */
router.get(
  "/stats",
  authMiddleware,
  adminOnly,
  adminController.getGlobalStats
);

/**
 * @swagger
 * /api/admin/users/activity:
 *   get:
 *     summary: Statistiques d'activité des utilisateurs (ADMIN uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'utilisateurs à retourner
 *     responses:
 *       200:
 *         description: Statistiques d'activité
 *       403:
 *         description: Accès refusé
 */
router.get(
  "/users/activity",
  authMiddleware,
  adminOnly,
  adminController.getUserActivityStats
);

/**
 * @swagger
 * /api/admin/activity/time:
 *   get:
 *     summary: Activité sur une période (ADMIN uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Nombre de jours
 *     responses:
 *       200:
 *         description: Activité sur la période
 *       403:
 *         description: Accès refusé
 */
router.get(
  "/activity/time",
  authMiddleware,
  adminOnly,
  adminController.getActivityOverTime
);

/**
 * @swagger
 * /api/admin/tasks/completion:
 *   get:
 *     summary: Statistiques de complétion des tâches (ADMIN uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques de complétion
 *       403:
 *         description: Accès refusé
 */
router.get(
  "/tasks/completion",
  authMiddleware,
  adminOnly,
  adminController.getTaskCompletionStats
);

/**
 * @swagger
 * /api/admin/tasks/categories:
 *   get:
 *     summary: Distribution des catégories (ADMIN uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distribution des catégories
 *       403:
 *         description: Accès refusé
 */
router.get(
  "/tasks/categories",
  authMiddleware,
  adminOnly,
  adminController.getCategoryDistribution
);

module.exports = router;

