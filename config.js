/**
 * KONFIGURASI UTAMA: MISI AL-KAFIRUN
 * Semua tetapan utama dan URL API Google Apps Script diuruskan di sini.
 */

const CONFIG = {
  // Tajuk & Info Permainan
  GAME_TITLE: "MISI AL-KAFIRUN",
  SUBTITLE: "Cabaran Hafazan Tahun 3",
  SURAH_NAME: "Surah Al-Kafirun (109)",
  
  // Peraturan Pemarkahan & Soalan
  TOTAL_QUESTIONS: 10,              // Jumlah soalan bagi setiap sesi permainan
  POINTS_PER_CORRECT_ANSWER: 100,   // Markah untuk setiap jawapan betul
  MAX_SCORE: 1000,                  // Jumlah skor maksimum (10 x 100)
  LEADERBOARD_LIMIT: 10,            // Bilangan kedudukan teratas untuk dipaparkan

  // URL Web App Google Apps Script
  API_URL: "https://script.google.com/macros/s/AKfycbwHxajH30k5sgLBeMWZwwJdytsy-xbEQItJKSTAV7m-CQPud2T2oGTCOB7lr7Jb1b2Rbw/exec",

  // Tetapan Audio & Efek
  SOUND_ENABLED_DEFAULT: true,

  // Semakan mod demo / placeholder
  isDemoMode: function() {
    return !this.API_URL || 
           this.API_URL === "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE" ||
           this.API_URL.trim() === "";
  }
};

// Pastikan boleh diakses di Node (jika diuji secara lokal)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG };
}
