/**
 * Scamora - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: urlAnalyzer.js - Heuristik Analisis Struktur URL & Pembersihan Sensitif
 * Berjalan sepenuhnya di sisi klien (browser) tanpa mengunduh konten web
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function validateUrl(rawUrl) {
    const CONFIG = S.CONFIG;
    if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
      return { valid: false, error: 'URL tidak boleh kosong. Masukkan alamat tautan yang ingin diperiksa.' };
    }

    const trimmed = rawUrl.trim();

    if (trimmed.length > CONFIG.LIMITS.URL_MAX_LENGTH) {
      return {
        valid: false,
        error: `URL terlalu panjang (${trimmed.length} karakter). Maksimum ${CONFIG.LIMITS.URL_MAX_LENGTH} karakter.`
      };
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      return {
        valid: false,
        error: 'Format URL harus diawali dengan skema protokol http:// atau https://'
      };
    }

    try {
      const parsed = new URL(trimmed);
      if (!parsed.hostname || parsed.hostname.trim() === '') {
        return { valid: false, error: 'Nama host atau domain pada URL tidak valid.' };
      }
      return { valid: true, parsedUrl: parsed, cleanInput: trimmed };
    } catch (e) {
      return { valid: false, error: 'Sintaks URL tidak valid atau mengandung karakter ilegal.' };
    }
  }

  function sanitizeUrl(rawUrl) {
    const CONFIG = S.CONFIG;
    let hasUserinfo = false;
    let userinfoPart = '';
    const cleanedParams = [];

    try {
      const matchUserinfo = rawUrl.match(/^https?:\/\/([^@\/]+)@/i);
      if (matchUserinfo) {
        hasUserinfo = true;
        userinfoPart = matchUserinfo[1];
      }

      const parsed = new URL(rawUrl);

      if (parsed.username || parsed.password) {
        hasUserinfo = true;
        if (!userinfoPart) {
          userinfoPart = `${parsed.username}${parsed.password ? ':' + parsed.password : ''}`;
        }
        parsed.username = '';
        parsed.password = '';
      }

      const searchParams = new URLSearchParams(parsed.search);
      const keys = Array.from(searchParams.keys());

      for (const key of keys) {
        const lowerKey = key.toLowerCase();
        if (CONFIG.SENSITIVE_PARAMS.includes(lowerKey)) {
          cleanedParams.push(key);
          searchParams.set(key, '[DIHAPUS]');
        }
      }

      parsed.search = searchParams.toString();
      const cleanedUrl = parsed.toString();

      return {
        cleanedUrl,
        hasUserinfo,
        userinfoPart,
        cleanedParams
      };
    } catch (e) {
      return {
        cleanedUrl: rawUrl,
        hasUserinfo: false,
        userinfoPart: '',
        cleanedParams: []
      };
    }
  }

  function analyzeUrlStructure(rawUrl) {
    const CONFIG = S.CONFIG;
    const indicators = [];
    const limitations = [
      'Analisis struktur URL dilakukan tanpa membuka atau mengunduh isi halaman web guna mencegah eksekusi kode berbahaya.'
    ];

    const sanitizeResult = sanitizeUrl(rawUrl);
    const parsed = new URL(sanitizeResult.cleanedUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();

    // Indikator 1: userinfo_in_url
    if (sanitizeResult.hasUserinfo) {
      const meta = CONFIG.URL_INDICATORS.userinfo_in_url;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: sanitizeResult.userinfoPart ? `${sanitizeResult.userinfoPart}@` : '@ dalam URL',
        reason: 'URL memuat informasi login/kredensial sebelum tanda @, teknik umum untuk mengelabui pembaca nama domain asli.',
        source: meta.source
      });
    }

    if (sanitizeResult.cleanedParams.length > 0) {
      limitations.push(
        `Parameter kueri sensitif (${sanitizeResult.cleanedParams.join(', ')}) telah disamarkan. Akurasi reputasi eksternal mungkin dipengaruhi.`
      );
    }

    // Indikator 2: no_https
    if (parsed.protocol === 'http:') {
      const meta = CONFIG.URL_INDICATORS.no_https;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: 'http://',
        reason: 'Koneksi tidak menggunakan enkripsi HTTPS. Data masukan (seperti sandi atau formulir) dapat disadap pihak ketiga.',
        source: meta.source
      });
    }

    // Indikator 3: ip_host
    const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
    const isIpv6 = hostname.startsWith('[') && hostname.endsWith(']');
    if (isIpv4 || isIpv6) {
      const meta = CONFIG.URL_INDICATORS.ip_host;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: hostname,
        reason: 'Alamat situs langsung menggunakan alamat IP mentah tanpa nama domain resmi.',
        source: meta.source
      });
    }

    // Indikator 4: punycode_homograph
    const hasPunycode = hostname.includes('xn--');
    const hasNonAscii = /[^\u0000-\u007F]/.test(hostname);
    if (hasPunycode || hasNonAscii) {
      const meta = CONFIG.URL_INDICATORS.punycode_homograph;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: hostname,
        reason: 'Host memanfaatkan punycode (xn--) atau karakter homograf yang menyerupai karakter Latin resmi.',
        source: meta.source
      });
    }

    // Indikator 5: url_shortener
    const isShortener = CONFIG.URL_SHORTENERS.some(short => hostname === short || hostname.endsWith('.' + short));
    if (isShortener) {
      const meta = CONFIG.URL_INDICATORS.url_shortener;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: hostname,
        reason: 'Layanan penyingkat tautan terdeteksi. Domain asli di balik tautan disembunyikan.',
        source: meta.source
      });
      limitations.push('Tujuan akhir tautan pemendek (redirect target) tidak diikuti demi keamanan peramban.');
    }

    // Indikator 6: risky_tld
    const matchedRiskyTld = CONFIG.RISKY_TLDS.find(tld => hostname.endsWith(tld));
    if (matchedRiskyTld) {
      const meta = CONFIG.URL_INDICATORS.risky_tld;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchedRiskyTld,
        reason: `Menggunakan akhiran domain ${matchedRiskyTld} yang sering dimanfaatkan untuk kampanye phishing berbiaya rendah.`,
        source: meta.source
      });
    }

    // Indikator 7: excessive_subdomains
    const domainParts = hostname.split('.');
    if (domainParts.length >= 4 && !isIpv4) {
      const meta = CONFIG.URL_INDICATORS.excessive_subdomains;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: hostname,
        reason: `Struktur subdomain memiliki ${domainParts.length} tingkatan label, sering digunakan untuk menyamarkan domain induk.`,
        source: meta.source
      });
    }

    // Indikator 8 & 9: brand_in_subdomain & typosquatting
    let brandInSubdomainFound = false;
    let typosquattingFound = false;

    for (const brand of CONFIG.KNOWN_BRANDS) {
      const brandName = brand.name;
      const isOfficial = brand.officialDomains.some(off => hostname === off || hostname.endsWith('.' + off));

      if (!isOfficial) {
        const subParts = domainParts.slice(0, -2);
        const subCombined = subParts.join('.');
        if (subCombined.includes(brandName) || hostname.startsWith(brandName + '.')) {
          if (!brandInSubdomainFound) {
            const meta = CONFIG.URL_INDICATORS.brand_in_subdomain;
            indicators.push({
              type: meta.type,
              label: meta.label,
              weight: meta.weight,
              severity: meta.severity,
              evidence: `${brandName} di dalam ${hostname}`,
              reason: `Nama entitas resmi '${brandName}' diletakkan pada subdomain untuk mengelabui pengguna, namun domain utama milik pihak lain.`,
              source: meta.source
            });
            brandInSubdomainFound = true;
          }
        }

        const mainDomainPart = domainParts.slice(-2).join('.');
        const hasHyphenBrand = hostname.includes(`${brandName}-`) || hostname.includes(`-${brandName}`);
        const hasLeetBrand = checkLeetSimilarity(hostname, brandName);

        if (hasHyphenBrand || hasLeetBrand || (mainDomainPart.includes(brandName) && !isOfficial)) {
          if (!typosquattingFound && !brandInSubdomainFound) {
            const meta = CONFIG.URL_INDICATORS.typosquatting;
            indicators.push({
              type: meta.type,
              label: meta.label,
              weight: meta.weight,
              severity: meta.severity,
              evidence: hostname,
              reason: `Nama domain menyerupai merek atau bank terpercaya (${brandName}) dengan modifikasi tanda hubung atau ejaan kata.`,
              source: meta.source
            });
            typosquattingFound = true;
          }
        }
      }
    }

    // Indikator 10: sensitive_keywords
    const matchedKeyword = CONFIG.SENSITIVE_KEYWORDS.find(kw => {
      return pathname.includes(kw) || search.includes(kw);
    });
    if (matchedKeyword) {
      const meta = CONFIG.URL_INDICATORS.sensitive_keywords;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: matchedKeyword,
        reason: `Terdapat kata kunci pancingan sensitif ('${matchedKeyword}') pada path atau parameter URL.`,
        source: meta.source
      });
    }

    // Indikator 11: unusual_port
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      const meta = CONFIG.URL_INDICATORS.unusual_port;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: `:${parsed.port}`,
        reason: `Port jaringan (${parsed.port}) tidak lazim untuk layanan web publik yang aman.`,
        source: meta.source
      });
    }

    // Indikator 12: long_encoded_url
    const percentMatches = rawUrl.match(/%[0-9a-fA-F]{2}/g) || [];
    if (rawUrl.length > 100 || percentMatches.length > 3) {
      const meta = CONFIG.URL_INDICATORS.long_encoded_url;
      indicators.push({
        type: meta.type,
        label: meta.label,
        weight: meta.weight,
        severity: meta.severity,
        evidence: `${rawUrl.length} karakter (${percentMatches.length} karakter ter-encode)`,
        reason: 'Panjang URL tidak lazim atau menggunakan banyak encoding untuk mengaburkan struktur aslinya.',
        source: meta.source
      });
    }

    return {
      cleanedUrl: sanitizeResult.cleanedUrl,
      hasSensitiveMasking: sanitizeResult.cleanedParams.length > 0 || sanitizeResult.hasUserinfo,
      indicators,
      limitations
    };
  }

  function checkLeetSimilarity(host, brand) {
    const normalized = host.replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/5/g, 's').replace(/8/g, 'b');
    return normalized.includes(brand) && !host.includes(brand);
  }

  S.validateUrl = validateUrl;
  S.sanitizeUrl = sanitizeUrl;
  S.analyzeUrlStructure = analyzeUrlStructure;
})(window.Scamora);
