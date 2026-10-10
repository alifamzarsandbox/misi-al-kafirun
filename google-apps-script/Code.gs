/**
 * =========================================================================
 * MISI AL-KAFIRUN: CABARAN HAFAZAN TAHUN 3 - BACKEND LEADERBOARD API
 * =========================================================================
 * 
 * Kod ini diletakkan di Google Apps Script (https://script.google.com).
 * Menghubungkan Google Sheets sebagai pangkalan data dengan frontend di GitHub Pages.
 * 
 * Struktur Helaian (Sheet) "Leaderboard":
 * Lajur 1: Timestamp
 * Lajur 2: PlayerName
 * Lajur 3: Score
 * Lajur 4: CorrectAnswers
 * Lajur 5: TotalQuestions
 * Lajur 6: Accuracy
 */

// Konfigurasi Helaian & Peraturan
const SHEET_NAME = "Leaderboard";
const MAX_LEADERBOARD_ITEMS = 10;
const MAX_SCORE = 1000;
const MIN_SCORE = 0;
const TOTAL_QUESTIONS_EXPECTED = 10;

/**
 * Mendapatkan objek Spreadsheet aktif.
 * Jika script ini dicipta melalui Google Sheet (Extensions > Apps Script), ia akan automatik mengesan helaian aktif.
 * Jika script dicipta secara berasingan (standalone), gantikan ID di bawah.
 */
function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (err) {
    // Abaikan jika bukan container-bound
  }
  
  // Jika script berdiri sendiri (standalone), masukkan ID Spreadsheet di sini:
  const SPREADSHEET_ID = ""; // Cth: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  
  throw new Error("Spreadsheet tidak ditemui. Pastikan script dibuka melalui Extensions > Apps Script pada Google Sheet anda, atau tetapkan SPREADSHEET_ID.");
}

/**
 * Fungsi Pembantu: Mendapatkan atau mencipta helaian 'Leaderboard'
 */
function getOrCreateSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Masukkan tajuk lajur
    const headers = ["Timestamp", "PlayerName", "Score", "CorrectAnswers", "TotalQuestions", "Accuracy"];
    sheet.appendRow(headers);
    
    // Format tajuk lajur
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2455A4");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

/**
 * ENDPOINT GET (doGet): Mengambil senarai Top 10 Leaderboard
 * Boleh diakses terus melalui pelayar web atau permintaan fetch GET dari frontend.
 */
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Jika hanya ada baris tajuk atau kosong
    if (!data || data.length <= 1) {
      return createJsonResponse({
        success: true,
        data: {
          leaderboard: [],
          totalRecords: 0
        },
        message: "Belum ada rekod permainan tersimpan."
      });
    }

    // Ekstrak baris rekod (abaikan header pada indeks 0)
    const rows = data.slice(1);
    const records = [];

    rows.forEach(function(row, index) {
      const rawTimestamp = row[0];
      const rawName = String(row[1] || "").trim();
      const rawScore = Number(row[2]);
      const rawCorrect = Number(row[3]);
      const rawTotal = Number(row[4]);
      const rawAccuracy = String(row[5] || "");

      if (rawName && !isNaN(rawScore)) {
        let dateDisplay = "";
        try {
          if (rawTimestamp instanceof Date) {
            dateDisplay = Utilities.formatDate(rawTimestamp, Session.getScriptTimeZone() || "GMT+8", "dd/MM/yyyy, hh:mm a");
          } else if (rawTimestamp) {
            dateDisplay = String(rawTimestamp).substring(0, 19);
          }
        } catch (eDate) {
          dateDisplay = String(rawTimestamp);
        }

        records.push({
          playerName: rawName,
          score: rawScore,
          correctAnswers: isNaN(rawCorrect) ? Math.round(rawScore / 100) : rawCorrect,
          totalQuestions: isNaN(rawTotal) ? TOTAL_QUESTIONS_EXPECTED : rawTotal,
          accuracy: rawAccuracy || Math.round((rawScore / MAX_SCORE) * 100) + "%",
          date: dateDisplay,
          rawTimestamp: rawTimestamp instanceof Date ? rawTimestamp.getTime() : index
        });
      }
    });

    // DASAR SKOR TERBAIK: Satu pemain hanya disenaraikan sekali dengan markah tertingginya
    // Nama dinormalkan (huruf kecil & tanpa ruang berlebihan) untuk perbandingan
    const bestByPlayer = new Map();

    records.forEach(function(rec) {
      const normalizedKey = rec.playerName.toLowerCase().replace(/\s+/g, " ");
      if (!bestByPlayer.has(normalizedKey)) {
        bestByPlayer.set(normalizedKey, rec);
      } else {
        const existing = bestByPlayer.get(normalizedKey);
        if (rec.score > existing.score) {
          bestByPlayer.set(normalizedKey, rec);
        } else if (rec.score === existing.score && rec.rawTimestamp < existing.rawTimestamp) {
          // Jika markah sama, simpan rekod yang lebih awal
          bestByPlayer.set(normalizedKey, rec);
        }
      }
    });

    const uniqueLeaderboard = Array.from(bestByPlayer.values());

    // Susun data:
    // 1. Skor tertinggi (descending)
    // 2. Tarikh terawal jika skor sama (ascending)
    uniqueLeaderboard.sort(function(a, b) {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.rawTimestamp - b.rawTimestamp;
    });

    // Ambil Top 10 sahaja
    const top10 = uniqueLeaderboard.slice(0, MAX_LEADERBOARD_ITEMS).map(function(item, idx) {
      return {
        rank: idx + 1,
        playerName: item.playerName,
        score: item.score,
        correctAnswers: item.correctAnswers,
        totalQuestions: item.totalQuestions,
        accuracy: item.accuracy,
        date: item.date
      };
    });

    return createJsonResponse({
      success: true,
      data: {
        leaderboard: top10,
        totalPlayers: uniqueLeaderboard.length,
        totalPlays: records.length
      }
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || "Ralat semasa mengambil data leaderboard."
    });
  }
}

/**
 * ENDPOINT POST (doPost): Menyimpan skor baharu pemain
 * Dilindungi oleh LockService untuk mengelakkan percanggahan penulisan serentak.
 */
function doPost(e) {
  // Dapatkan kunci skrip dengan had masa 30 saat
  const lock = LockService.getScriptLock();
  try {
    const hasLock = lock.tryLock(30000);
    if (!hasLock) {
      return createJsonResponse({
        success: false,
        error: "Pelayan sedang sibuk. Sila cuba hantar skor sekali lagi."
      });
    }

    // Ekstrak parameter sama ada daripada postData.contents (JSON / text) atau parameter form
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Jika format bukan JSON tulen, cuba baca sebagai parameter URL
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    // Validasi input di backend
    const rawName = String(payload.playerName || "").trim();
    if (!rawName) {
      return createJsonResponse({
        success: false,
        error: "Nama pemain wajib diisi."
      });
    }

    if (rawName.length < 2 || rawName.length > 25) {
      return createJsonResponse({
        success: false,
        error: "Panjang nama pemain mestilah antara 2 hingga 25 aksara."
      });
    }

    const score = parseInt(payload.score, 10);
    if (isNaN(score) || score < MIN_SCORE || score > MAX_SCORE) {
      return createJsonResponse({
        success: false,
        error: "Skor tidak sah. Nilai mesti antara 0 dan " + MAX_SCORE + "."
      });
    }

    let correctAnswers = parseInt(payload.correctAnswers, 10);
    if (isNaN(correctAnswers) || correctAnswers < 0 || correctAnswers > TOTAL_QUESTIONS_EXPECTED) {
      correctAnswers = Math.round(score / 100);
    }

    const totalQuestions = TOTAL_QUESTIONS_EXPECTED;
    // Kira accuracy di backend secara rasmi
    const calculatedAccuracy = Math.round((correctAnswers / totalQuestions) * 100) + "%";

    const timestamp = new Date();

    // Buka helaian dan simpan rekod
    const sheet = getOrCreateSheet();
    sheet.appendRow([
      timestamp,
      rawName,
      score,
      correctAnswers,
      totalQuestions,
      calculatedAccuracy
    ]);

    return createJsonResponse({
      success: true,
      message: "Keputusan berjaya disimpan!",
      data: {
        playerName: rawName,
        score: score,
        correctAnswers: correctAnswers,
        accuracy: calculatedAccuracy,
        timestamp: timestamp.toISOString()
      }
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || "Ralat sistem backend semasa menyimpan skor."
    });
  } finally {
    // Sentiasa lepaskan lock setelah selesai
    lock.releaseLock();
  }
}

/**
 * Fungsi Pembantu: Menghasilkan Respons JSON dengan Pengepala CORS yang serasi
 */
function createJsonResponse(data) {
  const jsonString = JSON.stringify(data);
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi Ujian & Permulaan (Boleh dijalankan terus dari editor Apps Script)
 */
function setup() {
  const sheet = getOrCreateSheet();
  Logger.log("Helaian 'Leaderboard' sedia digunakan pada: " + sheet.getName());
}

/**
 * Fungsi Ujian: Memasukkan beberapa data contoh untuk semakan awal
 */
function insertTestData() {
  const sheet = getOrCreateSheet();
  const sample = [
    [new Date(), "Aiman", 1000, 10, 10, "100%"],
    [new Date(), "Nurul Sarah", 900, 9, 10, "90%"],
    [new Date(), "Hafiz", 800, 8, 10, "80%"],
    [new Date(), "Farisya", 1000, 10, 10, "100%"],
    [new Date(), "Danish", 700, 7, 10, "70%"]
  ];
  sample.forEach(function(row) {
    sheet.appendRow(row);
  });
  Logger.log("Data contoh berjaya dimasukkan ke Google Sheets!");
}
