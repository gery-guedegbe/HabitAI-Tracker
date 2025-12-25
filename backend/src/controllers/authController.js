const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/email");
const authService = require("../services/authService");
const userService = require("../services/userService");

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // validation minimale (controller)
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await authService.register({ username, email, password });

    // renvoyer sans password
    res.status(201).json({ user });
  } catch (error) {
    // Propager status si définit
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  try {
    const user = await userService.getUser(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // on ne renvoie pas les infos sensibles
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function changePassword(req, res) {
  try {
    console.log("Req Body: ", req.body);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await userService.getUser(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userService.updatePassword(user.id, hashedPassword);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userService.findUserByEmail(email);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Génération token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await userService.savePasswordResetToken(user.id, hashedToken, expires);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Envoi email
    if (sendEmail) {
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        html: `
        <h2>Réinitialisation de votre mot de passe</h2>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Ce lien expire dans 15 minutes.</p>
        `,
      });
    }

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Missing fields" });

    // hashed version
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userService.findUserByResetToken(hashedToken);

    if (!user || user.reset_token_expires < new Date()) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userService.resetPassword(user.id, hashedPassword);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  register,
  login,
  me,
  changePassword,
  forgotPassword,
  resetPassword,
};
