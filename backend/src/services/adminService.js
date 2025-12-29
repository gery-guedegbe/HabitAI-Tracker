const pool = require("../config/db/db");

/**
 * Get global statistics for admin dashboard
 */
async function getGlobalStats() {
  const stats = {};

  // Total users
  const usersCount = await pool.query(
    `SELECT COUNT(*) as count FROM users WHERE role = 'user'`
  );
  stats.totalUsers = parseInt(usersCount.rows[0].count);

  // Active users (created journals in last 30 days)
  const activeUsers = await pool.query(
    `SELECT COUNT(DISTINCT user_id) as count 
     FROM journals 
     WHERE created_at >= NOW() - INTERVAL '30 days'`
  );
  stats.activeUsers = parseInt(activeUsers.rows[0].count);

  // Total journals
  const journalsCount = await pool.query(`SELECT COUNT(*) as count FROM journals`);
  stats.totalJournals = parseInt(journalsCount.rows[0].count);

  // Total tasks
  const tasksCount = await pool.query(`SELECT COUNT(*) as count FROM tasks`);
  stats.totalTasks = parseInt(tasksCount.rows[0].count);

  // Completed tasks
  const completedTasks = await pool.query(
    `SELECT COUNT(*) as count FROM tasks WHERE status = 'done'`
  );
  stats.completedTasks = parseInt(completedTasks.rows[0].count);

  // New users this month
  const newUsersThisMonth = await pool.query(
    `SELECT COUNT(*) as count 
     FROM users 
     WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`
  );
  stats.newUsersThisMonth = parseInt(newUsersThisMonth.rows[0].count);

  // Journals created this month
  const journalsThisMonth = await pool.query(
    `SELECT COUNT(*) as count 
     FROM journals 
     WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`
  );
  stats.journalsThisMonth = parseInt(journalsThisMonth.rows[0].count);

  // Tasks created this month
  const tasksThisMonth = await pool.query(
    `SELECT COUNT(*) as count 
     FROM tasks 
     WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`
  );
  stats.tasksThisMonth = parseInt(tasksThisMonth.rows[0].count);

  return stats;
}

/**
 * Get user activity statistics (users with most journals/tasks)
 */
async function getUserActivityStats(limit = 10) {
  const users = await pool.query(
    `SELECT 
      u.id,
      u.username,
      u.email,
      u.created_at,
      u.last_login,
      COUNT(DISTINCT j.id) as journal_count,
      COUNT(DISTINCT t.id) as task_count,
      COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks
    FROM users u
    LEFT JOIN journals j ON j.user_id = u.id
    LEFT JOIN tasks t ON t.journal_id = j.id
    WHERE u.role = 'user'
    GROUP BY u.id, u.username, u.email, u.created_at, u.last_login
    ORDER BY journal_count DESC, task_count DESC
    LIMIT $1`,
    [limit]
  );

  return users.rows.map((row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    createdAt: row.created_at,
    lastLogin: row.last_login,
    journalCount: parseInt(row.journal_count),
    taskCount: parseInt(row.task_count),
    completedTasks: parseInt(row.completed_tasks),
  }));
}

/**
 * Get activity over time (last 30 days)
 */
async function getActivityOverTime(days = 30) {
  const activity = await pool.query(
    `SELECT 
      DATE(created_at) as date,
      COUNT(*) as count,
      'journal' as type
    FROM journals
    WHERE created_at >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(created_at)
    
    UNION ALL
    
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count,
      'task' as type
    FROM tasks
    WHERE created_at >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(created_at)
    
    ORDER BY date ASC`
  );

  return activity.rows;
}

/**
 * Get task completion statistics
 */
async function getTaskCompletionStats() {
  const stats = await pool.query(
    `SELECT 
      status,
      COUNT(*) as count
    FROM tasks
    GROUP BY status`
  );

  return stats.rows.map((row) => ({
    status: row.status,
    count: parseInt(row.count),
  }));
}

/**
 * Get category distribution
 */
async function getCategoryDistribution() {
  const categories = await pool.query(
    `SELECT 
      category,
      COUNT(*) as count
    FROM tasks
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC
    LIMIT 10`
  );

  return categories.rows.map((row) => ({
    category: row.category,
    count: parseInt(row.count),
  }));
}

module.exports = {
  getGlobalStats,
  getUserActivityStats,
  getActivityOverTime,
  getTaskCompletionStats,
  getCategoryDistribution,
};

