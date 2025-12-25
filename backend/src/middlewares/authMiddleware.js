const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const userModel = require("../models/userModel");

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    // Vérification JWT CORRECTE
    const decoded = jwt.verify(token, JWT_SECRET);

    // Vérifie que tu utilises le bon champ (le JWT contient 'id' depuis authService)
    const user = await userModel.findUserById(decoded.id);

    if (!user || user.is_active === false) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: user.id, role: user.role };

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: `Not authenticated` });

  if (req.user.role !== "admin")
    return res.status(403).json({ message: `Forbidden` });
  next();
}

module.exports = { authMiddleware, adminOnly };
