/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/checklist.js - Quick Security Checklist Interaktif (P1)
 * Desain Visual Stitch Material 3 Cyber Console
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function renderChecklist() {
    const sections = [
      {
        id: 'sec-link',
        title: '1. Sebelum Mengeklik Tautan (URL)',
        icon: 'link',
        items: [
          { id: 'c1', text: 'Saya telah memeriksa nama domain utama (bukan hanya subdomain di awal).' },
          { id: 'c2', text: 'Tautan menggunakan protokol HTTPS dan tidak ada peringatan sertifikat peramban.' },
          { id: 'c3', text: 'Ejaan nama situs tidak mengandung saltik yang disengaja (misal: sh0pee, bca-klik).' },
          { id: 'c4', text: 'Jika berupa tautan pendek (bit.ly/s.id), saya sudah mengonfirmasi ke pengirim aslinya.' }
        ]
      },
      {
        id: 'sec-pay',
        title: '2. Sebelum Mentransfer Uang / Pembayaran',
        icon: 'credit_card',
        items: [
          { id: 'c5', text: 'Rekening penerima beratasnamakan resmi perusahaan, bukan rekening tabungan perorangan.' },
          { id: 'c6', text: 'Transaksi dilakukan melalui sistem rekening bersama resmi marketplace, bukan chat langsung.' },
          { id: 'c7', text: 'Saya tidak ditekan oleh tenggat waktu mendesak (misal: "harus transfer dalam 15 menit").' },
          { id: 'c8', text: 'Tidak ada biaya tersembunyi seperti biaya administrasi untuk mencairkan hadiah/pinjaman.' }
        ]
      },
      {
        id: 'sec-privacy',
        title: '3. Sebelum Memberikan Data Identitas Pribadi',
        icon: 'lock',
        items: [
          { id: 'c9', text: 'Saya TIDAK PERNAH membagikan kode OTP 6-digit kepada siapa pun termasuk pihak bank.' },
          { id: 'c10', text: 'Saya tidak memberikan nomor CVV (3 angka di belakang kartu) atau PIN kartu ATM.' },
          { id: 'c11', text: 'Saya tidak sembarangan mengirimkan foto e-KTP dan swafoto (selfie) ke nomor WhatsApp tak dikenal.' }
        ]
      }
    ];

    return `
      <div class="space-y-6">
        <div class="p-4 rounded-xl bg-surface-container border border-surface-container-high flex items-start gap-3">
          <span class="material-symbols-outlined text-[24px] text-secondary shrink-0 mt-0.5">verified_user</span>
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-on-surface">Panduan Verifikasi Mandiri Tiga Menit (Pre-Click Routine)</h3>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Centang setiap poin sebelum Anda mengambil keputusan finansial atau membuka tautan yang dikirimkan oleh nomor tidak dikenal.
            </p>
          </div>
        </div>

        <div class="space-y-4">
          ${sections.map(sec => `
            <div class="bg-surface-container-lowest border border-surface-container rounded-xl p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-secondary font-bold text-sm">
                <span class="material-symbols-outlined text-[18px]">${sec.icon}</span>
                <h4 class="text-on-surface">${escapeHtml(sec.title)}</h4>
              </div>
              <div class="space-y-2 pt-1">
                ${sec.items.map(item => `
                  <label class="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer select-none border border-transparent hover:border-surface-container">
                    <input type="checkbox" id="${item.id}" class="checklist-item-checkbox w-4 h-4 rounded text-secondary focus:ring-secondary mt-0.5 border-outline-variant">
                    <span class="text-xs text-on-surface-variant leading-relaxed checklist-item-text">${escapeHtml(item.text)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Progress Counter -->
        <div class="p-4 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-sm">
          <div>
            <span class="text-xs text-on-surface-variant block">Status Kesiapan Keamanan Anda:</span>
            <span id="checklist-counter-text" class="text-sm font-bold text-secondary">0 dari 11 Poin Terpenuhi</span>
          </div>
          <button id="btn-reset-checklist" class="px-3.5 py-1.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors">
            Reset Checklist
          </button>
        </div>
      </div>
    `;
  }

  function initChecklistEvents(container) {
    const checkboxes = container.querySelectorAll('.checklist-item-checkbox');
    const counterText = container.querySelector('#checklist-counter-text');
    const resetBtn = container.querySelector('#btn-reset-checklist');

    const updateChecklist = () => {
      let checkedCount = 0;
      checkboxes.forEach(cb => {
        const textSpan = cb.parentElement.querySelector('.checklist-item-text');
        if (cb.checked) {
          checkedCount++;
          if (textSpan) textSpan.classList.add('line-through', 'text-outline');
        } else {
          if (textSpan) textSpan.classList.remove('line-through', 'text-outline');
        }
      });

      if (counterText) {
        counterText.textContent = `${checkedCount} dari ${checkboxes.length} Poin Terpenuhi`;
        if (checkedCount === checkboxes.length) {
          counterText.className = 'text-sm font-bold text-on-tertiary-container';
          if (S.showToast) S.showToast('Luar biasa! Seluruh 11 poin perlindungan telah Anda verifikasi.', 'success');
        } else {
          counterText.className = 'text-sm font-bold text-secondary';
        }
      }
    };

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateChecklist);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => {
          cb.checked = false;
        });
        updateChecklist();
        if (S.showToast) S.showToast('Checklist direset', 'info');
      });
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  S.renderChecklist = renderChecklist;
  S.initChecklistEvents = initChecklistEvents;
})(window.Scamora);
