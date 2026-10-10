/**
 * BANK SOALAN: MISI AL-KAFIRUN (TAHUN 3 KSSR - EDISI MESRA MURID)
 * Disesuaikan khas untuk murid Tahun 3 (termasuk murid pemulihan/lemah).
 * Soalan mudah, jelas, tidak mengelirukan, dan HANYA fokus kepada:
 * 1. Hafazan susunan ayat 1 - 6 dan sambungan kalimah.
 * 2. Maksud ayat dan maksud kalimah Surah Al-Kafirun.
 * (Tiada ayat clue yang mengelirukan)
 */

const QUESTION_BANK = [
  // =========================================================================
  // KATEGORI 1: SUSUN AYAT (Hafazan Urutan & Nombor Ayat 1 - 6)
  // =========================================================================
  {
    id: 1,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Berapakah jumlah ayat yang terdapat dalam Surah Al-Kafirun?",
    options: [
      "6 ayat",
      "3 ayat",
      "4 ayat",
      "8 ayat"
    ],
    correctAnswer: "6 ayat",
    explanation: "Pandai! Surah Al-Kafirun mempunyai tepat 6 ayat."
  },
  {
    id: 2,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Ayat manakah yang merupakan AYAT PERTAMA (Ayat 1) Surah Al-Kafirun?",
    options: [
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ"
    ],
    correctAnswer: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
    explanation: "Betul! Ayat 1 bermula dengan: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ'."
  },
  {
    id: 3,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Pilih AYAT KEDUA (Ayat 2) Surah Al-Kafirun:",
    options: [
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ"
    ],
    correctAnswer: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
    explanation: "Hebat! Ayat ke-2 ialah: 'لَا أَعْبُدُ مَا تَعْبُدُونَ'."
  },
  {
    id: 4,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Pilih AYAT KETIGA (Ayat 3) Surah Al-Kafirun:",
    options: [
      "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ"
    ],
    correctAnswer: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
    explanation: "Bagus! Ayat ke-3 ialah: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ'."
  },
  {
    id: 5,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Pilih AYAT KEEMPAT (Ayat 4) Surah Al-Kafirun:",
    options: [
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ"
    ],
    correctAnswer: "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ",
    explanation: "Tepat sekali! Ayat ke-4 ialah: 'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ'."
  },
  {
    id: 6,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Pilih AYAT KELIMA (Ayat 5) Surah Al-Kafirun:",
    options: [
      "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ"
    ],
    correctAnswer: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
    explanation: "Betul! Ayat ke-5 berbunyi: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ'."
  },
  {
    id: 7,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Pilih AYAT TERAKHIR atau AYAT KEENAM (Ayat 6) Surah Al-Kafirun:",
    options: [
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ"
    ],
    correctAnswer: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    explanation: "Tahniah! Ayat penutup (ke-6) ialah: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ'."
  },
  {
    id: 8,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Ayat 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ' ialah ayat yang ke berapa?",
    options: [
      "Ayat ke-6",
      "Ayat ke-1",
      "Ayat ke-2",
      "Ayat ke-3"
    ],
    correctAnswer: "Ayat ke-6",
    explanation: "Betul! 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ' adalah ayat yang ke-6 (terakhir)."
  },
  {
    id: 9,
    category: "susun",
    categoryName: "Susun Ayat",
    question: "Selepas membaca ayat pertama (Ayat 1), apakah ayat yang dibaca seterusnya?",
    options: [
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
    ],
    correctAnswer: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
    explanation: "Bagus! Selepas ayat 1, kita membaca ayat 2: 'لَا أَعْبُدُ مَا تَعْبُدُونَ'."
  },

  // =========================================================================
  // KATEGORI 2: SAMBUNG AYAT (Hafazan Potongan Kalimah Mudah)
  // =========================================================================
  {
    id: 10,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Sambungkan ayat pertama ini: 'قُلْ يَا أَيُّهَا ...'",
    options: [
      "الْكَافِرُونَ",
      "النَّاسُ",
      "الْمُؤْمِنُونَ",
      "الصَّابِرُونَ"
    ],
    correctAnswer: "الْكَافِرُونَ",
    explanation: "Tepat! Ayat 1 disambung dengan: 'الْكَافِرُونَ'."
  },
  {
    id: 11,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Lengkapkan ayat kedua: 'لَا أَعْبُدُ مَا ...'",
    options: [
      "تَعْبُدُونَ",
      "تَأْكُلُونَ",
      "تَعْلَمُونَ",
      "تَسْمَعُونَ"
    ],
    correctAnswer: "تَعْبُدُونَ",
    explanation: "Betul! Sambungan ayat ke-2 ialah: 'تَعْبُدُونَ'."
  },
  {
    id: 12,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Lengkapkan ayat keenam: 'لَكُمْ دِينُكُمْ ...'",
    options: [
      "وَلِيَ دِينِ",
      "مَا تَعْبُدُونَ",
      "الْكَافِرُونَ",
      "أَعْبُدُ"
    ],
    correctAnswer: "وَلِيَ دِينِ",
    explanation: "Hebat! Ayat ke-6 disambung dengan: 'وَلِيَ دِينِ'."
  },
  {
    id: 13,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Lengkapkan ayat ini: 'وَلَا أَنَا عَابِدٌ مَا ...'",
    options: [
      "عَبَدْتُمْ",
      "عَلِمْتُمْ",
      "سَمِعْتُمْ",
      "قُلْتُمْ"
    ],
    correctAnswer: "عَبَدْتُمْ",
    explanation: "Bagus! Ayat 4 berakhir dengan kalimah: 'عَبَدْتُمْ'."
  },
  {
    id: 14,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Lengkapkan ayat ini: 'وَلَا أَنْتُمْ عَابِدُونَ مَا ...'",
    options: [
      "أَعْبُدُ",
      "تَسْمَعُ",
      "تَقُولُ",
      "تَأْكُلُ"
    ],
    correctAnswer: "أَعْبُدُ",
    explanation: "Tepat! Ayat 3 berakhir dengan kalimah: 'أَعْبُدُ'."
  },
  {
    id: 15,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Pilih kalimah yang betul: 'وَلَا [ ... ] عَابِدٌ مَا عَبَدْتُمْ'",
    options: [
      "أَنَا",
      "نَحْنُ",
      "هُمْ",
      "أَنْتُمْ"
    ],
    correctAnswer: "أَنَا",
    explanation: "Pandai! Kalimah yang betul dalam ayat 4 ialah: 'أَنَا'."
  },
  {
    id: 16,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Pilih kalimah yang betul: 'وَلَا [ ... ] عَابِدُونَ مَا أَعْبُدُ'",
    options: [
      "أَنْتُمْ",
      "أَنَا",
      "هُوَ",
      "هِيَ"
    ],
    correctAnswer: "أَنْتُمْ",
    explanation: "Betul! Kalimah yang betul dalam ayat 3 & 5 ialah: 'أَنْتُمْ'."
  },
  {
    id: 17,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Ayat manakah yang bermula dengan kalimah 'لَكُمْ'?",
    options: [
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ"
    ],
    correctAnswer: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    explanation: "Tepat! Ayat yang bermula dengan 'لَكُمْ' ialah ayat ke-6: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ'."
  },
  {
    id: 18,
    category: "sambung",
    categoryName: "Sambung Ayat",
    question: "Ayat manakah yang bermula dengan kalimah 'قُلْ'?",
    options: [
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ"
    ],
    correctAnswer: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
    explanation: "Betul! Ayat yang bermula dengan 'قُلْ' ialah ayat pertama: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ'."
  },

  // =========================================================================
  // KATEGORI 3: FAHAMI MAKSUD (Maksud Ayat & Kalimah Asas)
  // =========================================================================
  {
    id: 19,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Apakah nama surah ini dalam al-Quran?",
    options: [
      "Surah Al-Kafirun",
      "Surah Al-Fatihah",
      "Surah Al-Ikhlas",
      "Surah An-Nas"
    ],
    correctAnswer: "Surah Al-Kafirun",
    explanation: "Betul! Surah ini dinamakan Surah Al-Kafirun."
  },
  {
    id: 20,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Apakah maksud perkataan 'الْكَافِرُونَ'?",
    options: [
      "Orang-orang kafir",
      "Orang-orang beriman",
      "Orang-orang miskin",
      "Kanak-kanak"
    ],
    correctAnswer: "Orang-orang kafir",
    explanation: "Tepat! 'Al-Kafirun' bermaksud orang-orang kafir."
  },
  {
    id: 21,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Apakah maksud ayat pertama: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ'?",
    options: [
      "Katakanlah: Wahai orang-orang kafir!",
      "Katakanlah: Wahai orang-orang beriman!",
      "Katakanlah: Wahai kawan-kawan saya!",
      "Katakanlah: Selamat pagi semua!"
    ],
    correctAnswer: "Katakanlah: Wahai orang-orang kafir!",
    explanation: "Tahniah! Maksud ayat 1 ialah: 'Katakanlah: Wahai orang-orang kafir!'."
  },
  {
    id: 22,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Apakah maksud ayat kedua: 'لَا أَعْبُدُ مَا تَعْبُدُونَ'?",
    options: [
      "Aku tidak akan menyembah apa yang kamu sembah.",
      "Aku suka apa yang kamu makan.",
      "Mari kita pergi bermain di padang.",
      "Bagi kamu buku kamu dan bagiku bukuku."
    ],
    correctAnswer: "Aku tidak akan menyembah apa yang kamu sembah.",
    explanation: "Betul! Maksud ayat 2 ialah: 'Aku tidak akan menyembah apa yang kamu sembah.'"
  },
  {
    id: 23,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Apakah maksud ayat keenam: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ'?",
    options: [
      "Bagi kamu agama kamu, dan bagiku agamaku.",
      "Bagi kamu makanan kamu, dan bagiku makananku.",
      "Rumah kamu besar dan rumah saya kecil.",
      "Kamu kawan saya dan saya kawan kamu."
    ],
    correctAnswer: "Bagi kamu agama kamu, dan bagiku agamaku.",
    explanation: "Hebat! Maksud ayat 6 ialah: 'Bagi kamu agama kamu, dan bagiku agamaku'."
  },
  {
    id: 24,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Apakah maksud perkataan 'وَلِيَ دِينِ'?",
    options: [
      "Dan bagiku agamaku",
      "Dan bagiku rumahku",
      "Dan bagiku wangku",
      "Dan bagiku kawanku"
    ],
    correctAnswer: "Dan bagiku agamaku",
    explanation: "Bagus! 'Wa liya diin' (وَلِيَ دِينِ) bermaksud: 'Dan bagiku agamaku'."
  },
  {
    id: 25,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Apakah maksud perkataan 'لَكُمْ دِينُكُمْ'?",
    options: [
      "Bagi kamu agama kamu",
      "Bagi kamu makanan kamu",
      "Bagi kamu sekolah kamu",
      "Bagi kamu kereta kamu"
    ],
    correctAnswer: "Bagi kamu agama kamu",
    explanation: "Pandai! 'Lakum diinukum' (لَكُمْ دِينُكُمْ) bermaksud: 'Bagi kamu agama kamu'."
  },
  {
    id: 26,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Ayat manakah yang membawa maksud: 'Bagi kamu agama kamu, dan bagiku agamaku'?",
    options: [
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ"
    ],
    correctAnswer: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    explanation: "Tepat sekali! Ayatnya ialah: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ'."
  },
  {
    id: 27,
    category: "fahami",
    categoryName: "Fahami Maksud",
    question: "Ayat manakah yang bermaksud: 'Katakanlah: Wahai orang-orang kafir!'?",
    options: [
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ"
    ],
    correctAnswer: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
    explanation: "Betul! Ayatnya ialah: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ' (Ayat 1)."
  }
];

// Pastikan data boleh diakses di browser atau Node (jika diuji)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTION_BANK };
}
