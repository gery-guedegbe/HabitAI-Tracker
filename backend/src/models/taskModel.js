/**
 * src/models/taskModel.js
 *
 * Accès DB pour les tasks.
 * Les fonctions sont simples : CRUD.
 * Aucune logique métier ici.
 */

const pool = require("../config/db/db");

/**
 * Create a task for a journal.
 * @param {number} journalId
 * @param {Object} fields - { title, category, tags, status, duration_minutes, confidence, note)}
 */
async function createTask(journalId, fields) {
  const {
    title,
    category = null,
    tags = [],
    status = "todo",
    duration_minutes = null,
    confidence = null,
    note = null,
  } = fields;

  const sql = `INSERT INTO tasks (journal_id, title, category, tags, status, duration_minutes, confidence, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, journal_id, title, category, tags, status, duration_minutes, confidence, note, created_at, updated_at`;

  const values = [
    journalId,
    title,
    category,
    tags,
    status,
    duration_minutes,
    confidence,
    note,
  ];

  const { rows } = await pool.query(sql, values);
  return rows[0];
}

/**
 * Get a task by ID
 */
async function getTaskById(id) {
  const sql = `SELECT id, journal_id, title, category, tags, status, duration_minutes, confidence, note, created_at, updated_at FROM tasks WHERE id = $1`;
  const { rows } = await pool.query(sql, [id]);
  return rows[0] || null;
}

/**
 * Get all taks for a journal
 */
async function getTasksByJournal(journalId) {
  const sql = `SELECT id, journal_id, title, category, tags, status, duration_minutes, confidence, note, created_at, updated_at FROM tasks WHERE journal_id = $1 ORDER BY created_at ASC`;
  const { rows } = await pool.query(sql, [journalId]);
  return rows;
}

/**
 * Update task partially (title? status? note? etc.)
 */
async function updateTask(id, fields = {}) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getTaskById(id);

  const setClauses = keys.map((key, i) => `"${key}" = $${i + 1}`);
  const values = keys.map((key) => fields[key]);

  setClauses.push(`updated_at = NOW()`);

  const sql = `
    UPDATE tasks
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length + 1}
    RETURNING id, journal_id, title, category, tags, status, duration_minutes, confidence, note, created_at, updated_at
  `;

  values.push(id);

  const { rows } = await pool.query(sql, values);
  return rows[0] || null;
}

/**
 * Delete a task
 */
async function deleteTask(id) {
  await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
}

/**
 * Get tasks by date range for calendar view
 * Returns tasks grouped by date with journal_date
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @returns {Promise<Array>} Array of tasks with date information
 */
async function getTasksByDateRange(userId, startDate, endDate) {
  const sql = `
    SELECT 
      t.id,
      t.journal_id,
      t.title,
      t.category,
      t.tags,
      t.status,
      t.duration_minutes,
      t.confidence,
      t.note,
      t.created_at,
      t.updated_at,
      j.journal_date,
      COALESCE(j.journal_date, t.created_at::date) as task_date
    FROM tasks t
    INNER JOIN journals j ON t.journal_id = j.id
    WHERE j.user_id = $1
      AND j.journal_date >= $2
      AND j.journal_date <= $3
    ORDER BY j.journal_date DESC, t.created_at ASC
  `;

  const { rows } = await pool.query(sql, [userId, startDate, endDate]);
  return rows;
}

/**
 * Get calendar statistics for a date range
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Statistics object
 */
async function getCalendarStats(userId, startDate, endDate) {
  // Total tasks
  const totalTasksQuery = `
    SELECT COUNT(*) as count
    FROM tasks t
    INNER JOIN journals j ON t.journal_id = j.id
    WHERE j.user_id = $1
      AND j.journal_date >= $2
      AND j.journal_date <= $3
  `;
  const totalResult = await pool.query(totalTasksQuery, [
    userId,
    startDate,
    endDate,
  ]);

  // Completed tasks
  const completedTasksQuery = `
    SELECT COUNT(*) as count
    FROM tasks t
    INNER JOIN journals j ON t.journal_id = j.id
    WHERE j.user_id = $1
      AND j.journal_date >= $2
      AND j.journal_date <= $3
      AND t.status = 'done'
  `;
  const completedResult = await pool.query(completedTasksQuery, [
    userId,
    startDate,
    endDate,
  ]);

  // Days with tasks
  const daysWithTasksQuery = `
    SELECT COUNT(DISTINCT j.journal_date) as count
    FROM journals j
    INNER JOIN tasks t ON t.journal_id = j.id
    WHERE j.user_id = $1
      AND j.journal_date >= $2
      AND j.journal_date <= $3
      AND t.status = 'done'
  `;
  const daysResult = await pool.query(daysWithTasksQuery, [
    userId,
    startDate,
    endDate,
  ]);

  // Current streak
  const streakQuery = `
    WITH daily_completed AS (
      SELECT DISTINCT j.journal_date
      FROM journals j
      INNER JOIN tasks t ON t.journal_id = j.id
      WHERE j.user_id = $1
        AND t.status = 'done'
        AND j.journal_date <= CURRENT_DATE
      ORDER BY j.journal_date DESC
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
      AND journal_date >= CURRENT_DATE - INTERVAL '30 days'
  `;
  const streakResult = await pool.query(streakQuery, [userId]);

  // Longest streak
  const longestStreakQuery = `
    WITH daily_completed AS (
      SELECT DISTINCT j.journal_date
      FROM journals j
      INNER JOIN tasks t ON t.journal_id = j.id
      WHERE j.user_id = $1
        AND t.status = 'done'
        AND j.journal_date >= $2
        AND j.journal_date <= $3
      ORDER BY j.journal_date
    ),
    ranked_dates AS (
      SELECT 
        journal_date,
        ROW_NUMBER() OVER (ORDER BY journal_date) as rn,
        journal_date - (ROW_NUMBER() OVER (ORDER BY journal_date) || ' days')::interval as grp
      FROM daily_completed
    )
    SELECT COUNT(*) as streak, grp
    FROM ranked_dates
    GROUP BY grp
    ORDER BY streak DESC
    LIMIT 1
  `;
  const longestStreakResult = await pool.query(longestStreakQuery, [
    userId,
    startDate,
    endDate,
  ]);

  return {
    total_tasks: parseInt(totalResult.rows[0].count, 10),
    completed_tasks: parseInt(completedResult.rows[0].count, 10),
    completion_rate:
      totalResult.rows[0].count > 0
        ? (
            (completedResult.rows[0].count / totalResult.rows[0].count) *
            100
          ).toFixed(1)
        : 0,
    days_with_tasks: parseInt(daysResult.rows[0].count, 10),
    current_streak: parseInt(streakResult.rows[0].streak, 10) || 0,
    longest_streak:
      longestStreakResult.rows.length > 0
        ? parseInt(longestStreakResult.rows[0].streak, 10)
        : 0,
  };
}

/**
 * Get progression comparison (this month vs last month)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Progression object
 */
async function getProgression(userId) {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // This month
  const thisMonthQuery = `
    SELECT COUNT(*) as count
    FROM tasks t
    INNER JOIN journals j ON t.journal_id = j.id
    WHERE j.user_id = $1
      AND j.journal_date >= $2
      AND j.journal_date <= $3
      AND t.status = 'done'
  `;
  const thisMonthResult = await pool.query(thisMonthQuery, [
    userId,
    thisMonthStart,
    thisMonthEnd,
  ]);

  // Last month
  const lastMonthQuery = `
    SELECT COUNT(*) as count
    FROM tasks t
    INNER JOIN journals j ON t.journal_id = j.id
    WHERE j.user_id = $1
      AND j.journal_date >= $2
      AND j.journal_date <= $3
      AND t.status = 'done'
  `;
  const lastMonthResult = await pool.query(lastMonthQuery, [
    userId,
    lastMonthStart,
    lastMonthEnd,
  ]);

  const thisMonth = parseInt(thisMonthResult.rows[0].count, 10);
  const lastMonth = parseInt(lastMonthResult.rows[0].count, 10);
  const difference = thisMonth - lastMonth;
  const percentage =
    lastMonth > 0 ? ((difference / lastMonth) * 100).toFixed(1) : 0;

  return {
    this_month: thisMonth,
    last_month: lastMonth,
    difference: difference,
    percentage: percentage,
    improvement: difference > 0,
  };
}

module.exports = {
  createTask,
  getTaskById,
  getTasksByJournal,
  updateTask,
  deleteTask,
  getTasksByDateRange,
  getCalendarStats,
  getProgression,
};
