const pool = require("../config/db/db");

/**
 * Récupère les statistiques du dashboard pour un utilisateur
 */
async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;
    const daysInt = parseInt(days, 10);

    // Date de début
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysInt);

    // Nombre total de tâches complétées
    const completedTasksQuery = `
      SELECT COUNT(*) as count
      FROM tasks t
      INNER JOIN journals j ON t.journal_id = j.id
      WHERE j.user_id = $1 
        AND t.status = 'done'
        AND j.journal_date >= $2
    `;
    const completedResult = await pool.query(completedTasksQuery, [
      userId,
      startDate,
    ]);

    // Nombre total de tâches
    const totalTasksQuery = `
      SELECT COUNT(*) as count
      FROM tasks t
      INNER JOIN journals j ON t.journal_id = j.id
      WHERE j.user_id = $1 
        AND j.journal_date >= $2
    `;
    const totalResult = await pool.query(totalTasksQuery, [userId, startDate]);

    // Tâches par catégorie
    const categoryQuery = `
      SELECT 
        t.category,
        COUNT(*) as count,
        COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed
      FROM tasks t
      INNER JOIN journals j ON t.journal_id = j.id
      WHERE j.user_id = $1 
        AND j.journal_date >= $2
        AND t.category IS NOT NULL
      GROUP BY t.category
      ORDER BY count DESC
    `;
    const categoryResult = await pool.query(categoryQuery, [userId, startDate]);

    // Tâches par jour (pour heatmap)
    const dailyQuery = `
      SELECT 
        j.journal_date as date,
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks
      FROM journals j
      LEFT JOIN tasks t ON t.journal_id = j.id
      WHERE j.user_id = $1 
        AND j.journal_date >= $2
      GROUP BY j.journal_date
      ORDER BY j.journal_date DESC
    `;
    const dailyResult = await pool.query(dailyQuery, [userId, startDate]);

    // Top activités (tâches les plus fréquentes)
    const topActivitiesQuery = `
      SELECT 
        t.title,
        COUNT(*) as frequency,
        COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_count
      FROM tasks t
      INNER JOIN journals j ON t.journal_id = j.id
      WHERE j.user_id = $1 
        AND j.journal_date >= $2
      GROUP BY t.title
      ORDER BY frequency DESC
      LIMIT 10
    `;
    const topActivitiesResult = await pool.query(topActivitiesQuery, [
      userId,
      startDate,
    ]);

    // Temps total passé (en minutes)
    const timeQuery = `
      SELECT COALESCE(SUM(t.duration_minutes), 0) as total_minutes
      FROM tasks t
      INNER JOIN journals j ON t.journal_id = j.id
      WHERE j.user_id = $1 
        AND t.status = 'done'
        AND j.journal_date >= $2
        AND t.duration_minutes IS NOT NULL
    `;
    const timeResult = await pool.query(timeQuery, [userId, startDate]);

    // Streak (jours consécutifs avec au moins une tâche complétée)
    const streakQuery = `
      WITH daily_completed AS (
        SELECT DISTINCT j.journal_date
        FROM journals j
        INNER JOIN tasks t ON t.journal_id = j.id
        WHERE j.user_id = $1 
          AND t.status = 'done'
          AND j.journal_date >= $2
      ),
      ranked_dates AS (
        SELECT 
          journal_date,
          ROW_NUMBER() OVER (ORDER BY journal_date DESC) as rn,
          journal_date - (ROW_NUMBER() OVER (ORDER BY journal_date DESC) || ' days')::interval as grp
        FROM daily_completed
      )
      SELECT COUNT(*) as streak
      FROM ranked_dates
      WHERE grp = (SELECT grp FROM ranked_dates ORDER BY journal_date DESC LIMIT 1)
    `;
    const streakResult = await pool.query(streakQuery, [userId, startDate]);

    res.json({
      period_days: daysInt,
      stats: {
        total_tasks: parseInt(totalResult.rows[0].count, 10),
        completed_tasks: parseInt(completedResult.rows[0].count, 10),
        completion_rate:
          totalResult.rows[0].count > 0
            ? (
                (completedResult.rows[0].count / totalResult.rows[0].count) *
                100
              ).toFixed(1)
            : 0,
        total_minutes: parseInt(timeResult.rows[0].total_minutes, 10),
        current_streak: parseInt(streakResult.rows[0].streak, 10) || 0,
      },
      by_category: categoryResult.rows.map((row) => ({
        category: row.category,
        total: parseInt(row.count, 10),
        completed: parseInt(row.completed, 10),
      })),
      daily_activity: dailyResult.rows.map((row) => ({
        date: row.date,
        total_tasks: parseInt(row.total_tasks, 10),
        completed_tasks: parseInt(row.completed_tasks, 10),
      })),
      top_activities: topActivitiesResult.rows.map((row) => ({
        title: row.title,
        frequency: parseInt(row.frequency, 10),
        completed_count: parseInt(row.completed_count, 10),
      })),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
};

