/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/quiz.js - Kuis Edukasi Interaktif "Guardian Challenge" (#/kuis - P1)
 * Desain Visual Stitch Material 3 Cyber Console
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      type: 'URL',
      content: 'https://klikbca.com.layanan-keamanan-2026.xyz/login',
      correctAnswer: 'suspicious',
      title: 'Pemeriksaan Alamat Tautan Bank',
      explanation: 'Mencurigakan! Domain induk aslinya adalah "layanan-keamanan-2026.xyz", sedangkan "klikbca.com" hanyalah subdomain tipuan di depannya.'
    },
    {
      id: 2,
      type: 'CHAT',
      content: 'Selamat! Nomor telepon Anda memenangkan grand prize undian tahunan Rp50.000.000. Segera transfer biaya administrasi pajak pemenang Rp250.000 ke rekening panitia sebelum pukul 17:00.',
      correctAnswer: 'suspicious',
      title: 'Pesan Kemenangan Hadiah Fantastis',
      explanation: 'Mencurigakan! Undian resmi tidak memungut biaya transfer di muka ke rekening perorangan, dan menggunakan teknik penekanan waktu mendesak.'
    },
    {
      id: 3,
      type: 'URL',
      content: 'https://www.tokopedia.com/promo/spesial-diskon',
      correctAnswer: 'normal',
      title: 'Tautan Promo Marketplace Resmi',
      explanation: 'Risiko Rendah! Domain induk terverifikasi milik tokopedia.com dan menggunakan protokol aman HTTPS resmi.'
    },
    {
      id: 4,
      type: 'CHAT',
      content: 'Halo kak, pesanan buku paket sekolah sudah kami serahkan ke pihak ekspedisi dengan nomor resi JP1928374619 ya. Terima kasih banyak sudah berbelanja.',
      correctAnswer: 'normal',
      title: 'Pesan Konfirmasi Pengiriman Barang',
      explanation: 'Risiko Rendah! Komunikasi jual beli yang wajar tanpa ada desakan uang tambahan, link mencurigakan, atau permintaan kode rahasia.'
    },
    {
      id: 5,
      type: 'CHAT',
      content: 'Pemberitahuan: Kartu ATM Anda terindikasi disusupi dan akan diblokir otomatis. Mohon segera kirimkan 6 digit kode OTP SMS ke petugas kami untuk pembatalan blokir.',
      correctAnswer: 'suspicious',
      title: 'Pesan Ancaman Pemblokiran Rekening',
      explanation: 'Mencurigakan! Pihak bank TIDAK PERNAH meminta kode OTP nasabah untuk alasan apa pun. Ini adalah teknik rekayasa sosial (social engineering).'
    },
    {
      id: 6,
      type: 'URL',
      content: 'http://45.33.32.156/bca-update/verifikasi.html',
      correctAnswer: 'suspicious',
      title: 'Tautan Alamat IP Mentah Tanpa HTTPS',
      explanation: 'Mencurigakan! Situs institusi finansial tidak pernah menggunakan alamat IP numerik mentah dan wajib berenkripsi HTTPS.'
    }
  ];

  function renderQuizState(currentIdx, userAnswers, isCompleted) {
    if (isCompleted) {
      return renderQuizSummary(userAnswers);
    }

    const q = QUIZ_QUESTIONS[currentIdx];
    const totalQ = QUIZ_QUESTIONS.length;
    const progressPct = ((currentIdx) / totalQ) * 100;

    return `
      <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        
        <!-- Header Kuis -->
        <div class="flex items-center justify-between pb-2 border-b border-surface-container">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-surface-container text-amber-500 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <h1 class="text-base font-bold text-on-surface">Guardian Challenge</h1>
              <p class="text-xs text-on-surface-variant">Uji Naluri Keamanan Digital Anda</p>
            </div>
          </div>
          <span class="font-mono text-xs text-secondary font-bold bg-surface-container px-2.5 py-1 rounded">
            Soal ${currentIdx + 1} dari ${totalQ}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
          <div class="bg-secondary h-1.5 rounded-full transition-all duration-300" style="width: ${progressPct}%"></div>
        </div>

        <!-- Card Soal -->
        <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${q.type === 'URL' ? 'bg-surface-container text-secondary' : 'bg-surface-container-high text-on-tertiary-container'}">
              ${q.type === 'URL' ? 'Kasus Tautan (URL)' : 'Kasus Pesan Chat WhatsApp'}
            </span>
            <span class="text-xs text-on-surface-variant font-medium">${escapeHtml(q.title)}</span>
          </div>

          <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container font-mono text-xs sm:text-sm text-on-surface leading-relaxed break-all">
            ${escapeHtml(q.content)}
          </div>

          <p class="text-xs text-on-surface-variant text-center font-semibold">
            Berdasarkan indikator di atas, apakah ini berindikasi penipuan / rekayasa sosial?
          </p>

          <!-- Tombol Pilihan Jawaban -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="quiz-choices">
            <button data-choice="normal" class="quiz-choice-btn p-3.5 rounded-xl border border-surface-container hover:border-on-tertiary-container bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">check_circle</span>
              <span>Indikator Risiko Rendah</span>
            </button>
            <button data-choice="suspicious" class="quiz-choice-btn p-3.5 rounded-xl border border-surface-container hover:border-error bg-surface-container-lowest hover:bg-error-container/30 text-on-surface font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-error">warning</span>
              <span>Mencurigakan (Risiko Tinggi)</span>
            </button>
          </div>

          <!-- Kotak Feedback Instan -->
          <div id="quiz-feedback-box" class="hidden p-4 rounded-xl space-y-2 border">
            <div id="feedback-header" class="flex items-center gap-2"></div>
            <p id="feedback-explanation" class="text-xs text-on-surface-variant leading-relaxed"></p>
            <div class="pt-2 text-right">
              <button id="btn-next-quiz" class="px-5 py-2 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary-container transition-colors shadow-sm">
                ${currentIdx < totalQ - 1 ? 'Soal Berikutnya &rarr;' : 'Lihat Hasil Akhir'}
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  function renderQuizSummary(userAnswers) {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const total = QUIZ_QUESTIONS.length;
    const pct = Math.round((score / total) * 100);

    return `
      <div class="max-w-xl mx-auto py-12 px-4 sm:px-6 space-y-6 text-center">
        <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div class="w-16 h-16 rounded-2xl bg-surface-container text-amber-500 mx-auto flex items-center justify-center">
            <span class="material-symbols-outlined text-[36px]">military_tech</span>
          </div>

          <div class="space-y-1">
            <h2 class="text-2xl font-bold text-on-surface tracking-tight">Guardian Challenge Selesai!</h2>
            <p class="text-xs text-on-surface-variant">Hasil evaluasi kewaspadaan ancaman rekayasa sosial Anda:</p>
          </div>

          <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container inline-block px-8">
            <span class="text-4xl font-extrabold text-secondary font-mono">${pct}%</span>
            <span class="text-xs text-on-surface-variant block mt-1">Skor: ${score} Benar dari ${total} Soal</span>
          </div>

          <p class="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            ${pct >= 80 ? 'Hebat! Anda memiliki ketajaman visual yang sangat baik dalam mendeteksi indikator penipuan digital.' : 'Tetap waspada! Selalu ingat prinsip verifikasi sebelum mengklik tautan atau mentransfer dana.'}
          </p>

          <div class="pt-4 border-t border-surface-container flex flex-wrap justify-center gap-3">
            <button id="btn-restart-quiz" class="px-5 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs sm:text-sm hover:bg-secondary-container transition-colors shadow-sm">
              Ulangi Tantangan
            </button>
            <a href="#/panduan" class="px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold transition-colors">
              Buka Panduan Keamanan
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  S.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
  S.renderQuizState = renderQuizState;
})(window.Scamora);
