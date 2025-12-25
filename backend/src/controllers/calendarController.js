/**
 * src/controllers/calendarController.js
 *
 * Contrôleur pour la vue calendrier
 * Gère la récupération des tâches par plage de dates
 * et les statistiques de progression
 */

const taskModel = require("../models/taskModel");

/**
 * GET /api/tasks/calendar
 * Récupère les tâches pour une plage de dates (calendrier)
 * Query params: start_date, end_date (format: YYYY-MM-DD)
 */
async function getCalendarTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const { start_date, end_date, view = "month" } = req.query;

    // Validation des dates
    if (!start_date || !end_date) {
      return res.status(400).json({
        message: "start_date and end_date are required",
        error: "Missing required query parameters",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD",
        error: "Invalid date format",
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        message: "start_date must be before or equal to end_date",
        error: "Invalid date range",
      });
    }

    // Récupérer les tâches
    const tasks = await taskModel.getTasksByDateRange(
      userId,
      startDate,
      endDate
    );

    // Grouper les tâches par date
    const tasksByDate = {};
    tasks.forEach((task) => {
      const dateKey = task.task_date.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push({
        id: task.id,
        title: task.title,
        category: task.category,
        tags: task.tags,
        status: task.status,
        duration_minutes: task.duration_minutes,
        note: task.note,
        created_at: task.created_at,
        updated_at: task.updated_at,
        journal_id: task.journal_id,
      });
    });

    // Récupérer les statistiques
    const stats = await taskModel.getCalendarStats(userId, startDate, endDate);

    // Récupérer la progression (comparaison mois)
    const progression = await taskModel.getProgression(userId);

    res.json({
      period: {
        start_date: start_date,
        end_date: end_date,
        view: view,
      },
      tasks_by_date: tasksByDate,
      stats: stats,
      progression: progression,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCalendarTasks,
};
