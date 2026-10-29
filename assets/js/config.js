/**
 * Scamora - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: config.js - Konfigurasi Bobot Indikator, Ambang Skor, dan Data Referensi
 * Blueprint MIT-Week 2026
 */

window.Scamora = window.Scamora || {};
window.SIGUARD = window.Scamora;

(function (S) {
  const CONFIG = {
    APP_NAME: 'Scamora',
    APP_VERSION: '1.0.0-mockup',
    APP_TAGLINE: 'Deteksi Dini Potensi Penipuan Digital Berbasis AI',

    // Ambang Kategori Risiko
    THRESHOLDS: {
      HIGH_MIN: 60,
      REVIEW_MIN: 30,
      LOW_MIN: 0
    },

    // Kategori Hasil (Hanya 3 kategori resmi)
    CATEGORIES: {
      HIGH: {
        key: 'high',
        label: 'Indikasi risiko tinggi',
        color: 'red',
        bgColor: 'bg-error-container',
        borderColor: 'border-error',
        textColor: 'text-error',
        badgeBg: 'bg-error',
        description: 'Banyak atau kuat tanda bahaya; hindari bertindak atau membuka tautan sebelum diverifikasi pihak berwenang.'
      },
      REVIEW: {
        key: 'review',
        label: 'Perlu ditinjau lebih lanjut',
        color: 'amber',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/40',
        textColor: 'text-amber-700',
        badgeBg: 'bg-amber-600',
        description: 'Ada indikasi yang perlu diwaspadai atau data/pemeriksaan belum lengkap untuk menarik kesimpulan pasti.'
      },
      LOW: {
        key: 'low',
        label: 'Indikator risiko rendah',
        color: 'emerald',
        bgColor: 'bg-surface-container-high',
        borderColor: 'border-on-tertiary-container/30',
        textColor: 'text-on-tertiary-container',
        badgeBg: 'bg-on-tertiary-container',
        description: 'Tidak ditemukan tanda bahaya signifikan pada pemeriksaan lengkap. Catatan: tetap bukan jaminan 100% aman.'
      }
    },

    // Alasan Kategori
    CATEGORY_REASONS: {
      score: 'Ditetapkan berdasarkan akumulasi skor indikator risiko yang terdeteksi.',
      critical_indicator: 'Ditetapkan karena terdeteksi indikator bahaya kritis (Safe Browsing match atau permintaan OTP).',
      incomplete_check: 'Dinaikkan ke status tinjau karena pemeriksaan wajib gagal atau tidak lengkap.',
      cannot_conclude: 'Dinaikkan ke status tinjau karena bukti belum cukup konklusif untuk menarik kesimpulan pasti.'
    },

    // Jenis Penipuan (Daftar Tertutup Resmi)
    SCAM_TYPES: {
      phising: {
        key: 'phising',
        label: 'Phishing atau tautan palsu',
        description: 'Tautan atau situs yang dibuat menyerupai halaman resmi untuk mencuri data pribadi atau kredensial.'
      },
      lowongan_kerja_palsu: {
        key: 'lowongan_kerja_palsu',
        label: 'Lowongan kerja palsu',
        description: 'Tawaran kerja paruh waktu dengan komisi fantastis dan tuntutan uang di muka.'
      },
      giveaway_palsu: {
        key: 'giveaway_palsu',
        label: 'Giveaway atau hadiah palsu',
        description: 'Klaim memenangkan undian/hadiah yang meminta biaya administrasi atau verifikasi nomor rahasia.'
      },
      impersonasi: {
        key: 'impersonasi',
        label: 'Impersonasi atau penyamaran identitas',
        description: 'Penipu mengaku sebagai petugas bank, kurir, atau instansi terpercaya untuk meminta data rahasia.'
      },
      penipuan_jual_beli: {
        key: 'penipuan_jual_beli',
        label: 'Penipuan jual beli',
        description: 'Barang fiktif atau toko online palsu dengan harga miring dan pembayaran di luar rekening resmi.'
      },
      investasi_mencurigakan: {
        key: 'investasi_mencurigakan',
        label: 'Investasi atau tawaran finansial mencurigakan',
        description: 'Skema piramida, titip dana, robot trading tanpa izin dengan janji imbal hasil tetap dan instan.'
      },
      lainnya: {
        key: 'lainnya',
        label: 'Modus lain yang belum terklasifikasi',
        description: 'Indikasi penipuan terdeteksi namun belum cocok dengan kategori umum.'
      }
    },

    // Indikator URL Resmi (Tipe, Bobot, Severity, Sumber)
    URL_INDICATORS: {
      safe_browsing_match: {
        type: 'safe_browsing_match',
        label: 'Terdaftar di Database Ancaman',
        weight: 60,
        severity: 'high',
        isCritical: true,
        source: 'Reputasi',
        defaultReason: 'URL terdaftar sebagai ancaman phishing/malware pada basis data Google Safe Browsing.'
      },
      typosquatting: {
        type: 'typosquatting',
        label: 'Kemiripan Merek / Bank (Typosquatting)',
        weight: 35,
        severity: 'high',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Nama domain meniru ejaan merek terkenal atau bank dengan sedikit modifikasi huruf/karakter.'
      },
      punycode_homograph: {
        type: 'punycode_homograph',
        label: 'Karakter Punycode / Homograf',
        weight: 30,
        severity: 'high',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Domain memuat karakter Punycode (xn--) atau alfabet asing yang menyerupai huruf Latin untuk mengelabui mata.'
      },
      brand_in_subdomain: {
        type: 'brand_in_subdomain',
        label: 'Nama Merek di Subdomain',
        weight: 30,
        severity: 'high',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Nama merek resmi ditaruh pada subdomain, sementara domain utamanya adalah pihak asing yang berbeda.'
      },
      ip_host: {
        type: 'ip_host',
        label: 'Host Berupa Alamat IP',
        weight: 25,
        severity: 'medium',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Host URL langsung memakai alamat IP numerik tanpa nama domain resmi, sering digunakan server phishing sementara.'
      },
      userinfo_in_url: {
        type: 'userinfo_in_url',
        label: 'Kredensial / Simbol @ dalam URL',
        weight: 20,
        severity: 'medium',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Terdapat karakter @ atau informasi user login di dalam URL, teknik umum untuk mengalihkan pandangan host asli.'
      },
      url_shortener: {
        type: 'url_shortener',
        label: 'Layanan Pemendek URL',
        weight: 15,
        severity: 'medium',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Menggunakan pemendek tautan yang menyembunyikan alamat situs tujuan sebenarnya.'
      },
      excessive_subdomains: {
        type: 'excessive_subdomains',
        label: 'Subdomain Berlebihan (≥4 Level)',
        weight: 10,
        severity: 'low',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Struktur subdomain sangat berlapis untuk menyamarkan domain induk sebenarnya.'
      },
      risky_tld: {
        type: 'risky_tld',
        label: 'Ekstensi Domain (TLD) Berisiko Tinggi',
        weight: 10,
        severity: 'low',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Menggunakan domain level atas (TLD) murah atau gratis yang sering disalahgunakan untuk penipuan massal.'
      },
      no_https: {
        type: 'no_https',
        label: 'Tanpa Enkripsi HTTPS',
        weight: 10,
        severity: 'low',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Protokol tidak memakai HTTPS (hanya HTTP standar), transmisi data tidak terenkripsi.'
      },
      sensitive_keywords: {
        type: 'sensitive_keywords',
        label: 'Kata Kunci Pancingan Sensitif',
        weight: 10,
        severity: 'low',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Path atau query memuat kata umpan seperti login, verifikasi, otp, hadiah, atau klaim.'
      },
      unusual_port: {
        type: 'unusual_port',
        label: 'Port Jaringan Tidak Lazim',
        weight: 10,
        severity: 'low',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'URL menggunakan nomor port khusus non-standar (bukan 80 atau 443).'
      },
      long_encoded_url: {
        type: 'long_encoded_url',
        label: 'URL Sangat Panjang / Banyak Ter-encode',
        weight: 5,
        severity: 'low',
        isCritical: false,
        source: 'Struktur URL',
        defaultReason: 'Panjang URL melebihi 100 karakter atau sarat karakter persen-encoding (%XX) untuk mengaburkan isi parameter.'
      }
    },

    // Indikator Chat WhatsApp Resmi (Daftar Tertutup)
    CHAT_INDICATORS: {
      otp_request: {
        type: 'otp_request',
        label: 'Permintaan Kode OTP / PIN / Verifikasi',
        weight: 30,
        severity: 'high',
        isCritical: true,
        defaultReason: 'Pengirim meminta kode OTP, PIN, sandi, atau kode rahasia yang tidak boleh dibagikan kepada siapa pun.'
      },
      advance_fee: {
        type: 'advance_fee',
        label: 'Permintaan Transfer Uang / Biaya di Muka',
        weight: 30,
        severity: 'high',
        isCritical: false,
        defaultReason: 'Pengirim meminta transfer dana, deposit, atau biaya administrasi sebelum layanan/hadiah diberikan.'
      },
      threat_link: {
        type: 'threat_link',
        label: 'Tautan Disertai Ancaman Pemblokiran',
        weight: 30,
        severity: 'high',
        isCritical: false,
        defaultReason: 'Pesan memuat ancaman pemblokiran akun, sanksi, atau denda bila tautan tidak segera diakses.'
      },
      impersonation_data: {
        type: 'impersonation_data',
        label: 'Mengaku Pihak Resmi Meminta Data Pribadi',
        weight: 30,
        severity: 'high',
        isCritical: false,
        defaultReason: 'Mengatasnamakan institusi terpercaya (bank/e-commerce/instansi) sambil meminta data identitas atau nomor sensitif.'
      },
      unrealistic_offer: {
        type: 'unrealistic_offer',
        label: 'Tawaran Gaji / Hadiah Tidak Wajar',
        weight: 15,
        severity: 'medium',
        isCritical: false,
        defaultReason: 'Menjanjikan bayaran harian fantastis, hadiah uang jutaan tanpa ikut lomba, atau tugas mudah bergaji tinggi.'
      },
      time_pressure: {
        type: 'time_pressure',
        label: 'Tekanan Waktu Mendesak',
        weight: 15,
        severity: 'medium',
        isCritical: false,
        defaultReason: 'Mendesak korban untuk langsung mengambil keputusan dalam waktu singkat (hari ini, segera, beberapa menit).'
      },
      move_platform: {
        type: 'move_platform',
        label: 'Ajakan Pindah ke Platform Lain',
        weight: 15,
        severity: 'medium',
        isCritical: false,
        defaultReason: 'Mengarahkan komunikasi ke aplikasi lain seperti Telegram atau tautan grup chat eksternal.'
      },
      guaranteed_profit: {
        type: 'guaranteed_profit',
        label: 'Janji Keuntungan Pasti / Bebas Risiko',
        weight: 15,
        severity: 'medium',
        isCritical: false,
        defaultReason: 'Menawarkan investasi dengan iming-iming imbal hasil pasti untung tanpa ada kemungkinan rugi.'
      },
      odd_language: {
        type: 'odd_language',
        label: 'Gaya Bahasa Janggal / Terjemahan Mesin',
        weight: 5,
        severity: 'low',
        isCritical: false,
        defaultReason: 'Struktur kalimat terkesan kaku seperti translasi otomatis atau banyak saltik (typo) mencurigakan.'
      },
      unknown_sender: {
        type: 'unknown_sender',
        label: 'Sapaan Tidak Dikenal Tanpa Konteks',
        weight: 5,
        severity: 'low',
        isCritical: false,
        defaultReason: 'Pesan dari kontak baru yang mengklaim sebagai kerabat tanpa menyebutkan nama atau identitas yang jelas.'
      }
    },

    // Daftar Merek Populer Indonesia & Global untuk Cek Typosquatting & Subdomain
    KNOWN_BRANDS: [
      { name: 'bca', domain: 'bca.co.id', officialDomains: ['bca.co.id', 'klikbca.com', 'mybca.bca.co.id'] },
      { name: 'mandiri', domain: 'bankmandiri.co.id', officialDomains: ['bankmandiri.co.id', 'livinbymandiri.co.id'] },
      { name: 'bri', domain: 'bri.co.id', officialDomains: ['bri.co.id', 'ib.bri.co.id', 'brimo.bri.co.id'] },
      { name: 'bni', domain: 'bni.co.id', officialDomains: ['bni.co.id'] },
      { name: 'cimb', domain: 'cimbniaga.co.id', officialDomains: ['cimbniaga.co.id', 'octoclicks.co.id'] },
      { name: 'permata', domain: 'permatabank.com', officialDomains: ['permatabank.com'] },
      { name: 'jenius', domain: 'jenius.com', officialDomains: ['jenius.com', 'btpn.com'] },
      { name: 'jago', domain: 'jago.com', officialDomains: ['jago.com'] },
      { name: 'shopee', domain: 'shopee.co.id', officialDomains: ['shopee.co.id', 'shopee.com'] },
      { name: 'tokopedia', domain: 'tokopedia.com', officialDomains: ['tokopedia.com'] },
      { name: 'lazada', domain: 'lazada.co.id', officialDomains: ['lazada.co.id'] },
      { name: 'bukalapak', domain: 'bukalapak.com', officialDomains: ['bukalapak.com'] },
      { name: 'blibli', domain: 'blibli.com', officialDomains: ['blibli.com'] },
      { name: 'tiktok', domain: 'tiktok.com', officialDomains: ['tiktok.com'] },
      { name: 'dana', domain: 'dana.id', officialDomains: ['dana.id'] },
      { name: 'gopay', domain: 'gopay.co.id', officialDomains: ['gopay.co.id', 'gojek.com'] },
      { name: 'ovo', domain: 'ovo.id', officialDomains: ['ovo.id'] },
      { name: 'linkaja', domain: 'linkaja.id', officialDomains: ['linkaja.id'] },
      { name: 'flip', domain: 'flip.id', officialDomains: ['flip.id'] },
      { name: 'telkomsel', domain: 'telkomsel.com', officialDomains: ['telkomsel.com', 'my.telkomsel.com'] },
      { name: 'indosat', domain: 'indosatooredoo.com', officialDomains: ['indosatooredoo.com', 'ioh.co.id'] },
      { name: 'whatsapp', domain: 'whatsapp.com', officialDomains: ['whatsapp.com', 'wa.me'] },
      { name: 'telegram', domain: 'telegram.org', officialDomains: ['telegram.org', 't.me'] },
      { name: 'google', domain: 'google.com', officialDomains: ['google.com', 'google.co.id'] },
      { name: 'facebook', domain: 'facebook.com', officialDomains: ['facebook.com', 'fb.me'] },
      { name: 'instagram', domain: 'instagram.com', officialDomains: ['instagram.com'] },
      { name: 'pln', domain: 'pln.co.id', officialDomains: ['pln.co.id'] },
      { name: 'bpjs', domain: 'bpjs-kesehatan.go.id', officialDomains: ['bpjs-kesehatan.go.id', 'bpjsketenagakerjaan.go.id'] },
      { name: 'pajak', domain: 'pajak.go.id', officialDomains: ['pajak.go.id', 'djponline.pajak.go.id'] }
    ],

    // TLD Berisiko Tinggi
    RISKY_TLDS: [
      '.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.work', '.click',
      '.buzz', '.rest', '.icu', '.sbs', '.cfd', '.fit', '.link', '.cc',
      '.pro', '.live', '.loan', '.cam', '.vip', '.monster', '.club', '.online',
      '.site', '.uno', '.space', '.fun', '.host', '.press', '.bid', '.trade'
    ],

    // Domain Pemendek URL (Shortener)
    URL_SHORTENERS: [
      'bit.ly', 'tinyurl.com', 's.id', 't.co', 'cutt.ly', 'is.gd', 'rb.gy',
      'shorturl.at', 'rebrand.ly', 'ow.ly', 'bl.ink', 'v.gd', 'trib.al',
      'buff.ly', 'hyperurl.co', 'rotf.lol', 'goo.gl', 'dlvr.it'
    ],

    // Query Parameter Sensitif yang Wajib Dibersihkan
    SENSITIVE_PARAMS: [
      'token', 'access_token', 'api_key', 'apikey', 'key', 'secret',
      'password', 'pass', 'pwd', 'otp', 'code', 'session', 'session_id',
      'sid', 'auth', 'signature', 'credential', 'pin', 'verification_code'
    ],

    // Kata Kunci Sensitif pada Path / Query
    SENSITIVE_KEYWORDS: [
      'login', 'masuk', 'signin', 'verifikasi', 'verif', 'verify', 'otp',
      'hadiah', 'klaim', 'claim', 'bantuan', 'undian', 'update', 'aktivasi',
      'pulsa', 'saldo', 'voucher', 'menang', 'dana-kaget', 'blt', 'bansos',
      'subsidi', 'rekening', 'kartu', 'buka-blokir', 'konfirmasi', 'bonus'
    ],

    // Batas Panjang Input
    LIMITS: {
      URL_MAX_LENGTH: 2048,
      CHAT_MIN_LENGTH: 10,
      CHAT_MAX_LENGTH: 5000
    }
  };

  S.CONFIG = CONFIG;
})(window.Scamora);
