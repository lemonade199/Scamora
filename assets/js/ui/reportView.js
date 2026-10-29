/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/reportView.js - Render Komponen Risk Analysis Report (#/laporan)
 * Desain Visual Stitch Material 3 Cyber Console (Diagnostic Telemetry Dashboard)
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function renderReport(result, onResetCallback) {
    const CONFIG = S.CONFIG;

    if (!result) {
      return `
        <div class="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center">
            <span class="material-symbols-outlined text-[32px]">find_in_page</span>
          </div>
          <h2 class="text-xl font-bold text-on-surface">Belum Ada Hasil Analisis</h2>
          <p class="text-sm text-on-surface-variant">Silakan masukkan URL atau tempelkan percakapan WhatsApp untuk memulai pemindaian.</p>
          <div class="flex justify-center gap-3 pt-2">
            <a href="#/url" class="px-5 py-2.5 rounded-xl bg-secondary text-white font-medium text-sm transition-colors hover:bg-secondary-container shadow-sm flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">link</span>
              Cek URL
            </a>
            <a href="#/chat" class="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium text-sm transition-colors hover:bg-surface-container-high flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">chat_bubble</span>
              Analisis Chat
            </a>
          </div>
        </div>
      `;
    }

    if (result.analysis_status === 'failed') {
      return renderFailedReport(result, onResetCallback);
    }

    const catKey = (result.risk_level || 'review').toUpperCase();
    const categoryConfig = CONFIG.CATEGORIES[catKey] || CONFIG.CATEGORIES.REVIEW;
    const scamTypeConfig = result.scam_type ? CONFIG.SCAM_TYPES[result.scam_type] : null;

    const accentBarColor = result.risk_level === 'high' ? 'bg-error' : (result.risk_level === 'review' ? 'bg-amber-500' : 'bg-on-tertiary-container');
    const accentTextColor = result.risk_level === 'high' ? 'text-error' : (result.risk_level === 'review' ? 'text-amber-600' : 'text-on-tertiary-container');
    const iconContainerColor = result.risk_level === 'high' ? 'bg-error-container text-on-error-container' : (result.risk_level === 'review' ? 'bg-amber-500/10 text-amber-700' : 'bg-surface-container-high text-on-tertiary-container');
    const threatLevelLabel = result.risk_level === 'high' ? 'TINGGI / EKSTREM' : (result.risk_level === 'review' ? 'PERLU DITINJAU' : 'RISIKO RENDAH');

    return `
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        <!-- 1. BANNER STATUS JIKA PARTIAL -->
        ${result.analysis_status === 'partial' ? `
          <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-on-surface flex items-start gap-3 shadow-sm">
            <span class="material-symbols-outlined text-[24px] text-amber-600 shrink-0 mt-0.5">warning</span>
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-amber-800">Peringatan Hasil Analisis Parsial (Pemeriksaan Tidak Lengkap)</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                Sebagian pemeriksaan wajib mengalami kegagalan koneksi eksternal (lihat status pemeriksaan di bawah). Sesuai standar integritas Scamora AI, status risiko rendah tidak dapat diberikan pada pemeriksaan tidak lengkap, dan hasil otomatis dinaikkan untuk peninjauan lebih lanjut.
              </p>
            </div>
          </div>
        ` : ''}

        <!-- 2. TOP RESULT HEADER VERDICT BANNER (DESAIN STITCH) -->
        <div class="rounded-xl bg-surface-container-lowest shadow-sm p-6 sm:p-8 overflow-hidden relative border border-surface-container">
          <div class="absolute top-0 left-0 right-0 h-1.5 ${accentBarColor}"></div>
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl ${iconContainerColor} flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[32px]">${result.risk_level === 'high' ? 'crisis_alert' : (result.risk_level === 'review' ? 'help_outline' : 'verified_user')}</span>
              </div>
              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded text-white font-mono text-[10px] uppercase font-bold tracking-wider ${categoryConfig.badgeBg}">
                    ${result.risk_level === 'high' ? 'CRITICAL SEVERITY' : (result.risk_level === 'review' ? 'MEDIUM ATTENTION' : 'VERIFIED SAFE INGRESS')}
                  </span>
                  <span class="font-mono text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    ANALYSIS_ID: #SCAN-${Math.floor(10000 + Math.random() * 90000)}-ID
                  </span>
                  ${scamTypeConfig ? `
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-surface-container-high text-secondary">
                      Modus: ${scamTypeConfig.label}
                    </span>
                  ` : ''}
                </div>
                
                <h1 class="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                  ${categoryConfig.label}
                </h1>
                
                <p class="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                  ${getCategoryReasonText(result.category_reason)}
                </p>
              </div>
            </div>

            <!-- Risk Gauge Visual Module -->
            <div class="flex items-center gap-4 shrink-0 px-4 py-3 bg-surface-container-low rounded-xl border border-surface-container self-start lg:self-auto">
              <div class="relative w-20 h-20 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path class="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
                  <path class="${accentTextColor}" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="${result.risk_score || 0}, 100" stroke-linecap="round" stroke-width="3.5"></path>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="font-mono text-sm font-bold ${accentTextColor}">${result.risk_score}</span>
                  <span class="font-mono text-[9px] text-on-surface-variant">/100</span>
                </div>
              </div>
              <div class="flex flex-col">
                <span class="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Tingkat Risiko</span>
                <span class="text-base font-bold ${accentTextColor}">${threatLevelLabel}</span>
                <span class="font-mono text-[10px] text-outline">Raw: ${result.raw_score} ${result.isCapped ? '(Capped)' : ''}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- 3. PILAR DIAGNOSTIK FORENSIK (4 CARDS GRID) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Pilar 1 -->
          <div class="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between pb-1">
                <span class="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Pilar 01</span>
                <span class="material-symbols-outlined text-[18px] text-secondary">device_hub</span>
              </div>
              <h3 class="text-sm font-bold text-on-surface">Struktur & Anatomi</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                ${result.analysisType === 'url' ? 'Inspeksi kedalaman subdomain, karakter typosquatting, dan homograf Punycode.' : 'Pemeriksaan panjang percakapan, nomor kontak tak dikenal, dan anomali sintaks.'}
              </p>
            </div>
            <div class="pt-3">
              <div class="w-full bg-surface-container px-2 py-1 rounded font-mono text-[10px] text-on-surface font-semibold text-center">
                ${result.indicators.some(i => ['typosquatting', 'brand_in_subdomain', 'excessive_subdomains'].includes(i.type)) ? 'FLAG: ANOMALI_STRUKTUR' : 'STATUS: NORMAL_INGRESS'}
              </div>
            </div>
          </div>

          <!-- Pilar 2 -->
          <div class="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between pb-1">
                <span class="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Pilar 02</span>
                <span class="material-symbols-outlined text-[18px] text-secondary">security</span>
              </div>
              <h3 class="text-sm font-bold text-on-surface">Protokol & Rekayasa</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                ${result.analysisType === 'url' ? 'Keberadaan sertifikat SSL/TLS, port non-standar, dan kredensial dalam URL.' : 'Taktik manipulasi psikologis: desakan batas waktu (urgency) dan ancaman penutupan.'}
              </p>
            </div>
            <div class="pt-3">
              <div class="w-full bg-surface-container px-2 py-1 rounded font-mono text-[10px] text-on-surface font-semibold text-center">
                ${result.indicators.some(i => ['no_https', 'unusual_port', 'time_pressure', 'threat_link'].includes(i.type)) ? 'FLAG: MANIPULASI_TERDETEKSI' : 'STATUS: AMAN_DIVERIFIKASI'}
              </div>
            </div>
          </div>

          <!-- Pilar 3 -->
          <div class="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between pb-1">
                <span class="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Pilar 03</span>
                <span class="material-symbols-outlined text-[18px] text-secondary">payments</span>
              </div>
              <h3 class="text-sm font-bold text-on-surface">Motif Finansial</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                ${result.analysisType === 'url' ? 'Reputasi ekstensi domain (TLD berisiko) dan pemicu kata sandi/login/OTP sensitif.' : 'Permintaan kode OTP, transfer uang muka pendaftaran kerja, atau janji untung pasti.'}
              </p>
            </div>
            <div class="pt-3">
              <div class="w-full bg-surface-container px-2 py-1 rounded font-mono text-[10px] text-on-surface font-semibold text-center">
                ${result.indicators.some(i => ['otp_request', 'advance_fee', 'guaranteed_profit', 'sensitive_keywords'].includes(i.type)) ? 'FLAG: FINANSIAL_RISK' : 'STATUS: TIDAK_ADA_MOTIF'}
              </div>
            </div>
          </div>

          <!-- Pilar 4 -->
          <div class="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between pb-1">
                <span class="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Pilar 04</span>
                <span class="material-symbols-outlined text-[18px] text-secondary">cloud_done</span>
              </div>
              <h3 class="text-sm font-bold text-on-surface">Validasi Intelijen AI</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                ${result.analysisType === 'url' ? 'Korelasi basis data global Google Safe Browsing API v4 & Radar Feed.' : 'Inferensi pemahaman semantik konteks percakapan mendalam via Claude API.'}
              </p>
            </div>
            <div class="pt-3">
              <div class="w-full bg-surface-container px-2 py-1 rounded font-mono text-[10px] text-on-surface font-semibold text-center">
                ${result.indicators.some(i => i.type === 'safe_browsing_match') ? 'FLAG: THREAT_MATCH' : 'STATUS: FEED_CLEAN'}
              </div>
            </div>
          </div>
        </div>

        <!-- 4. SANITIZED INGRESS INSPECTION BOX (ZERO PLAINTEXT PROOF) -->
        <div class="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-secondary">filter_drama</span>
              <h3 class="text-sm font-bold text-on-surface">Inspeksi Pembersihan Input (Sanitized Ingress Pipeline)</h3>
            </div>
            <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Client-Side Ephemeral Ingress</span>
          </div>

          <p class="text-xs text-on-surface-variant">
            Seluruh data identitas pengguna, nomor telepon, dan parameter sensitif dihilangkan atau disamarkan pada memori lokal peramban sebelum inferensi mitigasi risiko:
          </p>

          ${result.analysisType === 'chat' && result.maskedText ? `
            <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-2 font-mono text-xs">
              <div class="flex items-center justify-between text-[11px] text-on-surface-variant font-sans font-semibold">
                <span>Teks Hasil Masking & Penyorotan Bukti (Siap Kirim ke AI):</span>
                <span class="text-secondary font-mono">100% PII Masked</span>
              </div>
              <div class="p-3 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface leading-relaxed whitespace-pre-wrap">
                ${renderHighlightedText(result.maskedText, result.indicators)}
              </div>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container space-y-1">
                <span class="text-[10px] text-on-surface-variant uppercase font-semibold font-sans block">Format Domain Masuk</span>
                <span class="text-on-surface break-all">${escapeHtml(result.normalizedUrl || 'Tautan dianalisis')}</span>
              </div>
              <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container space-y-1">
                <span class="text-[10px] text-on-surface-variant uppercase font-semibold font-sans block">Sanitized Canonical Target</span>
                <span class="text-secondary break-all">${escapeHtml(result.cleanUrl || result.normalizedUrl || 'Tautan')} <span class="text-on-tertiary-container font-semibold">[SANITIZED]</span></span>
              </div>
            </div>
          `}
        </div>

        <!-- 5. DAFTAR INDIKATOR BERBUKTI NYATA (EVIDENCE LIST) -->
        <div class="rounded-xl bg-surface-container-lowest p-6 shadow-sm border border-surface-container space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <h2 class="text-base font-bold text-on-surface">Daftar Indikator Berbukti Nyata</h2>
                <p class="text-xs text-on-surface-variant">Setiap temuan risiko wajib memiliki kutipan asli dari data input</p>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-secondary bg-surface-container px-2.5 py-1 rounded">
              Total Raw Score: ${result.raw_score}
            </span>
          </div>

          ${result.indicators.length > 0 ? `
            <div class="space-y-3">
              ${result.indicators.map((ind, i) => `
                <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-surface-container-lowest text-on-surface font-mono text-xs flex items-center justify-center font-bold border border-surface-container">
                        ${i + 1}
                      </span>
                      <span class="text-sm font-bold text-on-surface">${escapeHtml(ind.label || ind.type)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${getSeverityBadge(ind.severity)}">
                        ${ind.severity.toUpperCase()}
                      </span>
                      <span class="text-xs font-bold text-secondary font-mono">+${ind.weight}</span>
                    </div>
                  </div>

                  <!-- Kutipan Bukti Asli -->
                  <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-xs">
                    <span class="text-[10px] uppercase font-bold text-amber-700 block mb-0.5">Kutipan Bukti dari Input:</span>
                    <code class="text-amber-900 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-block break-all">
                      ${escapeHtml(ind.evidence || 'N/A')}
                    </code>
                  </div>

                  <p class="text-xs text-on-surface-variant leading-relaxed">
                    ${escapeHtml(ind.reason)}
                  </p>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container text-center">
              <p class="text-xs text-on-surface-variant">Tidak ada indikator kecurigaan berbobot yang ditemukan pada pemeriksaan ini.</p>
            </div>
          `}
        </div>

        <!-- 6. ACTIONABLE INCIDENT PLAYBOOK (LANGKAH PERLINDUNGAN SEGERA) -->
        <div class="rounded-xl bg-surface-container-lowest p-6 shadow-sm border border-surface-container space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">policy</span>
            </div>
            <div>
              <h2 class="text-base font-bold text-on-surface">Langkah Perlindungan Segera (Incident Playbook)</h2>
              <p class="text-xs text-on-surface-variant">Tindakan perlindungan mandiri yang konkret sesuai temuan analisis</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${(result.recommended_actions || []).slice(0, 3).map((action, i) => `
              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
                <div class="w-7 h-7 rounded-lg ${i === 0 ? 'bg-secondary text-white' : (i === 1 ? 'bg-primary text-white' : 'bg-surface-container-highest text-secondary')} flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                  ${i + 1}
                </div>
                <div class="flex flex-col space-y-0.5">
                  <span class="text-xs font-bold text-on-surface">${escapeHtml(action)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 7. STATUS PEMERIKSAAN PIPELINE (CHECKS) & KETERBATASAN -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          <!-- Status Checks -->
          <div class="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container space-y-3">
            <h3 class="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] text-secondary">fact_check</span>
              Transparansi Pemeriksaan Pipeline
            </h3>
            <div class="space-y-2">
              ${(result.checks || []).map(check => `
                <div class="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between text-xs">
                  <div>
                    <span class="font-semibold text-on-surface capitalize block">${escapeHtml(check.name.replace(/_/g, ' '))}</span>
                    <span class="text-[10px] text-on-surface-variant">${escapeHtml(check.note || '')}</span>
                  </div>
                  <div>${getCheckStatusBadge(check.status)}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Keterbatasan Analisis -->
          <div class="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container space-y-3">
            <h3 class="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] text-on-surface-variant">info</span>
              Keterbatasan Analisis Sistem
            </h3>
            <ul class="space-y-1.5 list-disc list-inside text-xs text-on-surface-variant leading-relaxed">
              ${(result.limitations || []).map(lim => `
                <li>${escapeHtml(lim)}</li>
              `).join('')}
            </ul>
          </div>

        </div>

        <!-- 8. DISCLAIMER RESMI TETAP -->
        <div class="p-4 rounded-xl bg-surface-container border border-surface-container-high text-center">
          <p class="text-xs text-on-surface-variant leading-relaxed">
            <strong class="text-on-surface">Disclaimer Resmi:</strong> Hasil ini adalah indikasi risiko berbasis aturan dan heuristik, bukan jaminan mutlak bahwa pesan atau URL aman maupun vonis hukum terbukti penipuan.
          </p>
        </div>

        <!-- 9. TOMBOL AKSI BAWAH (DESAIN STITCH) -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-surface-container">
          <div class="flex flex-wrap items-center gap-2.5">
            <button id="btn-copy-report" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs sm:text-sm hover:bg-primary-container transition-all shadow-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">content_copy</span>
              Salin Laporan Insiden
            </button>
            <a href="#/panduan" class="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">menu_book</span>
              Panduan Keamanan
            </a>
          </div>
          <button id="btn-analyze-again" class="px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">refresh</span>
            Analisis Tautan / Chat Lain
          </button>
        </div>

      </div>
    `;
  }

  function renderFailedReport(result, onResetCallback) {
    return `
      <div class="max-w-2xl mx-auto py-12 px-4 sm:px-6 space-y-6">
        <div class="bg-surface-container-lowest border border-error/30 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-5">
          <div class="w-16 h-16 rounded-2xl bg-error-container text-error mx-auto flex items-center justify-center">
            <span class="material-symbols-outlined text-[36px]">error</span>
          </div>

          <div class="space-y-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-error bg-error-container">
              Analisis Gagal Diproses (Status: FAILED)
            </span>
            <h1 class="text-2xl font-bold text-on-surface tracking-tight">Layanan Sedang Mengalami Kendala</h1>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              ${escapeHtml(result.error?.message || 'Layanan analitik eksternal saat ini tidak dapat merespon permintaan Anda.')}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container text-left space-y-2">
            <p class="text-xs font-semibold text-on-surface">Status Pemeriksaan:</p>
            <div class="space-y-1.5">
              ${(result.checks || []).map(c => `
                <div class="flex items-center justify-between text-xs">
                  <span class="text-on-surface font-mono">${escapeHtml(c.name)}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-error">
                    GAGAL (✕)
                  </span>
                </div>
                <p class="text-[11px] text-on-surface-variant">${escapeHtml(c.note || '')}</p>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-surface-container flex justify-center gap-3">
            <button id="btn-failed-retry" class="px-5 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs sm:text-sm hover:bg-secondary-container transition-colors flex items-center gap-2 shadow-sm">
              <span class="material-symbols-outlined text-[16px]">refresh</span>
              Coba Lagi Sekarang
            </button>
            <a href="#/" class="px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs sm:text-sm transition-colors">
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function getCheckStatusBadge(status) {
    if (status === 'ok') {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed-variant">
        ✓ OK
      </span>`;
    }
    if (status === 'failed') {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-error-container text-error">
        ✕ GAGAL
      </span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-high text-on-surface-variant">
      ⏭ DILEWATI
    </span>`;
  }

  function getCategoryIcon(level) {
    if (level === 'high') {
      return `<span class="material-symbols-outlined text-[16px]">crisis_alert</span>`;
    }
    if (level === 'review') {
      return `<span class="material-symbols-outlined text-[16px]">help_outline</span>`;
    }
    return `<span class="material-symbols-outlined text-[16px]">verified_user</span>`;
  }

  function getSeverityBadge(severity) {
    if (severity === 'high') {
      return 'bg-error-container text-error border border-error/30';
    }
    if (severity === 'medium') {
      return 'bg-amber-500/10 text-amber-700 border border-amber-500/30';
    }
    return 'bg-surface-container text-on-surface-variant border border-surface-container-high';
  }

  function getCategoryReasonText(reason) {
    if (reason === 'critical_indicator') {
      return 'Kategori risiko tinggi ditetapkan secara otomatis karena terdeteksi indikator kritis (ancaman Google Safe Browsing atau permintaan kode rahasia OTP).';
    }
    if (reason === 'incomplete_check') {
      return 'Kategori dinaikkan menjadi perlu ditinjau lebih lanjut karena sebagian pemeriksaan wajib tidak dapat diselesaikan oleh layanan eksternal.';
    }
    if (reason === 'cannot_conclude') {
      return 'Kategori ditetapkan untuk ditinjau lebih lanjut karena bukti teks yang diberikan tidak cukup konklusif atau tujuan akhir tautan pemendek tidak dapat diperiksa.';
    }
    return 'Kategori ditetapkan secara kumulatif dari penjumlahan bobot indikator-indikator risiko yang terdeteksi.';
  }

  function renderHighlightedText(maskedText, indicators = []) {
    let escaped = escapeHtml(maskedText);
    const evidences = indicators
      .map(i => i.evidence)
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    for (const ev of evidences) {
      const escEv = escapeHtml(ev);
      if (!escEv.trim()) continue;
      try {
        const regex = new RegExp(`(${escapeRegex(escEv)})`, 'gi');
        escaped = escaped.replace(regex, '<mark class="bg-amber-300/40 text-amber-900 px-1 py-0.5 rounded border border-amber-400 font-bold">$1</mark>');
      } catch (e) {}
    }

    return escaped;
  }

  function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function formatReportForCopy(result) {
    const CONFIG = S.CONFIG;
    if (!result || result.analysis_status === 'failed') {
      return 'Hasil analisis Scamora tidak tersedia atau gagal.';
    }

    const catLabel = result.risk_level ? CONFIG.CATEGORIES[result.risk_level.toUpperCase()]?.label : 'Perlu ditinjau';
    const scamLabel = result.scam_type ? CONFIG.SCAM_TYPES[result.scam_type]?.label : '-';

    let text = `========================================\n`;
    text += `LAPORAN INDIKASI RISIKO - Scamora AI\n`;
    text += `========================================\n`;
    text += `Kategori      : ${catLabel}\n`;
    text += `Skor Risiko   : ${result.risk_score}/100 (Raw: ${result.raw_score})\n`;
    text += `Modus Terkait : ${scamLabel}\n`;
    text += `Status Cek    : ${result.analysis_status.toUpperCase()}\n`;
    text += `\n--- INDIKATOR TERDETEKSI ---\n`;

    if (result.indicators && result.indicators.length > 0) {
      result.indicators.forEach((ind, i) => {
        text += `${i + 1}. [${ind.severity.toUpperCase()}] ${ind.label} (+${ind.weight})\n`;
        text += `   Bukti  : "${ind.evidence}"\n`;
        text += `   Alasan : ${ind.reason}\n`;
      });
    } else {
      text += `Tidak ditemukan indikator bahaya signifikan.\n`;
    }

    text += `\n--- SARAN TINDAKAN ---\n`;
    (result.recommended_actions || []).forEach((act, i) => {
      text += `${i + 1}. ${act}\n`;
    });

    text += `\n========================================\n`;
    text += `Disclaimer: Hasil ini adalah indikasi risiko, bukan jaminan pasti aman atau vonis penipuan.\n`;
    text += `Periksa mandiri di platform resmi Scamora (MIT-Week 2026)\n`;

    return text;
  }

  S.renderReport = renderReport;
  S.formatReportForCopy = formatReportForCopy;
})(window.Scamora);
