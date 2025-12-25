/**
 * Interface de base pour les providers de transcription
 * Tous les providers doivent implémenter cette interface
 */

class TranscriptionProvider {
  /**
   * Transcrit un buffer audio en texte
   * @param {Buffer} audioBuffer - Buffer du fichier audio
   * @param {Object} options - Options supplémentaires (langue, format, etc.)
   * @returns {Promise<string>} - Texte transcrit
   */
  async transcribe(audioBuffer, options = {}) {
    throw new Error("transcribe() must be implemented by subclass");
  }

  /**
   * Vérifie si le provider est configuré correctement
   * @returns {Promise<boolean>}
   */
  async isConfigured() {
    throw new Error("isConfigured() must be implemented by subclass");
  }

  /**
   * Retourne le nom du provider
   * @returns {string}
   */
  getName() {
    throw new Error("getName() must be implemented by subclass");
  }
}

module.exports = TranscriptionProvider;

