// ========================================
// services/keepAliveService.js
// ========================================
import axios from "axios";

const API_URL = "https://api-hydro-nex.onrender.com/api";

class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.intervalDuration = 5 * 60 * 1000; // 5 minutes par défaut
    this.lastPingTime = null;
    this.failedAttempts = 0;
    this.maxFailedAttempts = 3;
  }

  /**
   * Envoie un ping au serveur pour le maintenir éveillé
   */
  async ping() {
    try {
      const startTime = Date.now();
      
      // Endpoint le plus léger possible (health check ou similar)
      // Vous pouvez utiliser n'importe quel endpoint GET léger
      const response = await axios.get(`${API_URL}/devices`, {
        timeout: 10000, // 10 secondes max
        params: { limit: 1 } // Récupère juste 1 device pour alléger
      });

      const responseTime = Date.now() - startTime;
      this.lastPingTime = new Date();
      this.failedAttempts = 0;

      console.log(`✅ Keep-alive ping successful (${responseTime}ms) at ${this.lastPingTime.toLocaleTimeString()}`);
      
      return {
        success: true,
        responseTime,
        timestamp: this.lastPingTime
      };

    } catch (error) {
      this.failedAttempts++;
      console.warn(`⚠️ Keep-alive ping failed (attempt ${this.failedAttempts}/${this.maxFailedAttempts}):`, error.message);

      // Si trop d'échecs, on arrête temporairement
      if (this.failedAttempts >= this.maxFailedAttempts) {
        console.error("❌ Too many failed attempts. Pausing keep-alive for 15 minutes.");
        this.pause();
        
        // Redémarre après 15 minutes
        setTimeout(() => {
          console.log("🔄 Resuming keep-alive service...");
          this.start();
        }, 15 * 60 * 1000);
      }

      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Démarre le service de keep-alive
   * @param {number} intervalMinutes - Intervalle en minutes (défaut: 5)
   */
  start(intervalMinutes = 5) {
    if (this.isRunning) {
      console.log("ℹ️ Keep-alive service is already running");
      return;
    }

    this.intervalDuration = intervalMinutes * 60 * 1000;
    this.isRunning = true;
    this.failedAttempts = 0;

    console.log(`🚀 Keep-alive service started (interval: ${intervalMinutes} minutes)`);

    // Premier ping immédiat
    this.ping();

    // Pings réguliers
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.intervalDuration);
  }

  /**
   * Met en pause le service
   */
  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("⏸️ Keep-alive service paused");
  }

  /**
   * Arrête complètement le service
   */
  stop() {
    this.pause();
    this.lastPingTime = null;
    this.failedAttempts = 0;
    console.log("🛑 Keep-alive service stopped");
  }

  /**
   * Récupère le statut du service
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMinutes: this.intervalDuration / (60 * 1000),
      lastPingTime: this.lastPingTime,
      failedAttempts: this.failedAttempts
    };
  }
}

// Instance singleton
const keepAliveService = new KeepAliveService();

export default keepAliveService;