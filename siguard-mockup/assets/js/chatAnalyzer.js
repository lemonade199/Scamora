/**
 * Scamora - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: chatAnalyzer.js - Masking Data Pribadi & Pemindaian Pola Chat WhatsApp
 * Berjalan sepenuhnya di sisi klien, mematuhi prinsip privasi dan mitigasi prompt injection
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function validateChat(rawText) {
    const CONFIG = S.CONFIG;
    if (!rawText || typeof rawText !== 'string' || rawText.trim() === '') {
      return {
        valid: false,
        error: 'Teks percakapan tidak boleh kosong. Silakan tempelkan isi pesan yang ingin diperiksa.'
      };
    }

    const trimmed = rawText.trim();

    if (trimmed.length < CONFIG.LIMITS.CHAT_MIN_LENGTH) {
      return {
        valid: false,
        error: `Teks percakapan terlalu pendek (${trimmed.length} karakter). Minimal ${CONFIG.LIMITS.CHAT_MIN_LENGTH} karakter agar dapat dianalisis.`
      };
    }

    if (trimmed.length > CONFIG.LIMITS.CHAT_MAX_LENGTH) {
      return {
        valid: false,
        error: `Teks percakapan terlalu panjang (${trimmed.length} karakter). Maksimum ${CONFIG.LIMITS.CHAT_MAX_LENGTH} karakter.`
      };
    }

    return { valid: true, trimmedText: trimmed };
  }

  function maskSensitiveData(text) {
    let masked = text;
    const items = {
      phones: 0,
      emails: 0,
      accounts: 0,
      niks: 0,
      codes: 0
    };

    // 1. Email
    masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, () => {
      items.emails++;
      return '[EMAIL]';
    });

    // 2. NIK (16 digit angka Indonesia)
    masked = masked.replace(/\b[1-9]\d{15}\b/g, () => {
      items.niks++;
      return '[NIK]';
    });

    // 3. Rekening / Kartu Debit-Kredit (10 - 16 digit angka berderet)
    masked = masked.replace(/\b(?!(?:08|\+62))[0-9]{3,4}[- ]?[0-9]{3,4}[- ]?[0-9]{3,6}\b/g, (match) => {
      const rawDigits = match.replace(/\D/g, '');
      if (rawDigits.length >= 10 && rawDigits.length <= 16) {
        items.accounts++;
        return '[REKENING]';
      }
      return match;
    });

    // 4. Nomor Telepon (08xx, +62xx, 62xx dengan 9-14 digit)
    masked = masked.replace(/(?:\+62|62|08)[0-9]{2,3}[- ]?[0-9]{3,4}[- ]?[0-9]{3,5}\b/g, () => {
      items.phones++;
      return '[TELEPON]';
    });

    // 5. Kode OTP / PIN angka yang tertera jelas
    masked = masked.replace(/(?:kode(?:nya)?|otp|pin|token)\s*(?:adalah|:|=)?\s*([0-9]{4,8})\b/gi, (match, code) => {
      items.codes++;
      return match.replace(code, '[KODE_RAHASIA]');
    });

    return {
      maskedText: masked,
      maskedItems: items
    };
  }

  function scanLocalPatterns(maskedText) {
    const CONFIG = S.CONFIG;
    const indicators = [];

    // 1. otp_request (Tinggi - Kritis, 30)
    const otpRegex = /\b(?:kode\s*otp|kirimkan\s*(?:kode\s*)?otp|minta\s*otp|pin\s*atm|pin\s*rekening|password\s*anda|kode\s*verifikasi|kode\s*rahasia|kode\s*(?:sms\s*)?6\s*digit)\b/i;
    const matchOtp = maskedText.match(otpRegex);
    if (matchOtp) {
      const meta = CONFIG.CHAT_INDICATORS.otp_request;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchOtp[0],
        reason: meta.defaultReason,
        source: 'Pola Pesan'
      });
    }

    // 2. advance_fee (Tinggi, 30)
    const feeRegex = /\b(?:transfer\s*(?:rp\s*|uang\s*)?[\d.,]+(?:\s*dulu)?|biaya\s*(?:pendaftaran|daftar|administrasi|admin|ongkir|awal|pembuatan\s*id)|uang\s*muka|deposit\s*(?:sebesar|awal)?|tebus\s*hadiah|bayar\s*pajak\s*hadiah)\b/i;
    const matchFee = maskedText.match(feeRegex);
    if (matchFee) {
      const meta = CONFIG.CHAT_INDICATORS.advance_fee;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchFee[0],
        reason: 'Pengirim meminta transfer uang, biaya pendaftaran, atau uang muka sebelum proses dapat berlanjut.',
        source: 'Pola Pesan'
      });
    }

    // 3. threat_link (Tinggi, 30)
    const threatRegex = /\b(?:akun\s*(?:anda\s*)?(?:akan\s*)?diblokir|kartu\s*(?:anda\s*)?dinonaktifkan|terancam\s*diblokir|pembatalan\s*pemblokiran|klik\s*tautan\s*(?:ini\s*)?agar\s*tidak|sebelum\s*terblokir|sanksi\s*hukum|denda\s*keterlambatan)\b/i;
    const matchThreat = maskedText.match(threatRegex);
    if (matchThreat) {
      const meta = CONFIG.CHAT_INDICATORS.threat_link;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchThreat[0],
        reason: 'Menggunakan taktik intimidasi atau ancaman pemblokiran akun/layanan untuk memancing korban segera membuka tautan.',
        source: 'Pola Pesan'
      });
    }

    // 4. impersonation_data (Tinggi, 30)
    const impRegex = /\b(?:kami\s*dari\s*(?:pihak\s*)?(?:bank|mandiri|bca|bri|bni|cimb|shopee|tokopedia)|cs\s*(?:bank|mandiri|bca|bri|shopee|tokopedia)|customer\s*service\s*(?:bank|resmi)|petugas\s*(?:bank|resmi)|dari\s*pihak\s*bank)\b/i;
    const matchImp = maskedText.match(impRegex);
    if (matchImp) {
      const meta = CONFIG.CHAT_INDICATORS.impersonation_data;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchImp[0],
        reason: 'Pengirim mengaku sebagai representatif resmi institusi perbankan atau platform digital terpercaya.',
        source: 'Pola Pesan'
      });
    }

    // 5. unrealistic_offer (Sedang, 15)
    const offerRegex = /\b(?:gaji\s*(?:rp\s*)?[\d.,]+\s*(?:juta\s*)?per\s*(?:hari|jam)|komisi\s*(?:rp\s*)?[\d.,]+\s*(?:juta\s*)?per\s*(?:hari|jam|tugas)|part-time\s*(?:online\s*)?gaji|menang\s*(?:undian|hadiah)\s*(?:rp\s*)?[\d.,]+|lolos\s*kerja\s*part-time)\b/i;
    const matchOffer = maskedText.match(offerRegex);
    if (matchOffer) {
      const meta = CONFIG.CHAT_INDICATORS.unrealistic_offer;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchOffer[0],
        reason: 'Menawarkan kompensasi finansial atau upah yang tidak wajar untuk pekerjaan sederhana tanpa kualifikasi.',
        source: 'Pola Pesan'
      });
    }

    // 6. time_pressure (Sedang, 15)
    const timeRegex = /\b(?:segera\s*hari\s*ini|dalam\s*(?:waktu\s*)?[\d]+\s*(?:menit|jam)|sebelum\s*(?:tengah\s*malam|pukul|jam)|batas\s*waktu|kesempatan\s*terakhir|sekarang\s*juga|jangan\s*tunda|hanya\s*hari\s*ini|sebelum\s*kuota\s*penuh)\b/i;
    const matchTime = maskedText.match(timeRegex);
    if (matchTime) {
      const meta = CONFIG.CHAT_INDICATORS.time_pressure;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchTime[0],
        reason: 'Menerapkan batas waktu mendesak untuk memaksa calon korban bertindak impulsif tanpa sempat berpikir kritis.',
        source: 'Pola Pesan'
      });
    }

    // 7. move_platform (Sedang, 15)
    const moveRegex = /\b(?:pindah\s*ke\s*telegram|t\.me\/[\w_]+|hubungi\s*telegram|chat\s*(?:admin\s*)?via\s*telegram|gabung\s*(?:ke\s*)?grup\s*telegram|link\s*telegram|lanjut\s*ke\s*telegram)\b/i;
    const matchMove = maskedText.match(moveRegex);
    if (matchMove) {
      const meta = CONFIG.CHAT_INDICATORS.move_platform;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchMove[0],
        reason: 'Mengalihkan saluran percakapan ke platform obrolan lain (seperti Telegram) yang lebih sulit dilacak atau diawasi.',
        source: 'Pola Pesan'
      });
    }

    // 8. guaranteed_profit (Sedang, 15)
    const profitRegex = /\b(?:untung\s*pasti|profit\s*100%|pasti\s*cuan|garansi\s*untung|tanpa\s*rugi|bebas\s*risiko|pasti\s*balik\s*modal|imbal\s*hasil\s*pasti)\b/i;
    const matchProfit = maskedText.match(profitRegex);
    if (matchProfit) {
      const meta = CONFIG.CHAT_INDICATORS.guaranteed_profit;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchProfit[0],
        reason: 'Menjanjikan keuntungan investasi absolut bebas risiko yang bertentangan dengan prinsip finansial logis.',
        source: 'Pola Pesan'
      });
    }

    // 9. odd_language (Rendah, 5)
    const oddRegex = /\b(?:yang\s*terhormat\s*(?:pelanggan|nasabah)|rekening\s*kamu\s*telah\s*terpilih|segera\s*tindak\s*lanjuti\s*atas\s*perintah|klik\s*segera\s*untuk\s*memverifikasikan)\b/i;
    const matchOdd = maskedText.match(oddRegex);
    if (matchOdd) {
      const meta = CONFIG.CHAT_INDICATORS.odd_language;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchOdd[0],
        reason: 'Gaya tata bahasa kaku menyerupai hasil terjemahan mesin otomatis.',
        source: 'Pola Pesan'
      });
    }

    // 10. unknown_sender (Rendah, 5)
    const senderRegex = /\b(?:halo\s*kak\s*ini\s*nomor\s*baru|ganti\s*nomor\s*wa|simpan\s*nomor\s*baruku|kenal\s*aku\s*nggak|lupa\s*sama\s*aku)\b/i;
    const matchSender = maskedText.match(senderRegex);
    if (matchSender) {
      const meta = CONFIG.CHAT_INDICATORS.unknown_sender;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchSender[0],
        reason: 'Pesan dari kontak baru yang mengklaim sebagai kerabat tanpa menyebutkan nama atau identitas yang jelas.',
        source: 'Pola Pesan'
      });
    }

    return indicators;
  }

  function verifyIndicatorsEvidence(indicators, maskedText) {
    const normalizedText = maskedText.replace(/\s+/g, ' ').toLowerCase();

    return indicators.filter(ind => {
      if (!ind || !ind.evidence) return false;
      const normalizedEvidence = ind.evidence.replace(/\s+/g, ' ').toLowerCase();
      return normalizedText.includes(normalizedEvidence);
    });
  }

  function deduceScamType(indicators) {
    if (!indicators || indicators.length === 0) return null;

    const types = indicators.map(i => i.type);

    if (types.includes('unrealistic_offer') && (types.includes('advance_fee') || types.includes('move_platform'))) {
      return 'lowongan_kerja_palsu';
    }

    if (types.includes('otp_request') || (types.includes('threat_link') && types.includes('impersonation_data'))) {
      return 'impersonasi';
    }

    if (types.includes('threat_link')) {
      return 'phising';
    }

    if (types.includes('guaranteed_profit')) {
      return 'investasi_mencurigakan';
    }

    if (types.includes('unrealistic_offer') && types.includes('advance_fee')) {
      return 'giveaway_palsu';
    }

    if (types.includes('advance_fee')) {
      return 'penipuan_jual_beli';
    }

    if (indicators.length > 0) {
      return 'lainnya';
    }

    return null;
  }

  S.validateChat = validateChat;
  S.maskSensitiveData = maskSensitiveData;
  S.scanLocalPatterns = scanLocalPatterns;
  S.verifyIndicatorsEvidence = verifyIndicatorsEvidence;
  S.deduceScamType = deduceScamType;
})
(window.Scamora);