/**
 * SANSINOZ SWIMMING CLUB - Main Application Orchestrator (script.js)
 */

// 1. DEFINISIKAN STATE & DATA DULU AGAR TIDAK REFERENCE ERROR
window.AppState = window.AppState || {
  currentUser: null,
  activeTab: 'dashboard',
  athletes: [],
  records: [],
  userAccounts: [
    { id: '1', name: 'Head Coach', role: 'Head Coach', accessKey: 'HEADCOACH2026', email: 'coach@sansinoz.com', password: 'coach2026', avatarUrl: '' },
    { id: '2', name: 'Admin Club', role: 'Administrator', accessKey: 'ADMINSNZ', email: 'admin@sansinoz.com', password: 'admin2026', avatarUrl: '' }
  ]
};

let loginMode = 'key';

// 2. HELPER & DUMMY RENDER AGAR TIDAK CRASH
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${type === 'error' ? 'bg-rose-600' : 'bg-cyan-600'}`;
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function destroyCharts() {
  if (typeof Chart !== 'undefined') {
    Object.keys(Chart.instances || {}).forEach(id => Chart.instances[id].destroy());
  }
}

function initAnalyticsCharts() {}

// 3. FUNGSI RENDER TABS
function renderDashboardTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Selamat Datang di Dashboard SANSINOZ.</div>`; }
function renderAthletesTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Manajemen Atlet</div>`; }
function renderClassesTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Kelas & Room</div>`; }
function renderRecordsTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Catatan Waktu</div>`; }
function renderAnalyticsTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Analisis Grafik</div>`; }
function renderLeaderboardTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Limit Nasional</div>`; }
function renderMedalsTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Rekap Medali</div>`; }
function renderEvaluationsTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Evaluasi Atlet</div>`; }
function renderBMITab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman BMI & Gizi AI</div>`; }
function renderUsersTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Akun & Akses</div>`; }
function renderReportsTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Laporan PDF</div>`; }
function renderAlFatihTab() { return `<div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">Halaman Ekskul Al-Fatih</div>`; }

// 4. MAIN RENDER APP
function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  destroyCharts();

  if (!AppState.currentUser) {
    root.innerHTML = renderLoginPortal();
    if (window.lucide) lucide.createIcons();
    return;
  }

  root.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      <!-- Top Sticky Header -->
      <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-lg">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-cyan-500 to-teal-400 p-0.5 shadow-cyan-500/20 shadow-md shrink-0">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
              <i data-lucide="waves" class="w-5 h-5"></i>
            </div>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-sm sm:text-base font-black tracking-wider text-white uppercase italic">
                SANSINOZ <span class="text-cyan-400">SWIMMING CLUB</span>
              </h1>
              <span class="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40 hidden sm:inline-block">
                AQUATICS PORTAL
              </span>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
              Sistem Informasi Manajemen Atlet, Rekor Waktu & Limit Nasional
            </p>
          </div>
        </div>

        <!-- Right Side: User Profile & Logout -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2.5 bg-slate-950/80 border border-slate-800 py-1.5 px-3 rounded-xl">
            <img
              src="${escapeHtml(AppState.currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')}"
              alt="${escapeHtml(AppState.currentUser.name)}"
              class="w-7 h-7 rounded-lg object-cover border border-cyan-400"
            />
            <div class="text-left hidden md:block">
              <div class="text-xs font-bold text-white leading-tight">${escapeHtml(AppState.currentUser.name)}</div>
              <div class="text-[10px] font-semibold text-cyan-400 leading-none">${escapeHtml(AppState.currentUser.role)}</div>
            </div>
          </div>

          <button
            onclick="handleLogout()"
            class="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer shadow-sm"
            title="Keluar / Ganti Akun"
          >
            <i data-lucide="log-out" class="w-4 h-4"></i>
          </button>
        </div>
      </header>

      <!-- Main Layout Body -->
      <div class="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-4 sm:p-6 gap-6">
        
        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-64 shrink-0 space-y-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl space-y-1">
            <div class="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
              Menu Utama Club
            </div>

            ${renderNavButton('dashboard', 'layout-dashboard', 'Dashboard')}
            ${renderNavButton('athletes', 'users', 'Manajemen Atlet')}
            ${renderNavButton('classes', 'door-open', 'Kelas & Room')}
            ${renderNavButton('records', 'timer', 'Catatan Waktu')}
            ${renderNavButton('analytics', 'trending-up', 'Analisis Grafik')}
            ${renderNavButton('leaderboard', 'award', 'Limit Nasional')}
            ${renderNavButton('medals', 'medal', 'Rekap Medali')}
            ${renderNavButton('evaluations', 'clipboard-check', 'Evaluasi Atlet')}
            ${renderNavButton('bmi', 'heart-pulse', 'BMI & Gizi AI')}
            ${renderNavButton('reports', 'printer', 'Laporan PDF')}

            <div class="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-t border-slate-800/80 mt-2 mb-1">
              Program Kemitraan
            </div>
            ${renderNavButton('alfatih', 'school', 'Ekskul Al-Fatih')}

            <div class="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-t border-slate-800/80 mt-2 mb-1">
              Sistem
            </div>
            ${renderNavButton('users', 'shield', 'Akun & Akses')}
          </div>

          <!-- Quick Stat Card in Sidebar -->
          <div class="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 rounded-2xl p-4 shadow-lg space-y-2 hidden md:block">
            <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Status Atlet Terdaftar</span>
            <div class="flex items-baseline space-x-2">
              <span class="text-2xl font-black text-white font-mono">${(AppState.athletes || []).length}</span>
              <span class="text-xs text-slate-400">Perenang Aktif</span>
            </div>
            <div class="text-[11px] text-slate-400">
              Total Catatan: <strong class="text-cyan-300 font-mono">${(AppState.records || []).length}</strong> time trials
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0">
          ${renderCurrentTab()}
        </main>
      </div>

      <!-- Footer -->
      <footer class="mt-auto border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 bg-slate-950">
        <p>&copy; ${new Date().getFullYear()} SANSINOZ SWIMMING CLUB &bull; Pusat Pembinaan Prestasi Renang & Kualifikasi Limit Nasional</p>
      </footer>

      <div id="modal-container"></div>
      <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col space-y-2"></div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();

  if (AppState.activeTab === 'analytics') {
    initAnalyticsCharts();
  }
}

function renderNavButton(tabKey, iconName, label) {
  const isActive = AppState.activeTab === tabKey;
  const activeClass = isActive
    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-lg shadow-cyan-500/20'
    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-semibold';

  return `
    <button
      onclick="handleSwitchTab('${tabKey}')"
      class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition-all text-left cursor-pointer ${activeClass}"
    >
      <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
      <span class="truncate">${escapeHtml(label)}</span>
    </button>
  `;
}

function renderCurrentTab() {
  switch (AppState.activeTab) {
    case 'dashboard': return renderDashboardTab();
    case 'athletes': return renderAthletesTab();
    case 'classes': return renderClassesTab();
    case 'records': return renderRecordsTab();
    case 'analytics': return renderAnalyticsTab();
    case 'leaderboard': return renderLeaderboardTab();
    case 'medals': return renderMedalsTab();
    case 'evaluations': return renderEvaluationsTab();
    case 'bmi': return renderBMITab();
    case 'users': return renderUsersTab();
    case 'reports': return renderReportsTab();
    case 'alfatih': return renderAlFatihTab();
    default: return renderDashboardTab();
  }
}

function handleSwitchTab(tab) {
  AppState.activeTab = tab;
  renderApp();
}

function handleLogout() {
  AppState.currentUser = null;
  localStorage.removeItem('sansinoz_session_user');
  showToast('Anda telah keluar dari akun.');
  renderApp();
}

// 5. LOGIN PORTAL
function renderLoginPortal() {
  return `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-white text-center">
        <div class="space-y-3">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-0.5 mx-auto shadow-cyan-500/30 shadow-xl">
            <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <i data-lucide="waves" class="w-8 h-8"></i>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-wider uppercase italic">
              SANSINOZ <span class="text-cyan-400">SWIMMING CLUB</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              Portal Manajemen Atlet, Catatan Waktu & Limit Nasional
            </p>
          </div>
        </div>

        <div class="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
          <button
            onclick="setLoginMode('key')"
            id="tab-btn-key"
            class="flex-1 py-2 rounded-lg transition-all cursor-pointer ${loginMode === 'key' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}"
          >
            Kunci Akses Unik
          </button>
          <button
            onclick="setLoginMode('email')"
            id="tab-btn-email"
            class="flex-1 py-2 rounded-lg transition-all cursor-pointer ${loginMode === 'email' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}"
          >
            Email & Password
          </button>
        </div>

        <form onsubmit="handleLoginSubmit(event)" class="space-y-4 text-left text-xs">
          ${loginMode === 'key' ? `
            <div>
              <label class="block font-bold text-slate-300 mb-1.5">Masukkan Kunci Akses Portal</label>
              <div class="relative">
                <input
                  type="text"
                  id="login-access-key"
                  required
                  placeholder="Contoh: HEADCOACH2026 atau ADMINSNZ"
                  class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold tracking-wider outline-none focus:border-cyan-400 text-xs"
                />
              </div>
              <p class="text-[11px] text-slate-500 mt-1.5">
                Kunci akses diberikan oleh Head Coach atau Pengurus Club.
              </p>
            </div>
          ` : `
            <div>
              <label class="block font-bold text-slate-300 mb-1.5">Email Pengguna</label>
              <input
                type="email"
                id="login-email"
                required
                value="coach@sansinoz.com"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 text-xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                id="login-password"
                required
                value="coach2026"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 text-xs font-mono"
              />
            </div>
          `}

          <button
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-cyan-500/20 shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <span>Masuk ke Dashboard Club</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </form>

        <div class="pt-4 border-t border-slate-800 space-y-2 text-left">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Pilih Akun Demo Instan:
          </span>
          <div class="grid grid-cols-2 gap-2">
            ${(AppState.userAccounts || []).map(u => `
              <button
                type="button"
                onclick="quickLogin('${u.id}')"
                class="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer"
              >
                <div class="text-[11px] font-bold text-white truncate">${escapeHtml(u.name)}</div>
                <div class="text-[9px] text-cyan-400 truncate">${escapeHtml(u.role)}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
      <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col space-y-2"></div>
    </div>
  `;
}

function setLoginMode(mode) {
  loginMode = mode;
  renderApp();
}

function handleLoginSubmit(e) {
  e.preventDefault();

  if (loginMode === 'key') {
    const key = document.getElementById('login-access-key')?.value.trim().toUpperCase();
    const user = (AppState.userAccounts || []).find(u => u.accessKey.toUpperCase() === key);
    if (user) {
      AppState.currentUser = user;
      localStorage.setItem('sansinoz_session_user', JSON.stringify(user));
      renderApp();
    } else {
      showToast('Kunci akses tidak valid!', 'error');
    }
  } else {
    const email = document.getElementById('login-email')?.value.trim().toLowerCase();
    const pass = document.getElementById('login-password')?.value;
    const user = (AppState.userAccounts || []).find(u => u.email.toLowerCase() === email && u.password === pass);
    if (user) {
      AppState.currentUser = user;
      localStorage.setItem('sansinoz_session_user', JSON.stringify(user));
      renderApp();
    } else {
      showToast('Email atau password salah!', 'error');
    }
  }
}

function quickLogin(userId) {
  const user = (AppState.userAccounts || []).find(u => u.id === userId);
  if (user) {
    AppState.currentUser = user;
    localStorage.setItem('sansinoz_session_user', JSON.stringify(user));
    renderApp();
  }
}

// 6. INISIALISASI
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('sansinoz_session_user');
  if (savedUser) {
    try {
      AppState.currentUser = JSON.parse(savedUser);
    } catch (e) {
      console.warn('Session error:', e);
    }
  }
  renderApp();
});
