/**
 * Validators pour validation des données d'entrée
 * Utilise Joi pour la validation
 */

const Joi = require("joi");

/**
 * Schema de validation pour l'inscription
 */
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().required().messages({
    "string.email": "Email invalide",
    "any.required": "Email requis",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    "any.required": "Mot de passe requis",
  }),
});

/**
 * Schema de validation pour la connexion
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Schema de validation pour le changement de mot de passe
 */
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

/**
 * Schema de validation pour la réinitialisation de mot de passe
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

/**
 * Schema de validation pour forgot password
 */
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * Schema de validation pour créer un journal
 */
const createJournalSchema = Joi.object({
  raw_text: Joi.string().min(10).required().messages({
    "string.min": "Le texte doit contenir au moins 10 caractères",
    "any.required": "Le texte est requis",
  }),
  journal_date: Joi.date().optional(),
});

/**
 * Schema de validation pour mettre à jour un journal
 */
const updateJournalSchema = Joi.object({
  raw_text: Joi.string().min(10).optional(),
  journal_date: Joi.date().optional(),
});

/**
 * Schema de validation pour créer une tâche
 */
const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(500).required(),
  category: Joi.string()
    .valid("sport", "travail", "santé", "apprentissage", "social", "loisir", "autre")
    .optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("todo", "in_progress", "done").default("todo"),
  duration_minutes: Joi.number().integer().min(0).optional(),
  confidence: Joi.number().min(0).max(1).optional(),
  note: Joi.string().max(1000).optional(),
});

/**
 * Schema de validation pour mettre à jour une tâche
 */
const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(500).optional(),
  category: Joi.string()
    .valid("sport", "travail", "santé", "apprentissage", "social", "loisir", "autre")
    .optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("todo", "in_progress", "done").optional(),
  duration_minutes: Joi.number().integer().min(0).optional(),
  confidence: Joi.number().min(0).max(1).optional(),
  note: Joi.string().max(1000).optional(),
});

/**
 * Middleware de validation générique
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    req.body = value;
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  createJournalSchema,
  updateJournalSchema,
  createTaskSchema,
  updateTaskSchema,
  validate,
};

