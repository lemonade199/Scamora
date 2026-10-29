/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/community.js - Ruang Berbagi Pengalaman (Komunitas P2 - Tahap Lanjutan)
 * Desain Visual Stitch Material 3 Cyber Console
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  const COMMUNITY_POSTS = [
    {
      id: 'post-1',
      author: 'Pengguna #4029',
      date: '2 jam yang lalu',
      title: 'Hampir terkena modus link undangan pernikahan .APK di WhatsApp',
      summary: 'Dapat pesan dari nomor tidak dikenal mengaku teman lama mengirimi berkas "Undangan.apk". Setelah saya cek di Scamora dan panduan, ternyata modus pencurian SMS OTP.',
      upvotes: 38,
      category: 'Modus Malware APK'
    },
    {
      id: 'post-2',
      author: 'Pengguna #1184',
      date: 'Kemarin',
      title: 'Waspada link pendaftaran lowongan kerja paruh waktu rating hotel',
      summary: 'Di awal dikasih komisi Rp30.000 asli, tapi saat tugas level 3 diminta deposit uang Rp500.000 untuk saldo modal. Beruntung saya ingat rumus uang muka di platform ini.',
      upvotes: 64,
      category: 'Lowongan Kerja Palsu'
    },
    {
      id: 'post-3',
      author: 'Pengguna #8721',
      date: '3 hari yang lalu',
      title: 'Domain tiruan bank dengan akhiran .top dan form login persis asli',
      summary: 'URL-nya klikbca.update-tarif-baru.top. Tampilannya sangat mirip portal asli, tetapi tidak ada gembok HTTPS dan saat dicek di URL Checker skor bahayanya tinggi.',
      upvotes: 91,
      category: 'Phishing Perbankan'
    }
  ];

  function renderCommunityView() {
    return `
      <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        
        <div class="space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
            <span class="material-symbols-outlined text-[16px]">forum</span>
            Ruang Berbagi Pengalaman &bull; Tahap Lanjutan (P2)
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Edukasi & Komunitas Peduli Kejahatan Digital</h1>
          <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Wadah kolaboratif masyarakat untuk saling mengingatkan mengenai variasi narasi penipuan baru yang beredar di masyarakat.
          </p>
        </div>

        <!-- Community Safety Label Wajib -->
        <div class="p-4 rounded-xl bg-surface-container border border-surface-container-high flex items-start gap-3 shadow-sm">
          <span class="material-symbols-outlined text-[20px] text-secondary shrink-0 mt-0.5">policy</span>
          <div class="space-y-1">
            <h3 class="text-xs font-bold text-on-surface uppercase tracking-wider">Community Safety Label & Kebijakan Moderasi</h3>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Ini adalah pengalaman dan laporan subjektif pengguna, <strong>bukan bukti hukum mutlak</strong> bahwa pihak tertentu melakukan tindak pidana penipuan. Seluruh nomor rekening, nomor telepon, dan nama perorangan disanitasi secara otomatis untuk mencegah doxxing dan pencemaran nama baik.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-xs font-bold text-on-surface">Diskusi & Wawasan Terbaru:</span>
          <button id="btn-open-share-modal" class="px-4 py-2 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary-container transition-all shadow-sm flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>Bagikan Pengalaman Anda</span>
          </button>
        </div>

        <!-- Feed List -->
        <div class="space-y-4">
          ${COMMUNITY_POSTS.map(post => `
            <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-full bg-surface-container text-secondary font-mono text-xs flex items-center justify-center font-bold">
                    ${post.author.slice(-2)}
                  </span>
                  <div>
                    <span class="text-xs font-bold text-on-surface block leading-tight">${escapeHtml(post.author)}</span>
                    <span class="text-[10px] text-on-surface-variant">${escapeHtml(post.date)}</span>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface-container text-secondary">
                  ${escapeHtml(post.category)}
                </span>
              </div>

              <h3 class="text-sm font-bold text-on-surface">${escapeHtml(post.title)}</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">${escapeHtml(post.summary)}</p>

              <div class="pt-3 border-t border-surface-container flex items-center justify-between">
                <button class="community-like-btn text-xs text-on-surface-variant hover:text-secondary flex items-center gap-1.5 transition-colors">
                  <span class="material-symbols-outlined text-[16px]">thumb_up</span>
                  <span>Membantu (${post.upvotes})</span>
                </button>
                <span class="text-[11px] text-outline italic">Terverifikasi Bebas PII</span>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  S.renderCommunityView = renderCommunityView;
})(window.Scamora);
