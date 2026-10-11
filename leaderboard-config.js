/**
 * =========================================================================
 * LEADERBOARD CONFIG & CLIENT API (leaderboard-config.js)
 * =========================================================================
 * 
 * Mengendalikan komunikasi API Leaderboard (Top 10 dan 20 Murid Terkini)
 * serta sistem sandaran automatik (LocalStorage Fallback).
 */

const LEADERBOARD_CONFIG = {
  STORAGE_KEY_TOP10: "misi_alkafirun_top10",
  STORAGE_KEY_RECENT: "misi_alkafirun_recent",
  MAX_RECENT_ITEMS: 20,
  MAX_TOP10_ITEMS: 10,

  // Data lalai untuk mod demo / permulaan
  DEFAULT_RECENT: [
    { playerName: "Aiman Hafiz", score: 1000, timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    { playerName: "Nurul Sarah", score: 1000, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { playerName: "Muhammad Faris", score: 900, timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
    { playerName: "Danish Irfan", score: 900, timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { playerName: "Farisya Iman", score: 800, timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
    { playerName: "Adam Wafiy", score: 800, timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString() }
  ],

  DEFAULT_TOP10: [
    { rank: 1, playerName: "Aiman Hafiz", score: 1000, accuracy: "100%", date: "Hari Ini" },
    { rank: 2, playerName: "Nurul Sarah", score: 1000, accuracy: "100%", date: "Hari Ini" },
    { rank: 3, playerName: "Muhammad Faris", score: 900, accuracy: "90%", date: "Hari Ini" },
    { rank: 4, playerName: "Danish Irfan", score: 900, accuracy: "90%", date: "Hari Ini" },
    { rank: 5, playerName: "Farisya Iman", score: 800, accuracy: "80%", date: "Hari Ini" },
    { rank: 6, playerName: "Adam Wafiy", score: 800, accuracy: "80%", date: "Semalam" }
  ]
};

/**
 * Mendapatkan rekod Top 10 dari storan lokal
 */
function getLocalTop10() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_CONFIG.STORAGE_KEY_TOP10);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Gagal membaca Top 10 dari localStorage:", e);
  }
  return [...LEADERBOARD_CONFIG.DEFAULT_TOP10];
}

/**
 * Menyimpan rekod Top 10 ke storan lokal
 */
function setLocalTop10(items) {
  try {
    localStorage.setItem(LEADERBOARD_CONFIG.STORAGE_KEY_TOP10, JSON.stringify(items.slice(0, LEADERBOARD_CONFIG.MAX_TOP10_ITEMS)));
  } catch (e) {
    console.warn("Gagal menyimpan Top 10 ke localStorage:", e);
  }
}

/**
 * Mendapatkan rekod 20 penyertaan terkini dari storan lokal
 */
function getLocalRecent() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_CONFIG.STORAGE_KEY_RECENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Gagal membaca Recent dari localStorage:", e);
  }
  return [...LEADERBOARD_CONFIG.DEFAULT_RECENT];
}

/**
 * Menyimpan rekod penyertaan terkini baharu ke storan lokal (maksimum 20, unshift ke depan)
 */
function addLocalRecentRecord(newRecord) {
  try {
    let recent = getLocalRecent();
    // Elakkan duplikasi sesi jika ada sessionId
    if (newRecord.sessionId) {
      recent = recent.filter(r => r.sessionId !== newRecord.sessionId);
    }
    // Letak rekod terbaharu di paling hadapan
    recent.unshift({
      playerName: newRecord.playerName || newRecord.name,
      score: newRecord.score,
      timestamp: newRecord.timestamp || new Date().toISOString(),
      sessionId: newRecord.sessionId || ("local_" + Date.now())
    });
    // Hadkan kepada 20 rekod terkini sahaja
    recent = recent.slice(0, LEADERBOARD_CONFIG.MAX_RECENT_ITEMS);
    localStorage.setItem(LEADERBOARD_CONFIG.STORAGE_KEY_RECENT, JSON.stringify(recent));

    // Kemas kini juga Top 10 lokal jika markah ini melayakkan pemain
    updateLocalTop10WithNewScore(newRecord);
    return recent;
  } catch (e) {
    console.warn("Gagal menambah rekod ke localStorage:", e);
    return [];
  }
}

/**
 * Mengemas kini Top 10 tempatan dengan skor baharu
 */
function updateLocalTop10WithNewScore(newRecord) {
  try {
    let top10 = getLocalTop10();
    const name = String(newRecord.playerName || newRecord.name || "").trim();
    if (!name) return;

    const normName = name.toLowerCase();
    const existingIndex = top10.findIndex(item => item.playerName.trim().toLowerCase() === normName);

    if (existingIndex >= 0) {
      if (newRecord.score > top10[existingIndex].score) {
        top10[existingIndex].score = newRecord.score;
        top10[existingIndex].date = "Hari Ini";
      }
    } else {
      top10.push({
        playerName: name,
        score: newRecord.score,
        accuracy: Math.round(((newRecord.correctAnswers || (newRecord.score / 100)) / 10) * 100) + "%",
        date: "Hari Ini"
      });
    }

    // Susun semula: markah tinggi di atas
    top10.sort((a, b) => b.score - a.score);
    top10 = top10.slice(0, LEADERBOARD_CONFIG.MAX_TOP10_ITEMS).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setLocalTop10(top10);
  } catch (e) {
    console.warn("Ralat kemaskini Top 10 lokal:", e);
  }
}

/**
 * PANGGILAN TUNGGAL API: Mengambil data Top 10 dan 20 Murid Terkini
 * Lengkap dengan Cache Buster dan Sandaran (Fallback) ke LocalStorage
 */
async function fetchTop10Leaderboard() {
  const isDemo = typeof CONFIG !== "undefined" && typeof CONFIG.isDemoMode === "function" ? CONFIG.isDemoMode() : true;
  const apiUrl = typeof CONFIG !== "undefined" ? CONFIG.API_URL : "";

  // Jika URL belum dipasang (Mod Demo) -> Pulangkan terus dari storan lokal
  if (isDemo || !apiUrl) {
    return {
      success: true,
      isDemo: true,
      records: getLocalTop10(),
      recent: getLocalRecent()
    };
  }

  // Jika ada URL API Google Apps Script -> Ambil data langsung dari Google Sheets
  try {
    const separator = apiUrl.includes("?") ? "&" : "?";
    // Cache buster _t=Date.now() untuk mengelakkan cache pelayar web
    const requestUrl = `${apiUrl}${separator}action=get&_t=${Date.now()}`;

    const res = await fetch(requestUrl, {
      method: "GET",
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const json = await res.json();

    // Terima format respons: sama ada { records, recent } atau { data: { leaderboard, recent } }
    let records = [];
    let recent = [];

    if (json.records && Array.isArray(json.records)) {
      records = json.records;
    } else if (json.data && Array.isArray(json.data.leaderboard)) {
      records = json.data.leaderboard;
    }

    if (json.recent && Array.isArray(json.recent)) {
      recent = json.recent;
    } else if (json.data && Array.isArray(json.data.recent)) {
      recent = json.data.recent;
    }

    // Jika berjaya dapat data sebenar, kemas kini cache storan lokal
    if (records.length > 0) setLocalTop10(records);
    if (recent.length > 0) {
      try {
        localStorage.setItem(LEADERBOARD_CONFIG.STORAGE_KEY_RECENT, JSON.stringify(recent.slice(0, 20)));
      } catch (e) {}
    }

    return {
      success: true,
      isDemo: false,
      records: records,
      recent: recent
    };

  } catch (err) {
    console.warn("API Google Sheets gagal dihubungi. Menggunakan storan tempatan (offline fallback):", err);
    // Sandaran automatik jika luar talian / gangguan rangkaian
    return {
      success: true,
      isFallback: true,
      error: err.message,
      records: getLocalTop10(),
      recent: getLocalRecent()
    };
  }
}

// Eksport jika dalam persekitaran module
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LEADERBOARD_CONFIG,
    fetchTop10Leaderboard,
    addLocalRecentRecord,
    getLocalTop10,
    getLocalRecent
  };
}
