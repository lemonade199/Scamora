/**
 * Scamora - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: mockApi.js - Simulasi Panggilan Endpoint API Eksternal & Kontrol Kegagalan
 * Mensimulasikan Google Safe Browsing API dan Claude API (Anthropic) dengan validasi ketat
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  const SIM_MODES = {
    NORMAL: 'normal',
    REPUTATION_FAILED: 'reputation_failed',
    AI_FAILED: 'ai_failed',
    ALL_FAILED: 'all_failed',
    PIPELINE_FAILED: 'pipeline_failed',
    RATE_LIMITED: 'rate_limited'
  };

  let currentSimulationMode = SIM_MODES.NORMAL;
  const modeListeners = [];

  function getSimMode() {
    return currentSimulationMode;
  }

  function setSimMode(newMode) {
    if (Object.values(SIM_MODES).includes(newMode)) {
      currentSimulationMode = newMode;
      modeListeners.forEach(fn => fn(newMode));
    }
  }

  function onSimModeChange(fn) {
    modeListeners.push(fn);
  }

  function simulateNetworkDelay(minMs = 700, maxMs = 1300) {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async function analyzeUrlApi(rawUrl, privacyAccepted) {
    const CONFIG = S.CONFIG;
    const DEMO_DATA = S.DEMO_DATA;

    if (!privacyAccepted) {
      throw {
        status: 422,
        code: 'VALIDATION_ERROR',
        message: 'Persetujuan kebijakan privasi wajib dicentang sebelum melakukan analisis.'
      };
    }

    const validation = S.validateUrl(rawUrl);
    if (!validation.valid) {
      throw {
        status: 422,
        code: 'VALIDATION_ERROR',
        message: validation.error
      };
    }

    if (currentSimulationMode === SIM_MODES.RATE_LIMITED) {
      await simulateNetworkDelay(300, 600);
      throw {
        status: 429,
        code: 'RATE_LIMITED',
        message: 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu beberapa detik dan coba kembali.'
      };
    }

    if (currentSimulationMode === SIM_MODES.PIPELINE_FAILED) {
      await simulateNetworkDelay(500, 900);
      return S.calculateRisk([], [
        { name: 'pipeline', status: 'failed', note: 'Koneksi ke gateway analitik gagal merespon.' }
      ], { failedPipeline: true, errorMessage: 'Layanan analisis sistem sedang mengalami kendala (503 Service Unavailable).' });
    }

    await simulateNetworkDelay(800, 1400);
    const structureResult = S.analyzeUrlStructure(rawUrl);
    const urlIndicators = [...structureResult.indicators];
    const limitations = [...structureResult.limitations];

    const checks = [
      {
        name: 'structure',
        status: 'ok',
        note: 'Analisis heuristik struktur protokol, hostname, dan parameter kueri selesai.'
      }
    ];

    const isReputationFailed = (
      currentSimulationMode === SIM_MODES.REPUTATION_FAILED ||
      currentSimulationMode === SIM_MODES.ALL_FAILED
    );

    if (isReputationFailed) {
      checks.push({
        name: 'reputation',
        status: 'failed',
        note: 'Layanan basis data ancaman eksternal (Google Safe Browsing) tidak dapat dihubungi atau mengalami timeout.'
      });
      limitations.push('Pemeriksaan reputasi basis data ancaman gagal dilaksanakan; keakuratan verifikasi domain berkurang.');
    } else {
      checks.push({
        name: 'reputation',
        status: 'ok',
        note: 'Pemeriksaan pada basis data ancaman Google Safe Browsing selesai.'
      });

      const parsed = new URL(structureResult.cleanedUrl);
      const host = parsed.hostname.toLowerCase();
      const isThreat = DEMO_DATA.SAFE_BROWSING_THREATS.some(t => host === t || host.endsWith('.' + t));

      if (isThreat) {
        const meta = CONFIG.URL_INDICATORS.safe_browsing_match;
        urlIndicators.push({
          type: meta.type,
          label: meta.label,
          weight: meta.weight,
          severity: meta.severity,
          evidence: host,
          reason: 'Domain ini secara spesifik telah terdaftar dalam daftar hitam ancaman phishing / malware Google Safe Browsing.',
          source: meta.source
        });
      } else {
        limitations.push('URL tidak ditemukan pada daftar ancaman yang diperiksa. Hal ini bukan jaminan bahwa situs sepenuhnya aman, terutama untuk domain yang baru dibuat.');
      }
    }

    checks.push({
      name: 'domain_age',
      status: 'skipped',
      note: 'Pemeriksaan usia domain (RDAP) tidak termasuk dalam cakupan MVP (opsional P1).'
    });

    const hasShortener = urlIndicators.some(i => i.type === 'url_shortener');
    const scoring = S.calculateRisk(urlIndicators, checks, { canConclude: !hasShortener });

    let scamType = null;
    if (scoring.risk_level === 'high' || scoring.risk_level === 'review') {
      scamType = 'phising';
    }

    const actions = S.getRecommendedActions(scoring.risk_level, scamType, scoring.indicators);
    if (structureResult.hasSensitiveMasking) {
      actions.push('Jika URL ini memuat kata sandi atau token yang pernah Anda gunakan, segera ganti kredensial akun Anda di layanan resmi terkait.');
    }

    let explanation = '';
    if (scoring.risk_level === 'high') {
      explanation = `Analisis mendeteksi indikasi risiko tinggi pada URL ini dengan total skor risiko ${scoring.risk_score}/100. Terdapat ${scoring.indicators.length} indikator kecurigaan, termasuk ${scoring.indicators[0]?.label.toLowerCase()}. Sangat disarankan untuk tidak mengakses atau memasukkan informasi apa pun pada halaman tersebut.`;
    } else if (scoring.risk_level === 'review') {
      explanation = `Analisis menunjukkan bahwa URL ini memerlukan kehati-hatian dan peninjauan lebih lanjut (skor ${scoring.risk_score}/100). Beberapa karakteristik teknis menunjukkan kejanggalan atau pemeriksaan eksternal tidak lengkap.`;
    } else {
      explanation = `Tidak ditemukan tanda bahaya atau pola manipulasi yang signifikan pada struktur URL yang diperiksa (skor ${scoring.risk_score}/100). Walaupun demikian, status ini bukan jaminan mutlak situs aman; tetap berhati-hati sebelum menginput data sensitif.`;
    }

    return {
      analysis_status: scoring.analysis_status,
      risk_level: scoring.risk_level,
      raw_score: scoring.raw_score,
      risk_score: scoring.risk_score,
      category_reason: scoring.category_reason,
      scam_type: scamType,
      indicators: scoring.indicators,
      checks: checks,
      explanation: explanation,
      recommended_actions: actions,
      limitations: limitations,
      error: null,
      cleanedUrl: structureResult.cleanedUrl,
      isCapped: scoring.isCapped,
      analysisType: 'url'
    };
  }

  async function analyzeChatApi(rawChatText, privacyAccepted, maskedText) {
    const CONFIG = S.CONFIG;

    if (!privacyAccepted) {
      throw {
        status: 422,
        code: 'VALIDATION_ERROR',
        message: 'Persetujuan kebijakan privasi wajib dicentang sebelum melakukan analisis.'
      };
    }

    if (!rawChatText || rawChatText.trim().length < CONFIG.LIMITS.CHAT_MIN_LENGTH) {
      throw {
        status: 422,
        code: 'VALIDATION_ERROR',
        message: `Teks percakapan minimal ${CONFIG.LIMITS.CHAT_MIN_LENGTH} karakter.`
      };
    }

    if (rawChatText.trim().length > CONFIG.LIMITS.CHAT_MAX_LENGTH) {
      throw {
        status: 422,
        code: 'VALIDATION_ERROR',
        message: `Teks percakapan maksimal ${CONFIG.LIMITS.CHAT_MAX_LENGTH} karakter.`
      };
    }

    if (currentSimulationMode === SIM_MODES.RATE_LIMITED) {
      await simulateNetworkDelay(300, 600);
      throw {
        status: 429,
        code: 'RATE_LIMITED',
        message: 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu beberapa detik dan coba kembali.'
      };
    }

    if (currentSimulationMode === SIM_MODES.PIPELINE_FAILED) {
      await simulateNetworkDelay(500, 900);
      return S.calculateRisk([], [
        { name: 'pipeline', status: 'failed', note: 'Koneksi ke gateway analitik AI gagal merespon.' }
      ], { failedPipeline: true, errorMessage: 'Layanan analisis sistem sedang mengalami kendala (503 Service Unavailable).' });
    }

    await simulateNetworkDelay(900, 1500);

    const localIndicators = S.scanLocalPatterns(maskedText);
    const verifiedLocal = S.verifyIndicatorsEvidence(localIndicators, maskedText);

    const checks = [
      {
        name: 'pattern_scan',
        status: 'ok',
        note: 'Pemindaian pola kata kunci, penekanan urgensi, dan permintaan finansial lokal selesai.'
      }
    ];

    const limitations = [
      'Masking data pribadi bersifat upaya terbaik (best-effort) dan tidak menjamin seluruh data spesifik terdeteksi otomatis.',
      'Analisis semantik berbasis AI didasarkan pada teks kutipan yang ditempelkan dan tidak dapat mengonfirmasi identitas fisik pengirim pesan.'
    ];

    const isAiFailed = (
      currentSimulationMode === SIM_MODES.AI_FAILED ||
      currentSimulationMode === SIM_MODES.ALL_FAILED
    );

    let combinedIndicators = [...verifiedLocal];
    let aiCanConclude = true;
    let scamType = S.deduceScamType(verifiedLocal);

    const isAmbiguous = maskedText.length < 120 && verifiedLocal.length === 0 && !maskedText.toLowerCase().includes('nongkrong');

    if (isAiFailed) {
      checks.push({
        name: 'ai_analysis',
        status: 'failed',
        note: 'Layanan Claude API (Anthropic) tidak dapat dihubungi atau mengalami timeout. Analisis dialihkan ke pemindaian pola lokal.'
      });
      limitations.push('Analisis semantik konteks mendalam oleh AI tidak tersedia; sistem hanya mengandalkan pemindaian pola lokal.');
    } else {
      checks.push({
        name: 'ai_analysis',
        status: 'ok',
        note: 'Analisis semantik konteks percakapan menggunakan Claude API selesai.'
      });

      if (isAmbiguous) {
        aiCanConclude = false;
      }
    }

    const scoring = S.calculateRisk(combinedIndicators, checks, { canConclude: aiCanConclude });
    const actions = S.getRecommendedActions(scoring.risk_level, scamType, scoring.indicators);

    let explanation = '';
    if (scoring.risk_level === 'high') {
      const mainEvidence = scoring.indicators.map(i => `"${i.evidence}"`).slice(0, 3).join(', ');
      explanation = `Analisis mendeteksi indikasi risiko tinggi pada pesan WhatsApp ini (skor ${scoring.risk_score}/100). Ditemukan kalimat berisiko seperti ${mainEvidence}. Pola ini sangat identik dengan modus ${scamType ? CONFIG.SCAM_TYPES[scamType]?.label.toLowerCase() : 'penipuan digital'}. Jangan ikuti instruksi yang diminta.`;
    } else if (scoring.risk_level === 'review') {
      if (scoring.category_reason === 'incomplete_check') {
        explanation = `Analisis memerlukan peninjauan lebih lanjut karena layanan AI eksternal sedang tidak tersedia (status parsial). Sistem belum dapat memastikan secara lengkap apakah pesan ini berisiko atau normal.`;
      } else if (scoring.category_reason === 'cannot_conclude') {
        explanation = `Teks percakapan terlalu singkat atau minim konteks untuk ditarik kesimpulan pasti (cannot conclude). Disarankan untuk memverifikasi langsung melalui telepon resmi atau kontak terpercaya.`;
      } else {
        explanation = `Ditemukan beberapa indikasi yang perlu diwaspadai (skor ${scoring.risk_score}/100), namun bukti belum cukup kuat untuk menyimpulkan risiko tinggi. Tetap berhati-hati dan lakukan verifikasi silang.`;
      }
    } else {
      explanation = `Tidak ditemukan pola bahasa manipulatif, ancaman pemblokiran, atau permintaan dana pada teks percakapan ini (skor ${scoring.risk_score}/100). Namun demikian, hasil ini adalah indikasi risiko pada teks yang diperiksa, bukan jaminan pasti bahwa pengirim tidak memiliki niat jahat.`;
    }

    return {
      analysis_status: scoring.analysis_status,
      risk_level: scoring.risk_level,
      raw_score: scoring.raw_score,
      risk_score: scoring.risk_score,
      category_reason: scoring.category_reason,
      scam_type: scamType,
      indicators: scoring.indicators,
      checks: checks,
      explanation: explanation,
      recommended_actions: actions,
      limitations: limitations,
      error: null,
      maskedText: maskedText,
      isCapped: scoring.isCapped,
      analysisType: 'chat'
    };
  }

  S.SIM_MODES = SIM_MODES;
  S.getSimMode = getSimMode;
  S.setSimMode = setSimMode;
  S.onSimModeChange = onSimModeChange;
  S.analyzeUrlApi = analyzeUrlApi;
  S.analyzeChatApi = analyzeChatApi;
})(window.Scamora);
