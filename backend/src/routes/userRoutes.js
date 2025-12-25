/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (admin + utilisateur)
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs (ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Nombre max d'utilisateurs à retourner
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Décalage pour la pagination
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       403:
 *         description: Accès refusé (réservé à l’admin)
 */
router.get("/", authMiddleware, adminOnly, userController.listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur (ADMIN ou utilisateur lui-même)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       403:
 *         description: L'utilisateur n'a pas le droit d'accéder à cette ressource
 *       404:
 *         description: Utilisateur introuvable
 */
router.get("/:id", authMiddleware, userController.getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Met à jour un utilisateur (ADMIN ou utilisateur lui-même)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Champs modifiables (username, email, password...)
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur introuvable
 */
router.patch("/:id", authMiddleware, userController.patchUser);

/**
 * @swagger
 * /api/users/{id}/deactivate:
 *   post:
 *     summary: Désactive un utilisateur (ADMIN uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur désactivé
 *       403:
 *         description: Accès refusé
 */
router.post(
  "/:id/deactivate",
  authMiddleware,
  adminOnly,
  userController.deactivate
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur (ADMIN uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur introuvable
 */
router.delete("/:id", authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;
