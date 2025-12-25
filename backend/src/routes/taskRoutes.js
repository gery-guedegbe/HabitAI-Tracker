/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gestion des tâches extraites
 */

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createTaskSchema,
  updateTaskSchema,
  validate,
} = require("../utils/validators");

/**
 * @swagger
 * /api/journals/{journal_id}/tasks:
 *   post:
 *     summary: Créer une tâche manuellement
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journal_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [sport, travail, santé, apprentissage, social, loisir, autre]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *               duration_minutes:
 *                 type: integer
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tâche créée
 */
// Note: La route POST pour créer une tâche est dans journalRoutes.js
// car elle nécessite journal_id dans l'URL: /api/journals/:journal_id/tasks

/**
 * @swagger
 * /api/tasks/calendar:
 *   get:
 *     summary: Récupérer les tâches pour la vue calendrier
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Date de début (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: Date de fin (YYYY-MM-DD)
 *       - in: query
 *         name: view
 *         required: false
 *         schema:
 *           type: string
 *           enum: [month, week, day]
 *           default: month
 *         description: Type de vue (month, week, day)
 *     responses:
 *       200:
 *         description: Tâches récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     start_date:
 *                       type: string
 *                       format: date
 *                     end_date:
 *                       type: string
 *                       format: date
 *                     view:
 *                       type: string
 *                 tasks_by_date:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Task'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total_tasks:
 *                       type: integer
 *                     completed_tasks:
 *                       type: integer
 *                     completion_rate:
 *                       type: string
 *                     days_with_tasks:
 *                       type: integer
 *                     current_streak:
 *                       type: integer
 *                     longest_streak:
 *                       type: integer
 *                 progression:
 *                   type: object
 *                   properties:
 *                     this_month:
 *                       type: integer
 *                     last_month:
 *                       type: integer
 *                     difference:
 *                       type: integer
 *                     percentage:
 *                       type: string
 *                     improvement:
 *                       type: boolean
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non authentifié
 */
// IMPORTANT: Cette route doit être définie AVANT /:id pour éviter que "calendar" soit interprété comme un UUID
const calendarController = require("../controllers/calendarController");
router.get(
  "/calendar",
  authMiddleware,
  calendarController.getCalendarTasks
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Récupérer une tâche par ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tâche trouvée
 *       404:
 *         description: Tâche introuvable
 */
router.get("/:id", authMiddleware, taskController.getTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Mettre à jour une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *               tags:
 *                 type: array
 *               duration_minutes:
 *                 type: integer
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 */
router.patch(
  "/:id",
  authMiddleware,
  validate(updateTaskSchema),
  taskController.updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tâche supprimée
 */
router.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = router;

