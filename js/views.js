/**
 * SANSINOZ SWIMMING CLUB - View / Tab Components
 */

// Filter state variables
let athleteSearchQuery = '';
let athleteFilterKU = 'ALL';
let athleteFilterClass = 'ALL';
let athleteFilterStatus = 'ALL';

let recordFilterStroke = 'ALL';
let recordFilterDistance = 'ALL';
let recordFilterAthlete = 'ALL';
let recordSearchQuery = '';

let analyticsSelectedAthleteId = '';
let analyticsSelectedStroke = 'Gaya Bebas';
let analyticsSelectedDistance = '50m';

let leaderboardGender = 'Laki-Laki';
let leaderboardKU = 'KU II (14-15 thn)';
let leaderboardDistance = '50m';
let leaderboardStroke = 'Gaya Bebas';

let medalFilterAthlete = 'ALL';
let medalFilterTournament = 'ALL';
let medalFilterType = 'ALL';

let evalFilterAthlete = 'ALL';

let bmiSelectedAthleteId = '';
let currentBmiCalculated = null;
let currentAiRecommendation = null;
let isAiLoading = false;

let reportTypeSelected = 'CLUB_SUMMARY';
let reportSelectedAthleteId = '';
let reportDocumentDate = new Date().toISOString().split('T')[0];

let alfatihActiveSubTab = 'STUDENTS'; // STUDENTS | PENILAIAN | CONFIG

// ----------------------------------------------------
// 1. DASHBOARD TAB
// ----------------------------------------------------
function renderDashboardTab() {
  const user = AppState.currentUser;
  const activeAthletes = AppState.athletes.filter(a => a.status === 'Aktif');
  const maleCount = activeAthletes.filter(a => a.gender === 'Laki-Laki').length;
  const femaleCount = activeAthletes.filter(a => a.gender === 'Perempuan').length;

  const records25m = AppState.records.filter(r => r.distance === '25m' && r.stroke === 'Gaya Bebas').sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  const fastest25m = records25m[0];

  const records50m = AppState.records.filter(r => r.distance === '50m' && r.stroke === 'Gaya Bebas').sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  const fastest50m = records50m[0];

  const goldCount = AppState.medals.filter(m => m.medali === 'Emas').length;
  const silverCount = AppState.medals.filter(m => m.medali === 'Perak').length;
  const bronzeCount = AppState.medals.filter(m => m.medali === 'Perunggu').length;

  // Star swimmers
  const starMap = new Map();
  AppState.records.forEach(r => {
    const athlete = AppState.athletes.find(a => a.id === r.athleteId);
    if (!athlete) return;
    if (!starMap.has(r.athleteId)) {
      starMap.set(r.athleteId, { athlete, count: 1, bestTime: r });
    } else {
      const cur = starMap.get(r.athleteId);
      cur.count++;
      if (r.timeInSeconds < cur.bestTime.timeInSeconds) {
        cur.bestTime = r;
      }
    }
  });
  const starAthletes = Array.from(starMap.values()).sort((a, b) => b.count - a.count).slice(0, 4);
  const recentRecords = [...AppState.records].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 6);

  return `
    <div class="space-y-6">
      
      <!-- Hero Banner -->
      <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/50">
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div class="space-y-4 max-w-3xl">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 rounded-2xl border-2 border-cyan-400 flex items-center justify-center text-cyan-400 p-2 shadow-2xl shrink-0">
                <i data-lucide="waves" class="w-12 h-12"></i>
              </div>

              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-950 via-blue-900 to-cyan-950 border border-cyan-400/60 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-lg">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-cyan-400"></i>
                    <span>Official Athletic Hub</span>
                  </span>
                  <span class="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase shadow-lg">
                    <i data-lucide="user" class="w-3 h-3 text-slate-950"></i>
                    <span>${escapeHtml(user ? user.role : 'Head Coach')}</span>
                  </span>
                </div>

                <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase italic leading-none drop-shadow-xl">
                  SANSINOZ <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300">SWIMMING CLUB</span>
                </h1>

                <p class="text-base sm:text-xl font-bold text-slate-200">
                  Selamat Datang, <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">${escapeHtml(user ? user.name : 'Head Coach')}</span>! 👋
                </p>
              </div>
            </div>

            <p class="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal max-w-2xl">
              Monitoring real-time aktivitas room pembinaan, rekapitulasi catatan waktu 25m & 50m, posisi kualifikasi limit target kejuaraan, serta statistik medali resmi club.
            </p>

            <div class="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onclick="switchTab('leaderboard')"
                class="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 text-amber-300 border-2 border-amber-500/60 px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-amber-950/40"
              >
                <i data-lucide="trophy" class="w-4 h-4 text-amber-400"></i>
                <span>Lihat Peringkat Limit</span>
              </button>

              <button
                onclick="switchTab('ekskul-alfatih')"
                class="bg-gradient-to-r from-emerald-950 to-teal-950 hover:from-emerald-900 text-emerald-300 border-2 border-emerald-500/60 px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                <i data-lucide="graduation-cap" class="w-4 h-4 text-emerald-400"></i>
                <span>Ekskul Al-Fatih</span>
              </button>

              <button
                onclick="openAddRecordModal()"
                class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
              >
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Input Time Trial Baru</span>
              </button>
            </div>
          </div>

          <!-- Status Room Sektor Card -->
          <div class="bg-slate-900/90 border border-blue-700/50 p-5 rounded-2xl space-y-3 shrink-0 lg:w-80 backdrop-blur-md shadow-lg">
            <div class="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
              <span class="text-cyan-300 flex items-center space-x-1.5 uppercase font-extrabold tracking-wider">
                <i data-lucide="gauge" class="w-4 h-4 text-cyan-400"></i>
                <span>Status Room Sektor</span>
              </span>
              <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/50 font-mono text-[11px] font-bold">
                ${AppState.classes.length} Room Active
              </span>
            </div>

            <!-- Demographics Ratio -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-slate-300 flex items-center space-x-1">
                  <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Putra: ${maleCount}</span>
                </span>
                <span class="text-slate-300 flex items-center space-x-1">
                  <span class="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>Putri: ${femaleCount}</span>
                </span>
              </div>
              <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 flex">
                <div class="bg-cyan-400 h-full" style="width: ${activeAthletes.length ? (maleCount / activeAthletes.length) * 100 : 50}%"></div>
                <div class="bg-teal-400 h-full" style="width: ${activeAthletes.length ? (femaleCount / activeAthletes.length) * 100 : 50}%"></div>
              </div>
            </div>

            <div class="space-y-2 text-xs pt-1">
              <div class="flex justify-between items-center text-slate-300">
                <span class="text-slate-400">Total Atlet Aktif</span>
                <span class="font-mono font-extrabold text-white">${activeAthletes.length} Perenang</span>
              </div>
              <div class="flex justify-between items-center text-slate-300">
                <span class="text-slate-400">Total Catatan Time Trial</span>
                <span class="font-mono font-extrabold text-cyan-300">${AppState.records.length} Record</span>
              </div>
              <div class="flex justify-between items-center text-slate-300">
                <span class="text-slate-400">Total Medali Resmi</span>
                <span class="font-mono font-extrabold text-amber-400">${AppState.medals.length} Medali</span>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span class="flex items-center space-x-1">
                <i data-lucide="activity" class="w-3.5 h-3.5 text-emerald-400"></i>
                <span>Database LocalStorage</span>
              </span>
              <span class="text-emerald-400 font-extrabold">100% PERSISTENT</span>
            </div>
          </div>

        </div>
      </div>

      <!-- 4 Top KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="bg-slate-900 border-2 border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 text-white shadow-xl transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-black uppercase tracking-wider text-cyan-400/90 mb-1 flex items-center space-x-1">
                <i data-lucide="users" class="w-3.5 h-3.5"></i>
                <span>Total Atlet Aktif</span>
              </p>
              <h3 class="text-3xl font-black text-white font-mono tracking-tight">
                ${activeAthletes.length} <span class="text-xs font-semibold text-slate-400">Swimmers</span>
              </h3>
              <p class="text-[11px] text-emerald-400 font-bold mt-2 flex items-center">
                <span class="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                ${AppState.classes.length} Room Active
              </p>
            </div>
            <div class="p-3.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-lg">
              <i data-lucide="users" class="w-6 h-6"></i>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 border-2 border-slate-800 hover:border-teal-500/60 rounded-2xl p-5 text-white shadow-xl transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-black uppercase tracking-wider text-teal-400/90 mb-1 flex items-center space-x-1">
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                <span>Rekor Tercepat 25m Free</span>
              </p>
              <h3 class="text-3xl font-black text-teal-300 font-mono tracking-tight">
                ${fastest25m ? `${formatTime(fastest25m.timeInSeconds)}s` : '-'}
              </h3>
              <p class="text-[11px] text-slate-300 font-bold mt-2 truncate max-w-[170px]">
                ${fastest25m ? (AppState.athletes.find(a => a.id === fastest25m.athleteId)?.nama || '-') : 'Belum Ada Record'}
              </p>
            </div>
            <div class="p-3.5 rounded-2xl bg-teal-950 border border-teal-500/40 text-teal-400 shadow-lg">
              <i data-lucide="zap" class="w-6 h-6"></i>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 border-2 border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 text-white shadow-xl transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-black uppercase tracking-wider text-emerald-400/90 mb-1 flex items-center space-x-1">
                <i data-lucide="timer" class="w-3.5 h-3.5"></i>
                <span>Rekor Tercepat 50m Free</span>
              </p>
              <h3 class="text-3xl font-black text-emerald-300 font-mono tracking-tight">
                ${fastest50m ? `${formatTime(fastest50m.timeInSeconds)}s` : '-'}
              </h3>
              <p class="text-[11px] text-slate-300 font-bold mt-2 truncate max-w-[170px]">
                ${fastest50m ? (AppState.athletes.find(a => a.id === fastest50m.athleteId)?.nama || '-') : 'Belum Ada Record'}
              </p>
            </div>
            <div class="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 shadow-lg">
              <i data-lucide="timer" class="w-6 h-6"></i>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 border-2 border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 text-white shadow-xl transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-black uppercase tracking-wider text-amber-400/90 mb-1 flex items-center space-x-1">
                <i data-lucide="medal" class="w-3.5 h-3.5"></i>
                <span>Medali Kejuaraan Club</span>
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-lg font-black text-yellow-400">🥇${goldCount}</span>
                <span class="text-lg font-black text-slate-300">🥈${silverCount}</span>
                <span class="text-lg font-black text-amber-600">🥉${bronzeCount}</span>
              </div>
              <p class="text-[11px] text-amber-200/80 font-bold mt-2">Total ${AppState.medals.length} Medali Resmi</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400 shadow-lg">
              <i data-lucide="trophy" class="w-6 h-6"></i>
            </div>
          </div>
        </div>

      </div>

      <!-- Section 2: Hall of Fame & Stroke Bar Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Hall of Fame -->
        <div class="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <h3 class="text-base font-black text-white flex items-center space-x-2">
                <i data-lucide="crown" class="w-5 h-5 text-amber-400"></i>
                <span class="uppercase tracking-tight">Top PB Perenang Bintang</span>
              </h3>
              <span class="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/50 font-bold px-2 py-0.5 rounded">
                Leaderboard
              </span>
            </div>

            <div class="space-y-3">
              ${starAthletes.map(({ athlete, count, bestTime }, index) => {
                const ranks = ['🥇 #1', '🥈 #2', '🥉 #3', '⭐ #4'];
                return `
                  <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 transition-all flex items-center justify-between group">
                    <div class="flex items-center space-x-3">
                      <div class="relative">
                        ${athlete.fotoUrl ? `
                          <img src="${escapeHtml(athlete.fotoUrl)}" alt="${escapeHtml(athlete.nama)}" class="w-11 h-11 rounded-xl object-cover border-2 border-cyan-400 shadow-md shrink-0" />
                        ` : `
                          <div class="w-11 h-11 rounded-xl bg-cyan-950 text-cyan-300 border-2 border-cyan-500/50 font-bold flex items-center justify-center text-sm shrink-0">
                            ${escapeHtml(athlete.nama.charAt(0))}
                          </div>
                        `}
                        <span class="absolute -top-2 -left-2 bg-slate-900 border border-amber-400 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                          ${ranks[index] || `#${index + 1}`}
                        </span>
                      </div>

                      <div>
                        <h4 class="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                          ${escapeHtml(athlete.nama)}
                        </h4>
                        <p class="text-[10px] font-semibold text-slate-400">${escapeHtml(athlete.kelompokUmur)} &bull; ${escapeHtml(athlete.gender)}</p>
                      </div>
                    </div>

                    <div class="text-right">
                      <span class="font-mono font-black text-xs text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/40 block shadow-inner">
                        ${formatTime(bestTime.timeInSeconds)}s
                      </span>
                      <span class="text-[10px] text-emerald-400 font-bold mt-1 block">⭐ ${count} Time Trial</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <button
            onclick="switchTab('athletes')"
            class="mt-5 w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Buka Direktori Lengkap Atlet</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-cyan-400"></i>
          </button>
        </div>

        <!-- Stroke Speed Telemetry Chart -->
        <div class="lg:col-span-2 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-white shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-800">
            <div>
              <h3 class="text-base font-black text-white flex items-center space-x-2">
                <i data-lucide="bar-chart-3" class="w-5 h-5 text-cyan-400"></i>
                <span class="uppercase tracking-tight">Rata-Rata Catatan Waktu Per Gaya (50m)</span>
              </h3>
              <p class="text-xs text-slate-400">Analisis statistik kecepatan perenang di seluruh gaya renang 50m</p>
            </div>
            <span class="text-[10px] font-mono font-extrabold bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/40 shrink-0">
              TELEMETRY ANALYTICS
            </span>
          </div>

          <div class="h-64 w-full relative">
            <canvas id="dashboardStrokeChart"></canvas>
          </div>
        </div>

      </div>

      <!-- Section 3: Recent Time Trial Logs -->
      <div class="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 class="text-base font-black text-white flex items-center space-x-2">
              <i data-lucide="crosshair" class="w-5 h-5 text-emerald-400"></i>
              <span class="uppercase tracking-tight">Log Time Trial Terbaru</span>
            </h3>
            <p class="text-xs text-slate-400">Perekaman hasil waktu riil dari sesi latihan dan kejuaraan</p>
          </div>

          <button
            onclick="switchTab('records')"
            class="text-xs font-black text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Lihat Semua Catatan</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                <th class="py-3 px-3 rounded-l-lg">Perenang</th>
                <th class="py-3 px-3">Gaya & Jarak</th>
                <th class="py-3 px-3 text-center">Waktu (s)</th>
                <th class="py-3 px-3">Ajang & Tanggal</th>
                <th class="py-3 px-3 rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-xs">
              ${recentRecords.map(r => {
                const athlete = AppState.athletes.find(a => a.id === r.athleteId);
                return `
                  <tr class="hover:bg-slate-950/60 transition-colors">
                    <td class="py-3 px-3">
                      <div class="flex items-center space-x-3">
                        ${athlete?.fotoUrl ? `
                          <img src="${escapeHtml(athlete.fotoUrl)}" alt="${escapeHtml(athlete.nama)}" class="w-8 h-8 rounded-lg object-cover border border-cyan-400 shrink-0" />
                        ` : `
                          <div class="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold text-xs flex items-center justify-center shrink-0">
                            ${escapeHtml(athlete ? athlete.nama.charAt(0) : 'A')}
                          </div>
                        `}
                        <div>
                          <div class="font-extrabold text-white">${escapeHtml(athlete ? athlete.nama : 'Perenang')}</div>
                          <div class="text-[10px] text-slate-400">${escapeHtml(athlete ? athlete.kelompokUmur : '-')}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3">
                      <div class="font-bold text-cyan-200">${escapeHtml(r.stroke)}</div>
                      <span class="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] bg-slate-950 font-mono text-slate-400 border border-slate-800">
                        ${escapeHtml(r.distance)} (${escapeHtml(r.poolLength)})
                      </span>
                    </td>
                    <td class="py-3 px-3 text-center">
                      <span class="font-mono font-black text-sm text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/40 inline-block shadow-inner">
                        ${formatTime(r.timeInSeconds)}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      <div class="font-semibold text-slate-200">${escapeHtml(r.namaAjang)}</div>
                      <div class="text-[10px] text-slate-500 font-mono">${escapeHtml(r.tanggal)}</div>
                    </td>
                    <td class="py-3 px-3 text-right">
                      ${r.isPersonalBest ? `
                        <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500/60">
                          <span>⭐ PB BEST</span>
                        </span>
                      ` : `
                        <span class="text-[10px] text-slate-500 font-semibold">REGULAR</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// ----------------------------------------------------
// 2. ATHLETES TAB
// ----------------------------------------------------
function renderAthletesTab() {
  const filtered = AppState.athletes.filter(a => {
    const matchesSearch = 
      a.nama.toLowerCase().includes(athleteSearchQuery.toLowerCase()) ||
      a.nis.toLowerCase().includes(athleteSearchQuery.toLowerCase()) ||
      (a.namaWali && a.namaWali.toLowerCase().includes(athleteSearchQuery.toLowerCase()));

    const matchesKU = athleteFilterKU === 'ALL' || a.kelompokUmur === athleteFilterKU;
    const matchesClass = athleteFilterClass === 'ALL' || a.kelasId === athleteFilterClass;
    const matchesStatus = athleteFilterStatus === 'ALL' || a.status === athleteFilterStatus;

    return matchesSearch && matchesKU && matchesClass && matchesStatus;
  });

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="users" class="w-6 h-6 text-cyan-400"></i>
            <span>Database & Manajemen Atlet Renang</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Pengelolaan profil atlet, NIS, kelompok umur (KU I - IV), data fisik (TB/BB/BMI), kontak wali, serta penetapan Head Coach.
          </p>
        </div>

        <button
          onclick="openAddAthleteModal()"
          class="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Tambah Atlet Baru</span>
        </button>
      </div>

      <!-- Filters Strip -->
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-white">
        <div class="relative">
          <input
            type="text"
            placeholder="Cari nama, NIS, wali..."
            value="${escapeHtml(athleteSearchQuery)}"
            oninput="handleAthleteSearch(this.value)"
            class="w-full pl-3 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
        </div>

        <select
          onchange="handleAthleteFilterKU(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${athleteFilterKU === 'ALL' ? 'selected' : ''}>Semua Kelompok Umur (KU)</option>
          <option value="KU IV (<11 thn)" ${athleteFilterKU === 'KU IV (<11 thn)' ? 'selected' : ''}>KU IV (<11 thn)</option>
          <option value="KU III (12-13 thn)" ${athleteFilterKU === 'KU III (12-13 thn)' ? 'selected' : ''}>KU III (12-13 thn)</option>
          <option value="KU II (14-15 thn)" ${athleteFilterKU === 'KU II (14-15 thn)' ? 'selected' : ''}>KU II (14-15 thn)</option>
          <option value="KU I (16-18 thn)" ${athleteFilterKU === 'KU I (16-18 thn)' ? 'selected' : ''}>KU I (16-18 thn)</option>
          <option value="Senior (19+ thn)" ${athleteFilterKU === 'Senior (19+ thn)' ? 'selected' : ''}>Senior (19+ thn)</option>
        </select>

        <select
          onchange="handleAthleteFilterClass(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${athleteFilterClass === 'ALL' ? 'selected' : ''}>Semua Kelas Pembinaan</option>
          ${AppState.classes.map(c => `
            <option value="${c.id}" ${athleteFilterClass === c.id ? 'selected' : ''}>${escapeHtml(c.namaKelas)}</option>
          `).join('')}
        </select>

        <select
          onchange="handleAthleteFilterStatus(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${athleteFilterStatus === 'ALL' ? 'selected' : ''}>Semua Status</option>
          <option value="Aktif" ${athleteFilterStatus === 'Aktif' ? 'selected' : ''}>Aktif</option>
          <option value="Cuti" ${athleteFilterStatus === 'Cuti' ? 'selected' : ''}>Cuti</option>
          <option value="Alumni" ${athleteFilterStatus === 'Alumni' ? 'selected' : ''}>Alumni</option>
        </select>
      </div>

      <!-- Athletes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${filtered.map(a => {
          const cls = AppState.classes.find(c => c.id === a.kelasId);
          const age = calculateAge(a.tanggalLahir);
          const bmiInfo = calculateBMI(a.tinggiBadanCm, a.beratBadanKg);

          return `
            <div class="bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all p-5 flex flex-col justify-between text-white shadow-lg">
              
              <div>
                <div class="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div class="flex items-center space-x-3">
                    ${a.fotoUrl ? `
                      <img src="${escapeHtml(a.fotoUrl)}" alt="${escapeHtml(a.nama)}" class="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0" />
                    ` : `
                      <div class="w-14 h-14 rounded-2xl bg-cyan-950 text-cyan-300 border-2 border-cyan-500 font-black text-lg flex items-center justify-center shrink-0">
                        ${escapeHtml(a.nama.charAt(0))}
                      </div>
                    `}
                    <div>
                      <span class="text-[10px] font-mono font-bold text-cyan-400 block">${escapeHtml(a.nis)}</span>
                      <h3 class="text-sm font-black text-white leading-snug">${escapeHtml(a.nama)}</h3>
                      <div class="flex items-center space-x-1.5 mt-0.5">
                        <span class="text-[10px] font-bold text-slate-300">${escapeHtml(a.gender)}</span>
                        <span class="text-slate-600">&bull;</span>
                        <span class="text-[10px] font-bold text-amber-300">${age} Tahun</span>
                      </div>
                    </div>
                  </div>

                  <span class="px-2 py-0.5 text-[10px] font-black rounded-full ${
                    a.status === 'Aktif' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }">
                    ${escapeHtml(a.status)}
                  </span>
                </div>

                <div class="space-y-2 py-3.5 text-xs text-slate-300">
                  <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-[11px]">Kelompok Umur</span>
                    <span class="font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 text-[11px]">${escapeHtml(a.kelompokUmur)}</span>
                  </div>

                  <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-[11px]">Kelas / Room</span>
                    <span class="font-semibold text-slate-200 text-[11px] truncate max-w-[170px]">${escapeHtml(cls ? cls.namaKelas : '-')}</span>
                  </div>

                  <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-[11px]">Head Coach</span>
                    <span class="font-semibold text-slate-200 text-[11px]">${escapeHtml(a.headCoach || (cls ? cls.headCoach : '-'))}</span>
                  </div>

                  <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-[11px]">Status Fisik & BMI</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${bmiInfo.badgeColor}">
                      ${bmiInfo.category} (${bmiInfo.value})
                    </span>
                  </div>

                  <div class="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
                    <span class="text-slate-400">Wali: ${escapeHtml(a.namaWali || '-')}</span>
                    <span class="font-mono text-cyan-400">${escapeHtml(a.kontakWali || '-')}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onclick="openEditAthleteModal('${a.id}')"
                  class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                  <span>Edit</span>
                </button>
                <button
                  onclick="handleDeleteAthlete('${a.id}')"
                  class="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>Hapus</span>
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function handleAthleteSearch(val) {
  athleteSearchQuery = val;
  renderApp();
}

function handleAthleteFilterKU(val) {
  athleteFilterKU = val;
  renderApp();
}

function handleAthleteFilterClass(val) {
  athleteFilterClass = val;
  renderApp();
}

function handleAthleteFilterStatus(val) {
  athleteFilterStatus = val;
  renderApp();
}

function handleDeleteAthlete(id) {
  const athlete = AppState.athletes.find(a => a.id === id);
  if (!athlete) return;
  if (confirm(`Apakah Anda yakin ingin menghapus atlet "${athlete.nama}"?`)) {
    AppState.athletes = AppState.athletes.filter(a => a.id !== id);
    saveState('athletes', AppState.athletes);
    showToast(`Data atlet ${athlete.nama} berhasil dihapus.`);
    renderApp();
  }
}

// ----------------------------------------------------
// 3. CLASSES TAB
// ----------------------------------------------------
function renderClassesTab() {
  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="user-check" class="w-6 h-6 text-cyan-400"></i>
            <span>Kelola Kelas & Room Pembinaan</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Penetapan Room Pembagian, Jadwal Latihan, Kapasitas Lintasan, Head Coach, dan Asisten Coach.
          </p>
        </div>

        <button
          onclick="openAddClassModal()"
          class="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      <!-- Classes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${AppState.classes.map(c => {
          const enrolled = AppState.athletes.filter(a => a.kelasId === c.id);
          const percent = Math.min(100, Math.round((enrolled.length / (c.kapasitasMaksimal || 20)) * 100));

          return `
            <div class="bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all p-6 text-white shadow-xl flex flex-col justify-between">
              
              <div class="space-y-4">
                <div class="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div class="flex items-center space-x-3.5">
                    ${c.fotoCoachUrl ? `
                      <img src="${escapeHtml(c.fotoCoachUrl)}" alt="${escapeHtml(c.headCoach)}" class="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0" />
                    ` : `
                      <div class="w-14 h-14 rounded-2xl bg-blue-950 text-cyan-300 border-2 border-cyan-500 font-black text-lg flex items-center justify-center shrink-0">
                        <i data-lucide="user-check" class="w-7 h-7"></i>
                      </div>
                    `}
                    <div>
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40 inline-block mb-1">
                        ${escapeHtml(c.kodeRoom)}
                      </span>
                      <h3 class="text-base font-black text-white leading-snug">${escapeHtml(c.namaKelas)}</h3>
                      <p class="text-xs text-amber-300 font-bold mt-0.5">Head Coach: ${escapeHtml(c.headCoach)}</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-2.5 text-xs text-slate-300">
                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <div class="flex items-center space-x-2 text-cyan-300 font-bold">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                      <span>${escapeHtml(c.ruangPembagian || '-')}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-slate-400">
                      <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400"></i>
                      <span>${escapeHtml(c.jadwalLatihan || '-')}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-slate-400">
                      <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500"></i>
                      <span>Asisten: ${escapeHtml(c.asistenCoach || '-')}</span>
                    </div>
                  </div>

                  <div>
                    <span class="text-[11px] text-slate-400 font-bold block mb-1">Fokus Materi & Pembinaan:</span>
                    <p class="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      ${escapeHtml(c.fokusLatihan || '-')}
                    </p>
                  </div>

                  <!-- Capacity bar -->
                  <div class="space-y-1 pt-1">
                    <div class="flex justify-between text-[11px]">
                      <span class="text-slate-400">Kapasitas Atlet Terdaftar</span>
                      <span class="font-mono font-bold text-cyan-300">${enrolled.length} / ${c.kapasitasMaksimal} Atlet (${percent}%)</span>
                    </div>
                    <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style="width: ${percent}%"></div>
                    </div>
                  </div>

                  <!-- Enrolled Chips -->
                  ${enrolled.length > 0 ? `
                    <div class="pt-2">
                      <span class="text-[11px] text-slate-400 font-bold block mb-1.5">Atlet di Kelas Ini (${enrolled.length}):</span>
                      <div class="flex flex-wrap gap-1.5">
                        ${enrolled.map(a => `
                          <span class="px-2 py-0.5 rounded-full bg-slate-950 text-slate-200 border border-slate-800 text-[10px] font-medium">
                            ${escapeHtml(a.nama)}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onclick="openEditClassModal('${c.id}')"
                  class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                  <span>Edit</span>
                </button>
                <button
                  onclick="handleDeleteClass('${c.id}')"
                  class="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>Hapus</span>
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function handleDeleteClass(id) {
  const cls = AppState.classes.find(c => c.id === id);
  if (!cls) return;
  if (confirm(`Apakah Anda yakin ingin menghapus kelas "${cls.namaKelas}"?`)) {
    AppState.classes = AppState.classes.filter(c => c.id !== id);
    saveState('classes', AppState.classes);
    showToast(`Kelas ${cls.namaKelas} berhasil dihapus.`);
    renderApp();
  }
}

// ----------------------------------------------------
// 4. RECORDS TAB
// ----------------------------------------------------
function renderRecordsTab() {
  const filtered = AppState.records.filter(r => {
    const athlete = AppState.athletes.find(a => a.id === r.athleteId);
    const matchesAthlete = recordFilterAthlete === 'ALL' || r.athleteId === recordFilterAthlete;
    const matchesStroke = recordFilterStroke === 'ALL' || r.stroke === recordFilterStroke;
    const matchesDistance = recordFilterDistance === 'ALL' || r.distance === recordFilterDistance;
    const matchesSearch = !recordSearchQuery || 
      (athlete && athlete.nama.toLowerCase().includes(recordSearchQuery.toLowerCase())) ||
      (r.namaAjang && r.namaAjang.toLowerCase().includes(recordSearchQuery.toLowerCase())) ||
      (r.catatan && r.catatan.toLowerCase().includes(recordSearchQuery.toLowerCase()));

    return matchesAthlete && matchesStroke && matchesDistance && matchesSearch;
  }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const pbCount = AppState.records.filter(r => r.isPersonalBest).length;

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="timer" class="w-6 h-6 text-cyan-400"></i>
            <span>Pencatatan & Riwayat Time Trial</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Logging presisi catatan waktu resmi dari time trial internal, simulasi sprint, dan kejuaraan resmi akuatik.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <div class="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-xs font-bold text-amber-300">
            <span>⭐ ${pbCount} PB Records</span>
          </div>

          <button
            onclick="openAddRecordModal()"
            class="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Input Catatan Waktu Baru</span>
          </button>
        </div>
      </div>

      <!-- Filters Strip -->
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-white">
        <input
          type="text"
          placeholder="Cari atlet, ajang, catatan..."
          value="${escapeHtml(recordSearchQuery)}"
          oninput="handleRecordSearch(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-cyan-400"
        />

        <select
          onchange="handleRecordFilterAthlete(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${recordFilterAthlete === 'ALL' ? 'selected' : ''}>Semua Atlet Perenang</option>
          ${AppState.athletes.map(a => `
            <option value="${a.id}" ${recordFilterAthlete === a.id ? 'selected' : ''}>${escapeHtml(a.nama)} (${a.kelompokUmur})</option>
          `).join('')}
        </select>

        <select
          onchange="handleRecordFilterStroke(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${recordFilterStroke === 'ALL' ? 'selected' : ''}>Semua Gaya Renang</option>
          <option value="Gaya Bebas" ${recordFilterStroke === 'Gaya Bebas' ? 'selected' : ''}>Gaya Bebas (Freestyle)</option>
          <option value="Gaya Dada" ${recordFilterStroke === 'Gaya Dada' ? 'selected' : ''}>Gaya Dada (Breaststroke)</option>
          <option value="Gaya Punggung" ${recordFilterStroke === 'Gaya Punggung' ? 'selected' : ''}>Gaya Punggung (Backstroke)</option>
          <option value="Gaya Kupu-Kupu" ${recordFilterStroke === 'Gaya Kupu-Kupu' ? 'selected' : ''}>Gaya Kupu-Kupu (Butterfly)</option>
          <option value="Gaya Ganti" ${recordFilterStroke === 'Gaya Ganti' ? 'selected' : ''}>Gaya Ganti (Individual Medley)</option>
        </select>

        <select
          onchange="handleRecordFilterDistance(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${recordFilterDistance === 'ALL' ? 'selected' : ''}>Semua Nomor Jarak</option>
          <option value="25m" ${recordFilterDistance === '25m' ? 'selected' : ''}>25 Meter</option>
          <option value="50m" ${recordFilterDistance === '50m' ? 'selected' : ''}>50 Meter</option>
          <option value="100m" ${recordFilterDistance === '100m' ? 'selected' : ''}>100 Meter</option>
          <option value="200m" ${recordFilterDistance === '200m' ? 'selected' : ''}>200 Meter</option>
        </select>
      </div>

      <!-- Table View -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <th class="py-3 px-4">Perenang</th>
                <th class="py-3 px-4">Gaya Renang</th>
                <th class="py-3 px-4">Jarak / Kolam</th>
                <th class="py-3 px-4 text-center">Catatan Waktu</th>
                <th class="py-3 px-4">Ajang / Latihan</th>
                <th class="py-3 px-4">Tanggal</th>
                <th class="py-3 px-4 text-center">PB Status</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              ${filtered.map(r => {
                const athlete = AppState.athletes.find(a => a.id === r.athleteId);
                return `
                  <tr class="hover:bg-slate-950/60 transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center space-x-3">
                        ${athlete?.fotoUrl ? `
                          <img src="${escapeHtml(athlete.fotoUrl)}" alt="${escapeHtml(athlete.nama)}" class="w-8 h-8 rounded-lg object-cover border border-cyan-400 shrink-0" />
                        ` : `
                          <div class="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold text-xs flex items-center justify-center shrink-0">
                            ${escapeHtml(athlete ? athlete.nama.charAt(0) : 'A')}
                          </div>
                        `}
                        <div>
                          <div class="font-extrabold text-white">${escapeHtml(athlete ? athlete.nama : '-')}</div>
                          <div class="text-[10px] text-slate-400">${escapeHtml(athlete ? athlete.kelompokUmur : '-')}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 font-bold text-cyan-300">${escapeHtml(r.stroke)}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded bg-slate-950 font-mono text-slate-300 border border-slate-800">
                        ${escapeHtml(r.distance)} (${escapeHtml(r.poolLength)})
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <span class="font-mono font-black text-sm text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/40 inline-block shadow-inner">
                        ${formatTime(r.timeInSeconds)}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="font-semibold text-slate-200">${escapeHtml(r.namaAjang || '-')}</div>
                      ${r.catatan ? `<div class="text-[10px] text-slate-400 italic">${escapeHtml(r.catatan)}</div>` : ''}
                    </td>
                    <td class="py-3 px-4 font-mono text-slate-400">${escapeHtml(r.tanggal)}</td>
                    <td class="py-3 px-4 text-center">
                      ${r.isPersonalBest ? `
                        <span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500/50">
                          ⭐ PB
                        </span>
                      ` : `
                        <span class="text-slate-600 text-[10px] font-semibold">-</span>
                      `}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button
                        onclick="handleDeleteRecord('${r.id}')"
                        class="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
                        title="Hapus Catatan"
                      >
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function handleRecordSearch(val) {
  recordSearchQuery = val;
  renderApp();
}

function handleRecordFilterAthlete(val) {
  recordFilterAthlete = val;
  renderApp();
}

function handleRecordFilterStroke(val) {
  recordFilterStroke = val;
  renderApp();
}

function handleRecordFilterDistance(val) {
  recordFilterDistance = val;
  renderApp();
}

function handleDeleteRecord(id) {
  if (confirm('Apakah Anda yakin ingin menghapus catatan waktu ini?')) {
    AppState.records = AppState.records.filter(r => r.id !== id);
    saveState('records', AppState.records);
    showToast('Catatan waktu berhasil dihapus.');
    renderApp();
  }
}

// ----------------------------------------------------
// 5. ANALYTICS TAB
// ----------------------------------------------------
function renderAnalyticsTab() {
  if (!analyticsSelectedAthleteId && AppState.athletes.length > 0) {
    analyticsSelectedAthleteId = AppState.athletes[0].id;
  }

  const selectedAthlete = AppState.athletes.find(a => a.id === analyticsSelectedAthleteId) || AppState.athletes[0];

  // Records for this athlete
  const athleteRecords = AppState.records
    .filter(r => r.athleteId === selectedAthlete?.id && r.stroke === analyticsSelectedStroke && r.distance === analyticsSelectedDistance)
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  // Best time
  const bestRecord = [...athleteRecords].sort((a, b) => a.timeInSeconds - b.timeInSeconds)[0];
  const firstRecord = athleteRecords[0];
  const latestRecord = athleteRecords[athleteRecords.length - 1];

  let timeDelta = 0;
  if (firstRecord && latestRecord && firstRecord.id !== latestRecord.id) {
    timeDelta = firstRecord.timeInSeconds - latestRecord.timeInSeconds;
  }

  // Find limit standard
  const limitStd = AppState.limits.find(l => 
    l.stroke === analyticsSelectedStroke && 
    l.distance === analyticsSelectedDistance && 
    l.gender === selectedAthlete?.gender && 
    l.kelompokUmur === selectedAthlete?.kelompokUmur
  );

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="trending-up" class="w-6 h-6 text-cyan-400"></i>
            <span>Grafik & Analitik Progres Waktu</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Visualisasi kurva telemetri catatan waktu, analisis tren kecepatan renang, dan komparasi limit kualifikasi target.
          </p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Pilih Atlet</label>
          <select
            onchange="handleAnalyticsAthleteChange(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            ${AppState.athletes.map(a => `
              <option value="${a.id}" ${a.id === selectedAthlete?.id ? 'selected' : ''}>${escapeHtml(a.nama)} (${a.kelompokUmur})</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Gaya Renang</label>
          <select
            onchange="handleAnalyticsStrokeChange(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="Gaya Bebas" ${analyticsSelectedStroke === 'Gaya Bebas' ? 'selected' : ''}>Gaya Bebas</option>
            <option value="Gaya Dada" ${analyticsSelectedStroke === 'Gaya Dada' ? 'selected' : ''}>Gaya Dada</option>
            <option value="Gaya Punggung" ${analyticsSelectedStroke === 'Gaya Punggung' ? 'selected' : ''}>Gaya Punggung</option>
            <option value="Gaya Kupu-Kupu" ${analyticsSelectedStroke === 'Gaya Kupu-Kupu' ? 'selected' : ''}>Gaya Kupu-Kupu</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Jarak Nomor</label>
          <select
            onchange="handleAnalyticsDistanceChange(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="25m" ${analyticsSelectedDistance === '25m' ? 'selected' : ''}>25 Meter (Sprint)</option>
            <option value="50m" ${analyticsSelectedDistance === '50m' ? 'selected' : ''}>50 Meter</option>
            <option value="100m" ${analyticsSelectedDistance === '100m' ? 'selected' : ''}>100 Meter</option>
            <option value="200m" ${analyticsSelectedDistance === '200m' ? 'selected' : ''}>200 Meter</option>
          </select>
        </div>
      </div>

      <!-- KPI summary metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span class="text-[11px] font-bold text-slate-400 block">Personal Best (PB)</span>
          <div class="text-2xl font-black text-cyan-300 font-mono mt-1">
            ${bestRecord ? `${formatTime(bestRecord.timeInSeconds)}s` : '-'}
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">${bestRecord?.namaAjang || 'Belum ada catatan'}</span>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span class="text-[11px] font-bold text-slate-400 block">Limit Target Kualifikasi</span>
          <div class="text-2xl font-black text-amber-300 font-mono mt-1">
            ${limitStd ? `${limitStd.limitTargetSeconds.toFixed(2)}s` : '-'}
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">
            ${limitStd && bestRecord ? (
              bestRecord.timeInSeconds <= limitStd.limitTargetSeconds 
                ? '<span class="text-emerald-400 font-bold">✓ LOLOS TARGET LIMIT</span>' 
                : `<span class="text-rose-400 font-bold">+${(bestRecord.timeInSeconds - limitStd.limitTargetSeconds).toFixed(2)}s dari Limit</span>`
            ) : 'Standar Limit'}
          </span>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span class="text-[11px] font-bold text-slate-400 block">Progres Peningkatan Kecepatan</span>
          <div class="text-2xl font-black font-mono mt-1 ${timeDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
            ${timeDelta > 0 ? `+${timeDelta.toFixed(2)}s (Sharper)` : timeDelta < 0 ? `${timeDelta.toFixed(2)}s` : '0.00s'}
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">${athleteRecords.length} sesi time trial tercatat</span>
        </div>

      </div>

      <!-- Main Chart Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 class="text-base font-black flex items-center space-x-2">
              <i data-lucide="line-chart" class="w-5 h-5 text-cyan-400"></i>
              <span>Kurva Progres Waktu: ${escapeHtml(selectedAthlete?.nama || '')}</span>
            </h3>
            <p class="text-xs text-slate-400">${analyticsSelectedStroke} - ${analyticsSelectedDistance}</p>
          </div>
          <span class="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-bold">
            TIME TRIAL TIMELINE
          </span>
        </div>

        <div class="h-80 w-full relative">
          ${athleteRecords.length === 0 ? `
            <div class="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <i data-lucide="clock" class="w-12 h-12 stroke-[1.5]"></i>
              <p class="text-sm font-semibold">Belum ada rekaman time trial untuk nomor & gaya ini.</p>
              <button
                onclick="openAddRecordModal()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                + Input Time Trial
              </button>
            </div>
          ` : `
            <canvas id="athleteProgressChart"></canvas>
          `}
        </div>
      </div>

    </div>
  `;
}

function handleAnalyticsAthleteChange(id) {
  analyticsSelectedAthleteId = id;
  renderApp();
}

function handleAnalyticsStrokeChange(stroke) {
  analyticsSelectedStroke = stroke;
  renderApp();
}

function handleAnalyticsDistanceChange(dist) {
  analyticsSelectedDistance = dist;
  renderApp();
}

// ----------------------------------------------------
// 6. LEADERBOARD / LIMIT TAB
// ----------------------------------------------------
function renderLeaderboardTab() {
  // Find limit standard
  const limitStd = AppState.limits.find(l => 
    l.stroke === leaderboardStroke && 
    l.distance === leaderboardDistance && 
    l.gender === leaderboardGender && 
    l.kelompokUmur === leaderboardKU
  );

  // Filter athletes
  const matchingAthletes = AppState.athletes.filter(a => 
    a.gender === leaderboardGender && a.kelompokUmur === leaderboardKU && a.status === 'Aktif'
  );

  // Get best times for these athletes in this event
  const ranked = matchingAthletes.map(a => {
    const records = AppState.records
      .filter(r => r.athleteId === a.id && r.stroke === leaderboardStroke && r.distance === leaderboardDistance)
      .sort((x, y) => x.timeInSeconds - y.timeInSeconds);

    const best = records[0];
    return {
      athlete: a,
      bestRecord: best,
      time: best ? best.timeInSeconds : 999999,
      formatted: best ? formatTime(best.timeInSeconds) : '-',
      passedTargetLimit: limitStd && best && best.timeInSeconds <= limitStd.limitTargetSeconds,
      passedClubLimit: limitStd && best && best.timeInSeconds <= limitStd.limitClubSeconds,
      deltaTarget: limitStd && best ? (best.timeInSeconds - limitStd.limitTargetSeconds) : null,
    };
  }).sort((a, b) => a.time - b.time);

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="trophy" class="w-6 h-6 text-amber-400"></i>
            <span>Leaderboard & Kualifikasi Limit Nasional</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Peringkat perenang internal Sansinoz berdasarkan perbandingan catatan waktu dengan Limit Kualifikasi Resmi Akuatik.
          </p>
        </div>
      </div>

      <!-- Filters Strip -->
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-white">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Kategori Gender</label>
          <select
            onchange="handleLeaderboardGender(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="Laki-Laki" ${leaderboardGender === 'Laki-Laki' ? 'selected' : ''}>Laki-Laki (Putra)</option>
            <option value="Perempuan" ${leaderboardGender === 'Perempuan' ? 'selected' : ''}>Perempuan (Putri)</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Kelompok Umur (KU)</label>
          <select
            onchange="handleLeaderboardKU(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="KU IV (<11 thn)" ${leaderboardKU === 'KU IV (<11 thn)' ? 'selected' : ''}>KU IV (<11 thn)</option>
            <option value="KU III (12-13 thn)" ${leaderboardKU === 'KU III (12-13 thn)' ? 'selected' : ''}>KU III (12-13 thn)</option>
            <option value="KU II (14-15 thn)" ${leaderboardKU === 'KU II (14-15 thn)' ? 'selected' : ''}>KU II (14-15 thn)</option>
            <option value="KU I (16-18 thn)" ${leaderboardKU === 'KU I (16-18 thn)' ? 'selected' : ''}>KU I (16-18 thn)</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Gaya Renang</label>
          <select
            onchange="handleLeaderboardStroke(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="Gaya Bebas" ${leaderboardStroke === 'Gaya Bebas' ? 'selected' : ''}>Gaya Bebas</option>
            <option value="Gaya Dada" ${leaderboardStroke === 'Gaya Dada' ? 'selected' : ''}>Gaya Dada</option>
            <option value="Gaya Punggung" ${leaderboardStroke === 'Gaya Punggung' ? 'selected' : ''}>Gaya Punggung</option>
            <option value="Gaya Kupu-Kupu" ${leaderboardStroke === 'Gaya Kupu-Kupu' ? 'selected' : ''}>Gaya Kupu-Kupu</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Jarak Nomor</label>
          <select
            onchange="handleLeaderboardDistance(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="25m" ${leaderboardDistance === '25m' ? 'selected' : ''}>25 Meter (Sprint)</option>
            <option value="50m" ${leaderboardDistance === '50m' ? 'selected' : ''}>50 Meter</option>
          </select>
        </div>
      </div>

      <!-- Limit Target Standards Box -->
      <div class="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/60 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-amber-950 border border-amber-500/50 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
            <i data-lucide="target" class="w-6 h-6"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono font-black uppercase text-cyan-400 tracking-wider">Standar Limit Kualifikasi</span>
            <h4 class="text-base font-black text-white">${leaderboardStroke} ${leaderboardDistance} &bull; ${leaderboardKU} (${leaderboardGender})</h4>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-right">
            <span class="text-[10px] text-slate-400 font-bold block">Limit Nasional Target</span>
            <span class="text-xl font-black text-amber-300 font-mono">
              ${limitStd ? `${limitStd.limitTargetSeconds.toFixed(2)}s` : 'Belum Ditetapkan'}
            </span>
          </div>
          <div class="text-right border-l border-slate-700 pl-4">
            <span class="text-[10px] text-slate-400 font-bold block">Limit Internal Club</span>
            <span class="text-xl font-black text-cyan-300 font-mono">
              ${limitStd ? `${limitStd.limitClubSeconds.toFixed(2)}s` : 'Belum Ditetapkan'}
            </span>
          </div>
        </div>
      </div>

      <!-- Ranking List -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <th class="py-3 px-4 text-center w-16">Peringkat</th>
                <th class="py-3 px-4">Perenang</th>
                <th class="py-3 px-4 text-center">Catatan PB</th>
                <th class="py-3 px-4 text-center">Limit Target</th>
                <th class="py-3 px-4 text-center">Limit Club</th>
                <th class="py-3 px-4 text-right">Status Kualifikasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              ${ranked.map((item, idx) => {
                const rankBadges = ['🥇 #1', '🥈 #2', '🥉 #3'];
                const rankLabel = rankBadges[idx] || `#${idx + 1}`;
                const hasTime = item.bestRecord !== undefined;

                return `
                  <tr class="hover:bg-slate-950/60 transition-colors">
                    <td class="py-3.5 px-4 text-center">
                      <span class="font-black text-xs px-2.5 py-1 rounded-lg ${
                        idx === 0 ? 'bg-amber-950 text-amber-300 border border-amber-500' :
                        idx === 1 ? 'bg-slate-800 text-slate-200 border border-slate-600' :
                        idx === 2 ? 'bg-amber-950/60 text-amber-400 border border-amber-700' :
                        'text-slate-400'
                      }">
                        ${rankLabel}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="flex items-center space-x-3">
                        ${item.athlete.fotoUrl ? `
                          <img src="${escapeHtml(item.athlete.fotoUrl)}" alt="${escapeHtml(item.athlete.nama)}" class="w-9 h-9 rounded-xl object-cover border border-cyan-400 shrink-0" />
                        ` : `
                          <div class="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold text-xs flex items-center justify-center shrink-0">
                            ${escapeHtml(item.athlete.nama.charAt(0))}
                          </div>
                        `}
                        <div>
                          <div class="font-black text-white text-sm">${escapeHtml(item.athlete.nama)}</div>
                          <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(item.athlete.nis)}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-center">
                      ${hasTime ? `
                        <span class="font-mono font-black text-sm text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/40 inline-block">
                          ${item.formatted}s
                        </span>
                      ` : `
                        <span class="text-slate-500 text-xs italic">Belum Ada Waktu</span>
                      `}
                    </td>
                    <td class="py-3.5 px-4 text-center">
                      ${item.passedTargetLimit ? `
                        <span class="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold text-[10px]">
                          ✓ LOLOS TARGET
                        </span>
                      ` : hasTime && item.deltaTarget ? `
                        <span class="text-rose-400 font-mono font-semibold text-xs">
                          +${item.deltaTarget.toFixed(2)}s
                        </span>
                      ` : '<span class="text-slate-600">-</span>'}
                    </td>
                    <td class="py-3.5 px-4 text-center">
                      ${item.passedClubLimit ? `
                        <span class="px-2.5 py-1 rounded-lg bg-teal-950 text-teal-300 border border-teal-500/50 font-bold text-[10px]">
                          ✓ LOLOS CLUB
                        </span>
                      ` : '<span class="text-slate-600">-</span>'}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      ${item.passedTargetLimit ? `
                        <span class="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase shadow-md">
                          🏆 Kualifikasi Nasional
                        </span>
                      ` : item.passedClubLimit ? `
                        <span class="px-2.5 py-1 rounded-full bg-cyan-900 text-cyan-200 border border-cyan-400/50 font-bold text-[10px]">
                          ⭐ Standar Club
                        </span>
                      ` : `
                        <span class="text-slate-500 text-[10px] font-semibold">Dalam Pembinaan</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function handleLeaderboardGender(g) {
  leaderboardGender = g;
  renderApp();
}

function handleLeaderboardKU(ku) {
  leaderboardKU = ku;
  renderApp();
}

function handleLeaderboardStroke(s) {
  leaderboardStroke = s;
  renderApp();
}

function handleLeaderboardDistance(d) {
  leaderboardDistance = d;
  renderApp();
}

// ----------------------------------------------------
// 7. MEDALS TAB
// ----------------------------------------------------
function renderMedalsTab() {
  const filtered = AppState.medals.filter(m => {
    const matchesAthlete = medalFilterAthlete === 'ALL' || m.athleteId === medalFilterAthlete;
    const matchesTournament = medalFilterTournament === 'ALL' || m.kejuaraan === medalFilterTournament;
    const matchesType = medalFilterType === 'ALL' || m.medali === medalFilterType;
    return matchesAthlete && matchesTournament && matchesType;
  }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const gold = AppState.medals.filter(m => m.medali === 'Emas').length;
  const silver = AppState.medals.filter(m => m.medali === 'Perak').length;
  const bronze = AppState.medals.filter(m => m.medali === 'Perunggu').length;

  const tournaments = Array.from(new Set(AppState.medals.map(m => m.kejuaraan)));

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="medal" class="w-6 h-6 text-amber-400"></i>
            <span>Rekapitulasi Perolehan Medali Club</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Pencatatan medali resmi (Emas, Perak, Perunggu) dari seluruh kejuaraan antar klub dan kejuaraan daerah.
          </p>
        </div>

        <button
          onclick="openAddMedalModal()"
          class="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Tambah Medali Baru</span>
        </button>
      </div>

      <!-- Tally KPI Boxes -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-white">
        
        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-slate-400">Total Medali</span>
            <div class="text-3xl font-black text-white font-mono mt-1">${AppState.medals.length}</div>
          </div>
          <div class="p-3 bg-slate-800 rounded-xl text-cyan-400">
            <i data-lucide="trophy" class="w-6 h-6"></i>
          </div>
        </div>

        <div class="bg-gradient-to-br from-yellow-950/60 via-slate-900 to-slate-900 border border-yellow-500/40 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <span class="text-[11px] font-black text-yellow-400 uppercase">Medali Emas</span>
            <div class="text-3xl font-black text-yellow-300 font-mono mt-1">🥇 ${gold}</div>
          </div>
          <div class="p-3 bg-yellow-950 border border-yellow-500/50 rounded-xl text-yellow-400">
            <i data-lucide="award" class="w-6 h-6"></i>
          </div>
        </div>

        <div class="bg-gradient-to-br from-slate-800/60 via-slate-900 to-slate-900 border border-slate-500/40 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <span class="text-[11px] font-black text-slate-300 uppercase">Medali Perak</span>
            <div class="text-3xl font-black text-slate-200 font-mono mt-1">🥈 ${silver}</div>
          </div>
          <div class="p-3 bg-slate-800 border border-slate-500/50 rounded-xl text-slate-300">
            <i data-lucide="award" class="w-6 h-6"></i>
          </div>
        </div>

        <div class="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border border-amber-600/40 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <span class="text-[11px] font-black text-amber-500 uppercase">Medali Perunggu</span>
            <div class="text-3xl font-black text-amber-400 font-mono mt-1">🥉 ${bronze}</div>
          </div>
          <div class="p-3 bg-amber-950 border border-amber-600/50 rounded-xl text-amber-500">
            <i data-lucide="award" class="w-6 h-6"></i>
          </div>
        </div>

      </div>

      <!-- Filters Strip -->
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white">
        <select
          onchange="handleMedalFilterAthlete(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${medalFilterAthlete === 'ALL' ? 'selected' : ''}>Semua Atlet Perenang</option>
          ${AppState.athletes.map(a => `
            <option value="${a.id}" ${medalFilterAthlete === a.id ? 'selected' : ''}>${escapeHtml(a.nama)}</option>
          `).join('')}
        </select>

        <select
          onchange="handleMedalFilterTournament(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${medalFilterTournament === 'ALL' ? 'selected' : ''}>Semua Kejuaraan</option>
          ${tournaments.map(t => `
            <option value="${t}" ${medalFilterTournament === t ? 'selected' : ''}>${escapeHtml(t)}</option>
          `).join('')}
        </select>

        <select
          onchange="handleMedalFilterType(this.value)"
          class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
        >
          <option value="ALL" ${medalFilterType === 'ALL' ? 'selected' : ''}>Semua Jenis Medali</option>
          <option value="Emas" ${medalFilterType === 'Emas' ? 'selected' : ''}>Emas (Gold)</option>
          <option value="Perak" ${medalFilterType === 'Perak' ? 'selected' : ''}>Perak (Silver)</option>
          <option value="Perunggu" ${medalFilterType === 'Perunggu' ? 'selected' : ''}>Perunggu (Bronze)</option>
        </select>
      </div>

      <!-- Medals Table -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <th class="py-3 px-4 text-center w-24">Medali</th>
                <th class="py-3 px-4">Perenang</th>
                <th class="py-3 px-4">Kejuaraan & Tanggal</th>
                <th class="py-3 px-4">Nomor Lomba</th>
                <th class="py-3 px-4 text-center">Catatan Waktu</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              ${filtered.map(m => {
                const athlete = AppState.athletes.find(a => a.id === m.athleteId);
                const medalStyle = 
                  m.medali === 'Emas' ? 'bg-yellow-950 text-yellow-300 border-yellow-500/60' :
                  m.medali === 'Perak' ? 'bg-slate-800 text-slate-200 border-slate-500/60' :
                  'bg-amber-950 text-amber-400 border-amber-600/60';
                
                const medalEmoji = m.medali === 'Emas' ? '🥇 Emas' : m.medali === 'Perak' ? '🥈 Perak' : '🥉 Perunggu';

                return `
                  <tr class="hover:bg-slate-950/60 transition-colors">
                    <td class="py-3.5 px-4 text-center">
                      <span class="inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${medalStyle}">
                        ${medalEmoji}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="flex items-center space-x-3">
                        ${athlete?.fotoUrl ? `
                          <img src="${escapeHtml(athlete.fotoUrl)}" alt="${escapeHtml(athlete.nama)}" class="w-8 h-8 rounded-lg object-cover border border-cyan-400 shrink-0" />
                        ` : `
                          <div class="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold text-xs flex items-center justify-center shrink-0">
                            ${escapeHtml(athlete ? athlete.nama.charAt(0) : 'A')}
                          </div>
                        `}
                        <div>
                          <div class="font-extrabold text-white">${escapeHtml(athlete ? athlete.nama : '-')}</div>
                          <div class="text-[10px] text-slate-400">${escapeHtml(m.kelompokUmur || athlete?.kelompokUmur || '-')}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="font-bold text-slate-200">${escapeHtml(m.kejuaraan)}</div>
                      <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(m.tanggal)}</div>
                    </td>
                    <td class="py-3.5 px-4 font-bold text-cyan-300">
                      ${escapeHtml(m.stroke)} &bull; ${escapeHtml(m.distance)}
                    </td>
                    <td class="py-3.5 px-4 text-center">
                      <span class="font-mono font-bold text-sm text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/40 inline-block">
                        ${escapeHtml(m.catatanWaktu || '-')}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <button
                        onclick="handleDeleteMedal('${m.id}')"
                        class="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
                        title="Hapus Medali"
                      >
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function handleMedalFilterAthlete(a) {
  medalFilterAthlete = a;
  renderApp();
}

function handleMedalFilterTournament(t) {
  medalFilterTournament = t;
  renderApp();
}

function handleMedalFilterType(m) {
  medalFilterType = m;
  renderApp();
}

function handleDeleteMedal(id) {
  if (confirm('Apakah Anda yakin ingin menghapus catatan medali ini?')) {
    AppState.medals = AppState.medals.filter(m => m.id !== id);
    saveState('medals', AppState.medals);
    showToast('Catatan medali berhasil dihapus.');
    renderApp();
  }
}

// ----------------------------------------------------
// 8. EVALUATIONS TAB
// ----------------------------------------------------
function renderEvaluationsTab() {
  const filtered = AppState.evaluations.filter(e => {
    return evalFilterAthlete === 'ALL' || e.athleteId === evalFilterAthlete;
  }).sort((a, b) => new Date(b.tanggalEvaluasi).getTime() - new Date(a.tanggalEvaluasi).getTime());

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="clipboard-check" class="w-6 h-6 text-cyan-400"></i>
            <span>Evaluasi & Rapor Berkala Atlet</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Penilaian teknis komprehensif: Presensi kehadiran, skor stamina, teknik start/turn, dan arahan Head Coach.
          </p>
        </div>

        <button
          onclick="openAddEvaluationModal()"
          class="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Buat Evaluasi Baru</span>
        </button>
      </div>

      <!-- Filter -->
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex items-center space-x-3 text-xs text-white">
        <label class="font-bold text-slate-400">Filter Atlet:</label>
        <select
          onchange="handleEvalFilterAthlete(this.value)"
          class="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400 flex-1 max-w-sm"
        >
          <option value="ALL" ${evalFilterAthlete === 'ALL' ? 'selected' : ''}>Semua Atlet Perenang</option>
          ${AppState.athletes.map(a => `
            <option value="${a.id}" ${evalFilterAthlete === a.id ? 'selected' : ''}>${escapeHtml(a.nama)}</option>
          `).join('')}
        </select>
      </div>

      <!-- Evaluations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${filtered.map(ev => {
          const athlete = AppState.athletes.find(a => a.id === ev.athleteId);
          return `
            <div class="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all p-6 rounded-2xl shadow-xl text-white flex flex-col justify-between">
              
              <div class="space-y-4">
                <div class="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div class="flex items-center space-x-3">
                    ${athlete?.fotoUrl ? `
                      <img src="${escapeHtml(athlete.fotoUrl)}" alt="${escapeHtml(athlete.nama)}" class="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400 shadow-md shrink-0" />
                    ` : `
                      <div class="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-300 border-2 border-cyan-500 font-black text-sm flex items-center justify-center shrink-0">
                        ${escapeHtml(athlete ? athlete.nama.charAt(0) : 'A')}
                      </div>
                    `}
                    <div>
                      <h3 class="text-base font-black text-white">${escapeHtml(athlete ? athlete.nama : 'Atlet')}</h3>
                      <p class="text-xs text-slate-400 font-mono">Tgl Evaluasi: ${escapeHtml(ev.tanggalEvaluasi)}</p>
                    </div>
                  </div>

                  <span class="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase">
                    ${escapeHtml(ev.enduranceRating || 'Baik')}
                  </span>
                </div>

                <!-- Scores Matrix -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-slate-400 font-bold block">Kehadiran</span>
                    <span class="text-base font-black text-emerald-400 font-mono">${ev.kehadiranPersen}%</span>
                  </div>
                  <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-slate-400 font-bold block">Stamina</span>
                    <span class="text-base font-black text-cyan-300 font-mono">${ev.skorStamina}/100</span>
                  </div>
                  <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-slate-400 font-bold block">Start/Reaksi</span>
                    <span class="text-base font-black text-amber-300 font-mono">${ev.teknikStartReaction}/10</span>
                  </div>
                  <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-slate-400 font-bold block">Flip Turn</span>
                    <span class="text-base font-black text-teal-300 font-mono">${ev.teknikFlipTurn}/10</span>
                  </div>
                </div>

                <div class="space-y-2 text-xs text-slate-300">
                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span class="text-[11px] font-bold text-cyan-400 flex items-center space-x-1">
                      <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
                      <span>Catatan Khusus Coach:</span>
                    </span>
                    <p class="text-xs text-slate-200 leading-relaxed">${escapeHtml(ev.catatanCoach || '-')}</p>
                  </div>

                  <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span class="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                      <i data-lucide="target" class="w-3.5 h-3.5"></i>
                      <span>Target Milestone Berikutnya:</span>
                    </span>
                    <p class="text-xs text-slate-200 leading-relaxed">${escapeHtml(ev.targetBerikutnya || '-')}</p>
                  </div>
                </div>
              </div>

              <div class="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end">
                <button
                  onclick="handleDeleteEvaluation('${ev.id}')"
                  class="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>Hapus Evaluasi</span>
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function handleEvalFilterAthlete(a) {
  evalFilterAthlete = a;
  renderApp();
}

function handleDeleteEvaluation(id) {
  if (confirm('Apakah Anda yakin ingin menghapus evaluasi ini?')) {
    AppState.evaluations = AppState.evaluations.filter(e => e.id !== id);
    saveState('evaluations', AppState.evaluations);
    showToast('Evaluasi berhasil dihapus.');
    renderApp();
  }
}

// ----------------------------------------------------
// 9. BMI & NUTRITION TAB
// ----------------------------------------------------
function renderBMITab() {
  if (!bmiSelectedAthleteId && AppState.athletes.length > 0) {
    bmiSelectedAthleteId = AppState.athletes[0].id;
  }

  const selectedAthlete = AppState.athletes.find(a => a.id === bmiSelectedAthleteId) || AppState.athletes[0];

  const bmiLogs = AppState.bmiLogs
    .filter(b => b.athleteId === selectedAthlete?.id)
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const currentHeight = selectedAthlete?.tinggiBadanCm || 160;
  const currentWeight = selectedAthlete?.beratBadanKg || 50;
  const currentBmi = calculateBMI(currentHeight, currentWeight);

  const latestLog = bmiLogs[0];
  const activeAiRec = currentAiRecommendation || (latestLog?.aiRecommendation) || null;

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="heart-pulse" class="w-6 h-6 text-cyan-400"></i>
            <span>Kalkulator BMI & Rekomendasi Gizi Atlet</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Analisis Body Mass Index (BMI) spesifik perenang kompetitif serta integrasi asupan nutrisi dan dryland power workout.
          </p>
        </div>
      </div>

      <!-- Athlete Selection & Live Calculator Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
        
        <!-- Calculator Form -->
        <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 class="text-base font-black flex items-center space-x-2 pb-3 border-b border-slate-800">
            <i data-lucide="calculator" class="w-5 h-5 text-cyan-400"></i>
            <span>Hitung Status BMI</span>
          </h3>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Pilih Atlet</label>
            <select
              id="bmi-calc-athlete"
              onchange="handleBmiAthleteChange(this.value)"
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400 text-xs"
            >
              ${AppState.athletes.map(a => `
                <option value="${a.id}" ${a.id === selectedAthlete?.id ? 'selected' : ''}>${escapeHtml(a.nama)} (${a.kelompokUmur})</option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Tinggi Badan (cm)</label>
              <input
                type="number"
                id="bmi-calc-height"
                value="${currentHeight}"
                oninput="handleBmiLiveCalculate()"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Berat Badan (kg)</label>
              <input
                type="number"
                id="bmi-calc-weight"
                value="${currentWeight}"
                oninput="handleBmiLiveCalculate()"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Catatan Gizi / Kondisi Atlet</label>
            <textarea
              id="bmi-calc-notes"
              rows="2"
              placeholder="Contoh: Fokus penambahan massa otot latissimus..."
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-cyan-400"
            ></textarea>
          </div>

          <!-- Calculated Outcome preview -->
          <div id="bmi-live-preview" class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span class="text-[11px] text-slate-400 font-bold">Skor BMI Terhitung:</span>
            <div class="text-3xl font-black text-cyan-300 font-mono">${currentBmi.value}</div>
            <span class="inline-block px-2.5 py-0.5 rounded text-xs font-bold ${currentBmi.badgeColor}">
              ${currentBmi.category}
            </span>
          </div>

          <div class="pt-2 flex flex-col gap-2">
            <button
              onclick="handleGenerateAiNutrition()"
              class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-300"></i>
              <span>${isAiLoading ? 'Memproses Rekomendasi Gizi...' : 'Buat Rekomendasi Gizi AI'}</span>
            </button>

            <button
              onclick="handleSaveBmiRecord()"
              class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <i data-lucide="save" class="w-4 h-4"></i>
              <span>Simpan Catatan BMI ke Riwayat</span>
            </button>
          </div>
        </div>

        <!-- AI Nutrition Advisory Board -->
        <div class="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 class="text-base font-black flex items-center space-x-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-amber-400"></i>
              <span>Rekomendasi Nutrisi & Pola Latihan Spesifik Perenang</span>
            </h3>
            <span class="text-[10px] font-bold px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/50 rounded">
              AQUATICS NUTRITION AI
            </span>
          </div>

          ${activeAiRec ? `
            <div class="space-y-4 text-xs">
              
              <div class="p-4 bg-gradient-to-r from-purple-950/50 via-slate-950 to-slate-950 border border-purple-500/30 rounded-xl space-y-1.5">
                <span class="text-[11px] font-black text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <i data-lucide="activity" class="w-4 h-4"></i>
                  <span>Analisis Proporsi & Hidrodinamika Atlet</span>
                </span>
                <p class="text-slate-200 leading-relaxed">${escapeHtml(activeAiRec.analisisAI)}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <span class="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <i data-lucide="utensils" class="w-4 h-4"></i>
                    <span>Pola Nutrisi & Asupan Protein</span>
                  </span>
                  <p class="text-slate-300 leading-relaxed">${escapeHtml(activeAiRec.nutrisiGizi)}</p>
                </div>

                <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <span class="text-[11px] font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <i data-lucide="dumbbell" class="w-4 h-4"></i>
                    <span>Dryland & Power Workout</span>
                  </span>
                  <p class="text-slate-300 leading-relaxed">${escapeHtml(activeAiRec.jenisOlahraga)}</p>
                </div>

              </div>

              <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <span class="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                  <span>Saran Langkah & Target Milestone</span>
                </span>
                <p class="text-slate-300 leading-relaxed">${escapeHtml(activeAiRec.saranLangkah)}</p>
              </div>

            </div>
          ` : `
            <div class="py-12 text-center text-slate-500 space-y-3">
              <i data-lucide="sparkles" class="w-12 h-12 stroke-[1.5] mx-auto text-slate-600"></i>
              <p class="text-sm font-semibold">Klik "Buat Rekomendasi Gizi AI" untuk menghasilkan analisis nutrisi spesifik untuk ${escapeHtml(selectedAthlete?.nama || 'atlet ini')}.</p>
            </div>
          `}
        </div>

      </div>

      <!-- Historical BMI Logs Table -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white">
        <div class="p-4 border-b border-slate-800">
          <h3 class="text-sm font-black flex items-center space-x-2">
            <i data-lucide="history" class="w-4 h-4 text-cyan-400"></i>
            <span>Riwayat Pengukuran Fisik & BMI: ${escapeHtml(selectedAthlete?.nama || '')}</span>
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <th class="py-3 px-4">Tanggal</th>
                <th class="py-3 px-4 text-center">Tinggi (cm)</th>
                <th class="py-3 px-4 text-center">Berat (kg)</th>
                <th class="py-3 px-4 text-center">Skor BMI</th>
                <th class="py-3 px-4">Kategori Fisik</th>
                <th class="py-3 px-4">Catatan</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              ${bmiLogs.map(log => {
                const bmiMeta = calculateBMI(log.tinggiCm, log.beratKg);
                return `
                  <tr class="hover:bg-slate-950/60 transition-colors">
                    <td class="py-3 px-4 font-mono text-slate-300">${escapeHtml(log.tanggal)}</td>
                    <td class="py-3 px-4 text-center font-mono text-cyan-300">${log.tinggiCm} cm</td>
                    <td class="py-3 px-4 text-center font-mono text-cyan-300">${log.beratKg} kg</td>
                    <td class="py-3 px-4 text-center">
                      <span class="font-mono font-black text-sm text-cyan-300">${log.bmiValue}</span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${bmiMeta.badgeColor}">
                        ${log.kategori}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-slate-400">${escapeHtml(log.catatanGizi || '-')}</td>
                    <td class="py-3 px-4 text-right">
                      <button
                        onclick="handleDeleteBmiLog('${log.id}')"
                        class="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
                        title="Hapus Log"
                      >
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function handleBmiAthleteChange(id) {
  bmiSelectedAthleteId = id;
  currentAiRecommendation = null;
  renderApp();
}

function handleBmiLiveCalculate() {
  const h = parseFloat(document.getElementById('bmi-calc-height')?.value) || 0;
  const w = parseFloat(document.getElementById('bmi-calc-weight')?.value) || 0;
  const res = calculateBMI(h, w);
  const container = document.getElementById('bmi-live-preview');
  if (container) {
    container.innerHTML = `
      <span class="text-[11px] text-slate-400 font-bold">Skor BMI Terhitung:</span>
      <div class="text-3xl font-black text-cyan-300 font-mono">${res.value}</div>
      <span class="inline-block px-2.5 py-0.5 rounded text-xs font-bold ${res.badgeColor}">
        ${res.category}
      </span>
    `;
  }
}

function handleGenerateAiNutrition() {
  const athlete = AppState.athletes.find(a => a.id === bmiSelectedAthleteId) || AppState.athletes[0];
  const h = parseFloat(document.getElementById('bmi-calc-height')?.value) || athlete?.tinggiBadanCm || 160;
  const w = parseFloat(document.getElementById('bmi-calc-weight')?.value) || athlete?.beratBadanKg || 50;
  const bmiInfo = calculateBMI(h, w);

  isAiLoading = true;
  renderApp();

  setTimeout(() => {
    let rec = {};
    if (bmiInfo.category === 'Kurus') {
      rec = {
        analisisAI: `Status BMI ${bmiInfo.value} (${bmiInfo.category}) untuk ${athlete.nama} (${athlete.kelompokUmur}). Perlu peningkatan massa otot inti dan stamina agar dorongan di dalam air lebih kuat dan tidak mudah kelelahan.`,
        nutrisiGizi: `Pola makan surplus kalori sehat (+300-500 kkal/hari). Prioritaskan dada ayam, telur rebus 3-4 butir/hari, ikan laut, pisang, dan susu tinggi kalsium & protein pasca-latihan renang.`,
        jenisOlahraga: `Dryland resistance band training 3x seminggu untuk memperkuat latissimus dorsi, core plank, dan leg squat untuk meningkatkan daya dorong saat start dan turn.`,
        saranLangkah: `Targetkan kenaikan berat badan sehat +1 kg per bulan tanpa mengorbankan kelenturan sendi bahu dan pergelangan kaki.`,
        tanggalDibuat: new Date().toISOString().split('T')[0]
      };
    } else if (bmiInfo.category === 'Ideal Atlet Renang') {
      rec = {
        analisisAI: `Rasio BMI ${bmiInfo.value} sangat ideal untuk perenang kompetitif! Komposisi hidrodinamis tubuh sangat prima dengan daya apung (buoyancy) dan kekuatan propulsi yang seimbang.`,
        nutrisiGizi: `Pertahankan asupan karbohidrat kompleks 2 jam sebelum latihan (oatmeal, nasi merah, pisang) & 25-30g protein dalam 30 menit pasca renang untuk recovery otot cepat.`,
        jenisOlahraga: `Fokus pada latihan explosive power (box jumps, medicine ball slam, pull-ups) dan latihan fleksibilitas perenang (shoulder mobility, ankle stretch).`,
        saranLangkah: `Pertahankan komposisi tubuh saat ini dengan pemantauan berat badan berkala 2 minggu sekali menjelang kejuaraan target.`,
        tanggalDibuat: new Date().toISOString().split('T')[0]
      };
    } else {
      rec = {
        analisisAI: `Status BMI ${bmiInfo.value} (${bmiInfo.category}). Peningkatan efisiensi kayuhan dapat dicapai dengan mengoptimalkan rasio massa otot berbanding lemak tubuh (body fat).`,
        nutrisiGizi: `Batasi asupan gorengan dan gula berlebih. Tingkatkan serat sayuran hijau, buah-buahan segar, sumber protein tanpa lemak, dan hidrasi air putih minimal 2.5 - 3 liter per hari.`,
        jenisOlahraga: `Tambahkan porsi latihan aerobik interval di kolam renang (drill 200m/400m pace konstan) dikombinasikan dengan sirkuit dryland high-intensity.`,
        saranLangkah: `Penyesuaian porsi kalori harian secara bertahap didampingi evaluasi time trial 50m setiap akhir pekan.`,
        tanggalDibuat: new Date().toISOString().split('T')[0]
      };
    }

    currentAiRecommendation = rec;
    isAiLoading = false;
    showToast('Rekomendasi gizi AI berhasil dibuat!');
    renderApp();
  }, 600);
}

function handleSaveBmiRecord() {
  const athlete = AppState.athletes.find(a => a.id === bmiSelectedAthleteId) || AppState.athletes[0];
  const h = parseFloat(document.getElementById('bmi-calc-height')?.value) || athlete?.tinggiBadanCm || 160;
  const w = parseFloat(document.getElementById('bmi-calc-weight')?.value) || athlete?.beratBadanKg || 50;
  const notes = document.getElementById('bmi-calc-notes')?.value || '';
  const bmiInfo = calculateBMI(h, w);

  const newLog = {
    id: `bmi-${Date.now()}`,
    athleteId: athlete.id,
    tanggal: new Date().toISOString().split('T')[0],
    tinggiCm: h,
    beratKg: w,
    bmiValue: bmiInfo.value,
    kategori: bmiInfo.category,
    catatanGizi: notes || 'Pemeriksaan rutin berkala',
    aiRecommendation: currentAiRecommendation || null
  };

  AppState.bmiLogs.push(newLog);
  saveState('bmiLogs', AppState.bmiLogs);

  // Update athlete's height & weight
  athlete.tinggiBadanCm = h;
  athlete.beratBadanKg = w;
  saveState('athletes', AppState.athletes);

  showToast('Catatan BMI berhasil disimpan ke database riwayat!');
  renderApp();
}

function handleDeleteBmiLog(id) {
  if (confirm('Apakah Anda yakin ingin menghapus catatan BMI ini?')) {
    AppState.bmiLogs = AppState.bmiLogs.filter(b => b.id !== id);
    saveState('bmiLogs', AppState.bmiLogs);
    showToast('Catatan BMI berhasil dihapus.');
    renderApp();
  }
}

// ----------------------------------------------------
// 10. USER ACCOUNTS TAB
// ----------------------------------------------------
function renderUsersTab() {
  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="shield" class="w-6 h-6 text-cyan-400"></i>
            <span>Manajemen Akun & Kunci Akses Portal</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Pengelolaan hak akses Coach Utama, Administrator Club, serta Kunci Akses Khusus Orang Tua / Atlet.
          </p>
        </div>

        <button
          onclick="openAddUserModal()"
          class="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${AppState.userAccounts.map(u => {
          return `
            <div class="bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all p-5 flex flex-col justify-between text-white shadow-lg">
              
              <div class="space-y-3">
                <div class="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div class="flex items-center space-x-3">
                    ${u.avatarUrl ? `
                      <img src="${escapeHtml(u.avatarUrl)}" alt="${escapeHtml(u.name)}" class="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400 shadow-md shrink-0" />
                    ` : `
                      <div class="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-300 border-2 border-cyan-500 font-black text-sm flex items-center justify-center shrink-0">
                        ${escapeHtml(u.name.charAt(0))}
                      </div>
                    `}
                    <div>
                      <h3 class="text-sm font-black text-white leading-snug">${escapeHtml(u.name)}</h3>
                      <span class="text-[10px] font-bold text-amber-300 block mt-0.5">${escapeHtml(u.role)}</span>
                    </div>
                  </div>

                  <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    ${escapeHtml(u.status || 'Aktif')}
                  </span>
                </div>

                <div class="space-y-2 text-xs text-slate-300">
                  <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div class="flex justify-between">
                      <span class="text-slate-400">Email:</span>
                      <span class="text-cyan-300">${escapeHtml(u.email)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">Access Key:</span>
                      <span class="text-amber-300 font-black">${escapeHtml(u.accessKey)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">Password:</span>
                      <span class="text-slate-300">${escapeHtml(u.password)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-3 mt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onclick="handleDeleteUser('${u.id}')"
                  class="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>Hapus</span>
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function handleDeleteUser(id) {
  if (AppState.userAccounts.length <= 1) {
    showToast('Minimal harus ada 1 akun pengelola!', 'error');
    return;
  }
  const u = AppState.userAccounts.find(x => x.id === id);
  if (confirm(`Apakah Anda yakin ingin menghapus akun "${u?.name}"?`)) {
    AppState.userAccounts = AppState.userAccounts.filter(x => x.id !== id);
    saveState('userAccounts', AppState.userAccounts);
    showToast('Akun berhasil dihapus.');
    renderApp();
  }
}

// ----------------------------------------------------
// 11. REPORTS / CETAK PDF TAB
// ----------------------------------------------------
function renderReportsTab() {
  if (!reportSelectedAthleteId && AppState.athletes.length > 0) {
    reportSelectedAthleteId = AppState.athletes[0].id;
  }

  const selectedAthlete = AppState.athletes.find(a => a.id === reportSelectedAthleteId) || AppState.athletes[0];
  const athleteRecords = AppState.records.filter(r => r.athleteId === selectedAthlete?.id);
  const athleteMedals = AppState.medals.filter(m => m.athleteId === selectedAthlete?.id);
  const athleteEvals = AppState.evaluations.filter(e => e.athleteId === selectedAthlete?.id);

  return `
    <div class="space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center space-x-2">
            <i data-lucide="printer" class="w-6 h-6 text-cyan-400"></i>
            <span>Laporan Resmi & Cetak PDF Club</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Format resmi standar Akuatik Indonesia dengan kop surat, tabel rekapitulasi waktu, dan tanda tangan Head Coach & Manajemen.
          </p>
        </div>

        <button
          onclick="window.print()"
          class="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>Cetak Dokumen / Simpan PDF</span>
        </button>
      </div>

      <!-- Report Options Strip -->
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Pilih Jenis Laporan</label>
          <select
            onchange="handleReportTypeChange(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="CLUB_SUMMARY" ${reportTypeSelected === 'CLUB_SUMMARY' ? 'selected' : ''}>Rekapitulasi Prestasi Klub Keseluruhan</option>
            <option value="ATHLETE_RAPOR" ${reportTypeSelected === 'ATHLETE_RAPOR' ? 'selected' : ''}>Rapor Individual Atlet Perenang</option>
            <option value="LIMIT_QUALIFICATION" ${reportTypeSelected === 'LIMIT_QUALIFICATION' ? 'selected' : ''}>Daftar Kualifikasi Limit Target</option>
          </select>
        </div>

        ${reportTypeSelected === 'ATHLETE_RAPOR' ? `
          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">Pilih Atlet</label>
            <select
              onchange="handleReportAthleteChange(this.value)"
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 outline-none focus:border-cyan-400"
            >
              ${AppState.athletes.map(a => `
                <option value="${a.id}" ${a.id === selectedAthlete?.id ? 'selected' : ''}>${escapeHtml(a.nama)} (${a.kelompokUmur})</option>
              `).join('')}
            </select>
          </div>
        ` : ''}

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">Tanggal Dokumen</label>
          <input
            type="date"
            value="${reportDocumentDate}"
            onchange="handleReportDateChange(this.value)"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <!-- Printable Document Canvas -->
      <div id="printable-report" class="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-6">
        
        <!-- Official Club Letterhead / Kop Surat -->
        <div class="flex items-center justify-between border-b-4 border-double border-slate-900 pb-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center text-cyan-400 shrink-0 shadow">
              <i data-lucide="waves" class="w-10 h-10"></i>
            </div>
            <div>
              <h1 class="text-2xl font-black tracking-tight text-slate-950 uppercase italic leading-none">
                SANSINOZ SWIMMING CLUB
              </h1>
              <p class="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
                Pusat Pembinaan Prestasi Atlet Renang & Kualifikasi Limit Nasional
              </p>
              <p class="text-[11px] text-slate-500">
                Kolam Renang Standar Akuatik &bull; Contact: 0812-3456-7890 &bull; Email: management@sansinoz.com
              </p>
            </div>
          </div>

          <div class="text-right">
            <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-300 block">
              DOC: SNZ-${Date.now().toString().slice(-6)}
            </span>
            <span class="text-xs text-slate-600 mt-1 block font-semibold">Tgl: ${reportDocumentDate}</span>
          </div>
        </div>

        <!-- Document Content Based on Type -->
        ${reportTypeSelected === 'CLUB_SUMMARY' ? `
          <div class="space-y-4">
            <div class="text-center py-2 border-b border-slate-200">
              <h2 class="text-lg font-black uppercase text-slate-950">LAPORAN REKAPITULASI PRESTASI & TIME TRIAL KLUB</h2>
              <p class="text-xs text-slate-600">Ringkasan Perekaman Catatan Waktu, Prestasi Medali, dan Status Atlet Aktif</p>
            </div>

            <!-- Stats Box -->
            <div class="grid grid-cols-4 gap-3 text-center py-2">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Total Atlet</span>
                <div class="text-xl font-black text-slate-900">${AppState.athletes.length}</div>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Total Rekor Waktu</span>
                <div class="text-xl font-black text-slate-900">${AppState.records.length}</div>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Total Medali</span>
                <div class="text-xl font-black text-amber-600">${AppState.medals.length}</div>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Room Pembinaan</span>
                <div class="text-xl font-black text-slate-900">${AppState.classes.length}</div>
              </div>
            </div>

            <!-- Athletes Summary Table -->
            <div>
              <h3 class="text-xs font-bold text-slate-900 uppercase mb-2">Daftar Atlet & Catatan Waktu Terbaik (50m Gaya Bebas)</h3>
              <table class="w-full text-left border-collapse text-[11px] border border-slate-300">
                <thead>
                  <tr class="bg-slate-100 font-bold border-b border-slate-300">
                    <th class="py-2 px-2.5 border-r border-slate-300">No</th>
                    <th class="py-2 px-2.5 border-r border-slate-300">Nama Atlet</th>
                    <th class="py-2 px-2.5 border-r border-slate-300">NIS</th>
                    <th class="py-2 px-2.5 border-r border-slate-300">Kelompok Umur</th>
                    <th class="py-2 px-2.5 border-r border-slate-300">Gaya & Jarak</th>
                    <th class="py-2 px-2.5 text-center">Waktu Terbaik</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${AppState.athletes.map((a, i) => {
                    const best = AppState.records.filter(r => r.athleteId === a.id && r.distance === '50m' && r.stroke === 'Gaya Bebas').sort((x, y) => x.timeInSeconds - y.timeInSeconds)[0];
                    return `
                      <tr>
                        <td class="py-1.5 px-2.5 border-r border-slate-300 text-center font-bold">${i + 1}</td>
                        <td class="py-1.5 px-2.5 border-r border-slate-300 font-bold">${escapeHtml(a.nama)}</td>
                        <td class="py-1.5 px-2.5 border-r border-slate-300 font-mono">${escapeHtml(a.nis)}</td>
                        <td class="py-1.5 px-2.5 border-r border-slate-300">${escapeHtml(a.kelompokUmur)}</td>
                        <td class="py-1.5 px-2.5 border-r border-slate-300">50m Gaya Bebas</td>
                        <td class="py-1.5 px-2.5 text-center font-mono font-bold">${best ? `${formatTime(best.timeInSeconds)}s` : '-'}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : `
          <!-- Individual Athlete Report -->
          <div class="space-y-4">
            <div class="text-center py-2 border-b border-slate-200">
              <h2 class="text-lg font-black uppercase text-slate-950">RAPOR EVALUASI & CATATAN WAKTU ATLET PERENANG</h2>
              <p class="text-xs text-slate-600">Dokumen Rekapitulasi Capaian Atlet & Hasil Evaluasi Berkala</p>
            </div>

            <!-- Profile card -->
            <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div class="space-y-1">
                <div><span class="font-bold text-slate-500">Nama Atlet:</span> <span class="font-black text-slate-900">${escapeHtml(selectedAthlete?.nama || '-')}</span></div>
                <div><span class="font-bold text-slate-500">NIS Perenang:</span> <span class="font-mono font-bold">${escapeHtml(selectedAthlete?.nis || '-')}</span></div>
                <div><span class="font-bold text-slate-500">Kelompok Umur:</span> <span>${escapeHtml(selectedAthlete?.kelompokUmur || '-')}</span></div>
              </div>
              <div class="space-y-1">
                <div><span class="font-bold text-slate-500">Gender / Usia:</span> <span>${escapeHtml(selectedAthlete?.gender || '-')} (${calculateAge(selectedAthlete?.tanggalLahir)} thn)</span></div>
                <div><span class="font-bold text-slate-500">Tinggi / Berat:</span> <span>${selectedAthlete?.tinggiBadanCm} cm / ${selectedAthlete?.beratBadanKg} kg</span></div>
                <div><span class="font-bold text-slate-500">Head Coach:</span> <span>${escapeHtml(selectedAthlete?.headCoach || '-')}</span></div>
              </div>
            </div>

            <!-- Time Records Table -->
            <div>
              <h3 class="text-xs font-bold text-slate-900 uppercase mb-2">Riwayat Catatan Waktu Time Trial</h3>
              <table class="w-full text-left border-collapse text-[11px] border border-slate-300">
                <thead>
                  <tr class="bg-slate-100 font-bold border-b border-slate-300">
                    <th class="py-2 px-2.5 border-r border-slate-300">Gaya Renang</th>
                    <th class="py-2 px-2.5 border-r border-slate-300">Jarak</th>
                    <th class="py-2 px-2.5 border-r border-slate-300 text-center">Waktu</th>
                    <th class="py-2 px-2.5 border-r border-slate-300">Ajang</th>
                    <th class="py-2 px-2.5 border-r border-slate-300">Tanggal</th>
                    <th class="py-2 px-2.5 text-center">PB</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${athleteRecords.map(r => `
                    <tr>
                      <td class="py-1.5 px-2.5 border-r border-slate-300 font-bold">${escapeHtml(r.stroke)}</td>
                      <td class="py-1.5 px-2.5 border-r border-slate-300">${escapeHtml(r.distance)}</td>
                      <td class="py-1.5 px-2.5 border-r border-slate-300 font-mono font-bold text-center">${formatTime(r.timeInSeconds)}s</td>
                      <td class="py-1.5 px-2.5 border-r border-slate-300">${escapeHtml(r.namaAjang)}</td>
                      <td class="py-1.5 px-2.5 border-r border-slate-300 font-mono">${escapeHtml(r.tanggal)}</td>
                      <td class="py-1.5 px-2.5 text-center font-bold">${r.isPersonalBest ? '⭐' : '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `}

        <!-- Official Signatures -->
        <div class="pt-8 grid grid-cols-2 text-center text-xs">
          <div class="space-y-12">
            <div>
              <p class="font-bold text-slate-700">Mengetahui,</p>
              <p class="font-extrabold text-slate-900">Head Coach Sansinoz</p>
            </div>
            <div>
              <p class="font-black text-slate-950 underline decoration-2 underline-offset-4">Coach Doni Setiawan, M.Or.</p>
              <p class="text-[10px] text-slate-500">NIP. SNZ-CH-001</p>
            </div>
          </div>

          <div class="space-y-12">
            <div>
              <p class="font-bold text-slate-700">Ditetapkan di Kolam Renang,</p>
              <p class="font-extrabold text-slate-900">Manajemen Official Club</p>
            </div>
            <div>
              <p class="font-black text-slate-950 underline decoration-2 underline-offset-4">Admin Manajemen Sansinoz</p>
              <p class="text-[10px] text-slate-500">Reg. Official Club</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

function handleReportTypeChange(t) {
  reportTypeSelected = t;
  renderApp();
}

function handleReportAthleteChange(id) {
  reportSelectedAthleteId = id;
  renderApp();
}

function handleReportDateChange(d) {
  reportDocumentDate = d;
  renderApp();
}

// ----------------------------------------------------
// 12. EKSKUL AL-FATIH TAB
// ----------------------------------------------------
function renderAlFatihTab() {
  const students = AppState.alfatihStudents || [];
  const cfg = AppState.alfatihConfig || {};

  const totalSiswa = students.length;
  const tuntas25m = students.filter(s => s.statusCapaian25m?.gayaBebas && s.statusCapaian25m?.gayaDada).length;

  let totalEmas = 0, totalPerak = 0, totalPerunggu = 0;
  students.forEach(s => {
    totalEmas += s.medali?.emas || 0;
    totalPerak += s.medali?.perak || 0;
    totalPerunggu += s.medali?.perunggu || 0;
  });

  return `
    <div class="space-y-6">
      
      <!-- Hero Banner Al-Fatih -->
      <div class="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-600/50">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase">
                Khusus Kemitraan Sekolah
              </span>
              <span class="text-xs font-bold text-slate-300">&bull; ${escapeHtml(cfg.sekolah || 'Sekolah Al-Fatih')}</span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
              ${escapeHtml(cfg.namaEkskul || 'Ekskul Renang & Aquatics Al-Fatih')}
            </h1>

            <p class="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              Pusat evaluasi capaian kemampuan berenang 25m, penilaian teknik dasar (mengapung, kayuhan, bernapas), serta perolehan medali siswa Al-Fatih.
            </p>

            <div class="pt-2 flex flex-wrap items-center gap-2">
              <button
                onclick="openAddAlFatihStudentModal()"
                class="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
              >
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Tambah Siswa Al-Fatih</span>
              </button>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-slate-900/90 border border-emerald-700/50 p-5 rounded-2xl space-y-3 shrink-0 lg:w-72 backdrop-blur-md">
            <span class="text-xs font-bold text-emerald-300 uppercase block">Status Pembinaan</span>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Total Siswa Terdaftar:</span>
                <span class="font-bold text-white font-mono">${totalSiswa} / ${cfg.limitKapasitas || 30}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tuntas 25m Free/Breast:</span>
                <span class="font-bold text-emerald-400 font-mono">${tuntas25m} Siswa</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Total Medali Siswa:</span>
                <span class="font-bold text-amber-400 font-mono">🥇${totalEmas} 🥈${totalPerak} 🥉${totalPerunggu}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sub Tabs navigation -->
      <div class="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs font-bold">
        <button
          onclick="handleAlFatihSubTab('STUDENTS')"
          class="px-4 py-2 rounded-xl transition-all cursor-pointer ${
            alfatihActiveSubTab === 'STUDENTS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'text-slate-400 hover:text-white'
          }"
        >
          Daftar Siswa & Capaian 25m
        </button>

        <button
          onclick="handleAlFatihSubTab('PENILAIAN')"
          class="px-4 py-2 rounded-xl transition-all cursor-pointer ${
            alfatihActiveSubTab === 'PENILAIAN' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'text-slate-400 hover:text-white'
          }"
        >
          Rapor Nilai Teknik & Ekskul
        </button>
      </div>

      <!-- Students Grid -->
      ${alfatihActiveSubTab === 'STUDENTS' ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${students.map(s => {
            const m = s.medali || { emas: 0, perak: 0, perunggu: 0 };
            const c = s.statusCapaian25m || {};
            const w = s.waktu25m || {};

            return `
              <div class="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all p-5 rounded-2xl shadow-xl text-white flex flex-col justify-between">
                
                <div class="space-y-3">
                  <div class="flex items-start justify-between pb-3 border-b border-slate-800">
                    <div class="flex items-center space-x-3">
                      ${s.fotoUrl ? `
                        <img src="${escapeHtml(s.fotoUrl)}" alt="${escapeHtml(s.nama)}" class="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400 shadow-md shrink-0" />
                      ` : `
                        <div class="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-300 border-2 border-emerald-500 font-black text-sm flex items-center justify-center shrink-0">
                          ${escapeHtml(s.nama.charAt(0))}
                        </div>
                      `}
                      <div>
                        <h3 class="text-sm font-black text-white leading-snug">${escapeHtml(s.nama)}</h3>
                        <p class="text-[10px] font-bold text-emerald-300">${escapeHtml(s.kelasSekolah || '-')}</p>
                        <p class="text-[10px] text-slate-400 font-mono">NISN: ${escapeHtml(s.nisn || '-')}</p>
                      </div>
                    </div>

                    <span class="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Nilai ${escapeHtml(s.penilaian?.predikatAkhir || 'A')}
                    </span>
                  </div>

                  <!-- 25m Targets Check -->
                  <div class="space-y-1.5 text-xs text-slate-300">
                    <span class="text-[11px] font-bold text-slate-400 block">Status Capaian 25 Meter:</span>
                    
                    <div class="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span>Free:</span>
                        <span class="font-mono font-bold ${c.gayaBebas ? 'text-emerald-400' : 'text-slate-600'}">
                          ${c.gayaBebas ? `✓ ${w.gayaBebas || ''}` : 'Belum'}
                        </span>
                      </div>
                      <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span>Dada:</span>
                        <span class="font-mono font-bold ${c.gayaDada ? 'text-emerald-400' : 'text-slate-600'}">
                          ${c.gayaDada ? `✓ ${w.gayaDada || ''}` : 'Belum'}
                        </span>
                      </div>
                      <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span>Punggung:</span>
                        <span class="font-mono font-bold ${c.gayaPunggung ? 'text-emerald-400' : 'text-slate-600'}">
                          ${c.gayaPunggung ? `✓ ${w.gayaPunggung || ''}` : 'Belum'}
                        </span>
                      </div>
                      <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span>Kupu:</span>
                        <span class="font-mono font-bold ${c.gayaKupu ? 'text-emerald-400' : 'text-slate-600'}">
                          ${c.gayaKupu ? `✓ ${w.gayaKupu || ''}` : 'Belum'}
                        </span>
                      </div>
                    </div>

                    <!-- Medals -->
                    <div class="pt-1 flex items-center justify-between text-[11px]">
                      <span class="text-slate-400">Medali Siswa:</span>
                      <span class="font-bold text-amber-300">🥇${m.emas} 🥈${m.perak} 🥉${m.perunggu}</span>
                    </div>

                    <div class="pt-1 text-[10px] text-slate-400 border-t border-slate-800">
                      Wali: ${escapeHtml(s.namaOrangTua || '-')} (${escapeHtml(s.kontakOrangTua || '-')})
                    </div>
                  </div>
                </div>

                <div class="pt-3 mt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                  <button
                    onclick="handleDeleteAlFatihStudent('${s.id}')"
                    class="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    <span>Hapus</span>
                  </button>
                </div>

              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- Penilaian Matrix Table -->
        <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                  <th class="py-3 px-4">Siswa Al-Fatih</th>
                  <th class="py-3 px-3 text-center">Mengapung</th>
                  <th class="py-3 px-3 text-center">Menendang</th>
                  <th class="py-3 px-3 text-center">Kayuhan</th>
                  <th class="py-3 px-3 text-center">Bernapas</th>
                  <th class="py-3 px-3 text-center">25m Bebas</th>
                  <th class="py-3 px-3 text-center">25m Dada</th>
                  <th class="py-3 px-3 text-center">Predikat</th>
                  <th class="py-3 px-4">Catatan Guru</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/80">
                ${students.map(s => {
                  const p = s.penilaian || {};
                  return `
                    <tr class="hover:bg-slate-950/60 transition-colors">
                      <td class="py-3 px-4 font-bold text-white">${escapeHtml(s.nama)}</td>
                      <td class="py-3 px-3 text-center font-mono font-bold text-emerald-400">${p.mengapung || 'A'}</td>
                      <td class="py-3 px-3 text-center font-mono font-bold text-emerald-400">${p.menendang || 'A'}</td>
                      <td class="py-3 px-3 text-center font-mono font-bold text-cyan-300">${p.gerakanTangan || 'B'}</td>
                      <td class="py-3 px-3 text-center font-mono font-bold text-cyan-300">${p.teknikBernapas || 'B'}</td>
                      <td class="py-3 px-3 text-center font-mono font-bold text-amber-300">${p.target25mBebas || 'A'}</td>
                      <td class="py-3 px-3 text-center font-mono font-bold text-amber-300">${p.target25mDada || 'B'}</td>
                      <td class="py-3 px-3 text-center">
                        <span class="px-2 py-0.5 rounded font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          ${p.predikatAkhir || 'A'}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-slate-300 text-[11px]">${escapeHtml(p.catatanGuru || '-')}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}

    </div>
  `;
}

function handleAlFatihSubTab(tab) {
  alfatihActiveSubTab = tab;
  renderApp();
}

function handleDeleteAlFatihStudent(id) {
  if (confirm('Apakah Anda yakin ingin menghapus data siswa Al-Fatih ini?')) {
    AppState.alfatihStudents = AppState.alfatihStudents.filter(s => s.id !== id);
    saveState('alfatihStudents', AppState.alfatihStudents);
    showToast('Data siswa Al-Fatih berhasil dihapus.');
    renderApp();
  }
}



