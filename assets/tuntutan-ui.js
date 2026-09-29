(function () {
  'use strict';

  const core = window.PPDK_TUNTUTAN_CORE;
  const positions = window.PPDK_OFFICER_POSITIONS;

  if (!core || !positions) {
    console.error('[Tuntutan] Modul core/jawatan tidak tersedia.');
    return;
  }

  const state = {
    initialized: false,
    loading: false,
    loadedKey: '',
    preview: null,
    baris: [],
    modTapis: 'isd',
    signatures: {
      penyedia: { nama: '', tarikh: '' },
      penyemak: { nama: '', tarikh: '' },
      pengesah: { nama: '', tarikh: '' }
    },
    generated: false,
    dirty: false,
    manualSeq: 0
  };

  function el(id) { return document.getElementById(id); }
  function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>'"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c];
    });
  }
  function toast(message, type, subtext) {
    if (typeof window.showToast === 'function') window.showToast(message, type || 'success', subtext || '');
    else console[type === 'error' ? 'error' : 'log']('[Tuntutan]', message, subtext || '');
  }
  function token_() {
    if (typeof window.token_ === 'function') return window.token_();
    try { return localStorage.getItem('jtkAdminToken') || ''; } catch (e) { return ''; }
  }
  function rpc(method, payload) {
    return new Promise(function (resolve, reject) {
      const runner = window.google && window.google.script && window.google.script.run;
      if (!runner) return reject(new Error('Jambatan RPC admin tidak tersedia.'));
      runner.withSuccessHandler(resolve).withFailureHandler(reject)[method](token_(), payload || {});
    });
  }
  function unique(values) { return core.uniqueKeepOrder(values || []); }
  function normalizeName(value) { return String(value || '').trim(); }
  function rowKey(row) {
    if (row.manual) return 'manual:' + String(row._manualId || row.bil || '');
    if (row.noIsd) return 'isd:' + row.noIsd + '|' + String(row.sekolah || '').toUpperCase();
    return 'records:' + (row.laporanIds || []).slice().sort().join(',');
  }

  function officerZones_() {
    return window.PPDK_DATA && window.PPDK_DATA.filters && window.PPDK_DATA.filters.officersByZone ? window.PPDK_DATA.filters.officersByZone : {};
  }
  function officialOfficers_() {
    const zones = officerZones_();
    const ordered = [];
    const zone4 = zones['ZON 4'] || [];
    zone4.forEach(function (name) { if (positions.get(name)) ordered.push(name); });
    Object.keys(zones).forEach(function (zone) {
      if (zone === 'ZON 4') return;
      (zones[zone] || []).forEach(function (name) { if (positions.get(name)) ordered.push(name); });
    });
    return unique(ordered);
  }
  function officerOptions_(selected, includeBlank) {
    const zones = officerZones_();
    const all = officialOfficers_();
    const zone4Set = new Set(zones['ZON 4'] || []);
    let html = includeBlank ? '<option value="">Pilih pegawai…</option>' : '';
    html += '<optgroup label="ZON 4">';
    all.filter(function (name) { return zone4Set.has(name); }).forEach(function (name) {
      html += '<option value="' + esc(name) + '"' + (name === selected ? ' selected' : '') + '>' + esc(name) + '</option>';
    });
    html += '</optgroup><optgroup label="Pegawai lain">';
    all.filter(function (name) { return !zone4Set.has(name); }).forEach(function (name) {
      html += '<option value="' + esc(name) + '"' + (name === selected ? ' selected' : '') + '>' + esc(name) + '</option>';
    });
    html += '</optgroup>';
    return html;
  }

  function populateFilters_() {
    const now = new Date();
    const yearSelect = el('tuntutanTahun');
    const monthSelect = el('tuntutanBulan');
    if (!yearSelect || !monthSelect) return;
    const currentYear = now.getFullYear();
    let years = '';
    for (let year = currentYear; year >= Math.max(2022, currentYear - 6); year -= 1) {
      years += '<option value="' + year + '">' + year + '</option>';
    }
    yearSelect.innerHTML = years;
    yearSelect.value = String(currentYear);
    monthSelect.innerHTML = core.MONTHS_MS.map(function (name, index) {
      return '<option value="' + (index + 1) + '">' + esc(name) + '</option>';
    }).join('');
    monthSelect.value = String(now.getMonth() + 1);
    const bulk = el('tuntutanBulkOfficer');
    if (bulk) bulk.innerHTML = officerOptions_('', true);
  }

  function currentFilter_() {
    return {
      tahun: Number(el('tuntutanTahun').value),
      bulan: Number(el('tuntutanBulan').value),
      zon: 'ZON 4',
      modTapis: el('tuntutanIsdOnly').checked ? 'isd' : 'semua'
    };
  }

  function setBusy_(busy, text) {
    state.loading = busy;
    const badge = el('tuntutanStateBadge');
    if (badge) badge.textContent = text || (busy ? 'Memuatkan…' : (state.dirty ? 'Draf belum disimpan' : 'Sedia'));
    ['tuntutanMuatBtn', 'tuntutanSimpanBtn', 'tuntutanTambahManualBtn'].forEach(function (id) {
      const node = el(id); if (node) node.disabled = busy;
    });
  }

  function cloneRow_(row) {
    return {
      bil: Number(row.bil || 0),
      sumber: row.sumber === 'MEMO' ? 'MEMO' : 'ISD',
      noIsd: String(row.noIsd || '').replace(/^#/, '').trim(),
      keterangan: String(row.keterangan || '').trim(),
      tarikh: core.uniqueSortedDates(row.tarikh || []),
      sekolah: String(row.sekolah || '').trim(),
      pegawai: unique(Array.isArray(row.pegawai) ? row.pegawai : core.splitOfficers(row.pegawai)),
      pegawaiTuntutan: String(row.pegawaiTuntutan || '').trim(),
      laporanIds: unique(row.laporanIds || []),
      manual: Boolean(row.manual),
      dikecualikan: Boolean(row.dikecualikan),
      amaranSekolah: Boolean(row.amaranSekolah),
      sekolahAlternatif: unique(row.sekolahAlternatif || []),
      semakPelbagaiIsd: Boolean(row.semakPelbagaiIsd),
      _manualId: row._manualId || ''
    };
  }

  function mergeFreshRows_(freshRows, previousRows) {
    const previous = new Map();
    (previousRows || []).forEach(function (row) { previous.set(rowKey(row), cloneRow_(row)); });
    const merged = (freshRows || []).map(function (fresh) {
      const next = cloneRow_(fresh);
      const old = previous.get(rowKey(next));
      if (!old) return next;
      next.pegawaiTuntutan = old.pegawaiTuntutan;
      next.dikecualikan = old.dikecualikan;
      return next;
    });
    (previousRows || []).filter(function (row) { return row.manual; }).forEach(function (manual) {
      merged.push(cloneRow_(manual));
    });
    return merged;
  }

  function applyDraft_(draftData, freshRows) {
    if (!draftData || !Array.isArray(draftData.baris)) return freshRows.map(cloneRow_);
    state.modTapis = draftData.modTapis === 'semua' ? 'semua' : 'isd';
    el('tuntutanIsdOnly').checked = state.modTapis === 'isd';
    state.signatures.penyedia = Object.assign({ nama: '', tarikh: '' }, draftData.penyedia || {});
    state.signatures.penyemak = Object.assign({ nama: '', tarikh: '' }, draftData.penyemak || {});
    state.signatures.pengesah = Object.assign({ nama: '', tarikh: '' }, draftData.pengesah || {});
    return draftData.baris.map(cloneRow_);
  }

  async function load_(options) {
    options = options || {};
    if (state.loading) return;
    const filter = currentFilter_();
    const key = [filter.tahun, filter.bulan, filter.zon, filter.modTapis].join('|');
    if (!options.force && state.loadedKey === key && state.preview) {
      renderAll_();
      return;
    }
    setBusy_(true, 'Memuatkan rekod…');
    const previousRows = options.preserve ? state.baris.map(cloneRow_) : [];
    try {
      const results = await Promise.all([
        rpc('adminTuntutanPratonton', filter),
        rpc('adminTuntutanDapatDraf', filter)
      ]);
      const preview = results[0];
      const draftResult = results[1];
      if (!preview || !preview.ok) throw new Error(preview && preview.error ? preview.error : 'Pratonton tuntutan gagal dimuatkan.');
      state.preview = preview;
      state.modTapis = filter.modTapis;
      if (options.preserve && previousRows.length) {
        state.baris = mergeFreshRows_(preview.baris || [], previousRows);
      } else if (draftResult && draftResult.ok && draftResult.draft && draftResult.draft.data) {
        state.baris = applyDraft_(draftResult.draft.data, preview.baris || []);
      } else {
        state.baris = (preview.baris || []).map(cloneRow_);
      }
      state.loadedKey = [filter.tahun, filter.bulan, filter.zon, state.modTapis].join('|');
      state.generated = false;
      state.dirty = false;
      renderAll_();
      setBusy_(false, (draftResult && draftResult.draft) ? 'Draf tersimpan dimuatkan' : 'Data semakan dimuatkan');
    } catch (error) {
      setBusy_(false, 'Gagal memuatkan');
      toast(error.message || String(error), 'error');
    }
  }

  function syncSignaturesFromDom_() {
    state.signatures.penyedia = { nama: el('tuntutanPenyediaNama').value.trim(), tarikh: el('tuntutanPenyediaTarikh').value };
    state.signatures.penyemak = { nama: el('tuntutanPenyemakNama').value.trim(), tarikh: el('tuntutanPenyemakTarikh').value };
    state.signatures.pengesah = { nama: el('tuntutanPengesahNama').value.trim(), tarikh: el('tuntutanPengesahTarikh').value };
  }

  function syncRowsFromDom_() {
    document.querySelectorAll('#tuntutanReviewBody tr[data-row-index]').forEach(function (tr) {
      const index = Number(tr.dataset.rowIndex);
      const row = state.baris[index];
      if (!row) return;
      const noIsd = tr.querySelector('[data-field="noIsd"]');
      const keterangan = tr.querySelector('[data-field="keterangan"]');
      const dates = tr.querySelector('[data-field="tarikh"]');
      const school = tr.querySelector('[data-field="sekolah"]');
      const officers = tr.querySelector('[data-field="pegawai"]');
      const claimant = tr.querySelector('[data-field="pegawaiTuntutan"]');
      const excluded = tr.querySelector('[data-field="dikecualikan"]');
      if (noIsd) row.noIsd = noIsd.value.replace(/[^0-9]/g, '').slice(0, 6);
      if (keterangan) row.keterangan = keterangan.value.trim();
      if (dates) row.tarikh = core.uniqueSortedDates(dates.value.split(/[\n,;]+/));
      if (school) row.sekolah = school.value.trim();
      if (officers) row.pegawai = unique(officers.value.split(',').map(function (v) { return v.trim(); }).filter(Boolean));
      if (claimant) row.pegawaiTuntutan = claimant.value;
      if (excluded) row.dikecualikan = excluded.checked;
    });
    syncSignaturesFromDom_();
  }

  function draftData_() {
    syncRowsFromDom_();
    renumberRows_();
    return {
      modTapis: state.modTapis,
      baris: state.baris.map(function (row) {
        const copy = cloneRow_(row);
        delete copy._manualId;
        return copy;
      }),
      penyedia: Object.assign({}, state.signatures.penyedia),
      penyemak: Object.assign({}, state.signatures.penyemak),
      pengesah: Object.assign({}, state.signatures.pengesah)
    };
  }

  async function saveDraft_(status, silent) {
    if (!state.preview) return toast('Muatkan rekod tuntutan dahulu.', 'error');
    const filter = currentFilter_();
    try {
      const result = await rpc('adminTuntutanSimpanDraf', {
        tahun: filter.tahun,
        bulan: filter.bulan,
        zon: 'ZON 4',
        status: status === 'siap' ? 'siap' : 'draf',
        data: draftData_()
      });
      if (!result || !result.ok) throw new Error(result && result.error ? result.error : 'Draf gagal disimpan.');
      state.dirty = false;
      const badge = el('tuntutanStateBadge');
      if (badge) badge.textContent = status === 'siap' ? 'Siap · tersimpan' : 'Draf tersimpan';
      if (!silent) toast(result.message || 'Draf tuntutan berjaya disimpan.', 'success');
    } catch (error) {
      toast(error.message || String(error), 'error');
      throw error;
    }
  }

  function renumberRows_() {
    state.baris.sort(function (a, b) {
      const ad = (a.tarikh && a.tarikh[0]) || '9999-99-99';
      const bd = (b.tarikh && b.tarikh[0]) || '9999-99-99';
      return ad.localeCompare(bd) || String(a.noIsd || '').localeCompare(String(b.noIsd || ''));
    });
    state.baris.forEach(function (row, index) { row.bil = index + 1; });
  }

  function addManualRow_() {
    if (!state.preview) return toast('Muatkan rekod tuntutan dahulu.', 'error');
    syncRowsFromDom_();
    state.manualSeq += 1;
    state.baris.push({
      bil: state.baris.length + 1,
      sumber: 'ISD',
      noIsd: '',
      keterangan: '',
      tarikh: [],
      sekolah: '',
      pegawai: [],
      pegawaiTuntutan: '',
      laporanIds: [],
      manual: true,
      dikecualikan: false,
      amaranSekolah: false,
      sekolahAlternatif: [],
      semakPelbagaiIsd: false,
      _manualId: String(Date.now()) + '-' + state.manualSeq
    });
    state.dirty = true;
    renderAll_();
  }

  async function suggestDescriptions_() {
    if (!state.preview) return toast('Muatkan rekod tuntutan dahulu.', 'error');
    syncRowsFromDom_();
    const byId = new Map(((state.preview && state.preview.records) || []).map(function (record) { return [record.id, record]; }));
    const items = [];
    const seen = new Set();
    state.baris.forEach(function (row) {
      if (row.manual || row.dikecualikan) return;
      (row.laporanIds || []).forEach(function (laporanId) {
        if (seen.has(laporanId)) return;
        const record = byId.get(laporanId);
        if (!record) return;
        seen.add(laporanId);
        items.push({
          laporanId: laporanId,
          objektif: record.objektif || record.keterangan || '',
          title: record.title || '',
          namaSekolah: record.nama_sekolah || row.sekolah || '',
          noIsd: row.noIsd || ''
        });
      });
    });
    if (!items.length) return toast('Tiada rekod sumber untuk cadangan keterangan.', 'error');

    const button = el('tuntutanCadangKeteranganBtn');
    const originalText = button ? button.textContent : '';
    if (button) { button.disabled = true; button.textContent = 'Mencadang…'; }
    try {
      const result = await rpc('adminTuntutanCadangKeterangan', { items: items });
      if (!result || !result.ok) throw new Error(result && result.error ? result.error : 'Cadangan AI gagal.');
      const suggestions = new Map((result.cadangan || []).map(function (item) {
        return [String(item.laporanId || ''), String(item.cadangan || '').trim()];
      }));
      let applied = 0;
      state.baris.forEach(function (row) {
        if (row.manual || row.dikecualikan) return;
        let suggestion = '';
        (row.laporanIds || []).some(function (laporanId) {
          suggestion = suggestions.get(String(laporanId)) || '';
          return Boolean(suggestion);
        });
        if (!suggestion) return;
        row.keterangan = suggestion;
        applied += 1;
      });
      if (applied > 0) {
        state.dirty = true;
        state.generated = false;
        renderAll_();
      }
      if (result.aiAvailable === false || result.warning) {
        toast(result.warning || 'Cadangan AI tidak tersedia. Medan keterangan kekal boleh ditaip.', 'error');
      } else {
        toast(applied + ' cadangan keterangan diisi. Semak dan edit sebelum menyimpan baris.', 'success');
      }
    } catch (error) {
      toast('Cadangan AI tidak tersedia. Medan keterangan kekal boleh ditaip.', 'error', error.message || String(error));
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText || 'Cadang Keterangan (AI)'; }
    }
  }

  async function saveSourceRow_(index) {
    syncRowsFromDom_();
    const row = state.baris[index];
    if (!row) return;
    if (row.manual) {
      state.dirty = true;
      renderAll_();
      return toast('Baris manual dikemas kini dalam draf. Tekan Simpan Draf untuk menyimpan.', 'success');
    }
    if (!row.laporanIds.length) return toast('Baris ini tiada rekod sumber untuk ditulis balik.', 'error');
    if (row.noIsd && !/^\d{6}$/.test(row.noIsd)) return toast('No. ISD mesti 6 digit.', 'error');
    if (!row.sekolah) return toast('Nama sekolah diperlukan.', 'error');
    if (!row.keterangan) return toast('Keterangan tugas diperlukan.', 'error');

    const records = (state.preview.records || []).filter(function (record) { return row.laporanIds.indexOf(record.id) !== -1; }).sort(function (a, b) {
      return String(a.tarikh_iso || '').localeCompare(String(b.tarikh_iso || '')) || String(a.id).localeCompare(String(b.id));
    });
    const originalDates = core.uniqueSortedDates(records.map(function (record) { return record.tarikh_iso; }));
    const newDates = core.uniqueSortedDates(row.tarikh);
    const dateChanged = originalDates.join('|') !== newDates.join('|');
    let dateMap = null;
    if (dateChanged) {
      if (newDates.length === records.length) dateMap = newDates;
      else if (newDates.length === 1) dateMap = records.map(function () { return newDates[0]; });
      else return toast('Bilangan tarikh baharu tidak boleh dipadankan dengan rekod sumber. Untuk hari tambahan, guna Baris Manual dengan No. ISD yang sama.', 'error');
    }

    try {
      for (let i = 0; i < records.length; i += 1) {
        const payload = { id: records[i].id, noIsd: row.noIsd, sekolah: row.sekolah, keterangan: row.keterangan };
        if (dateMap) payload.tarikhIso = dateMap[i];
        const result = await rpc('adminTuntutanKemaskiniIsd', payload);
        if (!result || !result.ok) throw new Error(result && result.error ? result.error : 'Rekod sumber gagal dikemas kini.');
      }
      toast('Pembetulan ditulis balik ke rekod laporan.', 'success');
      await load_({ force: true, preserve: true });
    } catch (error) {
      toast(error.message || String(error), 'error');
    }
  }

  async function fillMissingIsd_(recordId, inputId) {
    const input = el(inputId);
    const noIsd = input ? input.value.replace(/[^0-9]/g, '').slice(0, 6) : '';
    if (!/^\d{6}$/.test(noIsd)) return toast('Masukkan No. ISD 6 digit.', 'error');
    try {
      const result = await rpc('adminTuntutanKemaskiniIsd', { id: recordId, noIsd: noIsd });
      if (!result || !result.ok) throw new Error(result && result.error ? result.error : 'No. ISD gagal disimpan.');
      toast('No. ISD disimpan ke rekod laporan.', 'success');
      await load_({ force: true, preserve: true });
    } catch (error) { toast(error.message || String(error), 'error'); }
  }

  function excludeMissing_(recordId) {
    syncRowsFromDom_();
    const row = state.baris.find(function (item) { return !item.noIsd && item.laporanIds.indexOf(recordId) !== -1; });
    if (!row) return toast('Baris tanpa ISD tidak ditemui dalam mod semasa.', 'error');
    row.dikecualikan = true;
    state.dirty = true;
    renderAll_();
  }

  function removeManual_(index) {
    if (!state.baris[index] || !state.baris[index].manual) return;
    state.baris.splice(index, 1);
    state.dirty = true;
    renderAll_();
  }

  function renderReviewTable_() {
    renumberRows_();
    const body = el('tuntutanReviewBody');
    if (!body) return;
    if (!state.baris.length) {
      body.innerHTML = '<tr><td colspan="7" class="tuntutan-empty">Tiada baris tuntutan untuk penapis ini.</td></tr>';
      return;
    }
    body.innerHTML = state.baris.map(function (row, index) {
      const assignedText = (row.pegawai || []).join(', ');
      const flags = [];
      if (row.manual) flags.push('Manual');
      if (row.semakPelbagaiIsd) flags.push('Semak: beberapa ISD');
      if (row.amaranSekolah) flags.push('Semak: lebih satu sekolah');
      const noIsdLabel = row.noIsd ? row.noIsd : 'TIADA ISD';
      const disabledClaim = row.dikecualikan ? ' disabled' : '';
      return '<tr data-row-index="' + index + '"' + (row.dikecualikan ? ' class="tuntutan-row-excluded"' : '') + '>' +
        '<td class="tuntutan-doc-center"><strong>' + (index + 1) + '</strong></td>' +
        '<td><div class="tuntutan-row-stack">' +
          '<input data-field="noIsd" inputmode="numeric" maxlength="6" value="' + esc(row.noIsd) + '" placeholder="6 digit">' +
          '<textarea data-field="keterangan" rows="2" placeholder="Keterangan ringkas tugas">' + esc(row.keterangan) + '</textarea>' +
          '<div class="tuntutan-row-meta">' + esc(noIsdLabel) + (flags.length ? ' · ' + esc(flags.join(' · ')) : '') + '</div>' +
        '</div></td>' +
        '<td><textarea data-field="tarikh" rows="2" placeholder="YYYY-MM-DD, YYYY-MM-DD">' + esc((row.tarikh || []).join(', ')) + '</textarea><div class="tuntutan-row-meta">' + esc(core.formatDateLines(row.tarikh || []).join(' / ')) + '</div></td>' +
        '<td><textarea data-field="sekolah" rows="2" placeholder="Nama sekolah">' + esc(row.sekolah) + '</textarea></td>' +
        '<td>' + (row.manual ? '<textarea data-field="pegawai" rows="3" placeholder="Nama pegawai, dipisahkan koma">' + esc(assignedText) + '</textarea>' : (row.pegawai || []).map(function (name) { return '<span class="tuntutan-row-chip">' + esc(name) + '</span>'; }).join('')) + '</td>' +
        '<td><select data-field="pegawaiTuntutan"' + disabledClaim + '>' + officerOptions_(row.pegawaiTuntutan, true) + '</select>' + (row.pegawaiTuntutan ? '<div class="tuntutan-row-meta">' + esc(positions.get(row.pegawaiTuntutan) || 'Jawatan tiada') + '</div>' : '') + '</td>' +
        '<td><div class="tuntutan-row-flags">' +
          '<label><input data-field="dikecualikan" type="checkbox"' + (row.dikecualikan ? ' checked' : '') + '> Kecualikan dari tuntutan</label>' +
          '<button type="button" class="secondary-btn tuntutan-small-btn" data-save-source="' + index + '">' + (row.manual ? 'Kemas kini draf' : 'Simpan data sumber') + '</button>' +
          (row.manual ? '<button type="button" class="secondary-btn tuntutan-small-btn" data-remove-manual="' + index + '">Buang baris manual</button>' : '') +
        '</div></td>' +
      '</tr>';
    }).join('');

    body.querySelectorAll('input,select,textarea').forEach(function (node) {
      node.addEventListener('change', function () {
        state.dirty = true;
        state.generated = false;
        syncRowsFromDom_();
        renderWarnings_();
        updateGate_();
      });
    });
    body.querySelectorAll('[data-save-source]').forEach(function (button) {
      button.addEventListener('click', function () { saveSourceRow_(Number(button.dataset.saveSource)); });
    });
    body.querySelectorAll('[data-remove-manual]').forEach(function (button) {
      button.addEventListener('click', function () { removeManual_(Number(button.dataset.removeManual)); });
    });
  }

  function warningCard_(id, status, html) {
    const card = el(id);
    if (!card) return;
    card.classList.remove('has-warning', 'has-blocker', 'is-clear');
    card.classList.add(status || 'is-clear');
    const body = card.querySelector('.tuntutan-warning-body');
    if (body) body.innerHTML = html;
  }

  function activeRows_() { return state.baris.filter(function (row) { return !row.dikecualikan; }); }

  function computeChecks_() {
    const active = activeRows_();
    const unresolvedNoIsd = active.filter(function (row) { return !row.noIsd; });
    const missingClaim = active.filter(function (row) { return !row.pegawaiTuntutan; });
    const missingAssigned = active.filter(function (row) { return !row.pegawai || !row.pegawai.length; });
    const positionMissing = unique(active.reduce(function (all, row) { return all.concat(row.pegawai || []); }, []).filter(function (name) { return !positions.get(name); }));
    return {
      unresolvedNoIsd: unresolvedNoIsd,
      missingClaim: missingClaim,
      missingAssigned: missingAssigned,
      positionMissing: positionMissing,
      blockers: unresolvedNoIsd.length + missingClaim.length + missingAssigned.length + positionMissing.length
    };
  }

  function renderWarnings_() {
    const preview = state.preview || { tanpaIsd: [], isdMencurigakan: [], jarakTiada: [] };
    const checks = computeChecks_();
    const tanpa = preview.tanpaIsd || [];
    let tanpaHtml = tanpa.length ? '<div class="tuntutan-warning-list">' + tanpa.map(function (record, index) {
      const inputId = 'tuntutanMissingIsd_' + index;
      return '<div class="tuntutan-warning-item"><strong>' + esc(core.formatDateMY(record.tarikh_iso)) + ' · ' + esc(record.nama_sekolah) + '</strong>' +
        '<div class="tuntutan-warning-inline"><input id="' + inputId + '" inputmode="numeric" maxlength="6" placeholder="No. ISD"><button type="button" class="secondary-btn tuntutan-small-btn" data-fill-isd="' + esc(record.id) + '" data-input-id="' + inputId + '">Isi No. ISD</button>' +
        (state.modTapis === 'semua' ? '<button type="button" class="secondary-btn tuntutan-small-btn" data-exclude-missing="' + esc(record.id) + '">Kecualikan</button>' : '') + '</div></div>';
    }).join('') + '</div>' : 'Tiada lawatan tanpa ISD.';
    warningCard_('tuntutanWarnTanpaIsd', tanpa.length ? (state.modTapis === 'semua' && checks.unresolvedNoIsd.length ? 'has-blocker' : 'has-warning') : 'is-clear', tanpaHtml);

    const suspicious = preview.isdMencurigakan || [];
    warningCard_('tuntutanWarnMencurigakan', suspicious.length ? 'has-warning' : 'is-clear', suspicious.length ? suspicious.map(function (x) { return '<div><strong>#' + esc(x.noIsd) + '</strong> · ' + esc(x.sebab) + '</div>'; }).join('') : 'Tiada nombor mencurigakan dikesan.');

    const missingDistance = preview.jarakTiada || [];
    warningCard_('tuntutanWarnJarak', missingDistance.length ? 'has-warning' : 'is-clear', missingDistance.length ? missingDistance.map(function (name) { return '<div>' + esc(name) + '</div>'; }).join('') : 'Semua sekolah dilawati mempunyai jarak.');

    let claimHtml = '';
    if (checks.missingClaim.length) claimHtml += '<div>' + checks.missingClaim.length + ' baris belum memilih pegawai tuntutan.</div>';
    if (checks.missingAssigned.length) claimHtml += '<div>' + checks.missingAssigned.length + ' baris tiada pegawai ditugaskan.</div>';
    warningCard_('tuntutanWarnPegawai', (checks.missingClaim.length || checks.missingAssigned.length) ? 'has-blocker' : 'is-clear', claimHtml || 'Semua baris lengkap.');

    warningCard_('tuntutanWarnJawatan', checks.positionMissing.length ? 'has-blocker' : 'is-clear', checks.positionMissing.length ? checks.positionMissing.map(function (name) { return '<div>' + esc(name) + '</div>'; }).join('') : 'Semua pegawai mempunyai padanan jawatan rasmi.');

    const warningCount = tanpa.length + suspicious.length + missingDistance.length + checks.missingClaim.length + checks.missingAssigned.length + checks.positionMissing.length;
    const count = el('tuntutanWarningCount');
    if (count) count.textContent = warningCount + ' isu';

    document.querySelectorAll('[data-fill-isd]').forEach(function (button) {
      button.addEventListener('click', function () { fillMissingIsd_(button.dataset.fillIsd, button.dataset.inputId); });
    });
    document.querySelectorAll('[data-exclude-missing]').forEach(function (button) {
      button.addEventListener('click', function () { excludeMissing_(button.dataset.excludeMissing); });
    });
  }

  function visitedSchools_() {
    return unique(activeRows_().map(function (row) { return row.sekolah; }).filter(Boolean));
  }

  function distanceByName_() {
    const map = new Map();
    ((state.preview && state.preview.jarak) || []).forEach(function (row) { map.set(String(row.nama || '').toUpperCase(), row); });
    return map;
  }

  function renderDistanceEditor_() {
    const root = el('tuntutanJarakEditor');
    if (!root) return;
    const schools = visitedSchools_();
    if (!schools.length) { root.innerHTML = '<div class="tuntutan-empty">Tiada sekolah dalam draf semasa.</div>'; return; }
    const byName = distanceByName_();
    root.innerHTML = schools.map(function (school, index) {
      const item = byName.get(school.toUpperCase()) || { nama: school, jarak_km: '', maps_url: '', maps_pdf: '' };
      return '<div class="tuntutan-distance-row" data-distance-index="' + index + '">' +
        '<div class="tuntutan-distance-school">' + esc(school) + '</div>' +
        '<input data-distance-field="km" type="number" min="0" step="0.1" value="' + esc(item.jarak_km === null || item.jarak_km === undefined ? '' : item.jarak_km) + '" placeholder="KM pergi-balik">' +
        '<input data-distance-field="url" type="url" value="' + esc(item.maps_url || '') + '" placeholder="Pautan Google Maps">' +
        '<input data-distance-field="pdf" type="text" value="' + esc(item.maps_pdf || '') + '" placeholder="Nama fail PDF peta">' +
        '<button type="button" class="secondary-btn tuntutan-small-btn" data-save-distance="' + index + '" data-school="' + esc(school) + '">Simpan jarak</button>' +
      '</div>';
    }).join('');
    root.querySelectorAll('[data-save-distance]').forEach(function (button) {
      button.addEventListener('click', function () { saveDistance_(button); });
    });
  }

  async function saveDistance_(button) {
    const row = button.closest('.tuntutan-distance-row');
    if (!row) return;
    const km = row.querySelector('[data-distance-field="km"]').value;
    const url = row.querySelector('[data-distance-field="url"]').value.trim();
    const pdf = row.querySelector('[data-distance-field="pdf"]').value.trim();
    try {
      const result = await rpc('adminTuntutanSimpanJarak', { sekolah: button.dataset.school, jarakKm: km, mapsUrl: url, mapsPdf: pdf });
      if (!result || !result.ok) throw new Error(result && result.error ? result.error : 'Jarak gagal disimpan.');
      const list = await rpc('adminTuntutanSenaraiJarak', { zon: 'ZON 4' });
      if (list && list.ok) state.preview.jarak = list.sekolah || [];
      const byName = distanceByName_();
      state.preview.jarakTiada = visitedSchools_().filter(function (name) {
        const item = byName.get(name.toUpperCase());
        return !item || item.jarak_km === null || item.jarak_km === undefined;
      });
      renderWarnings_();
      renderDistanceEditor_();
      state.generated = false;
      updateGate_();
      toast(result.message || 'Maklumat jarak disimpan.', 'success');
    } catch (error) { toast(error.message || String(error), 'error'); }
  }

  function applyBulkOfficer_() {
    syncRowsFromDom_();
    const name = el('tuntutanBulkOfficer').value;
    if (!name) return toast('Pilih pegawai dahulu.', 'error');
    state.baris.forEach(function (row) { if (!row.dikecualikan && !row.pegawaiTuntutan) row.pegawaiTuntutan = name; });
    state.dirty = true;
    state.generated = false;
    renderAll_();
  }

  function renderSignatures_() {
    el('tuntutanPenyediaNama').value = state.signatures.penyedia.nama || '';
    el('tuntutanPenyediaTarikh').value = state.signatures.penyedia.tarikh || '';
    el('tuntutanPenyemakNama').value = state.signatures.penyemak.nama || '';
    el('tuntutanPenyemakTarikh').value = state.signatures.penyemak.tarikh || '';
    el('tuntutanPengesahNama').value = state.signatures.pengesah.nama || '';
    el('tuntutanPengesahTarikh').value = state.signatures.pengesah.tarikh || '';
  }

  function updateModeNote_() {
    const note = el('tuntutanModeNote');
    if (!note) return;
    note.textContent = state.modTapis === 'isd'
      ? 'Mod lalai: hanya lawatan yang mempunyai No. ISD masuk jadual. Rekod tanpa ISD kekal dalam panel semakan.'
      : 'Mod semua lawatan: rekod tanpa ISD masuk jadual dan Jana disekat sehingga No. ISD diisi atau baris dikecualikan.';
  }

  function updateGate_() {
    syncRowsFromDom_();
    const checks = computeChecks_();
    const hasRows = activeRows_().length > 0;
    const blocked = !hasRows || checks.blockers > 0;
    const generate = el('tuntutanJanaBtn');
    if (generate) generate.disabled = blocked || state.loading;
    ['tuntutanPrintDok1Btn', 'tuntutanPrintDok2Btn', 'tuntutanPrintPackageBtn'].forEach(function (id) {
      const button = el(id); if (button) button.disabled = !state.generated;
    });
    const status = el('tuntutanPreviewStatus');
    if (status) {
      if (!hasRows) status.textContent = 'Tiada baris tuntutan yang boleh dijana.';
      else if (checks.blockers) status.textContent = 'Jana disekat: selesaikan ' + checks.blockers + ' perkara wajib dalam panel semakan.';
      else status.textContent = state.generated ? 'Dokumen sedia untuk cetakan A4.' : 'Semakan wajib lengkap. Tekan Jana untuk membina DOK-1, DOK-2 dan DOK-3.';
    }
  }

  function renderAll_() {
    if (!state.preview) return;
    state.modTapis = el('tuntutanIsdOnly').checked ? 'isd' : 'semua';
    renderReviewTable_();
    renderSignatures_();
    renderWarnings_();
    renderDistanceEditor_();
    updateModeNote_();
    updateGate_();
  }

  function finalRows_() {
    syncRowsFromDom_();
    return core.mergeClaimRows(activeRows_().map(cloneRow_));
  }

  function signatureHtml_(label, value) {
    return '<div class="tuntutan-signature-box"><strong>' + esc(label) + '</strong><div class="tuntutan-signature-line"></div><div>' + esc(value.nama || '') + '</div><div>Tarikh: ' + esc(value.tarikh ? core.formatDateMY(value.tarikh) : '') + '</div></div>';
  }

  function renderDok1_(rows, filter) {
    return '<section class="tuntutan-doc tuntutan-dok1" data-doc="dok1">' +
      '<h1>PERGERAKAN KE SEKOLAH MELALUI LAPORAN SISTEM ICT SERVICE DESK (ISD) ' + esc(filter.zon) + '</h1>' +
      '<h2>BULAN ' + esc(core.monthLabel(filter.bulan, filter.tahun).toUpperCase()) + '</h2>' +
      '<table><thead><tr><th>BIL</th><th>NO.ISD DAN KETERANGAN</th><th>TARIKH</th><th>SEKOLAH</th><th>PEGAWAI YANG DITUGASKAN</th><th>PEGAWAI YANG MEMBUAT TUNTUTAN</th></tr></thead><tbody>' +
      rows.map(function (row) {
        return '<tr><td class="tuntutan-doc-center">' + row.bil + '</td>' +
          '<td><strong>#' + esc(row.noIsd) + '</strong><br>' + esc(row.keterangan) + '</td>' +
          '<td class="tuntutan-date-lines">' + core.formatDateLines(row.tarikh).map(esc).join('<br>') + '</td>' +
          '<td>' + esc(row.sekolah) + '</td>' +
          '<td>' + (row.pegawai || []).map(esc).join('<br>') + '</td>' +
          '<td>' + esc(row.pegawaiTuntutan) + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<div class="tuntutan-signatures">' + signatureHtml_('Disediakan Oleh', state.signatures.penyedia) + signatureHtml_('Disemak Oleh', state.signatures.penyemak) + signatureHtml_('Disahkan Oleh', state.signatures.pengesah) + '</div>' +
    '</section>';
  }

  function renderDok2_(rows, filter) {
    const officers = unique(rows.reduce(function (all, row) { return all.concat(row.pegawai || []); }, []));
    return officers.map(function (officer) {
      const tasks = rows.filter(function (row) { return (row.pegawai || []).indexOf(officer) !== -1; });
      const position = positions.get(officer);
      return '<section class="tuntutan-doc tuntutan-dok2" data-doc="dok2" data-officer="' + esc(officer) + '">' +
        '<h1>LAMPIRAN A</h1><h2>BORANG PERMOHONAN UNTUK BERTUGAS DI LUAR PEJABAT</h2>' +
        '<div class="tuntutan-dok2-meta"><strong>NAMA PEGAWAI</strong><span>: ' + esc(officer.toUpperCase()) + '</span><strong>JAWATAN</strong><span>: ' + esc(position || '') + '</span><strong>BAHAGIAN/CAWANGAN/UNIT</strong><span>: UNIT TEKNIKAL ICT PPD CONTOH</span></div>' +
        '<p><strong>TUGAS-TUGAS YANG AKAN DIJALANKAN, TEMPATNYA DAN TEMPOH:</strong></p>' +
        '<table><thead><tr><th>PERIHAL TUGAS</th><th>TEMPAT</th><th>TEMPOH</th></tr></thead><tbody>' +
        tasks.map(function (row) { return '<tr><td>NO ISD #' + esc(row.noIsd) + '<br>KHIDMAT BANTU ICT MELALUI SISTEM ICT SERVICE DESK (ISD)</td><td>' + esc(row.sekolah.toUpperCase()) + '</td><td class="tuntutan-date-lines">' + core.formatDateLines(row.tarikh).map(esc).join('<br>') + '</td></tr>'; }).join('') +
        '</tbody></table>' +
        '<div class="tuntutan-dok2-footer">' +
          '<div class="tuntutan-dok2-block"><strong>CARA PERJALANAN</strong><div class="tuntutan-checkline"><span>Kereta Sendiri</span><span>Kapal terbang</span><span>Kenderaan Jabatan</span><span>Lain-lain</span></div><div>SEBAB TIDAK MENAIKI KERETAPI/KAPAL TERBANG: ____________________________________________</div><div class="tuntutan-checkline"><span>Elaun Hitungan Batu</span><span>Gantian Tambang</span></div></div>' +
          '<div class="tuntutan-approval-grid"><div class="tuntutan-approval-box"><strong>(TARIKH)</strong><br><br><br><strong>(PEMOHON)</strong></div><div class="tuntutan-approval-box"><strong>PERAKUAN PEGAWAI PENYOKONG</strong></div></div>' +
          '<div class="tuntutan-approval-grid"><div class="tuntutan-approval-box"><strong>PERAKUAN PEGAWAI PELULUS</strong></div><div class="tuntutan-approval-box"><strong>Cap Rasmi:</strong></div></div>' +
        '</div>' +
      '</section>';
    }).join('');
  }

  function renderDok3_(rows, filter) {
    const byName = distanceByName_();
    const schools = unique(rows.map(function (row) { return row.sekolah; }));
    return '<section class="tuntutan-doc tuntutan-dok3" data-doc="dok3">' +
      '<h1>LAMPIRAN JARAK (GOOGLE MAPS)</h1><h2>' + esc(filter.zon) + ' · ' + esc(core.monthLabel(filter.bulan, filter.tahun).toUpperCase()) + '</h2>' +
      '<p class="tuntutan-dok3-summary"><strong>Titik mula/akhir:</strong> Hab perjalanan yang ditetapkan · Semua jarak ialah pergi-balik Hab → Sekolah → Hab.</p>' +
      '<table><thead><tr><th>BIL</th><th>SEKOLAH</th><th>JARAK PERGI-BALIK (KM)</th><th>PAUTAN GOOGLE MAPS</th><th>NAMA FAIL PDF PETA</th></tr></thead><tbody>' +
      schools.map(function (school, index) {
        const item = byName.get(school.toUpperCase()) || {};
        const url = item.maps_url || '';
        return '<tr><td class="tuntutan-doc-center">' + (index + 1) + '</td><td>' + esc(school) + '</td><td class="tuntutan-doc-center">' + esc(item.jarak_km === null || item.jarak_km === undefined ? '' : item.jarak_km) + '</td><td>' + (url ? '<a class="tuntutan-doc-link" href="' + esc(url) + '">' + esc(url) + '</a>' : '—') + '</td><td>' + esc(item.maps_pdf || '—') + '</td></tr>';
      }).join('') + '</tbody></table></section>';
  }

  async function generateDocuments_() {
    syncRowsFromDom_();
    renderWarnings_();
    const checks = computeChecks_();
    if (checks.blockers) return toast('Jana disekat. Lengkapkan perkara wajib dalam panel semakan.', 'error');
    const rows = finalRows_();
    if (!rows.length) return toast('Tiada baris tuntutan untuk dijana.', 'error');
    const conflict = rows.find(function (row) { return row.claimantConflict; });
    if (conflict) return toast('No. ISD #' + conflict.noIsd + ' mempunyai pegawai tuntutan bercanggah. Selaraskan pilihan dahulu.', 'error');
    const filter = currentFilter_();
    const root = el('tuntutanPrintRoot');
    root.innerHTML = renderDok1_(rows, filter) + renderDok2_(rows, filter) + renderDok3_(rows, filter);
    root.dataset.printScope = 'package';
    state.generated = true;
    updateGate_();
    try { await saveDraft_('siap', true); } catch (e) { return; }
    toast('DOK-1, DOK-2 dan DOK-3 berjaya dijana.', 'success');
  }

  function printScope_(scope) {
    if (!state.generated) return toast('Jana dokumen dahulu.', 'error');
    const root = el('tuntutanPrintRoot');
    root.dataset.printScope = scope;
    window.setTimeout(function () { window.print(); }, 50);
  }

  function bindEvents_() {
    el('tuntutanMuatBtn').addEventListener('click', function () { load_({ force: true, preserve: false }); });
    el('tuntutanTambahManualBtn').addEventListener('click', addManualRow_);
    el('tuntutanSimpanBtn').addEventListener('click', function () { saveDraft_('draf', false); });
    el('tuntutanCadangKeteranganBtn').addEventListener('click', suggestDescriptions_);
    el('tuntutanApplyOfficerBtn').addEventListener('click', applyBulkOfficer_);
    el('tuntutanJanaBtn').addEventListener('click', generateDocuments_);
    el('tuntutanPrintDok1Btn').addEventListener('click', function () { printScope_('dok1'); });
    el('tuntutanPrintDok2Btn').addEventListener('click', function () { printScope_('dok2'); });
    el('tuntutanPrintPackageBtn').addEventListener('click', function () { printScope_('package'); });
    el('tuntutanIsdOnly').addEventListener('change', function () {
      syncRowsFromDom_();
      state.modTapis = el('tuntutanIsdOnly').checked ? 'isd' : 'semua';
      state.dirty = true;
      state.loadedKey = '';
      load_({ force: true, preserve: true });
    });
    ['tuntutanTahun', 'tuntutanBulan'].forEach(function (id) {
      el(id).addEventListener('change', function () { state.loadedKey = ''; state.generated = false; });
    });
    ['tuntutanPenyediaNama','tuntutanPenyediaTarikh','tuntutanPenyemakNama','tuntutanPenyemakTarikh','tuntutanPengesahNama','tuntutanPengesahTarikh'].forEach(function (id) {
      el(id).addEventListener('change', function () { state.dirty = true; state.generated = false; syncSignaturesFromDom_(); updateGate_(); });
    });
  }

  function init_() {
    if (state.initialized) return;
    state.initialized = true;
    populateFilters_();
    bindEvents_();
  }

  window.PPDK_TUNTUTAN_UI = Object.freeze({
    load: async function () { await window.PPDKData.ready; init_(); return load_({ force: !state.preview, preserve: Boolean(state.preview) }); },
    refresh: async function () { await window.PPDKData.ready; init_(); return load_({ force: true, preserve: true }); },
    state: state,
    generate: generateDocuments_
  });
})();
