const userModel = require("../models/userModel");

/**
 * Get single user
 */
async function getUser(id) {
  const user = await userModel.findUserById(id);
  if (!user) throw new Error("User not found");
  return user;
}

/**
 * Find user by email
 * Retourne null si l'utilisateur n'existe pas (ne lance pas d'erreur)
 */
async function findUserByEmail(email) {
  return await userModel.findUserByEmail(email);
}

/**
 * Update profile
 */
async function updateUser(id, data) {
  const exists = await userModel.findUserById(id);
  if (!exists) throw new Error("User not found");

  return await userModel.updateUser(id, data);
}

/**
 * Update user password
 */
async function updatePassword(id, hashedPassword) {
  return await userModel.updatePassword(id, hashedPassword);
}

async function savePasswordResetToken(userId, token, expires) {
  return userModel.saveResetToken(userId, token, expires);
}

async function findUserByResetToken(tokenHash) {
  return userModel.findUserByResetToken(tokenHash);
}

async function resetPassword(id, hashedPassword) {
  return userModel.resetPassword(id, hashedPassword);
}

/**
 * List users
 */
async function listUsers({ limit = 50, offset = 0 }) {
  return await userModel.findUsers({ limit, offset });
}

/**
 * Deactivate a user (admin)
 */
async function deactivateUser(id) {
  return await userModel.updateUser(id, { is_active: false });
}

/**
 * Delete a user
 */
async function deleteUser(id) {
  const exists = await userModel.findUserById(id);
  if (!exists) throw new Error("User not found");

  return await userModel.deleteUser(id);
}

module.exports = {
  getUser,
  findUserByEmail,
  updateUser,
  updatePassword,
  savePasswordResetToken,
  findUserByResetToken,
  resetPassword,
  listUsers,
  deactivateUser,
  deleteUser,
};
