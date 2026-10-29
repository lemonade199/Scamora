/**
 * Scamora - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: scoring.js - Penghitungan raw_score, risk_score, kategori, dan category_reason
 * Sesuai aturan bisnis MIT-Week 2026
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  /**
   * Menghitung skor dan kategori risiko berdasarkan daftar indikator unik dan status pemeriksaan.
   * 
   * @param {Array} rawIndicators - Indikator yang ditemukan (URL atau Chat)
   * @param {Array} checks - Status pemeriksaan [{name, status, note}]
   * @param {Object} options - Opsi tambahan: { canConclude: boolean, failedPipeline: boolean, errorMessage: string }
   * @returns {Object} Hasil perhitungan skor dan penetapan kategori
   */
  function calculateRisk(rawIndicators = [], checks = [], options = {}) {
    const CONFIG = S.CONFIG;
    const { canConclude = true, failedPipeline = false, errorMessage = null } = options;

    // Skenario Gagal Total (Pipeline Gagal 503 / Error Fatal)
    if (failedPipeline) {
      return {
        analysis_status: 'failed',
        risk_level: null,
        raw_score: null,
        risk_score: null,
        category_reason: null,
        scam_type: null,
        indicators: [],
        checks: checks.length ? checks : [
          { name: 'pipeline', status: 'failed', note: errorMessage || 'Analisis tidak dapat diselesaikan.' }
        ],
        explanation: null,
        recommended_actions: [
          'Coba ulangi analisis beberapa saat lagi.',
          'Jangan membuka tautan, mentransfer dana, atau memberikan data pribadi sebelum diverifikasi langsung ke pihak resmi.'
        ],
        limitations: ['Tidak ada hasil analisis yang dapat ditampilkan akibat gangguan pemrosesan.'],
        error: {
          code: 'ANALYSIS_UNAVAILABLE',
          message: errorMessage || 'Layanan analisis sedang tidak tersedia.'
        }
      };
    }

    // 1. Dedup Indikator berdasarkan type (tiap tipe hanya dihitung satu kali)
    const uniqueIndicatorsMap = new Map();
    for (const ind of rawIndicators) {
      if (!ind || !ind.type) continue;
      if (!uniqueIndicatorsMap.has(ind.type)) {
        const weight = Number(ind.weight) || 0;
        let severity = 'low';
        if (weight >= 30) severity = 'high';
        else if (weight >= 15) severity = 'medium';

        uniqueIndicatorsMap.set(ind.type, {
          type: ind.type,
          label: ind.label || ind.type,
          severity: severity,
          weight: weight,
          evidence: ind.evidence || '',
          reason: ind.reason || '',
          source: ind.source || 'Sistem'
        });
      }
    }

    const indicators = Array.from(uniqueIndicatorsMap.values());

    // 2. Hitung raw_score dan risk_score
    const raw_score = indicators.reduce((acc, curr) => acc + (curr.weight || 0), 0);
    const risk_score = Math.min(100, raw_score);

    // 3. Evaluasi status pemeriksaan wajib
    // URL wajib: structure, reputation. Chat wajib: pattern_scan, ai_analysis.
    // domain_age adalah opsional (skipped) dan tidak membuat status menjadi partial.
    const mandatoryFailed = checks.some(c => {
      if (c.name === 'domain_age') return false; // domain_age opsional di MVP
      return c.status === 'failed';
    });

    const analysis_status = mandatoryFailed ? 'partial' : 'complete';

    // 4. Kategori dasar dari ambang skor
    let risk_level = 'low';
    if (risk_score >= CONFIG.THRESHOLDS.HIGH_MIN) {
      risk_level = 'high';
    } else if (risk_score >= CONFIG.THRESHOLDS.REVIEW_MIN) {
      risk_level = 'review';
    } else {
      risk_level = 'low';
    }

    let category_reason = 'score';

    // 5. Aturan Pemeriksaan Tidak Lengkap & can_conclude AI
    // Jika pemeriksaan wajib gagal dan kategori dasar adalah 'low' -> naikkan ke 'review'
    // Kategori 'low' HANYA boleh muncul bila status complete (seluruh pemeriksaan wajib OK)
    if (analysis_status === 'partial' && risk_level === 'low') {
      risk_level = 'review';
      category_reason = 'incomplete_check';
    }

    // Jika bukti belum cukup / AI menyatakan cannot conclude dan belum high
    if (!canConclude && risk_level === 'low') {
      risk_level = 'review';
      category_reason = 'cannot_conclude';
    }

    // 6. Aturan Indikator Kritis
    // Indikator kritis (safe_browsing_match dan otp_request) menetapkan kategori minimal 'high'
    const hasCritical = indicators.some(ind => ind.type === 'safe_browsing_match' || ind.type === 'otp_request');
    if (hasCritical) {
      risk_level = 'high';
      category_reason = 'critical_indicator';
    }

    return {
      analysis_status,
      risk_level,
      raw_score,
      risk_score,
      category_reason,
      indicators,
      isCapped: raw_score > 100
    };
  }

  /**
   * Menghasilkan saran tindakan konkret berdasarkan tipe penipuan dan tingkat risiko
   */
  function getRecommendedActions(riskLevel, scamType, indicators = []) {
    const actions = [];

    // Saran dasar berdasarkan tingkat risiko
    if (riskLevel === 'high') {
      actions.push('JANGAN membuka tautan, mengklik tombol apa pun, atau membalas pesan tersebut.');
      actions.push('JANGAN pernah memberikan kode OTP, PIN perbankan, kata sandi, atau nomor CVV kartu kepada siapa pun, termasuk pihak yang mengaku petugas.');
      actions.push('Jika Anda terlanjur mengklik tautan atau memasukkan data, segera blokir kartu/rekening melalui aplikasi resmi bank dan ganti seluruh kata sandi akun penting Anda.');
    } else if (riskLevel === 'review') {
      actions.push('Verifikasi kebenaran pesan melalui saluran resmi (call center resmi bank, aplikasi resmi yang diunduh dari Play Store/App Store, atau situs bercentang biru).');
      actions.push('Tanyakan kepada kerabat terpercaya atau hubungi kontak resmi kantor pusat perusahaan terkait.');
      actions.push('Jangan terburu-buru melakukan pembayaran, deposit, atau mengirim data pribadi.');
    } else {
      actions.push('Meskipun indikator risiko rendah pada pemeriksaan ini, selalu pastikan keaslian situs atau identitas pengirim.');
      actions.push('Waspadai bila kemudian hari pihak pengirim meminta pengalihan ke platform lain atau meminta transfer uang.');
    }

    // Saran spesifik berdasarkan jenis modus (scamType)
    switch (scamType) {
      case 'phising':
        actions.push('Periksa kembali alamat domain di address bar peramban. Situs resmi perbankan di Indonesia umumnya beraliran domain .co.id atau .go.id.');
        actions.push('Jika membuka di peramban, pastikan sertifikat SSL valid dan tidak ada peringatan keamanan dari browser.');
        break;
      case 'lowongan_kerja_palsu':
        actions.push('Perusahaan resmi TIDAK PERNAH memungut biaya pendaftaran, biaya seragam, tes kesehatan, atau tiket akomodasi travel tertentu.');
        actions.push('Cek lowongan kerja di portal karir resmi perusahaan (misal careers.nama-pt.com) atau akun LinkedIn resmi terverifikasi.');
        break;
      case 'giveaway_palsu':
        actions.push('Undian dan giveaway resmi tidak pernah meminta pajak/biaya tebus hadiah ditransfer ke rekening atas nama pribadi perorangan.');
        actions.push('Hubungi call center penyelenggara untuk mengonfirmasi kebenaran nama pemenang.');
        break;
      case 'impersonasi':
        actions.push('Perhatikan nomor kontak: pihak bank atau marketplace resmi selalu menggunakan akun WhatsApp Business terverifikasi (centang hijau) atau nomor telepon call center pendek resmi.');
        actions.push('Tutup telepon atau abaikan chat, lalu hubungi nomor resmi yang tercantum di bagian belakang kartu ATM Anda.');
        break;
      case 'investasi_mencurigakan':
        actions.push('Periksa izin legalitas entitas investasi melalui Kontak OJK 157 atau situs resmi ojk.go.id (Satgas Pasti).');
        actions.push('Prinsip 2L: Legal (memiliki izin dari otoritas resmi) dan Logis (imbal hasil rasional, tidak ada investasi tanpa risiko).');
        break;
      case 'penipuan_jual_beli':
        actions.push('Gunakan selalu fitur rekening bersama / escrow yang disediakan marketplace terpercaya (Shopee, Tokopedia, Bukalapak, Blibli).');
        actions.push('Hindari transaksi langsung via WhatsApp atau transfer manual ke rekening penjual tak dikenal.');
        break;
    }

    if (indicators.some(i => i.type === 'url_shortener')) {
      actions.push('Gunakan alat pratinjau URL pemendek atau periksa tujuan akhir tautan sebelum membukanya di perangkat utama.');
    }

    return actions;
  }

  S.calculateRisk = calculateRisk;
  S.getRecommendedActions = getRecommendedActions;
})(window.Scamora);
