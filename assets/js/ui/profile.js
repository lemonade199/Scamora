/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/profile.js - Halaman Profil Pengguna Interaktif (Mockup)
 * Desain Visual Stitch Material 3 Cyber Console (MIT-Week 2026)
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  // Data Profil Pengguna Fiktif (Default State In-Memory)
  const defaultProfileData = {
    fullName: 'Arya Pratama, S.Kom.',
    email: 'arya.pratama@security-research.id',
    phone: '+62 812-9842-7710',
    organization: 'Komunitas Riset Keamanan Siber & Edukasi Digital',
    location: 'Jakarta Selatan, DKI Jakarta',
    bio: 'Security enthusiast dan edukator literasi digital. Berfokus pada perlindungan masyarakat dari modus phishing, rekayasa sosial, dan pencurian data pribadi.',
    memberId: 'SCM-89421-ID',
    tier: 'Guardian Elite',
    tierLevel: 'Level 3 Verified',
    joinDate: '12 Maret 2026',
    status: 'Terverifikasi',
    twoFactorEnabled: true,
    autoScrubPII: true,
    highRiskAlert: true,
    aggressiveDetection: false,
    language: 'id',
    theme: 'light',
    lastPasswordChange: '14 hari yang lalu',
    stats: {
      urlsChecked: 42,
      chatsAnalyzed: 18,
      threatsBlocked: 14,
      securityScore: 98,
      quizCompleted: 5
    },
    activeSessions: [
      {
        id: 'sess-1',
        device: 'Chrome 128 &bull; Windows 11',
        location: 'Jakarta Selatan, Indonesia',
        ip: '180.252.164.***',
        time: 'Aktif sekarang',
        current: true
      },
      {
        id: 'sess-2',
        device: 'Scamora Web App &bull; Android 15',
        location: 'Bandung, Jawa Barat',
        ip: '114.122.38.***',
        time: 'Kemarin, 21:40 WIB',
        current: false
      }
    ]
  };

  // State Profil yang sedang aktif
  let currentProfile = JSON.parse(JSON.stringify(defaultProfileData));
  let isEditing = false;
  let activeTab = 'info'; // 'info' | 'security' | 'preferences'

  function renderProfilePage(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
        
        <!-- HEADER HALAMAN PROFIL -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-container">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
              <span class="material-symbols-outlined text-[16px]">account_circle</span>
              <span>Identitas & Keamanan Akun</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Profil Saya</h1>
            <p class="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Kelola informasi identitas akun, kredensial keamanan, tingkat verifikasi Scamora Guardian, dan preferensi privasi Anda.
            </p>
          </div>

          <!-- Mode Badge & Quick Action -->
          <div class="flex items-center gap-2.5 shrink-0">
            ${isEditing ? `
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/30 font-mono text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Mode Pengeditan Aktif
              </span>
            ` : `
              <button id="btn-toggle-edit" class="px-4 py-2 rounded-xl bg-secondary text-white font-semibold text-xs sm:text-sm hover:bg-secondary-container transition-all shadow-sm flex items-center gap-2 group">
                <span class="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">edit</span>
                <span>Edit Profil</span>
              </button>
            `}
          </div>
        </div>

        <!-- MAIN LAYOUT GRID (Kiri: Kartu Identitas & Stats | Kanan: Detail & Pengaturan) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- KOLOM KIRI (KARTU PROFIL UTAMA & STATS) -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- Kartu Identitas Pengguna -->
            <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-36 h-36 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

              <!-- Avatar & Status -->
              <div class="flex flex-col items-center text-center space-y-4">
                <div class="relative">
                  <!-- Avatar Lingkaran dengan Inisial & Gradient Cyber -->
                  <div class="w-24 h-24 rounded-2xl bg-gradient-to-tr from-secondary via-secondary-container to-on-tertiary-container flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-secondary/25 border-4 border-surface-container-lowest">
                    ${getInitials(currentProfile.fullName)}
                  </div>
                  <!-- Dot Status Online / Terverifikasi -->
                  <div class="absolute -bottom-1 -right-1 p-1 bg-surface-container-lowest rounded-full shadow" title="Akun Terverifikasi & Aktif">
                    <span class="flex h-5 w-5 rounded-full bg-emerald-500 items-center justify-center text-white">
                      <span class="material-symbols-outlined text-[13px] font-bold">check</span>
                    </span>
                  </div>
                </div>

                <div class="space-y-1">
                  <h2 class="text-lg font-bold text-on-surface tracking-tight">${escapeHtml(currentProfile.fullName)}</h2>
                  <p class="text-xs font-mono text-on-surface-variant break-all">${escapeHtml(currentProfile.email)}</p>
                </div>

                <!-- Tier Badge -->
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-mono text-xs font-semibold">
                  <span class="material-symbols-outlined text-[16px] text-amber-500">verified</span>
                  <span>${escapeHtml(currentProfile.tier)}</span>
                  <span class="text-outline-variant font-mono">&bull;</span>
                  <span class="text-[11px] text-on-surface-variant">${escapeHtml(currentProfile.tierLevel)}</span>
                </div>
              </div>

              <!-- Quick Security Metrics (Grid 2x2) -->
              <div class="pt-4 border-t border-surface-container">
                <p class="text-[11px] font-mono font-bold uppercase tracking-wider text-outline mb-3">Ringkasan Aktivitas Edukasi</p>
                <div class="grid grid-cols-2 gap-2.5">
                  <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-0.5">
                    <span class="text-[10px] text-on-surface-variant uppercase font-mono">Cek URL</span>
                    <p class="text-lg font-extrabold text-on-surface">${currentProfile.stats.urlsChecked}</p>
                    <span class="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[12px]">verified</span> 100% Aman
                    </span>
                  </div>

                  <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-0.5">
                    <span class="text-[10px] text-on-surface-variant uppercase font-mono">Chat Dianalisis</span>
                    <p class="text-lg font-extrabold text-on-surface">${currentProfile.stats.chatsAnalyzed}</p>
                    <span class="text-[10px] text-secondary font-semibold flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[12px]">shield</span> AI Filter
                    </span>
                  </div>

                  <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-0.5">
                    <span class="text-[10px] text-on-surface-variant uppercase font-mono">Ancaman Dicegah</span>
                    <p class="text-lg font-extrabold text-error">${currentProfile.stats.threatsBlocked}</p>
                    <span class="text-[10px] text-error font-semibold flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[12px]">block</span> Terdeteksi
                    </span>
                  </div>

                  <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-0.5">
                    <span class="text-[10px] text-on-surface-variant uppercase font-mono">Skor Keamanan</span>
                    <p class="text-lg font-extrabold text-on-tertiary-container">${currentProfile.stats.securityScore}%</p>
                    <span class="text-[10px] text-on-tertiary-container font-semibold flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[12px]">check_circle</span> Sangat Baik
                    </span>
                  </div>
                </div>
              </div>

              <!-- Metadata Akun Singkat -->
              <div class="space-y-2.5 pt-4 border-t border-surface-container text-xs">
                <div class="flex items-center justify-between text-on-surface-variant">
                  <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-outline">badge</span>
                    <span>ID Anggota</span>
                  </span>
                  <span class="font-mono font-semibold text-on-surface">${escapeHtml(currentProfile.memberId)}</span>
                </div>

                <div class="flex items-center justify-between text-on-surface-variant">
                  <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
                    <span>Terdaftar Sejak</span>
                  </span>
                  <span class="font-medium text-on-surface">${escapeHtml(currentProfile.joinDate)}</span>
                </div>

                <div class="flex items-center justify-between text-on-surface-variant">
                  <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-outline">security</span>
                    <span>Protokol Keamanan</span>
                  </span>
                  <span class="font-mono text-[11px] text-secondary font-bold">Zero-Plaintext v2.6</span>
                </div>
              </div>

              <!-- Tombol Keluar Akun (Aksi Akun) -->
              <div class="pt-2">
                <button id="btn-logout" class="w-full py-2.5 px-3 rounded-xl border border-error/30 text-error hover:bg-error/5 text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-[16px]">logout</span>
                  <span>Keluar dari Akun</span>
                </button>
              </div>

            </div>

            <!-- Card Edukasi Privasi Cepat -->
            <div class="p-4 rounded-2xl bg-surface-container border border-surface-container-high space-y-2">
              <div class="flex items-center gap-2 text-secondary font-bold text-xs">
                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Standar Kedaulatan Data</span>
              </div>
              <p class="text-[11px] text-on-surface-variant leading-relaxed">
                Scamora tidak pernah menyimpan kata sandi Anda dalam bentuk teks mentah. Seluruh pengujian tautan dan pesan diproses dengan perlindungan sensor PII otomatis di peramban Anda.
              </p>
            </div>

          </div>

          <!-- KOLOM KANAN (DETAIL INFORMASI, KEAMANAN, & PREFERENSI) -->
          <div class="lg:col-span-8 space-y-6">
            
            <!-- TAB NAVIGASI BAGIAN PROFIL -->
            <div class="flex items-center gap-2 border-b border-surface-container pb-2 overflow-x-auto">
              <button id="tab-btn-info" class="tab-profile-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${activeTab === 'info' ? 'bg-surface-container text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}">
                <span class="material-symbols-outlined text-[18px] text-secondary">person</span>
                <span>Informasi Pribadi</span>
              </button>

              <button id="tab-btn-security" class="tab-profile-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${activeTab === 'security' ? 'bg-surface-container text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}">
                <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">lock_person</span>
                <span>Keamanan & Sandi</span>
              </button>

              <button id="tab-btn-preferences" class="tab-profile-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${activeTab === 'preferences' ? 'bg-surface-container text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}">
                <span class="material-symbols-outlined text-[18px] text-secondary">tune</span>
                <span>Preferensi Akun</span>
              </button>
            </div>

            <!-- KONTEN TAB 1: INFORMASI PRIBADI -->
            <div id="section-info" class="${activeTab === 'info' ? 'block' : 'hidden'} space-y-6">
              
              <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm space-y-6">
                
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <h3 class="text-base font-bold text-on-surface tracking-tight">Data Informasi Pribadi</h3>
                    <p class="text-xs text-on-surface-variant">Informasi identitas yang digunakan untuk kredensial sertifikat Guardian dan komunikasi keamanan.</p>
                  </div>
                  ${!isEditing ? `
                    <button id="btn-edit-inline" class="text-xs font-semibold text-secondary hover:text-secondary-container flex items-center gap-1 hover:underline">
                      <span class="material-symbols-outlined text-[16px]">edit</span>
                      <span>Ubah</span>
                    </button>
                  ` : ''}
                </div>

                ${isEditing ? renderEditForm() : renderViewDetails()}

              </div>

            </div>

            <!-- KONTEN TAB 2: KEAMANAN & SANDI -->
            <div id="section-security" class="${activeTab === 'security' ? 'block' : 'hidden'} space-y-6">
              
              <!-- Card Pengaturan Sandi -->
              <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm space-y-5">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <h3 class="text-base font-bold text-on-surface tracking-tight">Kata Sandi Akun</h3>
                    <p class="text-xs text-on-surface-variant">Pastikan kata sandi Anda menggunakan kombinasi huruf besar, angka, dan simbol khusus.</p>
                  </div>
                  <button id="btn-open-pwd-modal" class="px-3.5 py-1.5 rounded-xl border border-surface-container hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-secondary">key</span>
                    <span>Ubah Kata Sandi</span>
                  </button>
                </div>

                <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                      <span class="material-symbols-outlined text-[20px]">password</span>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-on-surface">Status Kekuatan: Sangat Kuat</p>
                      <p class="text-[11px] text-on-surface-variant">Terakhir diperbarui ${escapeHtml(currentProfile.lastPasswordChange)}</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold">
                    <span class="material-symbols-outlined text-[13px]">check_circle</span> Aman
                  </span>
                </div>
              </div>

              <!-- Card Autentikasi Dua Faktor (2FA) -->
              <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm space-y-5">
                <div class="flex items-start justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <h3 class="text-base font-bold text-on-surface tracking-tight">Autentikasi Dua Faktor (2FA)</h3>
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700">Disarankan</span>
                    </div>
                    <p class="text-xs text-on-surface-variant leading-relaxed">
                      Tambahkan lapisan perlindungan ekstra menggunakan aplikasi authenticator (Google Authenticator / Aegis) saat mengakses akun dari lokasi baru.
                    </p>
                  </div>

                  <!-- Toggle Switch 2FA -->
                  <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input type="checkbox" id="toggle-2fa" class="sr-only peer" ${currentProfile.twoFactorEnabled ? 'checked' : ''}>
                    <div class="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                <div class="p-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex items-center justify-between">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-secondary">security_update_good</span>
                    <span>Metode: Aplikasi TOTP / Kunci Akses Kriptografis</span>
                  </span>
                  <span class="font-mono text-[11px] font-semibold text-secondary">Aktif</span>
                </div>
              </div>

              <!-- Card Sesi Aktif -->
              <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <h3 class="text-base font-bold text-on-surface tracking-tight">Sesi Login Perangkat</h3>
                    <p class="text-xs text-on-surface-variant">Daftar peramban dan perangkat yang saat ini memiliki otorisasi aktif ke akun ini.</p>
                  </div>
                  <button id="btn-terminate-sessions" class="text-xs text-error hover:text-red-700 font-semibold flex items-center gap-1 transition-colors">
                    <span class="material-symbols-outlined text-[16px]">phonelink_erase</span>
                    <span>Keluar dari Perangkat Lain</span>
                  </button>
                </div>

                <div class="space-y-3">
                  ${currentProfile.activeSessions.map(sess => `
                    <div class="p-3.5 rounded-xl border ${sess.current ? 'border-secondary/40 bg-secondary/5' : 'border-surface-container bg-surface-container-lowest'} flex items-start sm:items-center justify-between gap-3">
                      <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-lg bg-surface-container text-on-surface flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                          <span class="material-symbols-outlined text-[18px]">${sess.current ? 'computer' : 'smartphone'}</span>
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-on-surface">${sess.device}</span>
                            ${sess.current ? `
                              <span class="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-secondary text-white">Sesi Ini</span>
                            ` : ''}
                          </div>
                          <p class="text-[11px] text-on-surface-variant">${sess.location} &bull; IP: <span class="font-mono">${sess.ip}</span></p>
                        </div>
                      </div>
                      <span class="text-[11px] font-mono text-outline shrink-0">${sess.time}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

            </div>

            <!-- KONTEN TAB 3: PREFERENSI AKUN -->
            <div id="section-preferences" class="${activeTab === 'preferences' ? 'block' : 'hidden'} space-y-6">
              
              <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm space-y-6">
                
                <div class="space-y-1">
                  <h3 class="text-base font-bold text-on-surface tracking-tight">Preferensi & Kontrol Privasi Deteksi</h3>
                  <p class="text-xs text-on-surface-variant">Sesuaikan tingkat kepekaan AI, peringatan dini otomatis, dan perlindungan privasi interaktif.</p>
                </div>

                <div class="space-y-4 divide-y divide-surface-container">
                  
                  <!-- Toggle 1: Notifikasi Bahaya Tinggi -->
                  <div class="pt-4 first:pt-0 flex items-start justify-between gap-4">
                    <div class="space-y-0.5">
                      <h4 class="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px] text-secondary">notifications_active</span>
                        Peringatan Dini Bahaya Kritis
                      </h4>
                      <p class="text-xs text-on-surface-variant leading-relaxed">
                        Tampilkan banner pop-up peringatan seketika jika URL atau teks WhatsApp terindikasi memiliki skor risiko kejahatan di atas 70%.
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input type="checkbox" id="pref-high-risk" class="sr-only peer" ${currentProfile.highRiskAlert ? 'checked' : ''}>
                      <div class="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <!-- Toggle 2: Auto Scrub PII -->
                  <div class="pt-4 flex items-start justify-between gap-4">
                    <div class="space-y-0.5">
                      <h4 class="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">enhanced_encryption</span>
                        Penyensoran Otomatis Data Pribadi (Auto-PII Scrubbing)
                      </h4>
                      <p class="text-xs text-on-surface-variant leading-relaxed">
                        Secara otomatis menyamarkan NIK, nomor rekening bank, dan nomor telepon seluler sebelum dikirim ke mesin analisis AI.
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input type="checkbox" id="pref-scrub-pii" class="sr-only peer" ${currentProfile.autoScrubPII ? 'checked' : ''}>
                      <div class="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <!-- Toggle 3: Aggressive Detection Mode -->
                  <div class="pt-4 flex items-start justify-between gap-4">
                    <div class="space-y-0.5">
                      <h4 class="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px] text-amber-500">troubleshoot</span>
                        Mode Heuristik Mendalam (Aggressive Analysis)
                      </h4>
                      <p class="text-xs text-on-surface-variant leading-relaxed">
                        Memeriksa karakter punycode/homoglyph secara ekstra ketat pada nama domain, cocok untuk analis keamanan digital.
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input type="checkbox" id="pref-aggressive" class="sr-only peer" ${currentProfile.aggressiveDetection ? 'checked' : ''}>
                      <div class="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                </div>

                <!-- Dropdown Preferensi Tampilan & Bahasa -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-surface-container">
                  <div class="space-y-1.5">
                    <label for="pref-language" class="block text-xs font-semibold text-on-surface">Bahasa Antarmuka</label>
                    <select id="pref-language" class="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
                      <option value="id" ${currentProfile.language === 'id' ? 'selected' : ''}>Bahasa Indonesia (Standar)</option>
                      <option value="en" ${currentProfile.language === 'en' ? 'selected' : ''}>English (US)</option>
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label for="pref-theme" class="block text-xs font-semibold text-on-surface">Tema Tampilan</label>
                    <select id="pref-theme" class="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
                      <option value="light" ${currentProfile.theme === 'light' ? 'selected' : ''}>Cyber Light (Konsol Standar)</option>
                      <option value="system" ${currentProfile.theme === 'system' ? 'selected' : ''}>Mengikuti Sistem Operasi</option>
                    </select>
                  </div>
                </div>

                <div class="flex justify-end pt-2">
                  <button id="btn-save-preferences" class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm">
                    <span class="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Preferensi</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- MODAL UBAH KATA SANDI (MOCKUP INTERAKTIF) -->
      <div id="modal-password" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-md transition-opacity duration-300 opacity-0 pointer-events-none">
        <div class="relative w-full max-w-md bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 space-y-5 transform scale-95 transition-transform duration-300">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">lock_reset</span>
              </div>
              <h3 class="text-base font-bold text-on-surface">Ubah Kata Sandi</h3>
            </div>
            <button id="btn-close-pwd-modal" class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <form id="form-change-password" class="space-y-4">
            <div class="space-y-1">
              <label for="input-old-pwd" class="block text-xs font-semibold text-on-surface">Kata Sandi Saat Ini</label>
              <input type="password" id="input-old-pwd" placeholder="Masukkan sandi lama..." required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
            </div>

            <div class="space-y-1">
              <label for="input-new-pwd" class="block text-xs font-semibold text-on-surface">Kata Sandi Baru</label>
              <input type="password" id="input-new-pwd" placeholder="Minimal 8 karakter unik..." minlength="8" required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
              <p class="text-[10px] text-outline">Gunakan perpaduan huruf, angka, dan karakter simbol.</p>
            </div>

            <div class="space-y-1">
              <label for="input-confirm-pwd" class="block text-xs font-semibold text-on-surface">Konfirmasi Kata Sandi Baru</label>
              <input type="password" id="input-confirm-pwd" placeholder="Ketik ulang sandi baru..." minlength="8" required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-2">
              <button type="button" id="btn-cancel-pwd" class="px-4 py-2 rounded-xl border border-surface-container hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors">
                Batal
              </button>
              <button type="submit" class="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary-container transition-all shadow-sm">
                Perbarui Kata Sandi
              </button>
            </div>
          </form>

        </div>
      </div>

      <!-- MODAL KONFIRMASI KELUAR AKUN -->
      <div id="modal-logout" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-md transition-opacity duration-300 opacity-0 pointer-events-none">
        <div class="relative w-full max-w-sm bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl p-6 space-y-4 transform scale-95 transition-transform duration-300 text-center">
          <div class="w-12 h-12 rounded-2xl bg-error/10 text-error mx-auto flex items-center justify-center">
            <span class="material-symbols-outlined text-[28px]">logout</span>
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-on-surface">Keluar dari Akun?</h3>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Anda akan keluar dari sesi akun Scamora AI saat ini. Sesi lokal Anda akan diamankan sesuai standar privasi.
            </p>
          </div>
          <div class="flex items-center justify-center gap-2.5 pt-2">
            <button id="btn-cancel-logout" class="flex-1 py-2 rounded-xl border border-surface-container hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors">
              Batal
            </button>
            <button id="btn-confirm-logout" class="flex-1 py-2 rounded-xl bg-error text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm">
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
    `;

    // Pasang Event Listeners
    setupProfileEventListeners(container);
  }

  // Render Mode Tampilan (Read-Only)
  function renderViewDetails() {
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
          <span class="text-[11px] font-mono text-outline uppercase">Nama Lengkap</span>
          <p class="text-sm font-semibold text-on-surface">${escapeHtml(currentProfile.fullName)}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
          <span class="text-[11px] font-mono text-outline uppercase">Alamat Email</span>
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-on-surface">${escapeHtml(currentProfile.email)}</p>
            <span class="material-symbols-outlined text-[16px] text-emerald-600" title="Email Terverifikasi">check_circle</span>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
          <span class="text-[11px] font-mono text-outline uppercase">Nomor Telepon</span>
          <p class="text-sm font-semibold text-on-surface">${escapeHtml(currentProfile.phone)}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
          <span class="text-[11px] font-mono text-outline uppercase">Domisili / Wilayah</span>
          <p class="text-sm font-semibold text-on-surface">${escapeHtml(currentProfile.location)}</p>
        </div>

        <div class="sm:col-span-2 p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
          <span class="text-[11px] font-mono text-outline uppercase">Organisasi / Lembaga Afiliasi</span>
          <p class="text-sm font-semibold text-on-surface">${escapeHtml(currentProfile.organization)}</p>
        </div>

        <div class="sm:col-span-2 p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
          <span class="text-[11px] font-mono text-outline uppercase">Bio Keamanan & Profil Riset</span>
          <p class="text-xs text-on-surface-variant leading-relaxed">${escapeHtml(currentProfile.bio)}</p>
        </div>

      </div>

      <!-- Quick Action di Bawah Mode Lihat -->
      <div class="pt-4 flex items-center justify-end">
        <button id="btn-edit-bottom" class="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 border border-surface-container-high">
          <span class="material-symbols-outlined text-[16px] text-secondary">edit</span>
          <span>Buka Form Edit Profil</span>
        </button>
      </div>
    `;
  }

  // Render Mode Edit (Form Input)
  function renderEditForm() {
    return `
      <form id="form-edit-profile" class="space-y-4">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div class="space-y-1">
            <label for="input-fullname" class="block text-xs font-semibold text-on-surface">Nama Lengkap <span class="text-error">*</span></label>
            <div class="relative">
              <input type="text" id="input-fullname" value="${escapeHtml(currentProfile.fullName)}" required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
            </div>
          </div>

          <div class="space-y-1">
            <label for="input-email" class="block text-xs font-semibold text-on-surface">Alamat Email <span class="text-error">*</span></label>
            <div class="relative">
              <input type="email" id="input-email" value="${escapeHtml(currentProfile.email)}" required class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
            </div>
            <p class="text-[10px] text-outline">Tautan verifikasi akan dikirimkan jika alamat diubah.</p>
          </div>

          <div class="space-y-1">
            <label for="input-phone" class="block text-xs font-semibold text-on-surface">Nomor Telepon</label>
            <input type="text" id="input-phone" value="${escapeHtml(currentProfile.phone)}" class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>

          <div class="space-y-1">
            <label for="input-location" class="block text-xs font-semibold text-on-surface">Wilayah / Domisili</label>
            <input type="text" id="input-location" value="${escapeHtml(currentProfile.location)}" class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>

          <div class="sm:col-span-2 space-y-1">
            <label for="input-org" class="block text-xs font-semibold text-on-surface">Organisasi / Lembaga</label>
            <input type="text" id="input-org" value="${escapeHtml(currentProfile.organization)}" class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>

          <div class="sm:col-span-2 space-y-1">
            <label for="input-bio" class="block text-xs font-semibold text-on-surface">Bio Singkat</label>
            <textarea id="input-bio" rows="3" class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary leading-relaxed">${escapeHtml(currentProfile.bio)}</textarea>
            <p class="text-[10px] text-outline">Maksimal 250 karakter. Teks ini tampil pada profil kontributor komunitas.</p>
          </div>

        </div>

        <!-- Tombol Aksi Simpan & Batal -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
          <button type="button" id="btn-cancel-edit" class="px-4 py-2 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">close</span>
            <span>Batal</span>
          </button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary-container transition-all flex items-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">check</span>
            <span>Simpan Perubahan</span>
          </button>
        </div>

      </form>
    `;
  }

  // Event Handlers untuk Halaman Profil
  function setupProfileEventListeners(container) {
    // 1. Tab Switching
    const tabInfo = container.querySelector('#tab-btn-info');
    const tabSec = container.querySelector('#tab-btn-security');
    const tabPref = container.querySelector('#tab-btn-preferences');

    if (tabInfo && tabSec && tabPref) {
      tabInfo.addEventListener('click', () => switchTab('info', container));
      tabSec.addEventListener('click', () => switchTab('security', container));
      tabPref.addEventListener('click', () => switchTab('preferences', container));
    }

    // 2. Toggle Mode Edit (Tombol Header, Inline, atau Bottom)
    const btnToggleEdit = container.querySelector('#btn-toggle-edit');
    const btnEditInline = container.querySelector('#btn-edit-inline');
    const btnEditBottom = container.querySelector('#btn-edit-bottom');

    [btnToggleEdit, btnEditInline, btnEditBottom].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          isEditing = true;
          activeTab = 'info';
          renderProfilePage(container);
          S.showToast('Mode edit profil dibuka. Silakan sesuaikan data Anda.', 'info');
        });
      }
    });

    // 3. Tombol Batal Edit
    const btnCancelEdit = container.querySelector('#btn-cancel-edit');
    if (btnCancelEdit) {
      btnCancelEdit.addEventListener('click', () => {
        isEditing = false;
        renderProfilePage(container);
        S.showToast('Perubahan profil dibatalkan.', 'info');
      });
    }

    // 4. Form Submit Simpan Perubahan
    const formEdit = container.querySelector('#form-edit-profile');
    if (formEdit) {
      formEdit.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = container.querySelector('#input-fullname')?.value.trim();
        const emailVal = container.querySelector('#input-email')?.value.trim();
        const phoneVal = container.querySelector('#input-phone')?.value.trim();
        const locationVal = container.querySelector('#input-location')?.value.trim();
        const orgVal = container.querySelector('#input-org')?.value.trim();
        const bioVal = container.querySelector('#input-bio')?.value.trim();

        if (!nameVal || !emailVal) {
          S.showToast('Nama lengkap dan email tidak boleh kosong!', 'error');
          return;
        }

        // Simpan data fiktif ke memori
        currentProfile.fullName = nameVal;
        currentProfile.email = emailVal;
        currentProfile.phone = phoneVal || currentProfile.phone;
        currentProfile.location = locationVal || currentProfile.location;
        currentProfile.organization = orgVal || currentProfile.organization;
        currentProfile.bio = bioVal || currentProfile.bio;

        isEditing = false;
        renderProfilePage(container);

        // Update badge avatar di navbar jika ada
        updateNavbarAvatarText(currentProfile.fullName);

        S.showToast('Perubahan profil berhasil disimpan!', 'success');
      });
    }

    // 5. Preferensi Simpan
    const btnSavePref = container.querySelector('#btn-save-preferences');
    if (btnSavePref) {
      btnSavePref.addEventListener('click', () => {
        const highRisk = container.querySelector('#pref-high-risk')?.checked;
        const scrubPII = container.querySelector('#pref-scrub-pii')?.checked;
        const aggressive = container.querySelector('#pref-aggressive')?.checked;
        const lang = container.querySelector('#pref-language')?.value;
        const thm = container.querySelector('#pref-theme')?.value;

        currentProfile.highRiskAlert = !!highRisk;
        currentProfile.autoScrubPII = !!scrubPII;
        currentProfile.aggressiveDetection = !!aggressive;
        currentProfile.language = lang || 'id';
        currentProfile.theme = thm || 'light';

        S.showToast('Preferensi akun dan proteksi privasi berhasil disimpan!', 'success');
      });
    }

    // 6. Toggle 2FA Langsung
    const toggle2fa = container.querySelector('#toggle-2fa');
    if (toggle2fa) {
      toggle2fa.addEventListener('change', () => {
        currentProfile.twoFactorEnabled = toggle2fa.checked;
        if (toggle2fa.checked) {
          S.showToast('Autentikasi Dua Faktor (2FA) berhasil diaktifkan.', 'success');
        } else {
          S.showToast('Peringatan: 2FA dinonaktifkan. Akun Anda lebih rentan.', 'warning');
        }
      });
    }

    // 7. Hentikan Sesi Lain
    const btnTerminate = container.querySelector('#btn-terminate-sessions');
    if (btnTerminate) {
      btnTerminate.addEventListener('click', () => {
        currentProfile.activeSessions = currentProfile.activeSessions.filter(s => s.current);
        renderProfilePage(container);
        S.showToast('Seluruh sesi perangkat lain telah berhasil dihentikan.', 'success');
      });
    }

    // 8. Modal Ubah Kata Sandi
    setupPasswordModal(container);

    // 9. Modal Logout
    setupLogoutModal(container);
  }

  function switchTab(tabName, container) {
    activeTab = tabName;
    const secInfo = container.querySelector('#section-info');
    const secSec = container.querySelector('#section-security');
    const secPref = container.querySelector('#section-preferences');

    const tabInfo = container.querySelector('#tab-btn-info');
    const tabSec = container.querySelector('#tab-btn-security');
    const tabPref = container.querySelector('#tab-btn-preferences');

    if (secInfo && secSec && secPref) {
      secInfo.classList.toggle('hidden', tabName !== 'info');
      secSec.classList.toggle('hidden', tabName !== 'security');
      secPref.classList.toggle('hidden', tabName !== 'preferences');
    }

    const tabs = [
      { id: 'info', btn: tabInfo },
      { id: 'security', btn: tabSec },
      { id: 'preferences', btn: tabPref }
    ];

    tabs.forEach(t => {
      if (t.btn) {
        if (t.id === tabName) {
          t.btn.classList.add('bg-surface-container', 'text-on-surface', 'shadow-sm');
          t.btn.classList.remove('text-on-surface-variant');
        } else {
          t.btn.classList.remove('bg-surface-container', 'text-on-surface', 'shadow-sm');
          t.btn.classList.add('text-on-surface-variant');
        }
      }
    });
  }

  function setupPasswordModal(container) {
    const modal = container.querySelector('#modal-password');
    const btnOpen = container.querySelector('#btn-open-pwd-modal');
    const btnClose = container.querySelector('#btn-close-pwd-modal');
    const btnCancel = container.querySelector('#btn-cancel-pwd');
    const formPwd = container.querySelector('#form-change-password');

    const openModal = () => {
      if (!modal) return;
      modal.classList.remove('opacity-0', 'pointer-events-none');
      const dialog = modal.querySelector('div');
      if (dialog) dialog.classList.remove('scale-95');
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.add('opacity-0', 'pointer-events-none');
      const dialog = modal.querySelector('div');
      if (dialog) dialog.classList.add('scale-95');
      if (formPwd) formPwd.reset();
    };

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (formPwd) {
      formPwd.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPwd = container.querySelector('#input-new-pwd')?.value;
        const confirmPwd = container.querySelector('#input-confirm-pwd')?.value;

        if (newPwd !== confirmPwd) {
          S.showToast('Konfirmasi kata sandi baru tidak cocok!', 'error');
          return;
        }

        currentProfile.lastPasswordChange = 'Baru saja diubah';
        closeModal();
        renderProfilePage(container);
        S.showToast('Kata sandi akun Anda berhasil diperbarui!', 'success');
      });
    }
  }

  function setupLogoutModal(container) {
    const modal = container.querySelector('#modal-logout');
    const btnLogout = container.querySelector('#btn-logout');
    const btnCancel = container.querySelector('#btn-cancel-logout');
    const btnConfirm = container.querySelector('#btn-confirm-logout');

    const openModal = () => {
      if (!modal) return;
      modal.classList.remove('opacity-0', 'pointer-events-none');
      const dialog = modal.querySelector('div');
      if (dialog) dialog.classList.remove('scale-95');
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.add('opacity-0', 'pointer-events-none');
      const dialog = modal.querySelector('div');
      if (dialog) dialog.classList.add('scale-95');
    };

    if (btnLogout) btnLogout.addEventListener('click', openModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        closeModal();
        S.showToast('Sesi Anda telah diakhiri secara aman. (Mockup logout)', 'info');
        // Kembali ke halaman beranda
        window.location.hash = '#/';
      });
    }
  }

  function getInitials(name) {
    if (!name) return 'AP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function updateNavbarAvatarText(name) {
    const navName = document.querySelector('#nav-profile-name');
    if (navName) {
      const parts = name.trim().split(' ');
      navName.textContent = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
    }
    const navInitials = document.querySelector('#nav-profile-initials');
    if (navInitials) {
      navInitials.textContent = getInitials(name);
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Ekspor ke namespace Scamora
  S.renderProfilePage = renderProfilePage;
  S.getCurrentProfile = () => currentProfile;
})(window.Scamora);

