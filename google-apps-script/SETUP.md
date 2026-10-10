# 🚀 PANDUAN PENYEDIAAN GOOGLE APPS SCRIPT & GOOGLE SHEETS

Dokumen ini menerangkan langkah demi langkah untuk menyediakan sistem pangkalan data dan API Leaderboard percuma bagi permainan **MISI AL-KAFIRUN: CABARAN HAFAZAN TAHUN 3**.

---

## 📋 Keperluan Asas
- Satu akaun Google (Akaun peribadi atau akaun Google Workspace seperti DELIMa / KPM).
- Pelayar web (Google Chrome / Microsoft Edge / Mozilla Firefox).

---

## 🛠️ Langkah 1: Cipta Google Sheet Baharu

1. Buka [Google Sheets](https://sheets.new) di pelayar anda.
2. Namakan fail Google Sheet ini:  
   **`MISI AL-KAFIRUN - PANGKALAN DATA LEADERBOARD`**
3. Namakan tab helaian pertama di bahagian bawah sebagai:  
   **`Leaderboard`** *(Pastikan huruf besar/kecil tepat)*.
4. *(Pilihan)* Anda boleh memasukkan tajuk lajur berikut pada Baris 1:
   - A1: `Timestamp`
   - B1: `PlayerName`
   - C1: `Score`
   - D1: `CorrectAnswers`
   - E1: `TotalQuestions`
   - F1: `Accuracy`

*(Nota: Skrip kami juga mempunyai fungsi automatik yang akan mencipta dan memformat tajuk lajur ini sekiranya anda membiarkannya kosong).*

---

## 💻 Langkah 2: Buka Apps Script & Masukkan Kod

1. Pada menu atas Google Sheets, klik **Extensions** > **Apps Script** (atau **Sambungan** > **Apps Script**).
2. Sebuah tab baharu akan dibuka dengan editor kod.
3. Padam semua kod asal di dalam fail `Code.gs`.
4. Salin (Copy) keseluruhan kod dari fail `google-apps-script/Code.gs` dalam projek ini, kemudian tampal (Paste) ke dalam editor Apps Script.
5. Klik ikon **Simpan** (Save / ikon disket) atau tekan `Ctrl + S`.
6. Tukar nama projek di bahagian atas kiri kepada:  
   **`Misi Al-Kafirun API`**.

---

## 🧪 Langkah 3: Uji Skrip (Setup Pertama Kali)

1. Pada bar alat di bahagian atas editor Apps Script, pilih fungsi **`setup`** dari senarai dropdown fungsi.
2. Klik butang **Run** (Jalankan).
3. Google akan meminta **Authorization Required** (Kebenaran Akses) kali pertama:
   - Klik **Review Permissions** (Semak Kebenaran).
   - Pilih akaun Google anda.
   - Jika keluar amaran *"Google hasn't verified this app"*, klik **Advanced** (Lanjutan) di bawah kiri.
   - Klik **Go to Misi Al-Kafirun API (unsafe)**.
   - Klik **Allow** (Benarkan).
4. Di tetingkap "Execution log", anda akan melihat mesej:  
   `Helaian 'Leaderboard' sedia digunakan pada: Leaderboard`.
5. *(Pilihan)* Jika anda mahu memasukkan data ujian, pilih fungsi **`insertTestData`** dan klik **Run**. Anda akan melihat beberapa baris data contoh dimasukkan ke Google Sheet anda.

---

## 🌐 Langkah 4: Deploy Sebagai Web App

Ini adalah langkah paling penting agar murid boleh menghantar dan melihat skor tanpa perlu log masuk akaun Google!

1. Di bahagian atas kanan editor Apps Script, klik butang biru **Deploy** > **New deployment** (Gunakan > Kerahan baharu).
2. Klik ikon gear di sebelah kiri *"Select type"* dan pilih **Web app**.
3. Lengkapkan borang tetapan dengan teliti:
   - **Description**: `Versi 1.0 - Leaderboard Al-Kafirun`
   - **Execute as**: Pilih **Me (emel anda)**  
     *(PENTING: Ini membolehkan skrip menulis ke Sheet menggunakan kuasa pemilik skrip)*.
   - **Who has access**: Pilih **Anyone** (Sesiapa sahaja)  
     *(PENTING: Jangan pilih "Only myself" atau "Anyone with Google account", supaya murid sekolah rendah boleh bermain terus tanpa login Google)*.
4. Klik butang **Deploy**.
5. Tunggu proses deployment selesai.
6. Salin **Web app URL** yang dipaparkan.  
   Format URL akan kelihatan seperti ini:  
   `https://script.google.com/macros/s/AKfycbx.../exec`

> ⚠️ **PERINGATAN PENTING SEMASA MENGEMAS KINI KOD:**  
> Jika anda mengubah apa-apa kod dalam `Code.gs` pada masa hadapan, anda mesti membuat **Deploy > Manage deployments > Edit > New version**, kemudian klik **Deploy** semula agar perubahan itu berkuat kuasa.

---

## 🔗 Langkah 5: Sambungkan ke Frontend Permainan

1. Buka fail **`config.js`** di dalam folder projek anda.
2. Cari baris berikut:
   ```javascript
   API_URL: "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
   ```
3. Gantikan teks placeholder tersebut dengan URL Web App sebenar yang anda salin tadi:
   ```javascript
   API_URL: "https://script.google.com/macros/s/AKfycbxAbCdEf123456789/exec",
   ```
4. Simpan fail `config.js`.

---

## 🔍 Langkah 6: Cara Menguji Penyambungan

1. Buka fail `index.html` dalam pelayar web anda (atau layari laman GitHub Pages anda).
2. Klik butang **LEADERBOARD TOP 10**.
3. Jika penyambungan berjaya, sistem akan memuatkan senarai Top 10 (atau memaparkan mesej tiada rekod jika sheet kosong).
4. Cuba main satu sesi permainan:
   - Masukkan nama contoh: `Aiman`.
   - Jawab 10 soalan.
   - Di skrin keputusan, lihat penunjuk status penghantaran skor: ia akan memaparkan **"Keputusan berjaya disimpan!"**.
   - Buka Google Sheets anda dan perhatikan baris baharu telah ditambah secara automatik!

---

## 🛡️ Nota Keselamatan & Had Sistem
- **Kadar Permintaan Percuma**: Kuota percuma Google Apps Script membolehkan ribuan murid bermain dan menghantar skor setiap hari tanpa kos.
- **Perlindungan Serentak (LockService)**: Skrip dilengkapi `LockService` agar apabila 30-40 murid di makmal komputer menghantar jawapan serentak, rekod tidak akan hilang atau bertindih.
- **Penapisan & Validasi**: Semua skor disemak di bahagian pelayan (maksimum 1,000 mata, 10 soalan, nama 2-25 aksara) bagi mengelakkan manipulasi data asas.
