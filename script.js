/**
 * =========================================================================
 * MISI AL-KAFIRUN: CABARAN HAFAZAN TAHUN 3 - CLIENT GAME LOGIC
 * =========================================================================
 * 
 * Pengendali aliran permainan, pengacakan soalan, pemarkahan,
 * kesan audio (Web Audio API), animasi, dan integrasi Google Apps Script API.
 */

// Pastikan konfigurasi dan bank soalan tersedia
if (typeof CONFIG === "undefined") {
  console.error("Fail config.js tidak ditemui! Memuatkan konfigurasi lalai.");
  window.CONFIG = {
    GAME_TITLE: "MISI AL-KAFIRUN",
    TOTAL_QUESTIONS: 10,
    POINTS_PER_CORRECT_ANSWER: 100,
    MAX_SCORE: 1000,
    LEADERBOARD_LIMIT: 10,
    API_URL: "",
    isDemoMode: () => true
  };
}

if (typeof QUESTION_BANK === "undefined" || !Array.isArray(QUESTION_BANK)) {
  console.error("Fail questions.js tidak ditemui atau bank soalan kosong!");
  window.QUESTION_BANK = [];
}

/* =========================================================================
   1. SISTEM AUDIO SINTESIS (WEB AUDIO API - ZERO EXTERNAL ASSET DEPENDENCY)
   ========================================================================= */
class SoundEffects {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem("misi_alkafirun_sound") !== "false";
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("misi_alkafirun_sound", this.enabled ? "true" : "false");
    return this.enabled;
  }

  playTone(freq, duration, type = "sine", gainVal = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio tidak disokong atau disekat oleh pelayar
    }
  }

  playClick() {
    this.playTone(600, 0.08, "triangle", 0.08);
  }

  playCorrect() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      // Arpeggio ceria (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.25, "sine", 0.12);
        }, i * 70);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      // Bunyi buzz lembut (Eb3, C3)
      this.playTone(277.18, 0.2, "sawtooth", 0.08);
      setTimeout(() => {
        this.playTone(220, 0.3, "sawtooth", 0.08);
      }, 120);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.4, "triangle", 0.15);
        }, i * 110);
      });
    } catch (e) {}
  }
}

const sound = new SoundEffects();

/* =========================================================================
   2. SISTEM PARTIKEL CELEBRATION (CONFETTI CANVAS)
   ========================================================================= */
class ConfettiManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.animationId = null;
    this.colors = ["#63C7F2", "#2455A4", "#FFD166", "#69D391", "#FF6B6B", "#A855F7"];
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 60) {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: this.canvas.height / 3 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // Gravity
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

let confetti;

/* =========================================================================
   3. PENGURUSAN STATUS PERMAINAN (GAME STATE)
   ========================================================================= */
const gameState = {
  playerName: "",
  playerAvatar: "🌟",
  currentQuestions: [],
  currentQuestionIndex: 0,
  score: 0,
  correctAnswersCount: 0,
  answered: false,
  isSubmittingScore: false,
  scoreSubmittedSuccessfully: false
};

/* =========================================================================
   4. NAVIGASI SKRIN
   ========================================================================= */
function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* =========================================================================
   5. LOGIK PEMILIHAN DAN PENGACAKAN SOALAN
   ========================================================================= */
/**
 * Fisher-Yates Shuffle untuk mengacak susunan array
 */
function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Menyediakan 10 soalan rawak yang seimbang mengikut 3 kategori
 */
function generateSessionQuestions() {
  if (!QUESTION_BANK || QUESTION_BANK.length === 0) {
    console.error("Bank soalan kosong!");
    return [];
  }

  // Asingkan mengikut kategori
  const susunList = QUESTION_BANK.filter((q) => q.category === "susun");
  const sambungList = QUESTION_BANK.filter((q) => q.category === "sambung");
  const fahamiList = QUESTION_BANK.filter((q) => q.category === "fahami");

  // Rawakkan setiap kategori
  const shuffledSusun = shuffleArray(susunList);
  const shuffledSambung = shuffleArray(sambungList);
  const shuffledFahami = shuffleArray(fahamiList);

  // Ambil soalan seimbang: 3 Susun, 3 Sambung, 3 Fahami, dan 1 baki rawak (Jumlah: 10)
  const selected = [];
  selected.push(...shuffledSusun.slice(0, 3));
  selected.push(...shuffledSambung.slice(0, 3));
  selected.push(...shuffledFahami.slice(0, 3));

  // Ambil baki 1 soalan dari baki bank yang belum terpilih
  const selectedIds = new Set(selected.map((q) => q.id));
  const remaining = QUESTION_BANK.filter((q) => !selectedIds.has(q.id));
  if (remaining.length > 0) {
    const randomRemaining = shuffleArray(remaining)[0];
    selected.push(randomRemaining);
  }

  // Rawakkan semula susunan akhir 10 soalan ini supaya kategori bercampur santai
  const finalSession = shuffleArray(selected).map((q) => {
    // Acak pilihan jawapan bagi setiap soalan
    return {
      ...q,
      shuffledOptions: shuffleArray(q.options)
    };
  });

  return finalSession.slice(0, CONFIG.TOTAL_QUESTIONS);
}

/* =========================================================================
   6. ALIRAN PERMAINAN KUIZ (QUIZ ENGINE)
   ========================================================================= */
function startNewGame() {
  gameState.score = 0;
  gameState.correctAnswersCount = 0;
  gameState.currentQuestionIndex = 0;
  gameState.answered = false;
  gameState.isSubmittingScore = false;
  gameState.scoreSubmittedSuccessfully = false;

  gameState.currentQuestions = generateSessionQuestions();

  if (gameState.currentQuestions.length === 0) {
    alert("Ralat memuatkan soalan. Sila muat semula halaman.");
    return;
  }

  renderQuestion();
  showScreen("screen-quiz");
}

function renderQuestion() {
  gameState.answered = false;
  const q = gameState.currentQuestions[gameState.currentQuestionIndex];
  if (!q) return;

  // Kemas kini nombor soalan & progress bar
  const currentNum = gameState.currentQuestionIndex + 1;
  const totalNum = CONFIG.TOTAL_QUESTIONS;
  const progressPct = (currentNum / totalNum) * 100;

  document.getElementById("quiz-question-number").textContent = `SOALAN ${currentNum}/${totalNum}`;
  document.getElementById("quiz-live-score").textContent = gameState.score;
  document.getElementById("quiz-progress-fill").style.width = `${progressPct}%`;

  // Kategori Badge
  const catPill = document.getElementById("quiz-category-pill");
  catPill.textContent = q.categoryName;
  catPill.className = `category-pill ${q.category}`;

  // Teks soalan
  document.getElementById("quiz-question-text").textContent = q.question;

  // Bekas Pilihan Jawapan (4 pilihan)
  const optionsContainer = document.getElementById("quiz-options-container");
  optionsContainer.innerHTML = "";

  const optionLetters = ["A", "B", "C", "D"];

  q.shuffledOptions.forEach((optText, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-option";
    btn.setAttribute("data-option", optText);
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");

    // Semak sama ada teks ialah tulisan Arab (Unicode Range Arabic)
    const isArabic = /[\u0600-\u06FF]/.test(optText);

    btn.innerHTML = `
      <span class="option-badge">${optionLetters[index]}</span>
      <span class="${isArabic ? "option-arabic" : "option-text"}">${optText}</span>
    `;

    btn.addEventListener("click", () => handleAnswerSelection(optText, btn));
    optionsContainer.appendChild(btn);
  });

  // Sembunyikan kad maklum balas sehingga jawapan dipilih
  const feedbackCard = document.getElementById("quiz-feedback-card");
  feedbackCard.classList.add("hidden");
  feedbackCard.classList.remove("correct", "wrong");
}

function handleAnswerSelection(selectedOption, clickedButton) {
  if (gameState.answered) return;
  gameState.answered = true;

  const currentQ = gameState.currentQuestions[gameState.currentQuestionIndex];
  const isCorrect = selectedOption.trim() === currentQ.correctAnswer.trim();

  // Kunci semua pilihan jawapan
  const allOptionBtns = document.querySelectorAll("#quiz-options-container .btn-option");
  allOptionBtns.forEach((btn) => {
    btn.disabled = true;
    const btnVal = btn.getAttribute("data-option").trim();
    if (btnVal === currentQ.correctAnswer.trim()) {
      btn.classList.add("correct");
    }
  });

  const feedbackCard = document.getElementById("quiz-feedback-card");
  const feedbackIcon = document.getElementById("quiz-feedback-icon");
  const feedbackTitle = document.getElementById("quiz-feedback-title");
  const feedbackExp = document.getElementById("quiz-feedback-explanation");

  if (isCorrect) {
    // Betul
    sound.playCorrect();
    clickedButton.classList.add("correct");
    clickedButton.setAttribute("aria-checked", "true");

    gameState.score += CONFIG.POINTS_PER_CORRECT_ANSWER;
    gameState.correctAnswersCount += 1;

    // Kemas kini paparan skor langsung
    document.getElementById("quiz-live-score").textContent = gameState.score;

    feedbackCard.className = "feedback-card correct";
    feedbackIcon.textContent = "🎉";
    feedbackTitle.textContent = `Tahniah! Jawapan Anda Betul! (+${CONFIG.POINTS_PER_CORRECT_ANSWER} Mata)`;

    // Partikel ceria ringkas
    if (confetti) {
      confetti.burst(35);
    }
  } else {
    // Salah
    sound.playWrong();
    clickedButton.classList.add("wrong");
    clickedButton.setAttribute("aria-checked", "true");

    feedbackCard.className = "feedback-card cutting-edge wrong";
    feedbackIcon.textContent = "💡";
    feedbackTitle.textContent = "Cuba Lagi Lain Kali!";
  }

  // Tunjukkan penerangan pembelajaran
  feedbackExp.textContent = currentQ.explanation || "Teruskan menghafaz dan memahami Surah Al-Kafirun!";
  feedbackCard.classList.remove("hidden");
}

function handleNextQuestion() {
  sound.playClick();
  if (gameState.currentQuestionIndex < CONFIG.TOTAL_QUESTIONS - 1) {
    gameState.currentQuestionIndex += 1;
    renderQuestion();
  } else {
    showResultScreen();
  }
}

/* =========================================================
   7. SKRIN KEPUTUSAN & PENGHANTARAN SKOR (RESULT & SYNC)
   ========================================================= */
function showResultScreen() {
  sound.playFanfare();
  if (confetti) {
    confetti.burst(90);
  }

  const score = gameState.score;
  const correct = gameState.correctAnswersCount;
  const total = CONFIG.TOTAL_QUESTIONS;
  const accuracyPct = Math.round((correct / total) * 100);

  // Paparkan data wira
  document.getElementById("result-display-name").textContent = `${gameState.playerAvatar} ${gameState.playerName}`;
  document.getElementById("result-total-score").textContent = score;
  document.getElementById("result-correct-count").textContent = `${correct} / ${total}`;
  document.getElementById("result-accuracy-pct").textContent = `${accuracyPct}%`;
  document.getElementById("result-gained-pts").textContent = score;

  // Bintang ganjaran & Kata galakan
  const starsContainer = document.getElementById("result-stars-box");
  const headlineEl = document.getElementById("result-headline-text");
  const subtextEl = document.getElementById("result-subtext-text");

  const stars = starsContainer.querySelectorAll(".result-star");
  stars.forEach((s) => s.classList.remove("active"));

  if (score >= 900) {
    // 900 - 1000: Juara (3 Bintang)
    stars[0].classList.add("active");
    stars[1].classList.add("active");
    stars[2].classList.add("active");
    headlineEl.textContent = "Hebat! Anda Juara Hafazan!";
    subtextEl.textContent = "Masyallah! Anda telah menguasai ayat dan maksud Surah Al-Kafirun dengan amat cemerlang!";
  } else if (score >= 700) {
    // 700 - 800: Bagus (2 Bintang)
    stars[0].classList.add("active");
    stars[1].classList.add("active");
    headlineEl.textContent = "Bagus! Teruskan Berlatih!";
    subtextEl.textContent = "Prestasi yang sangat membanggakan! Ulang kaji sedikit lagi untuk mencapai markah penuh 1,000.";
  } else if (score >= 400) {
    // 400 - 600: Usaha Baik (1 Bintang)
    stars[0].classList.add("active");
    headlineEl.textContent = "Usaha yang Baik! Cuba Lagi!";
    subtextEl.textContent = "Bagus kerana berusaha. Buka 'Rujukan Surah' di atas dan cuba main sekali lagi!";
  } else {
    // 0 - 300: Galakan Belajar
    headlineEl.textContent = "Jangan Putus Asa! Belajar dan Cuba Lagi!";
    subtextEl.textContent = "Hafazan perlukan latihan yang berulang kali. Anda pasti boleh melakukannya!";
  }

  showScreen("screen-result");

  // Hantar skor secara automatik ke Google Apps Script
  submitScoreToBackend();
}

/**
 * Menghantar skor ke Google Apps Script Web App
 */
async function submitScoreToBackend() {
  const syncStatus = document.getElementById("result-sync-status");
  const syncSpinner = document.getElementById("sync-spinner");
  const syncText = document.getElementById("sync-text");
  const retryBtn = document.getElementById("btn-retry-sync");

  // Jika sudah berjaya dihantar dalam sesi ini, elakkan hantaran berganda
  if (gameState.scoreSubmittedSuccessfully) {
    return;
  }

  // Semak jika dalam mod demo (URL API belum dikonfigurasi)
  if (CONFIG.isDemoMode()) {
    syncSpinner.classList.add("hidden");
    retryBtn.classList.add("hidden");
    syncStatus.className = "cloud-sync-status demo";
    syncText.textContent = "ℹ️ Mod Demo: Tetapkan URL API di config.js untuk menyimpan skor ke Google Sheets.";
    console.warn("[MISI AL-KAFIRUN] Mod Demo Aktif. Sila masukkan URL Google Apps Script Web App dalam config.js untuk membolehkan Leaderboard awan.");
    return;
  }

  // Sediakan penghantaran
  gameState.isSubmittingScore = true;
  syncSpinner.classList.remove("hidden");
  retryBtn.classList.add("hidden");
  syncStatus.className = "cloud-sync-status";
  syncText.textContent = "Menyimpan keputusan ke papan pendahulu Google Sheets...";

  const payload = {
    playerName: gameState.playerName,
    score: gameState.score,
    correctAnswers: gameState.correctAnswersCount,
    totalQuestions: CONFIG.TOTAL_QUESTIONS,
    accuracy: Math.round((gameState.correctAnswersCount / CONFIG.TOTAL_QUESTIONS) * 100) + "%"
  };

  try {
    /**
     * NOTA INTEGRASI CORS GOOGLE APPS SCRIPT:
     * Menggunakan fetch dengan Content-Type: text/plain menghalang browser daripada
     * menghantar permintaan pra-penerbangan OPTIONS (CORS preflight).
     * Google Apps Script akan menerima data dalam e.postData.contents,
     * dan mengembalikan status 302 redirect yang mengandungi CORS header yang sah.
     */
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok && response.type !== "opaque") {
      throw new Error(`Ralat pelayan: Status HTTP ${response.status}`);
    }

    let result = null;
    try {
      result = await response.json();
    } catch (parseErr) {
      // Jika respons bukan json boleh dibaca terus (cthnya redirect), kita sahkan respons status
    }

    if (result && result.success === false) {
      throw new Error(result.error || "Ralat semasa menyimpan di Google Sheets.");
    }

    // Berjaya disimpan
    gameState.scoreSubmittedSuccessfully = true;
    syncSpinner.classList.add("hidden");
    retryBtn.classList.add("hidden");
    syncStatus.className = "cloud-sync-status success";
    syncText.textContent = "✅ Keputusan berjaya disimpan ke Google Sheets!";

  } catch (err) {
    console.error("Gagal menyimpan keputusan ke Google Apps Script:", err);
    syncSpinner.classList.add("hidden");
    retryBtn.classList.remove("hidden");
    syncStatus.className = "cloud-sync-status error";
    syncText.textContent = "⚠️ Tidak dapat menyimpan ke Google Sheets.";
  } finally {
    gameState.isSubmittingScore = false;
  }
}

/* =========================================================
   8. SISTEM LEADERBOARD TOP 10
   ========================================================= */
async function loadLeaderboard() {
  showScreen("screen-leaderboard");

  const noticeBox = document.getElementById("leaderboard-notice");
  const loadingEl = document.getElementById("leaderboard-loading");
  const emptyEl = document.getElementById("leaderboard-empty");
  const errorEl = document.getElementById("leaderboard-error");
  const listContainer = document.getElementById("leaderboard-list-container");
  const rowsContainer = document.getElementById("leaderboard-rows");
  const errorDetail = document.getElementById("leaderboard-error-detail");

  // Reset paparan
  loadingEl.classList.remove("hidden");
  emptyEl.classList.add("hidden");
  errorEl.classList.add("hidden");
  listContainer.classList.add("hidden");
  noticeBox.classList.add("hidden");
  rowsContainer.innerHTML = "";

  // Jika Mod Demo (Belum pasang Web App URL)
  if (CONFIG.isDemoMode()) {
    loadingEl.classList.add("hidden");
    noticeBox.innerHTML = `
      <strong>💡 Makluman Pendidik / Penguji:</strong><br>
      URL Web App Google Apps Script belum dimasukkan dalam <code>config.js</code>. 
      Di bawah dipaparkan contoh format Leaderboard. Ikuti panduan dalam <code>google-apps-script/SETUP.md</code> untuk mengaktifkan sambungan Google Sheets sebenar!
    `;
    noticeBox.classList.remove("hidden");

    // Muatkan data demo
    renderLeaderboardRows([
      { rank: 1, playerName: "Aiman Hafiz", score: 1000, accuracy: "100%", date: "10/10/2026" },
      { rank: 2, playerName: "Nurul Sarah", score: 1000, accuracy: "100%", date: "10/10/2026" },
      { rank: 3, playerName: "Muhammad Faris", score: 900, accuracy: "90%", date: "10/10/2026" },
      { rank: 4, playerName: "Danish Irfan", score: 900, accuracy: "90%", date: "10/10/2026" },
      { rank: 5, playerName: "Farisya Iman", score: 800, accuracy: "80%", date: "10/10/2026" },
      { rank: 6, playerName: "Adam Wafiy", score: 800, accuracy: "80%", date: "10/10/2026" }
    ]);
    return;
  }

  // Muat data sebenar dari API Google Apps Script
  try {
    const fetchUrl = `${CONFIG.API_URL}${CONFIG.API_URL.includes("?") ? "&" : "?"}action=getLeaderboard&t=${Date.now()}`;
    const res = await fetch(fetchUrl, {
      method: "GET",
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const json = await res.json();
    loadingEl.classList.add("hidden");

    if (!json.success) {
      throw new Error(json.error || "Gagal memproses data leaderboard.");
    }

    const list = (json.data && json.data.leaderboard) ? json.data.leaderboard : [];

    if (list.length === 0) {
      emptyEl.classList.remove("hidden");
    } else {
      renderLeaderboardRows(list);
    }

  } catch (err) {
    console.error("Ralat mengambil data leaderboard:", err);
    loadingEl.classList.add("hidden");
    errorEl.classList.remove("hidden");
    errorDetail.textContent = `Punca: ${err.message || "Ralat sambungan rangkaian."}. Sila semak status Web App di Google Apps Script.`;
  }
}

function renderLeaderboardRows(items) {
  const listContainer = document.getElementById("leaderboard-list-container");
  const rowsContainer = document.getElementById("leaderboard-rows");
  rowsContainer.innerHTML = "";

  items.forEach((item, index) => {
    const row = document.createElement("div");
    const rank = item.rank || index + 1;
    let rankClass = "rank-other";
    let medalEmoji = "";

    if (rank === 1) {
      rankClass = "rank-1";
      medalEmoji = "👑 ";
    } else if (rank === 2) {
      rankClass = "rank-2";
      medalEmoji = "🥈 ";
    } else if (rank === 3) {
      rankClass = "rank-3";
      medalEmoji = "🥉 ";
    }

    // Sorot jika nama sama dengan nama pemain semasa
    const isCurrentUser = gameState.playerName && 
      item.playerName.trim().toLowerCase() === gameState.playerName.trim().toLowerCase();

    row.className = `leaderboard-row ${rankClass} ${isCurrentUser ? "highlight-me" : ""}`;

    row.innerHTML = `
      <div class="col-rank">
        <span class="rank-badge">${rank}</span>
      </div>
      <div class="player-name-cell">
        <span>${medalEmoji}${escapeHtml(item.playerName)}</span>
        ${isCurrentUser ? '<span class="badge-tag" style="font-size:0.7rem; padding:0.15rem 0.5rem;">SAYA</span>' : ""}
      </div>
      <div class="score-cell">
        <span>⭐ ${item.score}</span>
      </div>
      <div class="meta-cell">
        <div><strong>Ketepatan:</strong> ${escapeHtml(item.accuracy || "100%")}</div>
        <div>${escapeHtml(item.date || "-")}</div>
      </div>
    `;

    rowsContainer.appendChild(row);
  });

  listContainer.classList.remove("hidden");
}

function escapeHtml(str) {
  if (typeof str !== "string") return String(str || "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   9. MODAL RUJUKAN SURAH
   ========================================================= */
function setupSurahModal() {
  const modal = document.getElementById("modal-surah");
  const btnOpen = document.getElementById("btn-show-surah-modal");
  const btnHomeReview = document.getElementById("btn-home-review");
  const btnClose = document.getElementById("btn-close-modal");
  const btnActionClose = document.getElementById("btn-modal-close-action");

  function openModal() {
    sound.playClick();
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    sound.playClick();
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (btnOpen) btnOpen.addEventListener("click", openModal);
  if (btnHomeReview) btnHomeReview.addEventListener("click", openModal);
  if (btnClose) btnClose.addEventListener("click", closeModal);
  if (btnActionClose) btnActionClose.addEventListener("click", closeModal);

  // Tutup jika klik di luar modal kad
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Tutup dengan butang Esc
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

/* =========================================================
   10. PENGENDALI NAMA & AVATAR
   ========================================================= */
function setupNameForm() {
  const form = document.getElementById("form-player-name");
  const nameInput = document.getElementById("input-player-name");
  const errorMsg = document.getElementById("name-error-msg");
  const avatarBtns = document.querySelectorAll(".btn-avatar");

  // Muat semula nama sebelumnya jika disimpan dalam storan lokal
  const cachedName = localStorage.getItem("misi_alkafirun_saved_name");
  if (cachedName && nameInput) {
    nameInput.value = cachedName;
  }

  // Pemilihan avatar wira
  avatarBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sound.playClick();
      avatarBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      gameState.playerAvatar = btn.getAttribute("data-avatar") || "🌟";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sound.playClick();

    const rawName = nameInput.value.trim();

    // Validasi Peraturan Nama (2 hingga 15 aksara, tiada ruang kosong semata-mata)
    if (rawName.length < 2) {
      errorMsg.textContent = "Sila masukkan nama sekurang-kurangnya 2 huruf.";
      nameInput.focus();
      return;
    }

    if (rawName.length > 15) {
      errorMsg.textContent = "Nama tidak boleh melebihi 15 aksara.";
      nameInput.focus();
      return;
    }

    // Hanya benarkan huruf, nombor dan ruang munasabah
    const validNamePattern = /^[a-zA-Z0-9\s'.-]+$/;
    if (!validNamePattern.test(rawName)) {
      errorMsg.textContent = "Sila gunakan huruf atau nombor sahaja.";
      nameInput.focus();
      return;
    }

    errorMsg.textContent = "";
    gameState.playerName = rawName;
    localStorage.setItem("misi_alkafirun_saved_name", rawName);

    // Kemas kini nama di skrin taklimat
    document.getElementById("briefing-player-name").textContent = `${gameState.playerAvatar} ${rawName}`;

    showScreen("screen-briefing");
  });
}

/* =========================================================
   11. PENDAFTARAN ACARA (EVENT LISTENERS INITIALIZATION)
   ========================================================= */
function initEventListeners() {
  // Sound Toggle Button
  const soundBtn = document.getElementById("btn-sound-toggle");
  const soundIcon = document.getElementById("sound-icon");
  if (soundBtn && soundIcon) {
    soundIcon.textContent = sound.enabled ? "🔊" : "🔇";
    soundBtn.addEventListener("click", () => {
      const isNowEnabled = sound.toggle();
      soundIcon.textContent = isNowEnabled ? "🔊" : "🔇";
      if (isNowEnabled) sound.playClick();
    });
  }

  // Logo Klik -> Home
  const logoBtn = document.getElementById("btn-logo-home");
  if (logoBtn) {
    logoBtn.addEventListener("click", () => {
      sound.playClick();
      showScreen("screen-home");
    });
  }

  // Skrin A: Halaman Utama
  const homeStartBtn = document.getElementById("btn-home-start");
  if (homeStartBtn) {
    homeStartBtn.addEventListener("click", () => {
      sound.playClick();
      showScreen("screen-name");
      const nameInput = document.getElementById("input-player-name");
      if (nameInput) setTimeout(() => nameInput.focus(), 300);
    });
  }

  const homeLeaderboardBtn = document.getElementById("btn-home-leaderboard");
  if (homeLeaderboardBtn) {
    homeLeaderboardBtn.addEventListener("click", () => {
      sound.playClick();
      loadLeaderboard();
    });
  }

  // Skrin B: Kembali dari Nama ke Home
  const backNameToHomeBtn = document.getElementById("btn-back-name-to-home");
  if (backNameToHomeBtn) {
    backNameToHomeBtn.addEventListener("click", () => {
      sound.playClick();
      showScreen("screen-home");
    });
  }

  // Skrin C: Mula Kuiz dari Taklimat
  const startQuizBtn = document.getElementById("btn-start-quiz");
  if (startQuizBtn) {
    startQuizBtn.addEventListener("click", () => {
      sound.playClick();
      startNewGame();
    });
  }

  // Skrin D: Soalan Seterusnya
  const nextQBtn = document.getElementById("btn-next-question");
  if (nextQBtn) {
    nextQBtn.addEventListener("click", handleNextQuestion);
  }

  // Skrin E: Keputusan
  const playAgainBtn = document.getElementById("btn-play-again");
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      sound.playClick();
      startNewGame();
    });
  }

  const viewLeaderboardBtn = document.getElementById("btn-view-leaderboard");
  if (viewLeaderboardBtn) {
    viewLeaderboardBtn.addEventListener("click", () => {
      sound.playClick();
      loadLeaderboard();
    });
  }

  const backHomeBtn = document.getElementById("btn-back-home");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      sound.playClick();
      showScreen("screen-home");
    });
  }

  const retrySyncBtn = document.getElementById("btn-retry-sync");
  if (retrySyncBtn) {
    retrySyncBtn.addEventListener("click", () => {
      sound.playClick();
      submitScoreToBackend();
    });
  }

  // Skrin F: Leaderboard Actions
  const backFromLeaderboardBtn = document.getElementById("btn-back-from-leaderboard");
  if (backFromLeaderboardBtn) {
    backFromLeaderboardBtn.addEventListener("click", () => {
      sound.playClick();
      showScreen("screen-home");
    });
  }

  const refreshLeaderboardBtn = document.getElementById("btn-refresh-leaderboard");
  if (refreshLeaderboardBtn) {
    refreshLeaderboardBtn.addEventListener("click", () => {
      sound.playClick();
      loadLeaderboard();
    });
  }

  const retryLeaderboardBtn = document.getElementById("btn-retry-leaderboard");
  if (retryLeaderboardBtn) {
    retryLeaderboardBtn.addEventListener("click", () => {
      sound.playClick();
      loadLeaderboard();
    });
  }

  const emptyPlayBtn = document.getElementById("btn-empty-play");
  if (emptyPlayBtn) {
    emptyPlayBtn.addEventListener("click", () => {
      sound.playClick();
      showScreen("screen-name");
    });
  }

  const lbStartPlayBtn = document.getElementById("btn-leaderboard-start-play");
  if (lbStartPlayBtn) {
    lbStartPlayBtn.addEventListener("click", () => {
      sound.playClick();
      if (!gameState.playerName) {
        showScreen("screen-name");
      } else {
        startNewGame();
      }
    });
  }
}

/* =========================================================
   12. PERMULAAN APLIKASI (APPLICATION BOOTSTRAP)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  confetti = new ConfettiManager("confetti-canvas");
  setupNameForm();
  setupSurahModal();
  initEventListeners();

  // Paparkan makluman konsol pembangun
  if (CONFIG.isDemoMode()) {
    console.info(
      "%c[MISI AL-KAFIRUN]%c Sistem berjalan dalam mod sedia guna. Untuk menyambungkan Google Sheets Leaderboard, masukkan Web App URL dalam fail config.js mengikut panduan di google-apps-script/SETUP.md.",
      "color: #2455A4; font-weight: bold;",
      "color: #0369A1;"
    );
  }
});
