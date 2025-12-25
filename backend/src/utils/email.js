const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie un email via Resend
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendEmail({ to, subject, html }) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log("📧 Email envoyé :", data);
    return data;
  } catch (err) {
    console.error("❌ Erreur envoi email:", err);
    throw new Error("Email could not be sent");
  }
}

module.exports = { sendEmail };
