const adminService = require("../services/adminService");

/**
 * Get global statistics
 */
async function getGlobalStats(req, res, next) {
  try {
    const stats = await adminService.getGlobalStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * Get user activity statistics
 */
async function getUserActivityStats(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const stats = await adminService.getUserActivityStats(limit);
    res.json({ data: stats });
  } catch (error) {
    next(error);
  }
}

/**
 * Get activity over time
 */
async function getActivityOverTime(req, res, next) {
  try {
    const days = parseInt(req.query.days) || 30;
    const activity = await adminService.getActivityOverTime(days);
    res.json({ data: activity });
  } catch (error) {
    next(error);
  }
}

/**
 * Get task completion statistics
 */
async function getTaskCompletionStats(req, res, next) {
  try {
    const stats = await adminService.getTaskCompletionStats();
    res.json({ data: stats });
  } catch (error) {
    next(error);
  }
}

/**
 * Get category distribution
 */
async function getCategoryDistribution(req, res, next) {
  try {
    const distribution = await adminService.getCategoryDistribution();
    res.json({ data: distribution });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGlobalStats,
  getUserActivityStats,
  getActivityOverTime,
  getTaskCompletionStats,
  getCategoryDistribution,
};

