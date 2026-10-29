/**
 * Scamora AI - Autonomous Digital Threat Defense
 * File: app.js - Single Page Application Router & State Manager
 * Desain Visual Stitch Material 3 Cyber Console (MIT-Week 2026)
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  // STATE APLIKASI IN-MEMORY (Tanpa LocalStorage Input)
  const AppState = {
    privacyAccepted: false,
    lastAnalysisResult: null,
    isProcessing: false,
    activeRoute: '#/',
    quiz: {
      currentIdx: 0,
      userAnswers: [],
      isCompleted: false
    },
    knowledgeSlug: null,
    panduanTab: 'tindakan'
  };

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function handleRoute() {
    const rawHash = window.location.hash || '#/';
    const [baseRoute, param] = rawHash.split('?');
    AppState.activeRoute = baseRoute;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNavbarActive(baseRoute);

    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    switch (baseRoute) {
      case '#/':
        renderHomePage(appRoot);
        break;
      case '#/url':
        renderUrlCheckerPage(appRoot);
        break;
      case '#/chat':
        renderChatDetectorPage(appRoot);
        break;
      case '#/laporan':
        renderReportPage(appRoot);
        break;
      case '#/panduan':
        renderPanduanPage(appRoot);
        break;
      case '#/kuis':
        renderQuizPage(appRoot);
        break;
      case '#/pengetahuan':
        renderKnowledgePage(appRoot);
        break;
      case '#/komunitas':
        renderCommunityPage(appRoot);
        break;
      case '#/profil':
        renderProfilePage(appRoot);
        break;
      default:
        renderHomePage(appRoot);
        break;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function updateNavbarActive(route) {
    const navLinks = document.querySelectorAll('.nav-link-item');
    navLinks.forEach(link => {
      const target = link.getAttribute('href');
      if (target === route) {
        link.classList.add('bg-surface-container', 'text-on-surface', 'font-semibold');
        link.classList.remove('text-on-surface-variant');
      } else {
        link.classList.remove('bg-surface-container', 'text-on-surface', 'font-semibold');
        link.classList.add('text-on-surface-variant');
      }
    });
  }

  // 1. HOME / DASHBOARD PAGE (#/ - DESAIN RESMI STITCH)
  function renderHomePage(container) {
    container.innerHTML = `
      <div class="flex flex-col w-full pb-16">
        
        <!-- AMBIENT TOP LIGHT FIELD -->
        <div class="relative w-full overflow-hidden">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-secondary-container/10 via-tertiary-fixed/15 to-transparent blur-3xl pointer-events-none -z-10"></div>
          <div class="absolute -top-32 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-2xl pointer-events-none -z-10"></div>
          
          <!-- HERO SECTION -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 w-full flex flex-col items-center text-center">
            
            <!-- Live Status Pill -->
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest shadow-sm mb-6 border border-surface-container">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container"></span>
              </span>
              <span class="font-mono text-xs text-on-surface font-bold tracking-wider uppercase">Scamora AI 2026</span>
              <span class="text-outline-variant font-mono">/</span>
              <span class="font-mono text-xs text-secondary tracking-normal font-semibold">Autonomous Digital Threat Defense</span>
            </div>

            <!-- Main Typography Lockup -->
            <h1 class="text-4xl sm:text-6xl font-extrabold text-on-surface max-w-4xl tracking-tight leading-tight mb-5">
              Think <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-on-tertiary-container">Before You Click.</span>
            </h1>

            <p class="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
              Kenali potensi penipuan digital, tautan phishing, dan rekayasa sosial manipulatif sebelum menjadi korban. Zero data retention, automated client-side PII scrubbing, dan verifikasi heuristik sub-detik.
            </p>

            <!-- Action Tunnels -->
            <div class="flex flex-wrap items-center justify-center gap-4 mb-10">
              <a href="#/url" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-semibold text-sm hover:bg-secondary-container transition-all shadow-md shadow-secondary/20">
                <span class="material-symbols-outlined text-[20px]">shield</span>
                <span>Cek Tautan Mencurigakan</span>
              </a>
              <a href="#/chat" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest text-on-surface font-semibold text-sm hover:bg-surface-container transition-all shadow-sm border border-surface-container">
                <span class="material-symbols-outlined text-[20px] text-secondary">chat_bubble</span>
                <span>Inspeksi Chat WhatsApp</span>
                <span class="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-secondary">LIVE DEMO</span>
              </a>
            </div>

            <!-- Proof Bar -->
            <div class="w-full max-w-4xl py-3 px-6 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md shadow-sm border border-surface-container flex flex-wrap items-center justify-around gap-4 text-left">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary text-[20px]">analytics</span>
                <span class="font-mono text-xs text-on-surface font-semibold">450,000+ Daily Ingress Checks</span>
              </div>
              <div class="h-4 w-px bg-surface-container hidden sm:block"></div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-on-tertiary-container text-[20px]">security</span>
                <span class="font-mono text-xs text-on-surface font-semibold">Heuristic & Graph Reasoning</span>
              </div>
              <div class="h-4 w-px bg-surface-container hidden sm:block"></div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary text-[20px]">lock_reset</span>
                <span class="font-mono text-xs text-on-surface font-semibold">Zero Plaintext Storage Guaranteed</span>
              </div>
            </div>

          </section>

          <!-- BESPOKE LIVE SHOWCASE: DUAL TELEMETRY CONSOLES (STITCH) -->
          <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14" id="scanner-anchor">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <!-- Left: URL Heuristics Diagnostic Module -->
              <div class="lg:col-span-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 relative overflow-hidden flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-[22px]">link</span>
                    <span class="text-base font-bold text-on-surface">Domain Security Inspector</span>
                  </div>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-error-container text-error font-bold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                    THREAT IDENTIFIED
                  </span>
                </div>

                <!-- URL Input Bar Visualization -->
                <div class="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-2 border border-surface-container">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="material-symbols-outlined text-error text-[18px]">gpp_maybe</span>
                    <span class="font-mono text-xs text-on-surface truncate">http://bca-klik.com.secure-login-update.xyz/login?v=true</span>
                  </div>
                  <span class="font-mono text-[10px] text-on-surface-variant uppercase bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm shrink-0">Port 80</span>
                </div>

                <!-- Vector Phishing Analysis -->
                <div class="grid grid-cols-3 gap-2 pt-1">
                  <div class="p-3 bg-surface-container rounded-xl flex flex-col gap-1">
                    <span class="font-mono text-[10px] text-on-surface-variant font-semibold">TLD REPUTATION</span>
                    <span class="text-lg font-bold text-error">98.4%</span>
                    <span class="font-mono text-[10px] text-error">Hostile .xyz</span>
                  </div>
                  <div class="p-3 bg-surface-container rounded-xl flex flex-col gap-1">
                    <span class="font-mono text-[10px] text-on-surface-variant font-semibold">TYPOSQUATTING</span>
                    <span class="text-lg font-bold text-error">0.96</span>
                    <span class="font-mono text-[10px] text-on-surface-variant">Target: KlikBCA</span>
                  </div>
                  <div class="p-3 bg-surface-container rounded-xl flex flex-col gap-1">
                    <span class="font-mono text-[10px] text-on-surface-variant font-semibold">SSL LAYER</span>
                    <span class="text-lg font-bold text-error">Missing</span>
                    <span class="font-mono text-[10px] text-error">Insecure HTTP</span>
                  </div>
                </div>

                <!-- Forensic Diagnostic Findings -->
                <div class="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2 border border-surface-container">
                  <div class="flex items-center gap-1.5 text-error text-xs font-bold">
                    <span class="material-symbols-outlined text-[18px]">crisis_alert</span>
                    Critical Severity: Fraudulent Financial Subdomain Ingress
                  </div>
                  <p class="text-xs text-on-surface-variant leading-relaxed">
                    Target URL memanfaatkan deceptive domain prefixing untuk memalsukan PT Bank Central Asia Tbk. Domain terdaftar 14 jam lalu di klaster registrar berisiko tinggi tanpa catatan MX resmi.
                  </p>
                  <div class="flex items-center justify-between pt-1">
                    <span class="font-mono text-[11px] text-on-surface-variant">DNS_ENTROPY: 4.887 bit</span>
                    <a href="#/url?demo=phishing_bca" class="font-mono text-xs text-secondary hover:underline font-semibold flex items-center gap-0.5">
                      Uji Kasus Ini <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Right: WhatsApp Conversational Fraud Parser -->
              <div class="lg:col-span-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 flex flex-col gap-4 relative" id="chat-inspector-anchor">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-[22px]">quickreply</span>
                    <span class="text-base font-bold text-on-surface">Conversational Fraud Inspector</span>
                  </div>
                  <div class="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-tertiary-container font-semibold">
                    <span class="material-symbols-outlined text-[14px]">lock</span>
                    Zero-PII Active
                  </div>
                </div>

                <!-- Chat Transcript Simulation Box -->
                <div class="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 border border-surface-container">
                  <div class="flex items-center justify-between text-outline">
                    <span class="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">PARSED PAYLOAD</span>
                    <span class="font-mono text-[10px] text-on-surface-variant">SENDER: +62 821-****-9104</span>
                  </div>

                  <!-- Message Balloon with Masking Highlights -->
                  <div class="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm space-y-2 border border-surface-container">
                    <p class="text-xs text-on-surface leading-relaxed">
                      "Halo kak, kamu terpilih lolos kerja part-time like & subscribe YouTube! Gaji harian Rp500.000 - Rp2.000.000. Untuk aktivasi akun dan verifikasi sistem, mohon segera transfer <span class="bg-error-container text-error px-1 py-0.5 rounded font-mono font-semibold">Rp150.000</span> biaya jaminan ke rekening BCA <span class="bg-surface-container-high text-secondary px-1 py-0.5 rounded font-mono">[ACC_SCRUBBED_ID_302]</span> a.n. <span class="bg-surface-container-high text-secondary px-1 py-0.5 rounded font-mono">[NAME_REDACTED]</span>. Batas waktu hanya 15 menit!"
                    </p>
                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                      <span class="font-mono text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">Token Redaction: Bank Account Masked</span>
                      <span class="font-mono text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">NIK Sanitized</span>
                    </div>
                  </div>
                </div>

                <!-- AI Model Verdict Matrix -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 bg-surface-container rounded-xl flex items-center justify-between">
                    <div class="flex flex-col">
                      <span class="font-mono text-[10px] text-on-surface-variant font-semibold">SCAM CONFIDENCE</span>
                      <span class="text-xl font-bold text-error font-mono">94.8%</span>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                      <span class="material-symbols-outlined text-[20px]">warning</span>
                    </div>
                  </div>
                  <div class="p-3 bg-surface-container rounded-xl flex flex-col justify-center">
                    <span class="font-mono text-[10px] text-on-surface-variant font-semibold">TAXONOMY</span>
                    <span class="text-xs font-bold text-on-surface">Advance-Fee Job Scam</span>
                    <span class="font-mono text-[10px] text-error">High Urgency Trigger (15m)</span>
                  </div>
                </div>

                <!-- Cryptographic Integrity Strip -->
                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant">
                    <span class="material-symbols-outlined text-secondary text-[16px]">fingerprint</span>
                    <span>SHA256: 9b1e...f720 (Ephemeral Purged)</span>
                  </div>
                  <a href="#/chat?demo=job_fee" class="font-mono text-xs text-secondary hover:underline font-semibold flex items-center gap-0.5">
                    Uji Kasus Ini <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              </div>

            </div>
          </section>
        </div>

        <!-- CORE CAPABILITY DUAL-PILLARS -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div class="text-center max-w-2xl mx-auto mb-10">
            <span class="font-mono text-xs text-secondary uppercase tracking-wider font-semibold">Engineered Security Surface</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-on-surface mt-2">
              Bespoke Defense for Complex Deception
            </h2>
            <p class="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Dirancang untuk masyarakat digital sehari-hari yang menghadapi serangan penipuan multi-kanal yang semakin canggih.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Pillar 1 -->
            <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all">
              <div class="space-y-4">
                <div class="w-12 h-12 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
                  <span class="material-symbols-outlined text-[28px]">dns</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-on-surface">URL Safety & Domain Heuristics</h3>
                  <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Pemeriksaan tautan otomatis menyasar domain tiruan, registrasi WHOIS instan, manipulasi Punycode, dan pemendek URL bertingkat.
                  </p>
                </div>
                <div class="bg-surface-container-low rounded-xl p-3.5 space-y-2 border border-surface-container text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-on-surface flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      Homograph & Cyrillic Spoof Isolation
                    </span>
                    <span class="font-mono text-[10px] text-on-tertiary-container font-semibold">Active</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-on-surface flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      Global Safe Browsing Feed Check
                    </span>
                    <span class="font-mono text-[10px] text-on-tertiary-container font-semibold">&lt; 15ms</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-on-surface flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      Entropy & Lexical Subdomain Volatility
                    </span>
                    <span class="font-mono text-[10px] text-on-tertiary-container font-semibold">Heuristic v4</span>
                  </div>
                </div>
              </div>
              <div class="pt-6 flex items-center justify-between border-t border-surface-container mt-4">
                <span class="font-mono text-[10px] text-on-surface-variant">ENGINE: RADAR_URL_v4.2</span>
                <a href="#/url" class="font-mono text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1">
                  Jalankan Scanner <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>

            <!-- Pillar 2 -->
            <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all">
              <div class="space-y-4">
                <div class="w-12 h-12 rounded-xl bg-surface-container text-on-tertiary-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-[28px]">mark_chat_unread</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-on-surface">Conversational Scam & Social Engineering</h3>
                  <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Pemahaman semantik berbasis NLP khusus narasi penipuan Indonesia: pemaksaan instalasi berkas APK, desakan transfer, dan tawaran imbalan palsu.
                  </p>
                </div>
                <div class="bg-surface-container-low rounded-xl p-3.5 space-y-2 border border-surface-container text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-on-surface flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-on-tertiary-container text-[16px]">verified</span>
                      On-the-Fly NIK, Rekening, & Card Redaction
                    </span>
                    <span class="font-mono text-[10px] text-on-tertiary-container font-semibold">100% PII Masked</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-on-surface flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-on-tertiary-container text-[16px]">verified</span>
                      Social Engineering Urgency Vector Scoring
                    </span>
                    <span class="font-mono text-[10px] text-on-tertiary-container font-semibold">Multi-stage</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-on-surface flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-on-tertiary-container text-[16px]">verified</span>
                      WhatsApp / Telegram Threat Match Index
                    </span>
                    <span class="font-mono text-[10px] text-on-tertiary-container font-semibold">Real-time Feed</span>
                  </div>
                </div>
              </div>
              <div class="pt-6 flex items-center justify-between border-t border-surface-container mt-4">
                <span class="font-mono text-[10px] text-on-surface-variant">ENGINE: NLP_CONV_LLM_SEC</span>
                <a href="#/chat" class="font-mono text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1">
                  Jalankan Inspector <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- FOUR-STEP PRIVACY-FIRST ARCHITECTURE -->
        <section class="w-full bg-surface-container-low py-12 border-y border-surface-container">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span class="font-mono text-xs text-secondary uppercase tracking-wider font-semibold">How Scamora Operates</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                  Privacy-First Detection Architecture
                </h2>
              </div>
              <p class="text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
                Alur kerja inspeksi zero-knowledge memastikan percakapan privat dan kredensial Anda tidak pernah disimpan di server kami.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container flex flex-col justify-between">
                <div>
                  <span class="font-mono text-xs text-secondary font-bold">01 / INGESTION</span>
                  <h4 class="text-sm font-bold text-on-surface mt-2">Sanitized Ingress</h4>
                  <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Input URL atau chat dibersihkan dari parameter sensitif dan kredensial pada memori lokal peramban.
                  </p>
                </div>
                <div class="pt-4 mt-2 border-t border-surface-container">
                  <span class="font-mono text-[11px] text-outline">HTTP 308 Scrub</span>
                </div>
              </div>

              <div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container flex flex-col justify-between">
                <div>
                  <span class="font-mono text-xs text-on-tertiary-container font-bold">02 / REDACTION</span>
                  <h4 class="text-sm font-bold text-on-surface mt-2">Zero-Knowledge Masking</h4>
                  <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Penyensoran algoritmik otomatis terhadap nomor ponsel, NIK, nomor kartu rekening bank, dan nama orang.
                  </p>
                </div>
                <div class="pt-4 mt-2 border-t border-surface-container">
                  <span class="font-mono text-[11px] text-outline">PII Replacement Engine</span>
                </div>
              </div>

              <div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container flex flex-col justify-between">
                <div>
                  <span class="font-mono text-xs text-secondary font-bold">03 / INFERENCE</span>
                  <h4 class="text-sm font-bold text-on-surface mt-2">Dual AI Pipeline</h4>
                  <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Kombinasi aturan heuristik deterministik cepat dan inferensi semantik model bahasa tanpa retensi disk.
                  </p>
                </div>
                <div class="pt-4 mt-2 border-t border-surface-container">
                  <span class="font-mono text-[11px] text-outline">Ephemeral RAM Execution</span>
                </div>
              </div>

              <div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container flex flex-col justify-between">
                <div>
                  <span class="font-mono text-xs text-on-tertiary-container font-bold">04 / PLAYBOOK</span>
                  <h4 class="text-sm font-bold text-on-surface mt-2">Actionable Verdict</h4>
                  <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Laporan rincian dengan kutipan bukti berbobot dan langkah mitigasi konkret untuk melindungi diri.
                  </p>
                </div>
                <div class="pt-4 mt-2 border-t border-surface-container">
                  <span class="font-mono text-[11px] text-outline">Incident Report Output</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- INTERACTIVE THREAT CASE SIMULATION MATRIX -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div class="text-center max-w-xl mx-auto mb-8">
            <span class="font-mono text-xs text-secondary uppercase tracking-wider font-semibold">Live Sandbox Scenarios</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
              Common Attack Scenarios Simulated
            </h2>
            <p class="text-xs sm:text-sm text-on-surface-variant mt-1">
              Pilih skenario simulasi serangan untuk melihat bagaimana Scamora mendeteksi dan mengisolasi manipulasi digital.
            </p>
          </div>

          <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 max-w-4xl mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button class="p-3.5 rounded-xl text-left transition-all bg-surface-container text-on-surface font-semibold flex items-center justify-between border border-secondary" id="scenario-btn-1" type="button">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-secondary">account_balance</span>
                  <span class="text-xs sm:text-sm">Banking Subdomain Spoof</span>
                </div>
                <span class="font-mono text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded text-secondary font-bold">Kasus URL</span>
              </button>
              <button class="p-3.5 rounded-xl text-left transition-all bg-surface-container-low text-on-surface-variant hover:bg-surface-container flex items-center justify-between border border-surface-container" id="scenario-btn-2" type="button">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-on-tertiary-container">work_history</span>
                  <span class="text-xs sm:text-sm">Telegram Freelance Fee Trap</span>
                </div>
                <span class="font-mono text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded text-on-surface-variant font-bold">Kasus Chat</span>
              </button>
            </div>

            <div class="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4 border border-surface-container">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span class="font-mono text-[10px] text-error uppercase font-bold" id="scenario-type">VEKTOR: FINANCIAL CREDENTIAL THEFT</span>
                  <h4 class="text-sm sm:text-base font-bold text-on-surface" id="scenario-title">Deceptive Bank Central Asia Login Gateway</h4>
                </div>
                <span class="font-mono text-xs px-2.5 py-1 rounded bg-error-container text-error font-bold self-start sm:self-auto" id="scenario-score">RISK SCORE: 99 / 100</span>
              </div>

              <div class="p-3.5 bg-surface-container-lowest rounded-xl font-mono text-xs text-on-surface border border-surface-container" id="scenario-payload">
                Target: http://bca-klik.com.secure-login-update.xyz/login?verifikasi=true<br>
                Metode: Lookalike prefix + Unauthenticated DNS + Insecure HTTP
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3" id="scenario-metrics">
                <div class="bg-surface-container p-3 rounded-xl">
                  <span class="font-mono text-[10px] text-on-surface-variant block">PRIMARY TRIGGER</span>
                  <span class="text-xs font-bold text-on-surface mt-0.5 block" id="metric-1">Homograph Brand Impersonation</span>
                </div>
                <div class="bg-surface-container p-3 rounded-xl">
                  <span class="font-mono text-[10px] text-on-surface-variant block">CERTIFICATE REPUTATION</span>
                  <span class="text-xs font-bold text-error mt-0.5 block" id="metric-2">Missing TLS Encryption</span>
                </div>
                <div class="bg-surface-container p-3 rounded-xl">
                  <span class="font-mono text-[10px] text-on-surface-variant block">MITIGATION PLAYBOOK</span>
                  <span class="text-xs font-bold text-secondary mt-0.5 block" id="metric-3">Block & Report to ISP</span>
                </div>
              </div>

              <div class="bg-surface-container-high/40 p-3.5 rounded-xl flex items-start gap-3 border border-surface-container">
                <span class="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">policy</span>
                <div>
                  <span class="text-xs font-bold text-on-surface block">Immediate Defensive Action</span>
                  <p class="text-xs text-on-surface-variant mt-0.5 leading-relaxed" id="scenario-action">
                    Jangan pernah memasukkan User ID, respons token KeyBCA, atau PIN ATM. Pemilik domain dapat mengintersepsi keystroke secara langsung. Pastikan alamat selalu beralamat resmi klikbca.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- PRE-CLICK 3-MINUTE SECURITY CHECKLIST -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 sm:p-8">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-surface-container">
              <div>
                <span class="font-mono text-xs text-on-tertiary-container uppercase tracking-wider font-semibold">Human Shield Routine</span>
                <h2 class="text-xl sm:text-2xl font-extrabold text-on-surface mt-1">
                  Pre-Click 3-Minute Security Checklist
                </h2>
                <p class="text-xs text-on-surface-variant mt-1 max-w-xl">
                  Sebelum mengetuk lampiran mencurigakan, membuka tautan, atau merespon desakan transfer, selalu verifikasi 4 aturan pokok ini.
                </p>
              </div>
              <a href="#/panduan" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors self-start lg:self-auto">
                <span class="material-symbols-outlined text-[16px] text-secondary">fact_check</span>
                <span>Buka Checklist Interaktif Lengkap</span>
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <div class="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center font-mono text-xs font-bold">
                  01
                </div>
                <h4 class="text-sm font-bold text-on-surface">Domain Root Audit</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">
                  Baca tautan dari kanan ke kiri sebelum tanda garis miring pertama. Abaikan nama bank yang sengaja ditaruh di subdomain depan.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <div class="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center font-mono text-xs font-bold">
                  02
                </div>
                <h4 class="text-sm font-bold text-on-surface">OTP & Token Secrecy</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">
                  Pihak bank dan kurir resmi TIDAK PERNAH meminta 6-digit SMS OTP, CVV kartu, atau PIN ATM melalui panggilan atau chat.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <div class="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center font-mono text-xs font-bold">
                  03
                </div>
                <h4 class="text-sm font-bold text-on-surface">Channel Escalation</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">
                  Waspadai ajakan pindah ke grup Telegram rahasia atau instruksi mengunduh berkas berekstensi .APK dengan dalih surat tilang/resi.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <div class="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center font-mono text-xs font-bold">
                  04
                </div>
                <h4 class="text-sm font-bold text-on-surface">Artificial Urgency</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">
                  Taktik kepanikan "Rekening diblokir dalam 10 menit" atau "Hadiah hangus jika tidak bayar pajak" adalah manipulasi psikologis.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- COMPLIANCE & PRIVACY ASSURANCE BANNER -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <div class="bg-primary text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div class="max-w-2xl space-y-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-tertiary-fixed text-[22px]">verified_user</span>
                  <span class="font-mono text-xs text-tertiary-fixed uppercase tracking-wider font-semibold">Zero Plaintext Data Storage</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-white">
                  Built for Privacy. Engineered for Defense.
                </h3>
                <p class="text-xs sm:text-sm text-on-primary-container leading-relaxed">
                  Scamora AI tidak pernah menyimpan teks percakapan, nomor ponsel pribadi, atau URL mentah ke dalam basis data permanen. Seluruh inferensi linguistik dilakukan dengan client-side token scrubbing & RAM ephemerality.
                </p>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <button id="btn-home-view-privacy" class="px-5 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs sm:text-sm hover:bg-secondary-container transition-all shadow-sm">
                  Baca Kebijakan Privasi Lengkap
                </button>
                <a href="#/panduan" class="px-4 py-2.5 rounded-xl bg-surface-container-highest/20 text-white font-semibold text-xs sm:text-sm hover:bg-surface-container-highest/30 transition-all">
                  Panduan Mitigasi
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    `;

    // Interactive Scenario Switcher
    const sBtn1 = container.querySelector('#scenario-btn-1');
    const sBtn2 = container.querySelector('#scenario-btn-2');
    const sType = container.querySelector('#scenario-type');
    const sTitle = container.querySelector('#scenario-title');
    const sScore = container.querySelector('#scenario-score');
    const sPayload = container.querySelector('#scenario-payload');
    const m1 = container.querySelector('#metric-1');
    const m2 = container.querySelector('#metric-2');
    const m3 = container.querySelector('#metric-3');
    const sAction = container.querySelector('#scenario-action');

    if (sBtn1 && sBtn2) {
      sBtn1.addEventListener('click', () => {
        sBtn1.className = "p-3.5 rounded-xl text-left transition-all bg-surface-container text-on-surface font-semibold flex items-center justify-between border border-secondary";
        sBtn2.className = "p-3.5 rounded-xl text-left transition-all bg-surface-container-low text-on-surface-variant hover:bg-surface-container flex items-center justify-between border border-surface-container";
        sType.textContent = "VEKTOR: FINANCIAL CREDENTIAL THEFT";
        sTitle.textContent = "Deceptive Bank Central Asia Login Gateway";
        sScore.textContent = "RISK SCORE: 99 / 100";
        sPayload.innerHTML = "Target: http://bca-klik.com.secure-login-update.xyz/login?verifikasi=true<br>Metode: Lookalike prefix + Unauthenticated DNS + Insecure HTTP";
        m1.textContent = "Homograph Brand Impersonation";
        m2.textContent = "Missing TLS Encryption";
        m3.textContent = "Block & Report to ISP";
        sAction.textContent = "Jangan pernah memasukkan User ID, respons token KeyBCA, atau PIN ATM. Pemilik domain dapat mengintersepsi keystroke secara langsung. Pastikan alamat selalu beralamat resmi klikbca.com.";
      });

      sBtn2.addEventListener('click', () => {
        sBtn2.className = "p-3.5 rounded-xl text-left transition-all bg-surface-container text-on-surface font-semibold flex items-center justify-between border border-secondary";
        sBtn1.className = "p-3.5 rounded-xl text-left transition-all bg-surface-container-low text-on-surface-variant hover:bg-surface-container flex items-center justify-between border border-surface-container";
        sType.textContent = "VEKTOR: ADVANCE-FEE SOCIAL ENGINEERING";
        sTitle.textContent = "Freelance YouTube Like & Subscribe Scam";
        sScore.textContent = "RISK SCORE: 95 / 100";
        sPayload.innerHTML = "\"Halo kak, kamu lolos kerja part-time like & subscribe! Gaji Rp2.000.000/hari. Transfer <span class='bg-error-container text-error px-1 py-0.5 rounded'>Rp150.000</span> biaya jaminan ke <span class='bg-surface-container-highest px-1 py-0.5 rounded'>[ACC_SCRUBBED]</span> a.n. <span class='bg-surface-container-highest px-1 py-0.5 rounded'>[NAME_REDACTED]</span>. Batas 15 menit!\"";
        m1.textContent = "Advance-Fee Coercion";
        m2.textContent = "High Urgency Pressure (15m)";
        m3.textContent = "Block Number & Reject";
        sAction.textContent = "Jangan pernah mentransfer uang jaminan untuk lowongan kerja apa pun. Perusahaan legal tidak pernah meminta deposit untuk memulai tugas.";
      });
    }

    const btnPrivacy = container.querySelector('#btn-home-view-privacy');
    if (btnPrivacy) {
      btnPrivacy.addEventListener('click', () => {
        S.showPrivacyModal((accepted) => {
          AppState.privacyAccepted = accepted;
          S.showToast('Persetujuan privasi tersimpan untuk sesi ini', 'success');
        });
      });
    }
  }

  // 2. URL SAFETY CHECKER PAGE (#/url - DESAIN STITCH)
  function renderUrlCheckerPage(container) {
    const hashParts = window.location.hash.split('?demo=');
    const demoId = hashParts[1];
    let prefillUrl = '';
    if (demoId && S.DEMO_DATA) {
      const matched = S.DEMO_DATA.URL_EXAMPLES.find(d => d.id === demoId);
      if (matched) prefillUrl = matched.url;
    }

    container.innerHTML = `
      <div class="flex flex-col w-full pb-16">
        
        <!-- SUB-BANNER / BLUEPRINT HEADER -->
        <section class="w-full bg-surface-container-low py-8 border-b border-surface-container">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-highest text-secondary font-mono text-[11px] font-semibold uppercase">
                <span class="material-symbols-outlined text-[14px]">terminal</span>
                <span>MIT-Week 2026 Innovation Blueprint</span>
              </div>
              <span class="text-on-surface-variant font-mono text-xs">•</span>
              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-mono text-[11px]">
                <span>Pemeriksaan Struktur & Reputasi</span>
              </div>
              <span class="text-on-surface-variant font-mono text-xs">•</span>
              <div class="inline-flex items-center px-2 py-0.5 rounded bg-primary text-white font-mono text-[10px] font-bold uppercase">
                P0 Core Security Module
              </div>
              <div class="ml-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-lowest text-on-tertiary-container shadow-sm border border-surface-container font-mono text-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                <span>Zero Plaintext Ingress • Client-Side Scrubbing</span>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end pt-2">
              <div class="lg:col-span-8 space-y-1">
                <h1 class="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Pemeriksaan Keamanan Tautan (URL Safety Checker)</h1>
                <p class="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                  Pemeriksaan struktur URL secara lokal di peramban serta validasi reputasi Google Safe Browsing. URL dibersihkan dari kredensial login dan parameter sensitif sebelum proses mitigasi risiko.
                </p>
              </div>
              <div class="lg:col-span-4 flex lg:justify-end">
                <div class="flex items-center gap-3 px-4 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container">
                  <div class="flex flex-col">
                    <span class="font-mono text-[10px] text-on-surface-variant uppercase">Engine State</span>
                    <span class="font-mono text-xs text-secondary font-bold">HEURISTIC_V4.2 [ONLINE]</span>
                  </div>
                  <div class="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined text-[20px]">shield_lock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- MAIN WORKSPACE -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
          
          <!-- QUICK SIMULATION PRESETS -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-secondary">play_circle</span>
                <span class="font-mono text-xs font-bold uppercase tracking-wider text-on-surface">Pilih Contoh Skenario: SIMULASI – Data Fiktif</span>
              </div>
              <span class="font-mono text-[11px] text-on-surface-variant hidden sm:inline-block">5 Skenario Uji Serangan Otomatis</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3" id="presetPillGroup">
              ${(S.DEMO_DATA?.URL_EXAMPLES || []).map((ex, idx) => `
                <button type="button" data-url="${escapeHtml(ex.url)}" class="btn-load-url-demo flex flex-col text-left p-3 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow transition-all border border-surface-container group relative overflow-hidden">
                  <div class="flex items-center justify-between w-full mb-1">
                    <span class="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${ex.expectedScore >= 60 ? 'bg-error-container text-error' : (ex.expectedScore >= 30 ? 'bg-amber-500/10 text-amber-700' : 'bg-surface-container text-on-tertiary-container')}">
                      ${ex.expectedScore >= 60 ? 'High Risk' : (ex.expectedScore >= 30 ? 'Perlu Tinjau' : 'Low Risk')}
                    </span>
                    <span class="material-symbols-outlined text-[16px] text-outline-variant group-hover:text-secondary">check_circle</span>
                  </div>
                  <span class="text-xs text-on-surface font-semibold truncate w-full">${escapeHtml(ex.title)}</span>
                  <span class="font-mono text-[11px] text-on-surface-variant truncate w-full opacity-70">${escapeHtml(ex.url)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- INPUT BOX & PROTOCOL BADGE -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label for="input-url" class="text-xs sm:text-sm font-bold text-on-surface">
                Masukkan Alamat Tautan (URL) Lengkap:
              </label>
              <span class="font-mono text-xs text-on-surface-variant" id="url-char-count">0 / 2.048 karakter</span>
            </div>

            <div class="flex flex-col lg:flex-row items-stretch gap-3">
              <div class="flex-1 flex items-center bg-surface-container-low rounded-xl px-4 py-2 border border-surface-container shadow-inner">
                <div id="protocolBadge" class="flex items-center gap-1 px-2.5 py-1 rounded bg-error-container text-on-error-container font-mono text-xs font-bold mr-3 shrink-0">
                  <span class="material-symbols-outlined text-[14px]">lock_open</span>
                  <span id="protocolBadgeText">HTTP</span>
                </div>
                <input 
                  type="text" 
                  id="input-url" 
                  value="${escapeHtml(prefillUrl || 'http://bca-klik.com.secure-login-update.xyz/login?verifikasi=true')}" 
                  maxlength="2048"
                  placeholder="https://contoh-domain-target.com/jalur-halaman..." 
                  class="w-full bg-transparent font-mono text-xs sm:text-sm text-on-surface focus:outline-none placeholder-outline-variant"
                >
                <button type="button" id="btn-clear-url" class="text-on-surface-variant hover:text-on-surface p-1 transition-colors" title="Kosongkan Teks">
                  <span class="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              </div>

              <div class="flex items-center gap-2">
                <button 
                  type="button" 
                  id="btn-submit-url" 
                  class="px-6 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs sm:text-sm hover:bg-secondary-container transition-all shadow-md shadow-secondary/20 flex items-center justify-center gap-2 shrink-0"
                >
                  <span class="material-symbols-outlined text-[18px]">radar</span>
                  <span>Analisis Keamanan URL</span>
                </button>
              </div>
            </div>

            <!-- Error Box -->
            <div id="url-error-box" class="hidden p-3.5 rounded-xl bg-error-container text-error text-xs flex items-start gap-2.5" role="alert" aria-live="assertive">
              <span class="material-symbols-outlined text-[18px] text-error shrink-0 mt-0.5">error</span>
              <span id="url-error-text"></span>
            </div>

            <!-- Privacy Consent Checkbox -->
            <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
              <label class="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  id="url-privacy-checkbox" 
                  ${AppState.privacyAccepted ? 'checked' : ''} 
                  class="w-4 h-4 rounded text-secondary focus:ring-secondary mt-0.5 border-outline-variant"
                >
                <span class="text-xs text-on-surface-variant leading-relaxed">
                  Saya menyetujui <button type="button" id="btn-open-privacy-link-url" class="text-secondary hover:underline font-semibold">Pemberitahuan Perlindungan Privasi</button>. Saya memahami bahwa URL akan dibersihkan dari userinfo dan token sebelum dikirim ke Google Safe Browsing, serta input tidak disimpan permanen.
                </span>
              </label>
            </div>

            <!-- Security Disclaimer Notices -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div class="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low border border-surface-container">
                <span class="material-symbols-outlined text-[18px] text-secondary mt-0.5">verified</span>
                <span class="text-xs text-on-surface-variant">Sistem tidak pernah membuka, mengeksekusi skrip, atau mengunduh isi halaman web secara langsung. Evaluasi berbasis parser murni.</span>
              </div>
              <div class="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low border border-surface-container">
                <span class="material-symbols-outlined text-[18px] text-outline mt-0.5">info</span>
                <span class="text-xs text-on-surface-variant">Layanan penyingkat tautan (URL shortener) dicatat keterbatasannya karena tujuan akhir tidak diikuti demi keamanan lingkungan uji.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    const inputUrl = container.querySelector('#input-url');
    const charCount = container.querySelector('#url-char-count');
    const errorBox = container.querySelector('#url-error-box');
    const errorText = container.querySelector('#url-error-text');
    const privacyCheckbox = container.querySelector('#url-privacy-checkbox');
    const submitBtn = container.querySelector('#btn-submit-url');
    const clearBtn = container.querySelector('#btn-clear-url');
    const privacyLink = container.querySelector('#btn-open-privacy-link-url');
    const protocolBadge = container.querySelector('#protocolBadge');
    const protocolBadgeText = container.querySelector('#protocolBadgeText');

    const updateProtocolBadge = (val) => {
      const lower = val.trim().toLowerCase();
      if (lower.startsWith('https://')) {
        protocolBadge.className = 'flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-tertiary-container font-mono text-xs font-bold mr-3 shrink-0';
        protocolBadge.innerHTML = '<span class="material-symbols-outlined text-[14px]">lock</span><span>HTTPS</span>';
      } else {
        protocolBadge.className = 'flex items-center gap-1 px-2.5 py-1 rounded bg-error-container text-on-error-container font-mono text-xs font-bold mr-3 shrink-0';
        protocolBadge.innerHTML = '<span class="material-symbols-outlined text-[14px]">lock_open</span><span>HTTP</span>';
      }
    };

    const updateCount = () => {
      charCount.textContent = `${inputUrl.value.length} / 2.048 karakter`;
      updateProtocolBadge(inputUrl.value);
    };

    inputUrl.addEventListener('input', () => {
      updateCount();
      errorBox.classList.add('hidden');
    });
    updateCount();

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        inputUrl.value = '';
        updateCount();
        errorBox.classList.add('hidden');
      });
    }

    privacyLink.addEventListener('click', () => {
      S.showPrivacyModal((accepted) => {
        AppState.privacyAccepted = accepted;
        privacyCheckbox.checked = accepted;
        S.showToast('Pemberitahuan privasi telah disetujui', 'success');
      });
    });

    privacyCheckbox.addEventListener('change', () => {
      AppState.privacyAccepted = privacyCheckbox.checked;
    });

    const demoButtons = container.querySelectorAll('.btn-load-url-demo');
    demoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        inputUrl.value = btn.getAttribute('data-url');
        updateCount();
        errorBox.classList.add('hidden');
        S.showToast('Data simulasi dimuat ke kolom input', 'info');
      });
    });

    submitBtn.addEventListener('click', async () => {
      errorBox.classList.add('hidden');
      const val = inputUrl.value.trim();

      if (!privacyCheckbox.checked) {
        S.showPrivacyModal((accepted) => {
          AppState.privacyAccepted = accepted;
          privacyCheckbox.checked = accepted;
          submitBtn.click();
        });
        return;
      }

      const validation = S.validateUrl(val);
      if (!validation.valid) {
        errorText.textContent = validation.error;
        errorBox.classList.remove('hidden');
        return;
      }

      container.innerHTML = S.renderStepper('url');
      if (window.lucide) window.lucide.createIcons({ root: container });

      try {
        const result = await S.analyzeUrlApi(val, true);
        AppState.lastAnalysisResult = result;
        navigateTo('#/laporan');
      } catch (err) {
        if (err.status === 429) {
          S.showToast(err.message, 'warning');
          renderUrlCheckerPage(container);
          const errBox = container.querySelector('#url-error-box');
          const errTxt = container.querySelector('#url-error-text');
          errTxt.textContent = `[HTTP 429] ${err.message}`;
          errBox.classList.remove('hidden');
        } else {
          errorText.textContent = err.message || 'Gagal memproses URL.';
          errorBox.classList.remove('hidden');
          renderUrlCheckerPage(container);
        }
      }
    });
  }

  // 3. WHATSAPP SCAM DETECTOR PAGE (#/chat - DESAIN STITCH)
  function renderChatDetectorPage(container) {
    const hashParts = window.location.hash.split('?demo=');
    const demoId = hashParts[1];
    let prefillText = '';
    if (demoId && S.DEMO_DATA) {
      const matched = S.DEMO_DATA.CHAT_EXAMPLES.find(d => d.id === demoId);
      if (matched) prefillText = matched.text;
    }

    container.innerHTML = `
      <div class="flex flex-col w-full pb-16">
        
        <!-- SUB-BANNER HEADER -->
        <section class="w-full bg-surface-container-low py-8 border-b border-surface-container">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container text-on-tertiary-container font-mono text-[11px] font-semibold uppercase">
                <span class="material-symbols-outlined text-[14px]">quickreply</span>
                <span>Conversational Fraud Inspector</span>
              </div>
              <span class="text-on-surface-variant font-mono text-xs">•</span>
              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-mono text-[11px]">
                <span>Zero-Knowledge PII Masking</span>
              </div>
              <span class="text-on-surface-variant font-mono text-xs">•</span>
              <div class="inline-flex items-center px-2 py-0.5 rounded bg-primary text-white font-mono text-[10px] font-bold uppercase">
                P0 Core Security Module
              </div>
            </div>

            <div class="space-y-1 pt-2">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Pendeteksi Penipuan Obrolan (WhatsApp Scam Detector)</h1>
              <p class="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                Analisis semantik konteks percakapan berbasis AI untuk mendeteksi lowongan kerja palsu, impersonasi pejabat bank, ancaman pemblokiran rekening, dan pemerasan uang muka.
              </p>
            </div>
          </div>
        </section>

        <!-- MAIN WORKSPACE -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
          
          <!-- PII Masking Warning Banner -->
          <div class="p-4 rounded-xl bg-surface-container border border-surface-container-high flex items-start gap-3 shadow-sm">
            <span class="material-symbols-outlined text-[24px] text-secondary shrink-0 mt-0.5">shield_person</span>
            <div class="space-y-1">
              <h3 class="text-xs font-bold text-on-surface uppercase tracking-wider">Peringatan Perlindungan Data Pribadi</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                Harap <strong>samarkan atau hapus nama asli, nomor rekening, dan alamat tempat tinggal</strong> Anda sebelum menempelkan teks percakapan. Meskipun sistem menjalankan masking otomatis, penyamaran bersifat upaya terbaik (<em>best-effort</em>).
              </p>
            </div>
          </div>

          <!-- Quick Simulation Presets -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-secondary">play_circle</span>
                <span class="font-mono text-xs font-bold uppercase tracking-wider text-on-surface">Pilih Contoh Skenario Chat: SIMULASI – Data Fiktif</span>
              </div>
              <span class="font-mono text-[11px] text-on-surface-variant hidden sm:inline-block">5 Skenario Uji Chat Otomatis</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              ${(S.DEMO_DATA?.CHAT_EXAMPLES || []).map(ex => `
                <button type="button" data-text="${escapeHtml(ex.text)}" class="btn-load-chat-demo flex flex-col text-left p-3 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow transition-all border border-surface-container group relative overflow-hidden">
                  <div class="flex items-center justify-between w-full mb-1">
                    <span class="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${ex.expectedScore >= 60 ? 'bg-error-container text-error' : (ex.expectedScore >= 30 ? 'bg-amber-500/10 text-amber-700' : 'bg-surface-container text-on-tertiary-container')}">
                      ${ex.expectedScore >= 60 ? 'High Risk' : (ex.expectedScore >= 30 ? 'Perlu Tinjau' : 'Low Risk')}
                    </span>
                    <span class="material-symbols-outlined text-[16px] text-outline-variant group-hover:text-secondary">check_circle</span>
                  </div>
                  <span class="text-xs text-on-surface font-semibold truncate w-full">${escapeHtml(ex.title)}</span>
                  <span class="text-[11px] text-on-surface-variant truncate w-full opacity-70">${escapeHtml(ex.text.slice(0, 45))}...</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Form Input Textarea -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label for="input-chat" class="text-xs sm:text-sm font-bold text-on-surface">
                Tempelkan Isi Teks Percakapan WhatsApp:
              </label>
              <span class="font-mono text-xs text-on-surface-variant" id="chat-char-count">0 / 5.000 karakter</span>
            </div>

            <textarea 
              id="input-chat" 
              rows="6"
              placeholder="Contoh: Halo kak, selamat kamu lolos seleksi kerja part-time like & subscribe YouTube dengan gaji Rp2 juta per hari. Silakan transfer biaya jaminan Rp150.000..." 
              class="w-full p-4 bg-surface-container-low border border-surface-container rounded-xl text-xs sm:text-sm text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary transition-all font-sans leading-relaxed resize-y"
            >${escapeHtml(prefillText)}</textarea>

            <div id="chat-error-box" class="hidden p-3.5 rounded-xl bg-error-container text-error text-xs flex items-start gap-2.5" role="alert" aria-live="assertive">
              <span class="material-symbols-outlined text-[18px] text-error shrink-0 mt-0.5">error</span>
              <span id="chat-error-text"></span>
            </div>

            <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
              <label class="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  id="chat-privacy-checkbox" 
                  ${AppState.privacyAccepted ? 'checked' : ''} 
                  class="w-4 h-4 rounded text-secondary focus:ring-secondary mt-0.5 border-outline-variant"
                >
                <span class="text-xs text-on-surface-variant leading-relaxed">
                  Saya menyetujui <button type="button" id="btn-open-privacy-link-chat" class="text-secondary hover:underline font-semibold">Pemberitahuan Perlindungan Privasi</button>. Saya memahami bahwa teks yang dimasker akan dianalisis semantik melalui Claude API (Anthropic), tanpa penyimpanan permanen.
                </span>
              </label>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                id="btn-submit-chat" 
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs sm:text-sm hover:bg-secondary-container transition-all shadow-md shadow-secondary/20 flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[18px]">psychology</span>
                <span>Analisis Percakapan WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;

    const inputChat = container.querySelector('#input-chat');
    const charCount = container.querySelector('#chat-char-count');
    const errorBox = container.querySelector('#chat-error-box');
    const errorText = container.querySelector('#chat-error-text');
    const privacyCheckbox = container.querySelector('#chat-privacy-checkbox');
    const submitBtn = container.querySelector('#btn-submit-chat');
    const privacyLink = container.querySelector('#btn-open-privacy-link-chat');

    const updateCount = () => {
      const len = inputChat.value.trim().length;
      charCount.textContent = `${len} / 5.000 karakter`;
      if (len > 0 && len < 10) {
        charCount.className = 'font-mono text-xs text-amber-600 font-semibold';
      } else if (len > 5000) {
        charCount.className = 'font-mono text-xs text-error font-semibold';
      } else {
        charCount.className = 'font-mono text-xs text-on-surface-variant';
      }
    };

    inputChat.addEventListener('input', () => {
      updateCount();
      errorBox.classList.add('hidden');
    });
    updateCount();

    privacyLink.addEventListener('click', () => {
      S.showPrivacyModal((accepted) => {
        AppState.privacyAccepted = accepted;
        privacyCheckbox.checked = accepted;
        S.showToast('Pemberitahuan privasi telah disetujui', 'success');
      });
    });

    privacyCheckbox.addEventListener('change', () => {
      AppState.privacyAccepted = privacyCheckbox.checked;
    });

    const demoButtons = container.querySelectorAll('.btn-load-chat-demo');
    demoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        inputChat.value = btn.getAttribute('data-text');
        updateCount();
        errorBox.classList.add('hidden');
        S.showToast('Teks percakapan simulasi dimuat', 'info');
      });
    });

    submitBtn.addEventListener('click', async () => {
      errorBox.classList.add('hidden');
      const val = inputChat.value;

      if (!privacyCheckbox.checked) {
        S.showPrivacyModal((accepted) => {
          AppState.privacyAccepted = accepted;
          privacyCheckbox.checked = accepted;
          submitBtn.click();
        });
        return;
      }

      const validation = S.validateChat(val);
      if (!validation.valid) {
        errorText.textContent = validation.error;
        errorBox.classList.remove('hidden');
        return;
      }

      const maskResult = S.maskSensitiveData(validation.trimmedText);

      container.innerHTML = S.renderStepper('chat');
      if (window.lucide) window.lucide.createIcons({ root: container });

      try {
        const result = await S.analyzeChatApi(val, true, maskResult.maskedText);
        AppState.lastAnalysisResult = result;
        navigateTo('#/laporan');
      } catch (err) {
        if (err.status === 429) {
          S.showToast(err.message, 'warning');
          renderChatDetectorPage(container);
          const errBox = container.querySelector('#chat-error-box');
          const errTxt = container.querySelector('#chat-error-text');
          errTxt.textContent = `[HTTP 429] ${err.message}`;
          errBox.classList.remove('hidden');
        } else {
          errorText.textContent = err.message || 'Gagal menganalisis teks.';
          errorBox.classList.remove('hidden');
          renderChatDetectorPage(container);
        }
      }
    });
  }

  // 4. RISK ANALYSIS REPORT PAGE (#/laporan - DESAIN STITCH)
  function renderReportPage(container) {
    container.innerHTML = S.renderReport(AppState.lastAnalysisResult, () => {
      navigateTo(AppState.lastAnalysisResult?.analysisType === 'url' ? '#/url' : '#/chat');
    });

    if (window.lucide) window.lucide.createIcons({ root: container });

    const copyBtn = container.querySelector('#btn-copy-report');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const formatted = S.formatReportForCopy(AppState.lastAnalysisResult);
        try {
          await navigator.clipboard.writeText(formatted);
          S.showToast('Laporan insiden berhasil disalin ke clipboard!', 'success');
        } catch (e) {
          S.showToast('Gagal menyalin ke clipboard. Izin ditolak.', 'error');
        }
      });
    }

    const againBtn = container.querySelector('#btn-analyze-again');
    if (againBtn) {
      againBtn.addEventListener('click', () => {
        navigateTo(AppState.lastAnalysisResult?.analysisType === 'url' ? '#/url' : '#/chat');
      });
    }

    const retryBtn = container.querySelector('#btn-failed-retry');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        navigateTo(AppState.lastAnalysisResult?.analysisType === 'url' ? '#/url' : '#/chat');
      });
    }
  }

  // 5. SAFETY GUIDE & PRIVACY PAGE (#/panduan - DESAIN STITCH)
  function renderPanduanPage(container) {
    container.innerHTML = `
      <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container text-secondary text-xs font-semibold">
            <span class="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Panduan Perlindungan & Kepatuhan Privasi</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Panduan Keamanan & Privasi</h1>
          <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Saran tindakan mitigasi per modus penipuan, checklist verifikasi mandiri, dan transparansi pemrosesan data.
          </p>
        </div>

        <div class="flex items-center gap-2 border-b border-surface-container pb-2 overflow-x-auto">
          <button id="tab-btn-tindakan" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${AppState.panduanTab === 'tindakan' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}">
            Saran Tindakan Per Modus
          </button>
          <button id="tab-btn-checklist" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${AppState.panduanTab === 'checklist' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}">
            Quick Security Checklist (P1)
          </button>
          <button id="tab-btn-privasi" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${AppState.panduanTab === 'privasi' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}">
            Pemberitahuan Privasi Lengkap
          </button>
        </div>

        <div id="panduan-tab-content"></div>
      </div>
    `;

    const contentDiv = container.querySelector('#panduan-tab-content');
    const tabTindakan = container.querySelector('#tab-btn-tindakan');
    const tabChecklist = container.querySelector('#tab-btn-checklist');
    const tabPrivasi = container.querySelector('#tab-btn-privasi');

    const renderActiveTab = () => {
      if (AppState.panduanTab === 'tindakan') {
        renderActionGuideTab(contentDiv);
      } else if (AppState.panduanTab === 'checklist') {
        contentDiv.innerHTML = S.renderChecklist();
        S.initChecklistEvents(contentDiv);
      } else {
        renderPrivacyTab(contentDiv);
      }
      if (window.lucide) window.lucide.createIcons({ root: contentDiv });
    };

    tabTindakan.addEventListener('click', () => {
      AppState.panduanTab = 'tindakan';
      renderPanduanPage(container);
    });
    tabChecklist.addEventListener('click', () => {
      AppState.panduanTab = 'checklist';
      renderPanduanPage(container);
    });
    tabPrivasi.addEventListener('click', () => {
      AppState.panduanTab = 'privasi';
      renderPanduanPage(container);
    });

    renderActiveTab();
  }

  function renderActionGuideTab(container) {
    const guideItems = [
      {
        type: 'phising',
        label: 'Phishing atau Tautan Palsu',
        icon: 'link',
        actions: [
          'Jangan membuka tautan atau mengetik username, kata sandi, dan PIN Anda.',
          'Jika sudah terlanjur mengetikkan kata sandi, segera buka situs resmi institusi terkait dan ganti kata sandi utama akun Anda.',
          'Aktifkan otentikasi dua faktor (2FA) berbasis aplikasi authenticator, bukan SMS bila memungkinkan.'
        ]
      },
      {
        type: 'lowongan_kerja_palsu',
        label: 'Lowongan Kerja Palsu',
        icon: 'work',
        actions: [
          'Perusahaan resmi TIDAK PERNAH memungut uang tiket, seragam, tes medis, atau deposit misi.',
          'Abaikan ajakan bergabung ke grup Telegram admin misi komisi.',
          'Laporkan nomor pengirim ke WhatsApp dan blokir kontak tersebut.'
        ]
      },
      {
        type: 'giveaway_palsu',
        label: 'Giveaway atau Hadiah Palsu',
        icon: 'redeem',
        actions: [
          'Undian resmi tidak pernah membebankan pajak hadiah untuk ditransfer ke rekening pribadi.',
          'Hubungi customer care resmi penyelenggara program yang bersangkutan.',
          'Jangan tergiur bukti foto cek uang atau sertifikat penghargaan digital yang mudah diedit.'
        ]
      },
      {
        type: 'impersonasi',
        label: 'Impersonasi / Penyamaran Identitas',
        icon: 'badge',
        actions: [
          'Petugas bank tidak pernah meminta kode OTP 6-digit atau PIN perbankan.',
          'Tutup telepon dan segera hubungi kontak call center resmi di balik kartu ATM fisik Anda.',
          'Jangan mengunduh atau membuka lampiran berkas berekstensi .APK atau .EXE.'
        ]
      },
      {
        type: 'investasi_mencurigakan',
        label: 'Investasi atau Tawaran Finansial Mencurigakan',
        icon: 'trending_up',
        actions: [
          'Gunakan rumus 2L: Legal (cek daftar OJK di Kontak 157) dan Logis (keuntungan rasional).',
          'Jangan pernah mentransfer dana ke rekening titip dana atau rekening atas nama pribadi perorangan.',
          'Pahami bahwa instrumen keuangan yang sah selalu memiliki risiko pasar.'
        ]
      }
    ];

    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-surface-container border border-surface-container-high text-xs text-on-surface leading-relaxed">
          Pilih dan pelajari langkah perlindungan terperinci untuk setiap jenis modus penipuan digital di bawah ini:
        </div>

        <div class="space-y-4">
          ${guideItems.map(item => `
            <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[22px] text-secondary">${item.icon}</span>
                <h3 class="text-base font-bold text-on-surface">${escapeHtml(item.label)}</h3>
              </div>
              <ul class="space-y-2">
                ${item.actions.map(act => `
                  <li class="flex items-start gap-2.5 text-xs text-on-surface-variant p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                    <span class="material-symbols-outlined text-[16px] text-on-tertiary-container shrink-0 mt-0.5">check</span>
                    <span>${escapeHtml(act)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderPrivacyTab(container) {
    container.innerHTML = `
      <div class="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <div class="p-4 rounded-xl bg-surface-container border border-surface-container-high text-on-surface">
          <h3 class="font-bold text-secondary mb-1 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">verified_user</span>
            Komitmen Transparansi Privasi Scamora AI
          </h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Scamora dibuat untuk kompetisi MIT-Week 2026 dengan mengutamakan prinsip keamanan data, minimasi retensi, dan kepatuhan privasi pengguna (Zero Plaintext Storage).
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="font-bold text-on-surface text-base flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-secondary">database</span>
            1. Kebijakan Tanpa Penyimpanan Mentah (Zero Raw-Log Retention)
          </h4>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Teks percakapan WhatsApp mentah dan URL masukan pengguna <strong>tidak pernah disimpan</strong> ke dalam basis data atau dicatat ke dalam log akses server. Setelah analisis selesai dan hasil dikembalikan ke peramban Anda, data masukan sesi dibersihkan dari memori aplikasi.
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="font-bold text-on-surface text-base flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">chat_bubble</span>
            2. Pengiriman Data ke Claude API (Anthropic)
          </h4>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Untuk analisis percakapan WhatsApp, teks diproses melalui model bahasa Claude API (Anthropic). Sebelum dikirim, teks telah disamarkan (masking) dari nomor telepon, email, NIK, dan nomor rekening. Pengiriman dilakukan semata-mata untuk verifikasi semantik pada permintaan tersebut.
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="font-bold text-on-surface text-base flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-secondary">link</span>
            3. Pengiriman Data ke Google Safe Browsing
          </h4>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Untuk verifikasi URL, alamat tautan dinormalisasi dan dibersihkan dari kredensial userinfo serta parameter query sensitif (seperti token akses atau kata sandi) sebelum dicocokkan dengan basis data reputasi ancaman Google Safe Browsing.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-on-surface space-y-1">
          <h4 class="font-bold text-amber-800 text-xs">Batasan Masking Otomatis</h4>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Fitur masking penyamaran data bersifat upaya terbaik (<em>best-effort</em>) dan tidak dapat menjamin secara mutlak seluruh informasi unik tertangkap. Selalu lakukan penyamaran mandiri sebelum menempelkan teks percakapan.
          </p>
        </div>
      </div>
    `;
  }

  // 6. GUARDIAN CHALLENGE QUIZ PAGE (#/kuis - P1)
  function renderQuizPage(container) {
    const quizState = AppState.quiz;
    container.innerHTML = S.renderQuizState(quizState.currentIdx, quizState.userAnswers, quizState.isCompleted);
    if (window.lucide) window.lucide.createIcons({ root: container });

    if (quizState.isCompleted) {
      const restartBtn = container.querySelector('#btn-restart-quiz');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          AppState.quiz = { currentIdx: 0, userAnswers: [], isCompleted: false };
          renderQuizPage(container);
        });
      }
      return;
    }

    const choicesContainer = container.querySelector('#quiz-choices');
    const feedbackBox = container.querySelector('#quiz-feedback-box');
    const feedbackHeader = container.querySelector('#feedback-header');
    const feedbackExpl = container.querySelector('#feedback-explanation');
    const nextBtn = container.querySelector('#btn-next-quiz');

    const question = S.QUIZ_QUESTIONS[quizState.currentIdx];

    const buttons = choicesContainer.querySelectorAll('.quiz-choice-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        quizState.userAnswers[quizState.currentIdx] = choice;

        buttons.forEach(b => {
          b.disabled = true;
          b.classList.add('opacity-50', 'cursor-not-allowed');
        });

        const isCorrect = choice === question.correctAnswer;
        feedbackBox.classList.remove('hidden');

        if (isCorrect) {
          feedbackBox.className = 'p-4 rounded-xl bg-surface-container border border-on-tertiary-container/30 space-y-2';
          feedbackHeader.innerHTML = `
            <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">check_circle</span>
            <span class="text-sm font-bold text-on-tertiary-container">Jawaban Anda Tepat!</span>
          `;
        } else {
          feedbackBox.className = 'p-4 rounded-xl bg-error-container/40 border border-error/30 space-y-2';
          feedbackHeader.innerHTML = `
            <span class="material-symbols-outlined text-[20px] text-error">cancel</span>
            <span class="text-sm font-bold text-error">Jawaban Kurang Tepat</span>
          `;
        }

        feedbackExpl.textContent = question.explanation;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (quizState.currentIdx < S.QUIZ_QUESTIONS.length - 1) {
        quizState.currentIdx++;
      } else {
        quizState.isCompleted = true;
      }
      renderQuizPage(container);
    });
  }

  // 7. SCAM KNOWLEDGE CENTER PAGE (#/pengetahuan - P1)
  function renderKnowledgePage(container) {
    container.innerHTML = S.renderKnowledgeCenter(AppState.knowledgeSlug);
    if (window.lucide) window.lucide.createIcons({ root: container });

    const readButtons = container.querySelectorAll('.btn-read-knowledge');
    readButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        AppState.knowledgeSlug = btn.getAttribute('data-slug');
        renderKnowledgePage(container);
      });
    });

    const backBtn = container.querySelector('#btn-back-knowledge');
    const backBtn2 = container.querySelector('#btn-back-knowledge-2');
    [backBtn, backBtn2].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          AppState.knowledgeSlug = null;
          renderKnowledgePage(container);
        });
      }
    });
  }

  // 8. COMMUNITY FEED PAGE (#/komunitas - P2)
  function renderCommunityPage(container) {
    container.innerHTML = S.renderCommunityView();
    if (window.lucide) window.lucide.createIcons({ root: container });

    const shareBtn = container.querySelector('#btn-open-share-modal');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        S.showToast('Fitur berbagi pengalaman akan dibuka pada Tahap Lanjutan (P2)', 'info');
      });
    }

    const likeButtons = container.querySelectorAll('.community-like-btn');
    likeButtons.forEach(b => {
      b.addEventListener('click', () => {
        S.showToast('Apresiasi Anda tercatat!', 'success');
      });
    });
  }

  // 9. USER PROFILE PAGE (#/profil - MOCKUP)
  function renderProfilePage(container) {
    if (S.renderProfilePage) {
      S.renderProfilePage(container);
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function initApp() {
    S.initSimulationPanel();
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  S.initApp = initApp;

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})(window.Scamora);
