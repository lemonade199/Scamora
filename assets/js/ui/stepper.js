/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/stepper.js - Status Pemrosesan & Stepper Animasi saat Analisis Berjalan
 * Desain Visual Stitch Material 3 Cyber Console
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function renderStepper(type = 'url') {
    const steps = type === 'url' ? [
      { title: 'Validasi Format & Skema URL', desc: 'Memeriksa protokol http/https dan batas panjang 2.048 karakter' },
      { title: 'Analisis Struktur & Subdomain', desc: 'Mendeteksi typosquatting, brand impersonation, TLD berisiko, dan IP host' },
      { title: 'Pemeriksaan Reputasi Eksternal', desc: 'Mencocokkan domain dengan basis data Google Safe Browsing' },
      { title: 'Agregasi Indikator & Skor Risiko', desc: 'Menghitung bobot indikator unik dan memetakan ke kategori hasil' }
    ] : [
      { title: 'Validasi Input Percakapan', desc: 'Memeriksa panjang karakter (10 - 5.000 karakter)' },
      { title: 'Masking Data Pribadi Lokal', desc: 'Menyamarkan nomor telepon, email, rekening bank, NIK, dan OTP' },
      { title: 'Pemindaian Pola Pesan Lokal', desc: 'Mendeteksi kata kunci urgensi, uang muka, janji untung, dan pengalihan ke Telegram' },
      { title: 'Analisis Semantik Konteks AI', desc: 'Memproses teks yang sudah dimasker melalui Claude API untuk validasi bukti' },
      { title: 'Agregasi Skor & Rekomendasi', desc: 'Menetapkan kategori risiko, rincian bobot, dan langkah proteksi' }
    ];

    return `
      <div class="max-w-xl mx-auto py-12 px-4 sm:px-6">
        <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div class="text-center space-y-2">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container text-secondary mb-2">
              <svg class="animate-spin w-7 h-7 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-on-surface tracking-tight">Memproses Analisis Risiko...</h2>
            <p class="text-xs text-on-surface-variant">Sistem sedang memeriksa indikator keamanan secara berjenjang & mandiri</p>
          </div>

          <!-- Stepper Visual -->
          <div class="space-y-4 pt-2">
            ${steps.map((step, idx) => `
              <div class="flex items-start gap-4 stepper-step-item" data-step="${idx}">
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold step-icon-box bg-surface-container border-surface-container-high text-on-surface-variant transition-all duration-300">
                    <span>${idx + 1}</span>
                  </div>
                  ${idx < steps.length - 1 ? `<div class="w-0.5 h-8 bg-surface-container mt-1 step-line"></div>` : ''}
                </div>
                <div class="flex-1 pt-1">
                  <p class="text-sm font-semibold text-on-surface step-title">${escapeHtml(step.title)}</p>
                  <p class="text-xs text-on-surface-variant step-desc">${escapeHtml(step.desc)}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Skeleton loader bar -->
          <div class="pt-2">
            <div class="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
              <div class="bg-secondary h-1.5 rounded-full animate-pulse transition-all duration-500" style="width: 75%"></div>
            </div>
            <p class="text-[11px] text-outline text-center mt-2">Zero Plaintext Ingress &bull; Data tidak disimpan di server</p>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  S.renderStepper = renderStepper;
})(window.Scamora);
