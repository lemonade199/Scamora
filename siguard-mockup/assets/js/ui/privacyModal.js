/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/privacyModal.js - Modal Privacy Protection Notice Lengkap & Aksesibel
 * Desain Visual Stitch Material 3 Cyber Console
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function showPrivacyModal(onAcceptCallback = null) {
    let modalContainer = document.getElementById('privacy-modal-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'privacy-modal-container';
      modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-md transition-opacity duration-300 opacity-0 pointer-events-none';
      document.body.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
      <div class="relative w-full max-w-2xl bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform scale-95 transition-transform duration-300" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h2 id="privacy-modal-title" class="text-lg font-bold text-on-surface tracking-tight">Pemberitahuan Perlindungan Privasi</h2>
              <p class="text-xs text-on-surface-variant">Scamora AI &bull; Komitmen Keamanan Data & Zero-Plaintext Ingress</p>
            </div>
          </div>
          <button id="btn-close-privacy" class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors" aria-label="Tutup">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Konten Scrollable -->
        <div class="px-6 py-6 overflow-y-auto space-y-4 text-sm text-on-surface-variant leading-relaxed">
          <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface">
            <p class="font-semibold text-secondary mb-1 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">lock</span>
              Prinsip Privasi Tanpa Penyimpanan Mentah (Zero Plaintext Ingress)
            </p>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Scamora didesain dengan prinsip meminimalkan data (*data minimization*). Kami tidak pernah menyimpan isi percakapan atau URL mentah Anda ke basis data permanen maupun berkas catatan (*log*) peladen.
            </p>
          </div>

          <div class="space-y-2">
            <h3 class="font-semibold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">chat_bubble</span>
              1. Pemrosesan Analisis Chat WhatsApp (AI)
            </h3>
            <p class="text-xs">
              Sebelum teks percakapan diproses ke model bahasa <strong>Claude API (Anthropic)</strong> untuk pemindaian semantik, sistem melakukan <em>masking otomatis</em> lokal terhadap data pribadi seperti nomor telepon (<code class="bg-surface-container px-1 py-0.5 rounded text-secondary font-mono text-[11px]">[TELEPON]</code>), email (<code class="bg-surface-container px-1 py-0.5 rounded text-secondary font-mono text-[11px]">[EMAIL]</code>), nomor rekening (<code class="bg-surface-container px-1 py-0.5 rounded text-secondary font-mono text-[11px]">[REKENING]</code>), dan NIK. Teks dikirim semata-mata untuk analisis risiko pada sesi permintaan tersebut tanpa retensi permanen untuk pelatihan model AI publik.
            </p>
          </div>

          <div class="space-y-2">
            <h3 class="font-semibold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-secondary">link</span>
              2. Pemrosesan Pemeriksaan URL
            </h3>
            <p class="text-xs">
              Sebelum dikirim ke basis data reputasi <strong>Google Safe Browsing</strong>, URL akan dinormalisasi dan dibersihkan dari kredensial login (userinfo sebelum karakter <code class="text-xs bg-surface-container px-1 py-0.5 rounded font-mono text-secondary">@</code>) serta nilai token/kunci sensitif pada parameter kueri. Sistem tidak pernah membuka, mengeksekusi skrip, atau mengunduh berkas dari tautan tersebut.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-on-surface">
            <div class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-[20px] text-amber-600 shrink-0 mt-0.5">warning</span>
              <div class="space-y-1">
                <p class="font-semibold text-amber-800 text-xs">Batasan Masking Otomatis (Upaya Terbaik)</p>
                <p class="text-[11px] text-on-surface-variant leading-relaxed">
                  Fitur penyensoran data pribadi bekerja secara heuristik dan <strong>tidak menjamin 100%</strong> seluruh data pribadi teridentifikasi (misalnya nama panggilan tidak baku atau format rekening khusus). Pengguna sangat disarankan menyamarkan data pribadi penting sebelum menempelkan teks.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-2 text-xs">
            <h4 class="font-semibold text-on-surface">3. Ringkasan Pertukaran Data Pihak Ketiga:</h4>
            <div class="border border-surface-container rounded-xl overflow-hidden">
              <table class="w-full text-left text-xs">
                <thead class="bg-surface-container-low text-on-surface font-semibold border-b border-surface-container">
                  <tr>
                    <th class="p-2.5">Fitur</th>
                    <th class="p-2.5">Data Dikirim</th>
                    <th class="p-2.5">Penerima</th>
                    <th class="p-2.5">Tujuan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-container text-on-surface-variant">
                  <tr>
                    <td class="p-2.5 font-medium text-on-surface">URL Safety Checker</td>
                    <td class="p-2.5">URL setelah pembersihan userinfo & token</td>
                    <td class="p-2.5">Google Safe Browsing</td>
                    <td class="p-2.5">Pencocokan daftar hitam ancaman malware/phishing</td>
                  </tr>
                  <tr>
                    <td class="p-2.5 font-medium text-on-surface">WhatsApp Detector</td>
                    <td class="p-2.5">Teks percakapan hasil masking</td>
                    <td class="p-2.5">Claude API (Anthropic)</td>
                    <td class="p-2.5">Inferensi semantik indikator rekayasa sosial</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="p-3 bg-surface-container rounded-xl text-[11px] text-outline text-center">
            Prinsip Produk MIT-Week 2026: Hasil analisis adalah indikasi risiko, bukan jaminan atau vonis kebenaran mutlak.
          </div>
        </div>

        <!-- Footer Aksi -->
        <div class="px-6 py-4 border-t border-surface-container bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3">
          <span class="text-xs text-on-surface-variant text-center sm:text-left">
            Dengan menyetujui, Anda mengonfirmasi telah membaca dan memahami alur di atas.
          </span>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button id="btn-cancel-privacy" class="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors">
              Tutup
            </button>
            <button id="btn-accept-privacy" class="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary-container transition-colors shadow-sm flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>Saya Mengerti & Setuju</span>
            </button>
          </div>
        </div>

      </div>
    `;

    setTimeout(() => {
      modalContainer.classList.remove('opacity-0', 'pointer-events-none');
      const card = modalContainer.querySelector('div');
      if (card) card.classList.remove('scale-95');
    }, 10);

    function closeModal() {
      modalContainer.classList.add('opacity-0', 'pointer-events-none');
      const card = modalContainer.querySelector('div');
      if (card) card.classList.add('scale-95');
    }

    const btnClose = modalContainer.querySelector('#btn-close-privacy');
    const btnCancel = modalContainer.querySelector('#btn-cancel-privacy');
    const btnAccept = modalContainer.querySelector('#btn-accept-privacy');

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (btnAccept) {
      btnAccept.addEventListener('click', () => {
        closeModal();
        if (typeof onAcceptCallback === 'function') {
          onAcceptCallback(true);
        }
      });
    }

    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }

  S.showPrivacyModal = showPrivacyModal;
})(window.Scamora);
