/**
 * PPD-ICT — LEMBARAN OPERASI & FILTER BAR CONTROLLER (MASTER A-1)
 * Autoriti: master-a1/DASHBOARD_A1_DIRECTION.md + AGENT_PROMPTS_MASTER_A1_R2A.md §1
 */

(function () {
  'use strict';

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];
  const DEFAULT_FILTERS = Object.freeze({
    year: '2026',
    month: '9',
    day: 'all',
    zone: 'all',
    school: 'all',
    q: ''
  });

  // Keadaan Mod Graf Harian: 'total' (Lalai, Neutral Mint) atau 'zones' (Bertindan 8 Warna Zon)
  let activeChartMode = 'total';
  let filterOpener = null;
  let appliedFilterState = { ...DEFAULT_FILTERS };
  let dialogDraftOrigin = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function normalizeFilterState(raw) {
    const s = { ...raw };
    const validYears = ['2022', '2023', '2024', '2025', '2026'];
    if (s.year !== 'all' && !validYears.includes(String(s.year))) {
      s.year = '2026';
    }

    if (s.month !== 'all') {
      const mNum = parseInt(s.month, 10);
      if (isNaN(mNum) || mNum < 1 || mNum > 12) {
        s.month = '9';
      } else {
        s.month = String(mNum);
      }
    }

    // Peraturan: month === 'all' memaksa day = 'all'
    if (s.month === 'all') {
      s.day = 'all';
    } else if (s.day && s.day !== 'all') {
      const dNum = parseInt(s.day, 10);
      const mNum = parseInt(s.month, 10);
      if (isNaN(dNum) || dNum < 1 || dNum > 31) {
        s.day = 'all';
      } else {
        let maxDays;
        if (mNum === 2) {
          maxDays = (s.year === 'all') ? 29 : new Date(parseInt(s.year, 10), 2, 0).getDate();
        } else {
          const yrForDays = (s.year === 'all') ? 2024 : parseInt(s.year, 10);
          maxDays = new Date(yrForDays, mNum, 0).getDate();
        }
        if (dNum > maxDays) {
          s.day = 'all';
        } else {
          s.day = String(dNum);
        }
      }
    } else {
      s.day = 'all';
    }

    if (!s.zone) s.zone = 'all';
    if (!s.school) s.school = 'all';
    s.q = String(s.q || '').trim();

    return s;
  }
  window.normalizeFilterState = normalizeFilterState;

  // =========================================================================
  // 1. FILTER BAR & DIALOG CONTROLLER (DASHBOARD_A1_DIRECTION.md §2.3, §2.4)
  // =========================================================================

  function getFilterState() {
    const y = document.getElementById('filterYear');
    const m = document.getElementById('filterMonth');
    const z = document.getElementById('filterZone');
    const s = document.getElementById('filterSchool');
    const q = document.getElementById('txtGlobalSearch');

    const raw = {
      year: y ? y.value : (appliedFilterState.year || '2026'),
      month: m ? m.value : (appliedFilterState.month || '9'),
      day: appliedFilterState.day || 'all',
      zone: z ? z.value : (appliedFilterState.zone || 'all'),
      school: s ? s.value : (appliedFilterState.school || 'all'),
      q: q ? q.value.trim() : (appliedFilterState.q || '')
    };
    return normalizeFilterState(raw);
  }
  window.getOverviewFilterState = getFilterState;

  function setFilterState(state) {
    const normalized = normalizeFilterState(state);
    const y = document.getElementById('filterYear');
    const m = document.getElementById('filterMonth');
    const z = document.getElementById('filterZone');
    const s = document.getElementById('filterSchool');
    const q = document.getElementById('txtGlobalSearch');

    if (y && normalized.year !== undefined) y.value = normalized.year;
    if (m && normalized.month !== undefined) m.value = normalized.month;
    if (z && normalized.zone !== undefined) z.value = normalized.zone;
    if (typeof window.populateSchoolDropdown === 'function') {
      window.populateSchoolDropdown();
    }
    if (s && normalized.school !== undefined) s.value = normalized.school;
    if (q && normalized.q !== undefined) q.value = normalized.q;

    appliedFilterState = { ...normalized };
  }
  window.getCanonicalFilterState = () => ({ ...appliedFilterState });
  window.setCanonicalFilterState = (patch) => {
    appliedFilterState = normalizeFilterState({ ...appliedFilterState, ...patch });
    setFilterState(appliedFilterState);
  };

  window.openFilterDialog = function (focusTarget) {
    const dialog = document.getElementById('filterDialog');
    if (!dialog) return;
    filterOpener = document.activeElement;
    setFilterState(appliedFilterState);
    dialogDraftOrigin = { ...appliedFilterState };

    if (typeof window.populateSchoolDropdown === 'function') {
      try { window.populateSchoolDropdown(); } catch (_) {}
    }

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch (e) {
          dialog.setAttribute('open', '');
        }
      }
    } else {
      dialog.setAttribute('open', '');
    }

    const targetEl = focusTarget ? document.getElementById(focusTarget) : document.getElementById('filterYear');
    if (targetEl && typeof targetEl.focus === 'function') {
      try { targetEl.focus(); } catch (_) {}
    }
  };

  window.closeFilterDialog = function (restoreDraft = true) {
    const dialog = document.getElementById('filterDialog');
    if (!dialog) return;
    if (restoreDraft && dialogDraftOrigin) {
      setFilterState(dialogDraftOrigin);
    }
    if (typeof dialog.close === 'function') {
      if (dialog.open) {
        try {
          dialog.close();
        } catch (e) {
          dialog.removeAttribute('open');
        }
      }
    } else {
      dialog.removeAttribute('open');
    }
    if (filterOpener && typeof filterOpener.focus === 'function') {
      try { filterOpener.focus(); } catch (_) {}
    }
    dialogDraftOrigin = null;
  };

  window.handleFilterFormSubmit = function (event) {
    if (event) event.preventDefault();
    appliedFilterState = getFilterState();
    dialogDraftOrigin = null;
    closeFilterDialog(false);
    commitFiltersToUrl();
    if (typeof window.applyFilters === 'function') {
      window.applyFilters();
    }
  };

  window.quickCurrentMonth = function () {
    const y = document.getElementById('filterYear');
    const m = document.getElementById('filterMonth');
    const now = new Date();
    const nextYear = String(now.getFullYear());
    const nextMonth = String(now.getMonth() + 1);
    if (y && Array.from(y.options).some(option => option.value === nextYear)) y.value = nextYear;
    if (m && Array.from(m.options).some(option => option.value === nextMonth)) m.value = nextMonth;
    appliedFilterState.day = 'all';
  };

  window.resetAllFilters = function () {
    setFilterState(DEFAULT_FILTERS);
    appliedFilterState = { ...DEFAULT_FILTERS };
    commitFiltersToUrl();
    if (typeof window.applyFilters === 'function') {
      window.applyFilters();
    }
    const btnOpen = document.getElementById('btnFilterOpen');
    if (btnOpen) btnOpen.focus();
  };

  function commitFiltersToUrl(nextHash) {
    const state = normalizeFilterState(appliedFilterState);
    appliedFilterState = { ...state };
    const url = new URL(location.href);

    if (state.year) url.searchParams.set('f_year', state.year);
    if (state.month) url.searchParams.set('f_month', state.month);

    if (state.day && state.day !== 'all') {
      url.searchParams.set('f_day', state.day);
    } else {
      url.searchParams.delete('f_day');
    }

    if (state.zone && state.zone !== 'all') {
      url.searchParams.set('f_zone', state.zone);
    } else {
      url.searchParams.delete('f_zone');
    }

    if (state.school && state.school !== 'all') {
      url.searchParams.set('f_school', state.school);
    } else {
      url.searchParams.delete('f_school');
    }

    if (state.q) {
      url.searchParams.set('f_q', state.q);
    } else {
      url.searchParams.delete('f_q');
    }

    const targetHash = nextHash !== undefined
      ? (nextHash ? (nextHash.startsWith('#') ? nextHash : '#' + nextHash) : '')
      : location.hash;
    const nextUrl = url.pathname + url.search + targetHash;
    const currentUrl = location.pathname + location.search + location.hash;
    if (nextUrl !== currentUrl) {
      history.pushState(null, '', nextUrl);
    }
  }
  window.commitFiltersToUrl = commitFiltersToUrl;

  function readUrlFilters() {
    const params = new URLSearchParams(location.search);
    const raw = { ...DEFAULT_FILTERS };
    let hadInvalid = false;

    if (params.has('f_year')) raw.year = params.get('f_year');
    if (params.has('f_month')) raw.month = params.get('f_month');
    if (params.has('f_day')) raw.day = params.get('f_day');
    if (params.has('f_zone')) raw.zone = params.get('f_zone');
    if (params.has('f_school')) raw.school = params.get('f_school');
    if (params.has('f_q')) raw.q = params.get('f_q');

    const normalized = normalizeFilterState(raw);

    if (params.has('f_day') && (normalized.day === 'all' || normalized.day !== params.get('f_day'))) {
      hadInvalid = true;
    }
    if (params.has('f_month') && normalized.month !== params.get('f_month')) {
      hadInvalid = true;
    }

    setFilterState(normalized);
    appliedFilterState = { ...normalized };

    if (hadInvalid) {
      commitFiltersToUrl();
    }
  }
  window.readUrlFilters = readUrlFilters;

  function buildChip(label, type, isRemovable) {
    const span = document.createElement('span');
    span.className = 'chip';

    const textSpan = document.createElement('span');
    textSpan.textContent = label;
    textSpan.style.cursor = 'pointer';
    textSpan.onclick = function () {
      if (type === 'period' || type === 'day') window.openFilterDialog('filterMonth');
      else if (type === 'zone') window.openFilterDialog('filterZone');
      else if (type === 'school') window.openFilterDialog('filterSchool');
      else if (type === 'q') window.openFilterDialog('txtGlobalSearch');
    };
    span.appendChild(textSpan);

    if (isRemovable) {
      const rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.setAttribute('aria-label', 'Buang penapis ' + label);
      rmBtn.title = 'Buang penapis ' + label;
      rmBtn.innerHTML = '<svg class="i"><use href="#i-x"/></svg>';
      rmBtn.onclick = function () {
        if (type === 'zone') {
          const z = document.getElementById('filterZone');
          const s = document.getElementById('filterSchool');
          if (z) z.value = 'all';
          if (s) s.value = 'all';
          appliedFilterState.zone = 'all';
          appliedFilterState.school = 'all';
        } else if (type === 'period') {
          const y = document.getElementById('filterYear');
          const m = document.getElementById('filterMonth');
          if (y) y.value = 'all';
          if (m) m.value = 'all';
          appliedFilterState.year = 'all';
          appliedFilterState.month = 'all';
          appliedFilterState.day = 'all';
        } else if (type === 'day') {
          appliedFilterState.day = 'all';
        } else if (type === 'school') {
          const s = document.getElementById('filterSchool');
          if (s) s.value = 'all';
          appliedFilterState.school = 'all';
        } else if (type === 'q') {
          const q = document.getElementById('txtGlobalSearch');
          if (q) q.value = '';
          appliedFilterState.q = '';
        }
        commitFiltersToUrl();
        if (typeof window.applyFilters === 'function') {
          window.applyFilters();
        }
        const btnOpen = document.getElementById('btnFilterOpen');
        if (btnOpen) btnOpen.focus();
      };
      span.appendChild(rmBtn);
    }

    return span;
  }

  function updateFilterChips() {
    const chipsContainer = document.getElementById('filterChips');
    const btnReset = document.getElementById('btnFilterReset');
    const resultText = document.getElementById('filterResultText');
    if (!chipsContainer) return;

    chipsContainer.innerHTML = '';
    const state = getFilterState();
    const isDefault = Object.keys(DEFAULT_FILTERS).every(k => state[k] === DEFAULT_FILTERS[k]);

    if (btnReset) {
      btnReset.hidden = isDefault;
    }

    // 1. Cip Tempoh
    let periodLabel = '';
    if (state.month !== 'all') {
      const mIdx = parseInt(state.month, 10) - 1;
      const mName = MONTH_NAMES[mIdx] || state.month;
      periodLabel = state.year === 'all' ? `${mName} · Semua tahun` : `${mName} ${state.year}`;
    } else {
      periodLabel = state.year === 'all' ? 'Semua tahun' : `Tahun ${state.year}`;
    }
    const isPeriodModified = state.year !== 'all' || state.month !== 'all';
    chipsContainer.appendChild(buildChip(periodLabel, 'period', isPeriodModified));

    // 1b. Cip Hari Nyata
    if (state.day !== 'all' && state.month !== 'all') {
      const mIdx = parseInt(state.month, 10) - 1;
      const mName = MONTH_NAMES[mIdx] || state.month;
      const dayLabel = state.year === 'all'
        ? `Hari: ${state.day} ${mName} · Semua tahun`
        : `Hari: ${state.day} ${mName} ${state.year}`;
      chipsContainer.appendChild(buildChip(dayLabel, 'day', true));
    }

    // 2. Cip Zon
    if (state.zone !== 'all') {
      chipsContainer.appendChild(buildChip(state.zone, 'zone', true));
    }

    // 3. Cip Sekolah
    if (state.school !== 'all') {
      chipsContainer.appendChild(buildChip(state.school, 'school', true));
    }

    // 4. Cip Carian
    if (state.q) {
      chipsContainer.appendChild(buildChip('Carian: ' + state.q, 'q', true));
    }

    // Bilangan lawatan hasil
    if (resultText) {
      const recs = window.filteredRecords || (typeof window.getOverviewFilteredRecords === 'function' ? window.getOverviewFilteredRecords() : []);
      resultText.textContent = `${recs.length.toLocaleString()} lawatan`;
    }

    // Skop Halaman
    const pageScope = document.getElementById('pageScopeText');
    if (pageScope) {
      const pText = periodLabel || 'September 2026';
      const zText = state.zone !== 'all' ? state.zone : 'Semua zon';
      const sText = state.school !== 'all' ? state.school : 'Semua sekolah';
      const extraCount = state.q ? 1 : 0;
      const extraText = extraCount > 0 ? ` · ${extraCount} penapis tambahan` : '';
      pageScope.textContent = `${pText} · ${zText} · ${sText}${extraText}`;
    }
  }

  // =========================================================================
  // 2. HERO OVERVIEW & 4 STAT STRIP (DASHBOARD_A1_DIRECTION.md §3.1, §3.4)
  // =========================================================================

  function updateOverviewHero(filtered, all) {
    const total = filtered.length;
    const heroVal = document.getElementById('overviewHeroValue');
    const heroPeriod = document.getElementById('overviewHeroPeriod');
    const heroZoneScope = document.getElementById('overviewHeroZoneScope');
    const heroSchoolsCount = document.getElementById('overviewHeroSchoolsCount');
    const periodHeading = document.getElementById('overviewPeriodHeading');
    const dailyPeriod = document.getElementById('overviewDailyPeriod');

    if (heroVal) heroVal.textContent = total.toLocaleString();

    const selectedZone = document.getElementById('filterZone') ? document.getElementById('filterZone').value : 'all';
    const state = getFilterState();

    // Tempoh teks
    let pText = 'September 2026';
    if (state.month !== 'all') {
      const mIdx = parseInt(state.month, 10) - 1;
      pText = state.year === 'all' ? `${MONTH_NAMES[mIdx]} · Semua tahun` : `${MONTH_NAMES[mIdx]} ${state.year}`;
    } else {
      pText = state.year === 'all' ? 'Semua Tempoh' : `Tahun ${state.year}`;
    }

    if (heroPeriod) heroPeriod.textContent = pText;
    if (periodHeading) periodHeading.textContent = pText;
    if (dailyPeriod) dailyPeriod.textContent = pText;

    if (heroZoneScope) {
      heroZoneScope.textContent = selectedZone !== 'all' ? selectedZone : 'Semua zon';
    }

    // Sekolah dilawati
    const visitedSchools = typeof window.countOfficialVisitedSchools === 'function'
      ? window.countOfficialVisitedSchools(filtered)
      : new Set(filtered.map(r => String(r.school || '').trim().toUpperCase())).size;

    if (heroSchoolsCount) {
      heroSchoolsCount.textContent = visitedSchools;
    }

    // 4 Stat Strip
    const officialTarget = 83; // KUNCI: Denominator liputan rasmi = 83
    const metricSchools = document.getElementById('overviewMetricSchools');
    const metricSchoolsSub = document.getElementById('overviewMetricSchoolsSub');
    if (metricSchools) {
      metricSchools.innerHTML = `${visitedSchools}<small>/${officialTarget}</small>`;
    }
    if (metricSchoolsSub) {
      const pct = Math.round((visitedSchools / officialTarget) * 100);
      const remaining = Math.max(0, officialTarget - visitedSchools);
      metricSchoolsSub.textContent = `${pct}% liputan · ${remaining} belum`;
    }

    // Pegawai
    const officersCount = typeof window.getPeopleStats === 'function'
      ? window.getPeopleStats().length
      : new Set(filtered.flatMap(r => r.members || [r.member]).filter(Boolean)).size || 37;
    const metricOfficers = document.getElementById('overviewMetricOfficers');
    if (metricOfficers) {
      metricOfficers.textContent = officersCount;
    }

    // Tiket ISD
    const isdCount = filtered.reduce((sum, r) => sum + ((r.isdNumbers && r.isdNumbers.length) || 0), 0) ||
      filtered.filter(r => r.isdNumbers && r.isdNumbers.length > 0).length;
    const metricIsd = document.getElementById('overviewMetricIsd');
    if (metricIsd) {
      metricIsd.textContent = isdCount.toLocaleString();
    }

    // Aduan
    let complaintsCount = 0;
    const catCounts = {};
    filtered.forEach(r => {
      const c = (window.A1Cat && typeof window.A1Cat.classify === 'function')
        ? window.A1Cat.classify(r)
        : { key: 'penyelenggaraan', label: 'Penyelenggaraan', hasIssue: true };
      if (c && c.hasIssue) {
        complaintsCount++;
        catCounts[c.label] = (catCounts[c.label] || 0) + 1;
      }
    });

    const metricComplaints = document.getElementById('overviewMetricComplaints');
    const metricComplaintsSub = document.getElementById('overviewMetricComplaintsSub');
    if (metricComplaints) {
      metricComplaints.textContent = complaintsCount.toLocaleString();
    }
    if (metricComplaintsSub) {
      const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
      if (topCat && complaintsCount > 0) {
        const topPct = Math.round((topCat[1] / complaintsCount) * 100);
        metricComplaintsSub.textContent = `${topCat[0]} ${topPct}% daripada semua`;
      } else {
        metricComplaintsSub.textContent = 'Tiada aduan aktif';
      }
    }
  }

  // =========================================================================
  // 3. SEKSYEN 01: LAWATAN MENGIKUT ZON (DASHBOARD_A1_DIRECTION.md §3.5, §5.4)
  // =========================================================================

  function renderOverviewZoneDistribution(filtered, all) {
    const distEl = document.getElementById('overviewDistribution');
    const ledgerEl = document.getElementById('overviewZoneLedger');
    if (!distEl || !ledgerEl) return;

    const total = filtered.length;
    const zoneTargets = [7, 9, 10, 11, 12, 11, 11, 12]; // Denominator 83

    const zoneStats = [];
    for (let z = 1; z <= 8; z++) {
      const rows = filtered.filter(r => {
        const raw = String(r.zoneName || r.zoneId || '').trim().toUpperCase();
        const m = raw.match(/(?:ZON\s*|Z)([1-8])\b/);
        return m && Number(m[1]) === z;
      });
      const visitedCount = typeof window.countOfficialVisitedSchools === 'function'
        ? window.countOfficialVisitedSchools(rows)
        : new Set(rows.map(r => String(r.school || '').trim().toUpperCase())).size;
      const target = zoneTargets[z - 1];

      zoneStats.push({
        n: z,
        label: `ZON ${z}`,
        count: rows.length,
        visited: visitedCount,
        target: target
      });
    }

    const maxCount = Math.max(...zoneStats.map(z => z.count), 1);
    const tot = total > 0 ? total : 1;

    // 1. Jalur Taburan .zdist
    if (total === 0) {
      distEl.innerHTML = '<span class="mono" style="color:var(--muted);font-size:12px;padding:4px 0;">Tiada lawatan sepadan dengan penapis</span>';
    } else {
      distEl.innerHTML = zoneStats
        .filter(z => z.count > 0)
        .map(z => `<i style="--c:var(--z${z.n});--f:${z.count}"></i>`)
        .join('');
    }

    // 2. Lejar .zledger.two: Z1..Z4 kiri, Z5..Z8 kanan
    const rowHtml = z => {
      const w = (z.count / maxCount) * 100;
      const pc = total > 0 ? Math.round((z.count / tot) * 100) : 0;
      return `
        <div class="zl">
          <span class="zb" style="--c:var(--z${z.n})">ZON ${z.n}</span>
          <span class="trk"><span style="--c:var(--z${z.n});--w:${w}%"></span></span>
          <span class="lv">${z.count}</span>
          <span class="pc">${pc}%</span>
          <button class="zl-frac" type="button" aria-label="Zon ${z.n}: ${z.visited} daripada ${z.target} sekolah dilawati, buka senarai" onclick="window.navigateToZonesFromRing('ZON ${z.n}')">
            <b>${z.visited}</b>/${z.target}<span class="u"> sekolah</span>
          </button>
        </div>
      `;
    };

    const leftRows = zoneStats.slice(0, 4).map(rowHtml).join('');
    const rightRows = zoneStats.slice(4).map(rowHtml).join('');
    ledgerEl.innerHTML = `<div>${leftRows}</div><div>${rightRows}</div>`;
  }

  // =========================================================================
  // 4. HERO: GRAF HARIAN (DASHBOARD_A1_DIRECTION.md §3.2 & components.html §08)
  // =========================================================================

  window.setOverviewChartMode = function (mode) {
    activeChartMode = mode;
    const btnTotal = document.getElementById('btnModeTotal');
    const btnZones = document.getElementById('btnModeZones');
    const legendEl = document.getElementById('overviewChartLegend');
    const isZones = (mode === 'zones');

    if (btnTotal) {
      btnTotal.setAttribute('aria-pressed', String(!isZones));
      btnTotal.classList.toggle('active', !isZones);
    }
    if (btnZones) {
      btnZones.setAttribute('aria-pressed', String(isZones));
      btnZones.classList.toggle('active', isZones);
    }
    if (legendEl) {
      legendEl.hidden = !isZones;
      legendEl.style.display = isZones ? 'flex' : 'none';
    }

    if (window._lastOverviewFiltered && window._lastOverviewAll) {
      renderOverviewDailyChart(window._lastOverviewFiltered, window._lastOverviewAll);
    }
  };

  function renderOverviewDailyChart(filtered, all) {
    const svgChart = document.getElementById('overviewDailySvg');
    const avgEl = document.getElementById('overviewDailyAvg');
    const peakEl = document.getElementById('overviewDailyPeak');
    const tableBody = document.getElementById('overviewDailyTable');
    const footEl = document.getElementById('overviewDailyCoverage');
    const legendEl = document.getElementById('overviewChartLegend');
    if (!svgChart) return;

    if (legendEl) {
      const isZones = (activeChartMode === 'zones');
      legendEl.hidden = !isZones;
      legendEl.style.display = isZones ? 'flex' : 'none';
    }

    const state = getFilterState();
    const isDaily = (state.month !== 'all');
    const yVal = state.year === 'all' ? 2026 : parseInt(state.year, 10);
    const mVal = isDaily ? parseInt(state.month, 10) : 9;

    // Hari dalam bulan (atau 12 bulan jika mod bulanan)
    const totalDaysInMonth = isDaily ? new Date(yVal, mVal, 0).getDate() : 12;

    // Hari berlalu (KUNCI: 23 hari pada 23.09.2026 bagi bulan semasa; 12 bulan bagi graf bulanan)
    const now = new Date();
    let elapsedDays = totalDaysInMonth;
    const isCurrentMonth = (yVal === now.getFullYear() && mVal === (now.getMonth() + 1));
    const isPastMonth = (yVal < now.getFullYear() || (yVal === now.getFullYear() && mVal < (now.getMonth() + 1)));
    const isFutureMonth = (yVal > now.getFullYear() || (yVal === now.getFullYear() && mVal > (now.getMonth() + 1)));

    if (isDaily) {
      if (isFutureMonth) {
        elapsedDays = 0;
      } else if (isCurrentMonth) {
        elapsedDays = Math.min(now.getDate(), totalDaysInMonth);
      }
    } else {
      // Mod Bulanan: 12 bar bulan
      elapsedDays = 12;
    }

    const bucketCount = isDaily ? totalDaysInMonth : 12;
    const periodTotals = Array(bucketCount).fill(0);
    const periodZones = Array.from({ length: bucketCount }, () => Array(8).fill(0));

    filtered.forEach(r => {
      let dNum = Number(r.day) || 0;
      let mNum = Number(r.month) || 0;
      if (r.date) {
        const parts = String(r.date).split('/');
        if (parts.length >= 2) {
          dNum = dNum || parseInt(parts[0], 10);
          mNum = mNum || parseInt(parts[1], 10);
        }
      }
      const idx = isDaily ? dNum - 1 : mNum - 1;
      if (idx >= 0 && idx < bucketCount) {
        periodTotals[idx]++;
        const zMatch = String(r.zoneName || r.zoneId || '').match(/(?:ZON\s*|Z)([1-8])\b/i);
        if (zMatch) {
          const z = parseInt(zMatch[1], 10) - 1;
          if (z >= 0 && z < 8) periodZones[idx][z]++;
        }
      }
    });

    // Ambil subset hari berlalu untuk dilukis sebagai bar
    const daysToPlot = periodTotals.slice(0, elapsedDays);
    const peak = Math.max(...daysToPlot, 1);
    const sumPlotted = daysToPlot.reduce((a, b) => a + b, 0);
    const avg = elapsedDays > 0 ? (sumPlotted / elapsedDays).toFixed(1) : '0';

    if (avgEl) avgEl.textContent = avg;
    if (peakEl) peakEl.textContent = peak;

    // Geometri Master A-1 (S5: viewBox 0 0 640 300, B=270, T=24)
    const N = bucketCount;
    const W = 640;
    const H = 300;
    const L = 24;
    const B = 270;
    const T = 24;
    const slot = (W - L) / N;

    let s = '<defs><pattern id="dhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="hl" x1="0" y1="0" x2="0" y2="6"/></pattern></defs>';

    // Garis grid mendatar & paksi Y (0, .5, 1)
    [0, 0.5, 1].forEach(f => {
      const y = B - (B - T) * f;
      s += `<line class="gl" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text class="ax" x="0" y="${y + 3}">${Math.round(peak * f)}</text>`;
    });

    // Bar hari/bulan berlalu
    const kind = isDaily ? 'day' : 'month';
    daysToPlot.forEach((d, i) => {
      const x = L + i * slot + 2;
      const w = Math.max(2, slot - 4);

      let timeLabel = '';
      if (isDaily) {
        const dayNum = i + 1;
        timeLabel = `${String(dayNum).padStart(2, '0')} ${MONTH_NAMES[mVal - 1]}`;
      } else {
        const mName = MONTH_NAMES[i];
        timeLabel = state.year === 'all' ? `${mName} · Semua tahun` : `${mName} ${yVal}`;
      }

      if (d > 0) {
        if (activeChartMode === 'zones') {
          // Mod Zon: Bar bertindan mengikut zon 1 hingga 8
          // S1: Setiap segmen .bz mendapat .hit sendiri dengan data-zone="ZON n"; tiada .hit sepenuh slot
          let currY = B;
          for (let z = 1; z <= 8; z++) {
            const count = periodZones[i][z - 1] || 0;
            if (count > 0) {
              const segH = (B - T) * count / peak;
              currY -= segH;
              s += `<rect class="bz" style="--c:var(--z${z})" x="${x}" y="${currY}" width="${w}" height="${segH}"/>`;
              const segLabel = `${timeLabel} · ZON ${z}: ${count} lawatan, lihat rekod`;
              s += `<rect class="hit" x="${x}" y="${currY}" width="${w}" height="${segH}" tabindex="0" role="button" aria-label="${escapeAttr(segLabel)}" data-kind="${kind}" data-bucket="${i}" data-zone="ZON ${z}"/>`;
            }
          }
        } else {
          // Mod Jumlah: Bar warna mint neutral tunggal
          // K1 & S2: Satu .hit per bucket sahaja, dan hanya apabila d > 0
          const h = (B - T) * d / peak;
          s += `<rect class="b" x="${x}" y="${B - h}" width="${w}" height="${h}"/>`;
          const barLabel = `${timeLabel}: ${d} lawatan, lihat rekod`;
          s += `<rect class="hit" x="${x - 2}" y="${T}" width="${slot}" height="${B - T}" tabindex="0" role="button" aria-label="${escapeAttr(barLabel)}" data-kind="${kind}" data-bucket="${i}"/>`;
        }

        if (d === peak) {
          s += `<text class="pk" x="${x}" y="${B - ((B - T) * d / peak) - 6}">${d}</text>`;
        }
      } else {
        // S2: Hari sifar lawatan — tiada .hit
        s += `<rect class="b0" x="${x}" y="${B - 2}" width="${w}" height="2"/>`;
      }

      // Label paksi X (S5: y = B + 18)
      if (isDaily) {
        if (i === 0 || (i + 1) % 5 === 0 || i === daysToPlot.length - 1) {
          s += `<text class="ax" x="${x}" y="${B + 18}">${String(i + 1).padStart(2, '0')}</text>`;
        }
      } else {
        const mShort = MONTH_NAMES[i].substring(0, 3).toUpperCase();
        s += `<text class="ax" x="${x}" y="${B + 18}">${mShort}</text>`;
      }
    });

    // Kawasan masa hadapan (belum dilaporkan)
    if (elapsedDays < N) {
      const fx = L + elapsedDays * slot;
      s += `<rect class="hatch-bg" fill="url(#dhatch)" x="${fx}" y="${T}" width="${W - fx}" height="${B - T}"/><text class="futl" x="${fx + 8}" y="${T + 14}">BELUM DILAPORKAN</text>`;
    }

    svgChart.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svgChart.innerHTML = s;

    // Pasang interaksi klik / papan kekunci pada .hit (K1: baca data-kind, data-bucket, data-zone dari target.dataset)
    if (!svgChart._interactionBound) {
      svgChart._interactionBound = true;
      const onChartBarAction = (target) => {
        const kind = target.dataset.kind;
        const bucketIdx = parseInt(target.dataset.bucket, 10);
        if (isNaN(bucketIdx)) return;
        const zone = target.dataset.zone;
        const patch = {};
        if (kind === 'month') {
          patch.month = String(bucketIdx + 1);
          patch.day = 'all';
        } else {
          patch.day = String(bucketIdx + 1);
        }
        if (zone) {
          patch.zone = zone;
        }
        window.navigateToRecordsFromChart(patch);
      };

      svgChart.addEventListener('click', (e) => {
        const target = e.target.closest('.hit');
        if (target) {
          e.stopPropagation();
          onChartBarAction(target);
        }
      });

      svgChart.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target.closest('.hit');
          if (target) {
            e.preventDefault();
            e.stopPropagation();
            onChartBarAction(target);
          }
        }
      });
    }

    // Kemas kini Footer Carta
    if (footEl) {
      const recordedLabel = isDaily
        ? `01–${String(elapsedDays).padStart(2, '0')} ${MONTH_NAMES[mVal - 1].substring(0, 3).toUpperCase()} · direkod`
        : `JAN–DIS · direkod`;
      footEl.textContent = recordedLabel;
    }

    // Kemas kini Jadual Angka dalam details
    if (tableBody) {
      let rowsHtml = '';
      for (let i = 0; i < bucketCount; i++) {
        const dayLabel = isDaily
          ? String(i + 1).padStart(2, '0')
          : MONTH_NAMES[i].substring(0, 3).toUpperCase();
        if (i >= elapsedDays) {
          rowsHtml += `<tr><th scope="row">${dayLabel}</th><td colspan="9" class="dash">Belum dilaporkan</td></tr>`;
          continue;
        }
        const tot = periodTotals[i] || 0;
        const zCols = periodZones[i].map(c => `<td class="r">${c || 0}</td>`).join('');
        rowsHtml += `<tr><th scope="row">${dayLabel}</th>${zCols}<td class="r"><b>${tot}</b></td></tr>`;
      }
      tableBody.innerHTML = rowsHtml;
    }

    window._lastOverviewFiltered = filtered;
    window._lastOverviewAll = all;
  }

  // =========================================================================
  // 5. GELUNG LIPUTAN (DIBUANG PER §1.7)
  // =========================================================================

  function renderOverviewCoverageRings(filtered, all) {
    return; // Gelung sepusat radial dibuang sepenuhnya
  }

  // =========================================================================
  // 6. SEKSYEN 02 & 03: OPERASI TERKINI & KATEGORI ADUAN (A-1)
  // =========================================================================

  function renderOverviewRecentAndIssues(filtered, all) {
    const logEl = document.getElementById('overviewLog');
    const issueListEl = document.getElementById('overviewIssueList');
    const issueTotalEl = document.getElementById('overviewIssueTotal');

    // 1. Operasi Terkini (5 Rekod Terkini — .visit)
    if (logEl) {
      const recent = [...filtered].slice(0, 5);
      if (!recent.length) {
        logEl.innerHTML = '<div class="empty" style="margin-top:16px"><p>Tiada rekod untuk pilihan ini</p><span class="mono">Cuba ubah tempoh atau penapis</span></div>';
      } else {
        logEl.innerHTML = recent.map(r => {
          let dayStr = '—';
          let monShort = 'SEP';
          if (r.date) {
            const parts = String(r.date).split('/');
            if (parts.length >= 2) {
              dayStr = String(parts[0]).padStart(2, '0');
              const mNum = parseInt(parts[1], 10);
              if (mNum >= 1 && mNum <= 12) {
                monShort = MONTH_NAMES[mNum - 1].substring(0, 3).toUpperCase();
              }
            }
          }

          const rawZone = String(r.zoneName || r.zoneId || '').trim().toUpperCase();
          const zMatch = rawZone.match(/(?:ZON\s*|Z)([1-8])\b/);
          const zoneNum = zMatch ? zMatch[1] : '1';

          const cat = (window.A1Cat && typeof window.A1Cat.classify === 'function')
            ? window.A1Cat.classify(r)
            : { label: 'Rangkaian', icon: 'i-wifi' };

          const taskDesc = r.agenda || r.issue || 'Khidmat bantu dan semakan teknikal';
          const isdHtml = (r.isdNumbers && r.isdNumbers.length > 0)
            ? `<span class="isd-tag">${escapeHtml(r.isdNumbers[0])}</span>`
            : '';

          return `
            <article class="visit">
              <div class="d">${escapeHtml(dayStr)}<span>${escapeHtml(monShort)}</span></div>
              <div>
                <h4><button class="lnk" type="button" onclick="openRecordDetail('${escapeAttr(r.id)}')">${escapeHtml(r.school || 'Sekolah')}</button></h4>
                <p>${escapeHtml(taskDesc)}</p>
                <div class="meta mono">
                  <span class="cat"><svg class="i"><use href="#${cat.icon}"/></svg>${escapeHtml(cat.label)}</span>
                  ${isdHtml}
                </div>
              </div>
              <div class="zcol"><span class="zb" style="--c:var(--z${zoneNum})">ZON ${zoneNum}</span></div>
            </article>
          `;
        }).join('');
      }
    }

    // 2. Kategori Aduan (A1Cat.classify — .iss)
    if (issueListEl) {
      const categoryCounts = {};
      const categoryMeta = {};

      filtered.forEach(r => {
        const cat = (window.A1Cat && typeof window.A1Cat.classify === 'function')
          ? window.A1Cat.classify(r)
          : { key: 'penyelenggaraan', label: 'Penyelenggaraan', icon: 'i-wrench', hasIssue: true };
        if (cat && cat.hasIssue) {
          const key = cat.key;
          categoryCounts[key] = (categoryCounts[key] || 0) + 1;
          if (!categoryMeta[key]) {
            categoryMeta[key] = cat;
          }
        }
      });

      const totalIssues = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
      if (issueTotalEl) issueTotalEl.textContent = totalIssues.toLocaleString();

      const keys = (window.A1Cat && window.A1Cat.KEYS) || ['rangkaian', 'pencetak', 'komputer', 'sistem', 'penyelenggaraan'];
      const categoriesList = keys
        .map(key => {
          const meta = categoryMeta[key] || {
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            icon: key === 'rangkaian' ? 'i-wifi' : (key === 'pencetak' ? 'i-printer' : (key === 'komputer' ? 'i-laptop' : (key === 'sistem' ? 'i-cog' : 'i-wrench')))
          };
          return {
            key,
            label: meta.label,
            icon: meta.icon,
            count: categoryCounts[key] || 0
          };
        })
        .sort((a, b) => b.count - a.count);

      issueListEl.innerHTML = categoriesList.map((item, idx) => {
        const pct = totalIssues > 0 ? (item.count / totalIssues) * 100 : 0;
        const isTop = (idx === 0 && item.count > 0);
        return `
          <div class="iss${isTop ? ' top' : ''}">
            <span class="ic"><svg class="i"><use href="#${item.icon}"/></svg></span>
            <div>
              <b>${item.label}</b>
              <div class="meter"><span style="--w:${pct}%"></span></div>
            </div>
            <div class="v">${item.count} <small>${Math.round(pct)}%</small></div>
          </div>
        `;
      }).join('');
    }
  }

  // =========================================================================
  // 7. INTERAKSI NAVIGASI KE RECORDS & ZONES (OVERVIEW_CHART_INTERACTIONS.md)
  // =========================================================================

  window.navigateToRecordsFromChart = function (patch) {
    const nextState = normalizeFilterState({ ...appliedFilterState, ...patch });
    setFilterState(nextState);
    appliedFilterState = { ...nextState };
    commitFiltersToUrl('#records');
    if (typeof window.switchTab === 'function') {
      window.switchTab('records', false);
    } else if (typeof window.switchView === 'function') {
      window.switchView('records');
    }
    if (typeof window.applyFilters === 'function') {
      window.applyFilters();
    }
    const targetFocus = document.getElementById('recordsSummaryGrid') || document.getElementById('txtGlobalSearch');
    if (targetFocus && typeof targetFocus.focus === 'function') {
      try { targetFocus.focus(); } catch (_) {}
    }
  };

  window.navigateToZonesFromRing = function (zoneId) {
    const nextState = normalizeFilterState({ ...appliedFilterState, zone: zoneId || 'all' });
    setFilterState(nextState);
    appliedFilterState = { ...nextState };
    commitFiltersToUrl('#zones');
    if (typeof window.switchTab === 'function') {
      window.switchTab('zones', false);
    } else if (typeof window.switchView === 'function') {
      window.switchView('zones');
    }
    if (typeof window.applyFilters === 'function') {
      window.applyFilters();
    }
    const targetSection = document.getElementById('zoneSchoolsSubview') || document.getElementById('zonesCoverageTracks');
    if (targetSection && typeof targetSection.scrollIntoView === 'function') {
      try { targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
    }
  };

  // =========================================================================
  // 8. MASTER RENDER HOOK UNTUK OVERVIEW
  // =========================================================================

  window.renderOverviewSwiss = function (filteredOverride, allOverride) {
    const filtered = filteredOverride || (typeof window.getOverviewFilteredRecords === 'function' ? window.getOverviewFilteredRecords() : (window.filteredRecords || []));
    const all = allOverride || (typeof window.getOverviewAllRecords === 'function' ? window.getOverviewAllRecords() : (window.allRecords || []));
    const dialog = document.getElementById('filterDialog');
    if (!dialog || !dialog.open) {
      appliedFilterState = getFilterState();
    }

    updateOverviewHero(filtered, all);
    renderOverviewZoneDistribution(filtered, all);
    renderOverviewDailyChart(filtered, all);
    renderOverviewCoverageRings(filtered, all);
    renderOverviewRecentAndIssues(filtered, all);
    updateFilterChips();
  };

  function initSwissOverview() {
    readUrlFilters();

    const dialog = document.getElementById('filterDialog');
    if (dialog) {
      dialog.addEventListener('cancel', function (e) {
        e.preventDefault();
        window.closeFilterDialog(true);
      });
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) {
          const rect = dialog.getBoundingClientRect();
          if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            window.closeFilterDialog();
          }
        }
      });
    }

    window.addEventListener('popstate', function () {
      readUrlFilters();
      const validTabs = new Set(['overview', 'zones', 'members', 'issues', 'records', 'geospatial', 'report']);
      const currentTab = (location.hash || '').replace(/^#/, '') || 'overview';
      if (validTabs.has(currentTab)) {
        if (typeof window.switchTab === 'function') {
          window.switchTab(currentTab, false);
        } else if (typeof window.switchView === 'function') {
          window.switchView(currentTab);
        }
      }
      if (typeof window.applyFilters === 'function') {
        window.applyFilters();
      } else {
        window.renderOverviewSwiss();
      }
    });

    const zoneSelect = document.getElementById('filterZone');
    if (zoneSelect) {
      zoneSelect.addEventListener('change', function () {
        if (typeof window.populateSchoolDropdown === 'function') {
          window.populateSchoolDropdown();
        }
      });
    }

    window.renderOverviewSwiss();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwissOverview);
  } else {
    setTimeout(initSwissOverview, 50);
  }

})();
