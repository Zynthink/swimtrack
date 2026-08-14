/**
 * SANSINOZ SWIMMING CLUB - Utilities & Helper Functions
 */

function formatTime(seconds) {
  if (isNaN(seconds) || seconds <= 0) return '00:00.00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 100);

  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
  const msStr = ms < 10 ? `0${ms}` : `${ms}`;

  if (mins > 0) {
    return `${minsStr}:${secsStr}.${msStr}`;
  }
  return `${secsStr}.${msStr}`;
}

function parseTimeToSeconds(input) {
  if (!input) return 0;
  const clean = String(input).trim();
  if (clean.includes(':')) {
    const parts = clean.split(':');
    const mins = parseFloat(parts[0]) || 0;
    const secsMs = parseFloat(parts[1]) || 0;
    return mins * 60 + secsMs;
  } else {
    return parseFloat(clean) || 0;
  }
}

function calculateAge(birthDateString) {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function determineKelompokUmur(birthDateString) {
  const age = calculateAge(birthDateString);
  if (age < 12) return 'KU IV (<11 thn)';
  if (age <= 13) return 'KU III (12-13 thn)';
  if (age <= 15) return 'KU II (14-15 thn)';
  if (age <= 18) return 'KU I (16-18 thn)';
  return 'Senior (19+ thn)';
}

function calculateBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg || heightCm <= 0) {
    return { value: 0, category: 'Ideal Atlet Renang', badgeColor: 'bg-slate-800 text-slate-300' };
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  if (rounded < 18.5) {
    return { value: rounded, category: 'Kurus', badgeColor: 'bg-amber-950 text-amber-300 border border-amber-500/50' };
  } else if (rounded >= 18.5 && rounded <= 23.9) {
    return { value: rounded, category: 'Ideal Atlet Renang', badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' };
  } else if (rounded >= 24 && rounded <= 28.9) {
    return { value: rounded, category: 'Gemuk', badgeColor: 'bg-orange-950 text-orange-300 border border-orange-500/50' };
  } else {
    return { value: rounded, category: 'Obesitas', badgeColor: 'bg-rose-950 text-rose-300 border border-rose-500/50' };
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-900 border-emerald-500 text-emerald-200' : 'bg-rose-900 border-rose-500 text-rose-200';
  const icon = type === 'success' ? '✓' : '⚠';

  toast.className = `${bg} border px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold transition-all transform translate-y-2 opacity-0 duration-300 pointer-events-auto`;
  toast.innerHTML = `<span class="text-base">${icon}</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function loadState(key, fallback) {
  try {
    const item = localStorage.getItem(`sansinoz_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading state ${key}:`, e);
    return fallback;
  }
}

function saveState(key, data) {
  try {
    localStorage.setItem(`sansinoz_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving state ${key}:`, e);
  }
}

// ----------------------------------------------------
// Global Navigation Alias
// ----------------------------------------------------
function switchTab(tab) {
  if (tab === 'ekskul-alfatih') {
    tab = 'alfatih';
  }
  if (typeof handleSwitchTab === 'function') {
    handleSwitchTab(tab);
  } else if (typeof AppState !== 'undefined') {
    AppState.activeTab = tab;
    if (typeof renderApp === 'function') renderApp();
  }
}

// ----------------------------------------------------
// Chart.js Lifecycle Management
// ----------------------------------------------------
let activeChartInstances = [];

function destroyCharts() {
  if (Array.isArray(activeChartInstances)) {
    activeChartInstances.forEach(chart => {
      try {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      } catch (e) {
        console.warn('Error destroying chart instance:', e);
      }
    });
  }
  activeChartInstances = [];
}

function initAnalyticsCharts() {
  const canvas = document.getElementById('athleteProgressChart');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    console.warn('Chart.js is not loaded yet');
    return;
  }

  // Always destroy previous chart instances
  destroyCharts();

  const selectedAthlete = AppState.athletes.find(a => a.id === analyticsSelectedAthleteId) || AppState.athletes[0];
  if (!selectedAthlete) return;

  // Filter records for this athlete, stroke, and distance
  const athleteRecords = AppState.records
    .filter(r => r.athleteId === selectedAthlete.id && r.stroke === analyticsSelectedStroke && r.distance === analyticsSelectedDistance)
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  if (athleteRecords.length === 0) return;

  // Prepare chart dataset
  const labels = athleteRecords.map(r => {
    const d = new Date(r.tanggal);
    if (isNaN(d.getTime())) return r.tanggal;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  });
  const dataPoints = athleteRecords.map(r => r.timeInSeconds);

  // Find limit standards
  const limitStd = AppState.limits.find(l => 
    l.stroke === analyticsSelectedStroke && 
    l.distance === analyticsSelectedDistance && 
    l.gender === selectedAthlete.gender && 
    l.kelompokUmur === selectedAthlete.kelompokUmur
  );

  const datasets = [
    {
      label: `Waktu ${selectedAthlete.nama} (Detik)`,
      data: dataPoints,
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.12)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }
  ];

  if (limitStd && limitStd.limitTargetSeconds) {
    datasets.push({
      label: `Limit Target Nasional (${limitStd.limitTargetSeconds.toFixed(2)}s)`,
      data: Array(dataPoints.length).fill(limitStd.limitTargetSeconds),
      borderColor: '#f59e0b',
      borderWidth: 2,
      borderDash: [6, 6],
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 0,
    });
  }

  if (limitStd && limitStd.limitClubSeconds) {
    datasets.push({
      label: `Limit Club Sansinoz (${limitStd.limitClubSeconds.toFixed(2)}s)`,
      data: Array(dataPoints.length).fill(limitStd.limitClubSeconds),
      borderColor: '#3b82f6',
      borderWidth: 1.5,
      borderDash: [4, 4],
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 0,
    });
  }

  try {
    const ctx = canvas.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 11,
                weight: 'bold',
              },
              boxWidth: 12,
              padding: 15,
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#334155',
            borderWidth: 1,
            titleColor: '#f8fafc',
            bodyColor: '#38bdf8',
            padding: 10,
            callbacks: {
              label: function(context) {
                const val = context.parsed.y;
                return `${context.dataset.label}: ${formatTime(val)} (${val.toFixed(2)}s)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.3)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: "'JetBrains Mono', monospace",
                size: 10,
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.3)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: "'JetBrains Mono', monospace",
                size: 10,
              },
              callback: function(value) {
                return formatTime(value);
              }
            }
          }
        }
      }
    });

    activeChartInstances.push(newChart);
  } catch (err) {
    console.error('Error creating progress chart:', err);
  }
}
