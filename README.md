# 📖 MISI AL-KAFIRUN: CABARAN HAFAZAN (TAHUN 3 KSSR)

Permainan kuiz pendidikan Islam berasaskan web yang ceria, interaktif, responsif dan siap dimainkan untuk murid Tahun 3 Sekolah Rendah bagi menguasai hafazan dan kefahaman **Surah Al-Kafirun (Surah ke-109)**.

Dihoskan secara percuma menggunakan **GitHub Pages** dengan pangkalan data papan pendahulu (Leaderboard Top 10) menggunakan **Google Apps Script** dan **Google Sheets**.

---

## 🌟 Ciri-Ciri Utama Permainan

1. **Mematuhi DSKP KSSR Pendidikan Islam Tahun 3**:
   - Hafazan dan susunan nombor ayat 1 hingga 6.
   - Sambungan potongan kalimah dan ayat.
   - Terjemahan ayat Bahasa Melayu dan pengajaran asas aqidah Islam (menolak syirik & menjaga kesucian tauhid).
2. **Bank Soalan Lengkap**:
   - Mengandungi 27 soalan berkualiti tinggi yang diacak secara automatik setiap sesi permainan.
   - Pilihan jawapan (A, B, C, D) diacak kedudukannya untuk memastikan ketelusan dan mengelakkan murid sekadar menghafal posisi butang.
3. **Pemarkahan Adil & Motivasi Kanak-Kanak**:
   - 10 soalan setiap sesi permainan.
   - 100 mata bagi setiap jawapan betul (Maksimum 1,000 mata).
   - Penilaian bintang (1 hingga 3 bintang emas) dan kata-kata galakan bersesuaian.
   - Tiada kiraan masa yang mendesak, mengutamakan pembelajaran murid.
4. **Kesan Audio Sintesis (Web Audio API)**:
   - Kesan bunyi yang ceria (bunyi betul, salah, dan kemenangan) dihasilkan terus oleh pelayar web tanpa bergantung kepada fail audio MP3 luar.
   - Butang buka/tutup bunyi tersedia.
5. **Leaderboard Top 10 Dalam Talian**:
   - Mengambil dan menyimpan skor murid ke Google Sheets secara terus melalui Google Apps Script Web App.
   - Dilengkapi fungsi pengunci (*LockService*) agar tiada data hilang semasa ramai murid menghantar serentak di makmal komputer sekolah.

---

## 📁 Struktur Fail Projek

```text
HAFAZAN SURAH AL-KAFIRUN/
├── index.html              # Antaramuka utama (6 skrin interaktif & modal surah)
├── style.css               # Gaya visual, susun atur responsif & animasi kanak-kanak
├── script.js               # Enjin logik kuiz, pemarkahan, audio Web Audio & API sync
├── questions.js            # Bank soalan (Susun Ayat, Sambung Ayat, Fahami Maksud)
├── config.js               # Tetapan tajuk, had markah & URL Web App Google Apps Script
├── README.md               # Dokumentasi utama dan panduan projek
└── google-apps-script/
    ├── Code.gs             # Skrip API doGet & doPost untuk Google Apps Script
    └── SETUP.md            # Panduan langkah demi langkah persediaan Google Sheets
```

---

## 💻 Cara Membuka Permainan Secara Lokal (Komputer Sendiri)

1. Muat turun atau buka folder projek ini pada komputer anda.
2. Dwiklik pada fail **`index.html`** untuk membukanya secara terus dalam mana-mana pelayar web (Google Chrome, Microsoft Edge, Firefox, Safari).
3. Anda boleh terus bermain dan menguji semua soalan secara serta-merta tanpa perlu memasang sebarang perisian pembangunan tambahan!

---

## 🌐 Cara Menghoskan di GitHub Pages (Percuma)

Untuk membolehkan murid di sekolah atau di rumah bermain melalui pautan internet:

1. **Cipta Repository Baharu di GitHub**:
   - Log masuk ke akaun [GitHub](https://github.com/).
   - Klik butang **New** untuk mencipta repository baharu.
   - Namakan repository, contohnya: `misi-al-kafirun`.
   - Tetapkan status kepada **Public**.
   - Klik **Create repository**.

2. **Muat Naik Fail Projek**:
   - Muat naik semua fail dan folder daripada projek ini ke dalam repository anda (pastikan fail `index.html` berada pada folder utama / root repository).
   - Buat *Commit changes*.

3. **Aktifkan GitHub Pages**:
   - Pada halaman repository GitHub anda, klik tab **Settings**.
   - Di bar sisi kiri, klik bahagian **Pages**.
   - Di bawah **Build and deployment** > **Source**, pilih **Deploy from a branch**.
   - Di bahagian **Branch**, pilih branch `main` (atau `master`) dan folder `/ (root)`.
   - Klik butang **Save**.
   - Tunggu 1 hingga 2 minit. GitHub akan memberikan pautan laman web anda, contohnya:  
     `https://nama-pengguna.github.io/misi-al-kafirun/`
   - Kongsikan pautan ini kepada murid!

---

## 📊 Cara Menyediakan Google Sheets & Google Apps Script

Sistem Leaderboard menggunakan Google Sheets percuma sebagai pangkalan data awan.

Sila rujuk panduan bergambar dan lengkap di:  
👉 **[`google-apps-script/SETUP.md`](google-apps-script/SETUP.md)**

### Ringkasan Langkah:
1. Buka [Google Sheets](https://sheets.new) dan cipta helaian bertajuk `Leaderboard`.
2. Klik **Extensions** > **Apps Script**.
3. Salin kod dari fail **`google-apps-script/Code.gs`** dan tampal ke editor Apps Script.
4. Klik **Deploy** > **New deployment** > Pilih **Web app**.
5. Tetapkan:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Supaya murid boleh menyimpan markah tanpa perlu login akaun Google)*.
6. Salin **Web app URL** yang terhasil.
7. Buka fail **`config.js`** dalam projek ini, dan gantikan nilai `API_URL` dengan URL tersebut:
   ```javascript
   API_URL: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
8. Simpan fail dan muat naik semula perubahan ke GitHub.

---

## 🧪 Cara Menguji Leaderboard

1. **Ujian Semasa Mod Demo (Tanpa API)**:
   - Jika `API_URL` masih nilai lalai, permainan secara automatik berfungsi dalam mod demo dengan memaparkan data simulasi apabila anda menekan butang **LEADERBOARD TOP 10**.
2. **Ujian Selepas API Disambungkan**:
   - Masukkan nama contoh: `Aiman`.
   - Jawab 10 soalan sehingga tamat.
   - Di skrin keputusan, lihat penunjuk: *"Keputusan berjaya disimpan ke Google Sheets!"*.
   - Tekan butang **LEADERBOARD TOP 10** untuk melihat kedudukan anda.
   - Buka Google Sheets anda dan sahkan baris rekod baharu telah dicatatkan.

---

## ✍️ Cara Menambah atau Mengubah Bank Soalan

Semua soalan disimpan dalam fail **`questions.js`**. Anda boleh menambah seberapa banyak soalan mengikut format JSON berikut:

```javascript
{
  id: 28,
  category: "susun", // Pilihan: "susun", "sambung", atau "fahami"
  categoryName: "Susun Ayat",
  question: "Teks soalan anda di sini?",
  arabicSnippet: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", // Pilihan (jika ada)
  options: [
    "Pilihan A",
    "Pilihan B",
    "Pilihan C",
    "Pilihan D"
  ],
  correctAnswer: "Pilihan A", // Mesti tepat sama dengan salah satu pilihan di atas
  explanation: "Penerangan pembelajaran untuk murid."
}
```

---

## ❓ Penyelesaian Masalah (Troubleshooting)

| Masalah | Punca Biasa | Penyelesaian |
|---|---|---|
| Skor tidak disimpan ke Google Sheets | Tetapan kebenaran deployment bukan `Anyone` | Buka Apps Script, klik *Deploy* > *Manage deployments*, pastikan *Who has access* ialah `Anyone`. |
| Papan pendahulu memaparkan ralat | URL Web App dalam `config.js` tersilap atau mengandungi ruang kosong | Semak nilai `API_URL` dalam `config.js`. Pastikan berakhir dengan `/exec`. |
| Perubahan pada `Code.gs` tidak berlaku | Belum membuat deployment versi baharu | Setiap kali kod `Code.gs` diubah, klik *Deploy* > *Manage deployments* > *Edit* > *Version: New version* > *Deploy*. |
| Teks Arab kelihatan terpotong pada telefon pintar | Fon Arab peranti tidak lengkap | Laman web ini telah menyertakan fon Google 'Amiri' secara automatik bagi memastikan paparan harakat dan huruf jelas pada semua peranti. |

---

## 📜 Hak Cipta & Lesen
Dicipta khas untuk kegunaan pengajaran dan pembelajaran (PdP) Pendidikan Islam Sekolah Rendah KSSR Malaysia. Boleh digunakan, diubah suai dan dikongsi secara percuma bagi tujuan pendidikan.
