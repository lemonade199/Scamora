/**
 * Scamora - Platform Pendeteksi Potensi Penipuan Digital Berbasis AI
 * File: ui/toast.js - Komponen Notifikasi Toast Sederhana & Aksesibel
 */

window.Scamora = window.Scamora || {};
window.Scamora = window.Scamora;

(function (S) {
  function showToast(message, type = 'info', duration = 3500) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto transform transition-all duration-300 ease-out translate-y-3 opacity-0 rounded-xl p-4 shadow-xl border flex items-start gap-3 backdrop-blur-md`;

    let borderBgClass = 'bg-slate-900/95 text-white border-slate-700';
    let iconHtml = `<i data-lucide="info" class="w-5 h-5 text-indigo-400 shrink-0"></i>`;

    if (type === 'success') {
      borderBgClass = 'bg-slate-900/95 text-white border-emerald-500/40';
      iconHtml = `<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400 shrink-0"></i>`;
    } else if (type === 'error') {
      borderBgClass = 'bg-slate-900/95 text-white border-red-500/40';
      iconHtml = `<i data-lucide="alert-octagon" class="w-5 h-5 text-red-400 shrink-0"></i>`;
    } else if (type === 'warning') {
      borderBgClass = 'bg-slate-900/95 text-white border-amber-500/40';
      iconHtml = `<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-400 shrink-0"></i>`;
    }

    toast.className += ` ${borderBgClass}`;
    toast.innerHTML = `
      ${iconHtml}
      <div class="flex-1 text-sm font-medium leading-relaxed">${escapeHtml(message)}</div>
      <button class="text-slate-400 hover:text-white transition-colors" aria-label="Tutup notifikasi">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    const removeToast = () => {
      toast.classList.add('opacity-0', 'translate-y-3');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    };

    closeBtn.addEventListener('click', removeToast);
    toastContainer.appendChild(toast);

    if (window.lucide) {
      window.lucide.createIcons({ root: toast });
    }

    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-3');
      toast.classList.add('opacity-100', 'translate-y-0');
    });

    setTimeout(removeToast, duration);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  S.showToast = showToast;
})(window.Scamora);
