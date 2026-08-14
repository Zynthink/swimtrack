/**
 * SANSINOZ SWIMMING CLUB - Modal Management & Form Handlers
 */

function openModal(title, bodyHtml) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 text-white flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <h3 class="text-base font-black text-white">${escapeHtml(title)}</h3>
          <button onclick="closeModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto space-y-4">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) container.innerHTML = '';
}

// 1. ADD / EDIT ATHLETE MODAL
function openAddAthleteModal() {
  const formHtml = `
    <form id="athlete-form" onsubmit="handleSaveAthlete(event)" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Nomor Induk Atlet (NIS)</label>
        <input type="text" id="atl-nis" value="SNZ-${new Date().getFullYear()}-${String(AppState.athletes.length + 1).padStart(3, '0')}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Nama Lengkap Atlet *</label>
        <input type="text" id="atl-nama" required placeholder="Contoh: Muhammad Rizky" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Gender *</label>
          <select id="atl-gender" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="Laki-Laki">Laki-Laki (Putra)</option>
            <option value="Perempuan">Perempuan (Putri)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Tanggal Lahir *</label>
          <input type="date" id="atl-dob" required value="2012-05-15" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kelas Pembinaan</label>
          <select id="atl-kelas" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            ${AppState.classes.map(c => `<option value="${c.id}">${escapeHtml(c.namaKelas)}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Status Keaktifan</label>
          <select id="atl-status" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="Aktif">Aktif</option>
            <option value="Cuti">Cuti</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Tinggi Badan (cm)</label>
          <input type="number" id="atl-height" value="155" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Berat Badan (kg)</label>
          <input type="number" id="atl-weight" value="45" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Nama Orang Tua / Wali</label>
          <input type="text" id="atl-wali" placeholder="Bpk. Hendra" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kontak WhatsApp Wali</label>
          <input type="text" id="atl-kontak" placeholder="0812-xxxx-xxxx" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Foto Atlet (URL atau Unggah)</label>
        <input type="text" id="atl-foto" placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 text-xs" />
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all">Simpan Atlet</button>
      </div>
    </form>
  `;
  openModal('Tambah Atlet Baru', formHtml);
}

function openEditAthleteModal(id) {
  const a = AppState.athletes.find(x => x.id === id);
  if (!a) return;

  const formHtml = `
    <form id="athlete-form" onsubmit="handleUpdateAthlete(event, '${a.id}')" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Nomor Induk Atlet (NIS)</label>
        <input type="text" id="atl-nis" value="${escapeHtml(a.nis)}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Nama Lengkap Atlet *</label>
        <input type="text" id="atl-nama" value="${escapeHtml(a.nama)}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Gender *</label>
          <select id="atl-gender" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="Laki-Laki" ${a.gender === 'Laki-Laki' ? 'selected' : ''}>Laki-Laki (Putra)</option>
            <option value="Perempuan" ${a.gender === 'Perempuan' ? 'selected' : ''}>Perempuan (Putri)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Tanggal Lahir *</label>
          <input type="date" id="atl-dob" value="${escapeHtml(a.tanggalLahir)}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kelas Pembinaan</label>
          <select id="atl-kelas" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            ${AppState.classes.map(c => `<option value="${c.id}" ${c.id === a.kelasId ? 'selected' : ''}>${escapeHtml(c.namaKelas)}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Status Keaktifan</label>
          <select id="atl-status" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="Aktif" ${a.status === 'Aktif' ? 'selected' : ''}>Aktif</option>
            <option value="Cuti" ${a.status === 'Cuti' ? 'selected' : ''}>Cuti</option>
            <option value="Alumni" ${a.status === 'Alumni' ? 'selected' : ''}>Alumni</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Tinggi Badan (cm)</label>
          <input type="number" id="atl-height" value="${a.tinggiBadanCm || 155}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Berat Badan (kg)</label>
          <input type="number" id="atl-weight" value="${a.beratBadanKg || 45}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Nama Orang Tua / Wali</label>
          <input type="text" id="atl-wali" value="${escapeHtml(a.namaWali || '')}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kontak WhatsApp Wali</label>
          <input type="text" id="atl-kontak" value="${escapeHtml(a.kontakWali || '')}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Foto Atlet URL</label>
        <input type="text" id="atl-foto" value="${escapeHtml(a.fotoUrl || '')}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 text-xs" />
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all">Perbarui Atlet</button>
      </div>
    </form>
  `;
  openModal(`Edit Data Atlet: ${a.nama}`, formHtml);
}

function handleSaveAthlete(e) {
  e.preventDefault();
  const dob = document.getElementById('atl-dob').value;
  const newAthlete = {
    id: `atl-${Date.now()}`,
    nis: document.getElementById('atl-nis').value,
    nama: document.getElementById('atl-nama').value,
    gender: document.getElementById('atl-gender').value,
    tanggalLahir: dob,
    kelompokUmur: determineKelompokUmur(dob),
    kelasId: document.getElementById('atl-kelas').value,
    status: document.getElementById('atl-status').value,
    tinggiBadanCm: parseFloat(document.getElementById('atl-height').value) || 155,
    beratBadanKg: parseFloat(document.getElementById('atl-weight').value) || 45,
    namaWali: document.getElementById('atl-wali').value,
    kontakWali: document.getElementById('atl-kontak').value,
    fotoUrl: document.getElementById('atl-foto').value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tanggalBergabung: new Date().toISOString().split('T')[0],
  };

  AppState.athletes.push(newAthlete);
  saveState('athletes', AppState.athletes);
  closeModal();
  showToast(`Atlet ${newAthlete.nama} berhasil ditambahkan!`);
  renderApp();
}

function handleUpdateAthlete(e, id) {
  e.preventDefault();
  const athlete = AppState.athletes.find(a => a.id === id);
  if (!athlete) return;

  const dob = document.getElementById('atl-dob').value;
  athlete.nis = document.getElementById('atl-nis').value;
  athlete.nama = document.getElementById('atl-nama').value;
  athlete.gender = document.getElementById('atl-gender').value;
  athlete.tanggalLahir = dob;
  athlete.kelompokUmur = determineKelompokUmur(dob);
  athlete.kelasId = document.getElementById('atl-kelas').value;
  athlete.status = document.getElementById('atl-status').value;
  athlete.tinggiBadanCm = parseFloat(document.getElementById('atl-height').value) || 155;
  athlete.beratBadanKg = parseFloat(document.getElementById('atl-weight').value) || 45;
  athlete.namaWali = document.getElementById('atl-wali').value;
  athlete.kontakWali = document.getElementById('atl-kontak').value;
  athlete.fotoUrl = document.getElementById('atl-foto').value;

  saveState('athletes', AppState.athletes);
  closeModal();
  showToast(`Data atlet ${athlete.nama} berhasil diperbarui!`);
  renderApp();
}

// 2. ADD / EDIT RECORD MODAL
function openAddRecordModal() {
  const formHtml = `
    <form id="record-form" onsubmit="handleSaveRecord(event)" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Pilih Atlet Perenang *</label>
        <select id="rec-athlete" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
          ${AppState.athletes.map(a => `<option value="${a.id}">${escapeHtml(a.nama)} (${a.kelompokUmur})</option>`).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Gaya Renang *</label>
          <select id="rec-stroke" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="Gaya Bebas">Gaya Bebas (Freestyle)</option>
            <option value="Gaya Dada">Gaya Dada (Breaststroke)</option>
            <option value="Gaya Punggung">Gaya Punggung (Backstroke)</option>
            <option value="Gaya Kupu-Kupu">Gaya Kupu-Kupu (Butterfly)</option>
            <option value="Gaya Ganti">Gaya Ganti (IM)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Nomor Jarak *</label>
          <select id="rec-distance" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="25m">25 Meter (Sprint)</option>
            <option value="50m" selected>50 Meter</option>
            <option value="100m">100 Meter</option>
            <option value="200m">200 Meter</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Waktu (detik / mm:ss.xx) *</label>
          <input type="text" id="rec-time" required placeholder="Contoh: 26.50 atau 01:05.20" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono font-bold outline-none focus:border-cyan-400" />
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Tipe Kolam</label>
          <select id="rec-pool" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400">
            <option value="50m">Olympic Pool (50m LCM)</option>
            <option value="25m">Short Course (25m SCM)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Ajang / Sesi Latihan *</label>
          <input type="text" id="rec-event" required value="Time Trial Internal Sansinoz" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Tanggal *</label>
          <input type="date" id="rec-date" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Catatan Tambahan Coach</label>
        <input type="text" id="rec-notes" placeholder="Contoh: Streamline rapi, breakout bagus..." class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="flex items-center space-x-2 pt-1">
        <input type="checkbox" id="rec-pb" class="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700" />
        <label for="rec-pb" class="text-xs font-bold text-amber-300 cursor-pointer">Tandai sebagai Personal Best (PB)</label>
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all">Simpan Time Trial</button>
      </div>
    </form>
  `;
  openModal('Input Catatan Waktu Baru', formHtml);
}

function handleSaveRecord(e) {
  e.preventDefault();
  const rawTime = document.getElementById('rec-time').value;
  const timeInSec = parseTimeToSeconds(rawTime);

  const newRecord = {
    id: `tr-${Date.now()}`,
    athleteId: document.getElementById('rec-athlete').value,
    stroke: document.getElementById('rec-stroke').value,
    distance: document.getElementById('rec-distance').value,
    poolLength: document.getElementById('rec-pool').value,
    timeInSeconds: timeInSec,
    timeFormatted: formatTime(timeInSec),
    namaAjang: document.getElementById('rec-event').value,
    tanggal: document.getElementById('rec-date').value,
    catatan: document.getElementById('rec-notes').value,
    isPersonalBest: document.getElementById('rec-pb').checked,
  };

  AppState.records.unshift(newRecord);
  saveState('records', AppState.records);
  closeModal();
  showToast('Catatan waktu berhasil disimpan!');
  renderApp();
}

// 3. ADD CLASS MODAL
function openAddClassModal() {
  const formHtml = `
    <form id="class-form" onsubmit="handleSaveClass(event)" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Nama Kelas Pembinaan *</label>
        <input type="text" id="cls-name" required placeholder="Contoh: Kelas Junior Sprint" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kode Room *</label>
          <input type="text" id="cls-code" required placeholder="ROOM-101" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kapasitas Maksimal</label>
          <input type="number" id="cls-capacity" value="20" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Ruang / Lintasan Kolam</label>
        <input type="text" id="cls-room" placeholder="Room Alpha - Lintasan 1 & 2" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Head Coach *</label>
          <input type="text" id="cls-coach" required placeholder="Coach Doni Setiawan" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Asisten Coach</label>
          <input type="text" id="cls-asst" placeholder="Coach Rian" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Jadwal Latihan</label>
        <input type="text" id="cls-schedule" placeholder="Senin, Rabu, Jumat (16:00 - 18:00 WIB)" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Fokus Materi Latihan</label>
        <textarea id="cls-focus" rows="2" placeholder="Fokus teknik 4 gaya renang & cadence..." class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"></textarea>
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all">Simpan Kelas</button>
      </div>
    </form>
  `;
  openModal('Tambah Kelas & Room Baru', formHtml);
}

function handleSaveClass(e) {
  e.preventDefault();
  const newClass = {
    id: `cls-${Date.now()}`,
    namaKelas: document.getElementById('cls-name').value,
    kodeRoom: document.getElementById('cls-code').value,
    kapasitasMaksimal: parseInt(document.getElementById('cls-capacity').value) || 20,
    ruangPembagian: document.getElementById('cls-room').value,
    headCoach: document.getElementById('cls-coach').value,
    asistenCoach: document.getElementById('cls-asst').value,
    jadwalLatihan: document.getElementById('cls-schedule').value,
    fokusLatihan: document.getElementById('cls-focus').value,
    fotoCoachUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  };

  AppState.classes.push(newClass);
  saveState('classes', AppState.classes);
  closeModal();
  showToast(`Kelas ${newClass.namaKelas} berhasil ditambahkan!`);
  renderApp();
}

// 4. ADD MEDAL MODAL
function openAddMedalModal() {
  const formHtml = `
    <form id="medal-form" onsubmit="handleSaveMedal(event)" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Pilih Atlet Peraih Medali *</label>
        <select id="med-athlete" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
          ${AppState.athletes.map(a => `<option value="${a.id}">${escapeHtml(a.nama)} (${a.kelompokUmur})</option>`).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Jenis Medali *</label>
          <select id="med-type" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-bold outline-none focus:border-cyan-400">
            <option value="Emas">🥇 Emas (Gold)</option>
            <option value="Perak">🥈 Perak (Silver)</option>
            <option value="Perunggu">🥉 Perunggu (Bronze)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Tanggal Kejuaraan *</label>
          <input type="date" id="med-date" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Nama Kejuaraan / Turnamen *</label>
        <input type="text" id="med-event" required placeholder="Contoh: Kejurda Jawa Barat 2026" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Gaya Renang *</label>
          <select id="med-stroke" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="Gaya Bebas">Gaya Bebas</option>
            <option value="Gaya Dada">Gaya Dada</option>
            <option value="Gaya Punggung">Gaya Punggung</option>
            <option value="Gaya Kupu-Kupu">Gaya Kupu-Kupu</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Nomor Jarak *</label>
          <select id="med-distance" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="25m">25 Meter</option>
            <option value="50m" selected>50 Meter</option>
            <option value="100m">100 Meter</option>
            <option value="200m">200 Meter</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Catatan Waktu Raihan</label>
        <input type="text" id="med-time" placeholder="26.50" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-cyan-400" />
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition-all">Simpan Medali</button>
      </div>
    </form>
  `;
  openModal('Tambah Medali Kejuaraan', formHtml);
}

function handleSaveMedal(e) {
  e.preventDefault();
  const athleteId = document.getElementById('med-athlete').value;
  const athlete = AppState.athletes.find(a => a.id === athleteId);

  const newMedal = {
    id: `med-${Date.now()}`,
    athleteId: athleteId,
    medali: document.getElementById('med-type').value,
    kejuaraan: document.getElementById('med-event').value,
    tanggal: document.getElementById('med-date').value,
    stroke: document.getElementById('med-stroke').value,
    distance: document.getElementById('med-distance').value,
    kelompokUmur: athlete ? athlete.kelompokUmur : 'KU II',
    catatanWaktu: document.getElementById('med-time').value || '-',
  };

  AppState.medals.unshift(newMedal);
  saveState('medals', AppState.medals);
  closeModal();
  showToast(`Medali berhasil dicatat untuk ${athlete ? athlete.nama : 'atlet'}!`);
  renderApp();
}

// 5. ADD EVALUATION MODAL
function openAddEvaluationModal() {
  const formHtml = `
    <form id="eval-form" onsubmit="handleSaveEvaluation(event)" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Pilih Atlet *</label>
        <select id="eval-athlete" required class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
          ${AppState.athletes.map(a => `<option value="${a.id}">${escapeHtml(a.nama)} (${a.kelompokUmur})</option>`).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Tanggal Evaluasi *</label>
          <input type="date" id="eval-date" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">Rating Endurance</label>
          <select id="eval-rating" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
            <option value="Luar Biasa">Luar Biasa (Elite)</option>
            <option value="Sangat Baik" selected>Sangat Baik</option>
            <option value="Baik">Baik</option>
            <option value="Cukup">Cukup (Perlu Ditingkatkan)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-2">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kehadiran (%)</label>
          <input type="number" id="eval-presence" value="95" min="0" max="100" class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Stamina (0-100)</label>
          <input type="number" id="eval-stamina" value="90" min="0" max="100" class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Start (1-10)</label>
          <input type="number" id="eval-start" value="9" min="1" max="10" class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Flip Turn (1-10)</label>
          <input type="number" id="eval-turn" value="8" min="1" max="10" class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-center" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Catatan Evaluasi Coach</label>
        <textarea id="eval-notes" rows="2" placeholder="Evaluasi ritme kayuhan, dorongan kaki..." class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"></textarea>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Target Milestone Berikutnya</label>
        <input type="text" id="eval-target" placeholder="Contoh: Menembus 25 detik pada 50m gaya bebas..." class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all">Simpan Evaluasi</button>
      </div>
    </form>
  `;
  openModal('Buat Evaluasi Atlet', formHtml);
}

function handleSaveEvaluation(e) {
  e.preventDefault();
  const newEval = {
    id: `eval-${Date.now()}`,
    athleteId: document.getElementById('eval-athlete').value,
    tanggalEvaluasi: document.getElementById('eval-date').value,
    enduranceRating: document.getElementById('eval-rating').value,
    kehadiranPersen: parseInt(document.getElementById('eval-presence').value) || 90,
    skorStamina: parseInt(document.getElementById('eval-stamina').value) || 85,
    teknikStartReaction: parseInt(document.getElementById('eval-start').value) || 8,
    teknikFlipTurn: parseInt(document.getElementById('eval-turn').value) || 8,
    catatanCoach: document.getElementById('eval-notes').value,
    targetBerikutnya: document.getElementById('eval-target').value,
  };

  AppState.evaluations.unshift(newEval);
  saveState('evaluations', AppState.evaluations);
  closeModal();
  showToast('Evaluasi atlet berhasil disimpan!');
  renderApp();
}

// 6. ADD USER MODAL
function openAddUserModal() {
  const formHtml = `
    <form id="user-form" onsubmit="handleSaveUser(event)" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Nama Pengguna *</label>
        <input type="text" id="usr-name" required placeholder="Coach / Admin / Wali" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Peran / Role Akses *</label>
        <select id="usr-role" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 outline-none focus:border-cyan-400">
          <option value="Head Coach Utama">Head Coach Utama</option>
          <option value="Administrator Club">Administrator Club</option>
          <option value="Orang Tua / Atlet">Orang Tua / Atlet</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Email *</label>
          <input type="email" id="usr-email" required placeholder="user@sansinoz.com" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Password *</label>
          <input type="text" id="usr-pass" required value="pass2026" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
      </div>

      <div>
        <label class="block text-slate-400 font-bold mb-1">Kunci Akses Unik (Access Key)</label>
        <input type="text" id="usr-key" value="KEY-${Date.now().toString().slice(-4)}" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold outline-none focus:border-cyan-400" />
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all">Simpan Akun</button>
      </div>
    </form>
  `;
  openModal('Tambah Akun Pengguna', formHtml);
}

function handleSaveUser(e) {
  e.preventDefault();
  const newUser = {
    id: `usr-${Date.now()}`,
    name: document.getElementById('usr-name').value,
    role: document.getElementById('usr-role').value,
    email: document.getElementById('usr-email').value,
    password: document.getElementById('usr-pass').value,
    accessKey: document.getElementById('usr-key').value,
    status: 'Aktif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tanggalDibuat: new Date().toISOString().split('T')[0],
  };

  AppState.userAccounts.push(newUser);
  saveState('userAccounts', AppState.userAccounts);
  closeModal();
  showToast(`Akun ${newUser.name} berhasil dibuat!`);
  renderApp();
}

// 7. ADD AL-FATIH STUDENT MODAL
function openAddAlFatihStudentModal() {
  const formHtml = `
    <form id="alfatih-form" onsubmit="handleSaveAlFatihStudent(event)" class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-400 font-bold mb-1">Nama Siswa *</label>
        <input type="text" id="af-nama" required placeholder="Contoh: Muhammad Umar Al-Fatih" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">NISN</label>
          <input type="text" id="af-nisn" placeholder="0123456789" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kelas Sekolah</label>
          <input type="text" id="af-kelas" placeholder="Kelas 4 Al-Farabi" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-400 font-bold mb-1">Nama Orang Tua</label>
          <input type="text" id="af-wali" placeholder="Bpk. Abdullah" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label class="block text-slate-400 font-bold mb-1">Kontak Orang Tua</label>
          <input type="text" id="af-kontak" placeholder="0812-xxxx-xxxx" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono" />
        </div>
      </div>

      <div class="pt-4 border-t border-slate-800 flex justify-end space-x-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Batal</button>
        <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all">Simpan Siswa Al-Fatih</button>
      </div>
    </form>
  `;
  openModal('Tambah Siswa Ekskul Al-Fatih', formHtml);
}

function handleSaveAlFatihStudent(e) {
  e.preventDefault();
  const newStudent = {
    id: `alfatih-${Date.now()}`,
    nama: document.getElementById('af-nama').value,
    nisn: document.getElementById('af-nisn').value || '-',
    kelasSekolah: document.getElementById('af-kelas').value || 'Kelas Al-Fatih',
    namaOrangTua: document.getElementById('af-wali').value || '-',
    kontakOrangTua: document.getElementById('af-kontak').value || '-',
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    medali: { emas: 0, perak: 0, perunggu: 0, daftar: [] },
    statusCapaian25m: { gayaBebas: false, gayaDada: false, gayaPunggung: false, gayaKupu: false },
    waktu25m: { gayaBebas: '-', gayaDada: '-', gayaPunggung: '-', gayaKupu: '-' },
    penilaian: {
      mengapung: 'A',
      menendang: 'B',
      gerakanTangan: 'B',
      teknikBernapas: 'B',
      target25mBebas: 'B',
      target25mDada: 'C',
      predikatAkhir: 'B',
      catatanGuru: 'Siswa baru bergabung dalam pembinaan aquatics.',
    },
    tanggalMulai: new Date().toISOString().split('T')[0],
  };

  AppState.alfatihStudents.push(newStudent);
  saveState('alfatihStudents', AppState.alfatihStudents);
  closeModal();
  showToast(`Siswa ${newStudent.nama} berhasil didaftarkan!`);
  renderApp();
}
