/**
 * Scamora AI - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/simPanel.js - Panel Kendali Simulasi Demo (Pengujian Skenario & Kegagalan)
 * Desain Visual Stitch Material 3 Cyber Console
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function initSimulationPanel() {
    let existing = document.getElementById('sim-panel-container');
    if (existing) return;

    const SIM_MODES = S.SIM_MODES;
    const panel = document.createElement('div');
    panel.id = 'sim-panel-container';
    panel.className = 'fixed bottom-4 left-4 z-40 max-w-xs transition-all duration-300';

    panel.innerHTML = `
      <!-- Panel Body -->
      <div id="sim-panel-card" class="bg-surface-container-lowest/95 border border-surface-container rounded-2xl p-4 shadow-2xl backdrop-blur-md text-on-surface transition-all duration-200">
        <div class="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-surface-container">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" id="sim-indicator-dot"></span>
            <span class="text-xs font-bold uppercase tracking-wider text-secondary">Mode Simulasi Demo</span>
          </div>
          <button id="btn-toggle-sim-minimize" class="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors" title="Perkecil Panel">
            <span class="material-symbols-outlined text-[18px]" id="sim-minimize-icon">expand_more</span>
          </button>
        </div>

        <div id="sim-panel-content" class="space-y-3">
          <p class="text-[11px] text-on-surface-variant leading-tight">
            Pilih skenario respon layanan eksternal untuk mendemokan ketangguhan sistem & penanganan kegagalan (MIT-Week 2026 Resilience):
          </p>

          <div class="space-y-1.5" id="sim-mode-radios">
            <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-xs transition-colors">
              <input type="radio" name="sim_mode" value="${SIM_MODES.NORMAL}" class="text-secondary focus:ring-0 bg-surface-container border-outline-variant" checked>
              <div>
                <span class="font-medium text-on-surface block">Normal (Semua Berjalan)</span>
                <span class="text-[10px] text-on-surface-variant">Status <code>complete</code>, Safe Browsing & Claude OK</span>
              </div>
            </label>

            <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-xs transition-colors">
              <input type="radio" name="sim_mode" value="${SIM_MODES.REPUTATION_FAILED}" class="text-amber-500 focus:ring-0 bg-surface-container border-outline-variant">
              <div>
                <span class="font-medium text-amber-700 block">Layanan Reputasi Gagal</span>
                <span class="text-[10px] text-on-surface-variant">URL Safe Browsing 502/timeout &rarr; Status <code>partial</code></span>
              </div>
            </label>

            <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-xs transition-colors">
              <input type="radio" name="sim_mode" value="${SIM_MODES.AI_FAILED}" class="text-amber-500 focus:ring-0 bg-surface-container border-outline-variant">
              <div>
                <span class="font-medium text-amber-700 block">Layanan AI Gagal</span>
                <span class="text-[10px] text-on-surface-variant">Claude API timeout &rarr; Chat fallback ke pola lokal</span>
              </div>
            </label>

            <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-xs transition-colors">
              <input type="radio" name="sim_mode" value="${SIM_MODES.ALL_FAILED}" class="text-amber-500 focus:ring-0 bg-surface-container border-outline-variant">
              <div>
                <span class="font-medium text-amber-700 block">Semua Eksternal Gagal</span>
                <span class="text-[10px] text-on-surface-variant">Safe Browsing & AI gagal bersamaan</span>
              </div>
            </label>

            <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-xs transition-colors">
              <input type="radio" name="sim_mode" value="${SIM_MODES.PIPELINE_FAILED}" class="text-error focus:ring-0 bg-surface-container border-outline-variant">
              <div>
                <span class="font-medium text-error block">Gagal Total (HTTP 503)</span>
                <span class="text-[10px] text-on-surface-variant">Status <code>failed</code>, tanpa skor/kategori, tombol coba lagi</span>
              </div>
            </label>

            <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-xs transition-colors">
              <input type="radio" name="sim_mode" value="${SIM_MODES.RATE_LIMITED}" class="text-secondary focus:ring-0 bg-surface-container border-outline-variant">
              <div>
                <span class="font-medium text-secondary block">Rate Limited (HTTP 429)</span>
                <span class="text-[10px] text-on-surface-variant">Simulasi kuota habis &rarr; banner coba lagi 30 detik</span>
              </div>
            </label>
          </div>

          <div class="pt-2 border-t border-surface-container flex items-center justify-between text-[10px] text-outline">
            <span>Preset Aktif: <strong id="sim-active-mode-label" class="text-secondary">Normal</strong></span>
            <button id="btn-reset-sim" class="text-on-surface-variant hover:text-on-surface underline">Reset</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    const toggleBtn = panel.querySelector('#btn-toggle-sim-minimize');
    const content = panel.querySelector('#sim-panel-content');
    const icon = panel.querySelector('#sim-minimize-icon');
    let isMinimized = false;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (content) content.classList.toggle('hidden', isMinimized);
        if (icon) icon.textContent = isMinimized ? 'expand_less' : 'expand_more';
      });
    }

    const radios = panel.querySelectorAll('input[name="sim_mode"]');
    const activeLabel = panel.querySelector('#sim-active-mode-label');
    const indicatorDot = panel.querySelector('#sim-indicator-dot');

    if (radios) {
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          const val = e.target.value;
          S.setSimMode(val);
          updateLabel(val);
          if (S.showToast) {
            S.showToast(`Mode simulasi diubah ke: ${val}`, 'info');
          }
        });
      });
    }

    const resetBtn = panel.querySelector('#btn-reset-sim');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        S.setSimMode(SIM_MODES.NORMAL);
        if (radios) radios.forEach(r => r.checked = (r.value === SIM_MODES.NORMAL));
        updateLabel(SIM_MODES.NORMAL);
        if (S.showToast) {
          S.showToast('Mode simulasi direset ke Normal', 'success');
        }
      });
    }

    function updateLabel(mode) {
      if (mode === SIM_MODES.NORMAL) {
        activeLabel.textContent = 'Normal';
        activeLabel.className = 'text-secondary font-semibold';
        indicatorDot.className = 'w-2 h-2 rounded-full bg-secondary animate-pulse';
      } else if (mode === SIM_MODES.PIPELINE_FAILED) {
        activeLabel.textContent = 'Gagal Total';
        activeLabel.className = 'text-error font-semibold';
        indicatorDot.className = 'w-2 h-2 rounded-full bg-error animate-ping';
      } else {
        activeLabel.textContent = mode.replace('_', ' ');
        activeLabel.className = 'text-amber-600 font-semibold';
        indicatorDot.className = 'w-2 h-2 rounded-full bg-amber-500 animate-pulse';
      }
    }
  }

  S.initSimulationPanel = initSimulationPanel;
})(window.Scamora);
