/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/knowledge.js - Scam Knowledge Center (#/pengetahuan - P1)
 * Desain Visual Stitch Material 3 Cyber Console
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  const KNOWLEDGE_ARTICLES = [
    {
      slug: 'phising',
      title: 'Phishing dan Tautan Palsu',
      icon: 'link',
      shortDesc: 'Pembuatan situs tiruan untuk menguras kredensial perbankan dan kata sandi.',
      redFlags: [
        'Alamat URL menaruh nama bank di subdomain depan (klikbca.update-data.xyz).',
        'Tidak menggunakan protokol HTTPS atau sertifikat tidak valid.',
        'Meminta pengisian PIN, nomor kartu ATM, dan kode OTP dalam satu form web.'
      ],
      prevention: [
        'Ketik langsung alamat situs resmi perbankan di address bar peramban.',
        'Periksa apakah ekstensi domain adalah .co.id atau .go.id resmi.',
        'Jangan pernah mengklik link verifikasi akun dari SMS atau pesan WhatsApp tidak dikenal.'
      ],
      fictionalCase: 'Pengguna menerima SMS bahwa token internet banking telah kedaluwarsa dan diminta login ke tautan klikbca-pembaruan.top.'
    },
    {
      slug: 'lowongan_kerja_palsu',
      title: 'Lowongan Kerja Part-Time Palsu',
      icon: 'work',
      shortDesc: 'Pekerjaan paruh waktu daring dengan iming-iming komisi harian fantastis.',
      redFlags: [
        'Tugas sangat sepele (hanya like video YouTube atau rating produk) digaji Rp500.000–Rp2.000.000 per hari.',
        'Diminta menyetor uang jaminan atau biaya deposit awal untuk membuka "tugas berbayar tinggi".',
        'Komunikasi dipindahkan ke grup Telegram dengan admin yang memamerkan bukti transfer fiktif.'
      ],
      prevention: [
        'Perusahaan kredibel TIDAK PERNAH memungut uang sepeser pun kepada pencari kerja.',
        'Lamar pekerjaan hanya melalui portal karir terpercaya (JobStreet, LinkedIn) atau situs resmi perusahaan.',
        'Segera tinggalkan grup chat jika diminta deposit uang pribadi.'
      ],
      fictionalCase: 'Korban dihubungi nomor asing via WA menawarkan tugas like video, namun di tugas ke-4 saldo terkunci dan harus deposit Rp5 juta.'
    },
    {
      slug: 'giveaway_palsu',
      title: 'Giveaway dan Hadiah Palsu',
      icon: 'redeem',
      shortDesc: 'Pemberitahuan hadiah miliaran rupiah yang meminta tebusan pajak administrasi.',
      redFlags: [
        'Mengklaim Anda memenangkan undian dari program yang sama sekali tidak pernah Anda ikuti.',
        'Diminta mentransfer pajak pemenang atau ongkos kirim ke rekening perorangan.',
        'Batas klaim sangat singkat (hanya beberapa jam) agar korban panik dan tidak sempat berpikir kritis.'
      ],
      prevention: [
        'Pajak undian resmi berizin Kemensos dipotong langsung dari nilai hadiah atau dibayar di kantor resmi.',
        'Cek pengumuman resmi di website atau media sosial resmi bercentang biru penyelenggara.',
        'Abaikan pesan dan blokir nomor pengirim.'
      ],
      fictionalCase: 'Pesan mengatasnamakan undian tahunan operator seluler meminta transfer uang Rp350.000 untuk pengiriman motor matic gratis.'
    },
    {
      slug: 'impersonasi',
      title: 'Impersonasi Pejabat / Petugas Bank',
      icon: 'badge',
      shortDesc: 'Penyamaran sebagai aparat, bankir, atau teman yang mengaku sedang darurat.',
      redFlags: [
        'Memakai foto profil logo resmi bank namun nomor WhatsApp menggunakan nomor seluler biasa (+62 8xx).',
        'Mengancam bahwa rekening Anda dibekukan jika tidak segera memberikan kode OTP/PIN.',
        'Mengarahkan untuk mengunduh berkas berekstensi .APK lewat chat (berkedok surat tilang, undangan, resi kurir).'
      ],
      prevention: [
        'Petugas bank tidak pernah meminta password, PIN ATM, atau kode OTP melalui telepon atau chat.',
        'Kontak resmi perbankan umumnya memiliki centang hijau verifikasi resmi WhatsApp Business.',
        'Tolak instalasi berkas dari luar Google Play Store atau App Store.'
      ],
      fictionalCase: 'Seseorang mengaku customer service bank meminta kode OTP 6-digit dengan alasan "sinkronisasi tarif transaksi baru".'
    },
    {
      slug: 'investasi_bodong',
      title: 'Investasi Bodong & Robot Trading',
      icon: 'trending_up',
      shortDesc: 'Tawaran keuntungan pasti tanpa risiko kerugian dalam waktu singkat.',
      redFlags: [
        'Menjanjikan return tetap 10%-30% per minggu tanpa risiko.',
        'Sistem titip dana di mana uang ditransfer ke rekening pribadi perorangan.',
        'Uang tidak bisa ditarik (withdrawal macet) dengan alasan harus membayar biaya admin tambahan.'
      ],
      prevention: [
        'Gunakan prinsip 2L: Legal (terdaftar OJK/Bappebti) dan Logis (keuntungan masuk akal).',
        'Cek legalitas entitas di Kontak OJK 157 atau situs ojk.go.id.',
        'Hindari bergabung dengan skema Ponzi piramida member-get-member.'
      ],
      fictionalCase: 'Korban ditawari investasi crypto otomatis dengan modal Rp1 juta dijanjikan cair Rp15 juta dalam 3 hari, uang tidak pernah kembali.'
    }
  ];

  function renderKnowledgeCenter(selectedSlug = null) {
    if (selectedSlug) {
      const article = KNOWLEDGE_ARTICLES.find(a => a.slug === selectedSlug);
      if (article) return renderArticleDetail(article);
    }

    return `
      <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
            <span class="material-symbols-outlined text-[16px]">menu_book</span>
            Scam Knowledge Center (P1)
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Katalog Modus Kejahatan Digital</h1>
          <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Edukasi komprehensif mengenai anatomi serangan, tanda bahaya (red flags), dan langkah proteksi untuk setiap modus penipuan.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          ${KNOWLEDGE_ARTICLES.map(art => `
            <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div class="space-y-3">
                <div class="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
                  <span class="material-symbols-outlined text-[22px]">${art.icon}</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">${escapeHtml(art.title)}</h3>
                  <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed">${escapeHtml(art.shortDesc)}</p>
                </div>
              </div>
              <div class="pt-4 mt-3 border-t border-surface-container">
                <button data-slug="${art.slug}" class="btn-read-knowledge text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
                  <span>Pelajari Anatomi Modus</span>
                  <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderArticleDetail(art) {
    return `
      <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <button id="btn-back-knowledge" class="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Katalog Modus</span>
        </button>

        <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[26px]">${art.icon}</span>
            </div>
            <div>
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-secondary">Anatomi Modus Kejahatan Digital</span>
              <h1 class="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">${escapeHtml(art.title)}</h1>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            ${escapeHtml(art.shortDesc)}
          </p>

          <div class="space-y-3">
            <h3 class="text-sm font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-error">warning</span>
              Tanda-Tanda Bahaya Utama (Red Flags):
            </h3>
            <ul class="space-y-2">
              ${art.redFlags.map(rf => `
                <li class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface">
                  <span class="material-symbols-outlined text-[16px] text-error shrink-0 mt-0.5">close</span>
                  <span>${escapeHtml(rf)}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">verified</span>
              Langkah Perlindungan yang Dianjurkan:
            </h3>
            <ul class="space-y-2">
              ${art.prevention.map(pr => `
                <li class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface">
                  <span class="material-symbols-outlined text-[16px] text-on-tertiary-container shrink-0 mt-0.5">check</span>
                  <span>${escapeHtml(pr)}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-surface-container border border-surface-container-high space-y-1">
            <span class="text-[10px] uppercase font-bold text-secondary block">Contoh Kasus Fiktif:</span>
            <p class="text-xs text-on-surface-variant italic">
              "${escapeHtml(art.fictionalCase)}"
            </p>
          </div>

          <div class="pt-4 border-t border-surface-container flex justify-between items-center">
            <button id="btn-back-knowledge-2" class="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors">
              &larr; Kembali
            </button>
            <a href="#/url" class="px-4 py-2 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary-container transition-colors shadow-sm">
              Cek Tautan Terkait
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

  S.KNOWLEDGE_ARTICLES = KNOWLEDGE_ARTICLES;
  S.renderKnowledgeCenter = renderKnowledgeCenter;
})(window.Scamora);
