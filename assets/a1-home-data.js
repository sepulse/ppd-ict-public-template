(function (root) {
  'use strict';

  const MONTH_LABELS = [
    '', 'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];
  const MONTH_SHORT = ['', 'JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGO', 'SEP', 'OKT', 'NOV', 'DIS'];
  const MONTH_TITLE_SHORT = ['', 'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];

  function clean(value) {
    return String(value == null ? '' : value).trim();
  }

  function schoolKey(value) {
    return clean(value).toUpperCase();
  }

  function categoryApi() {
    const api = root && root.A1Cat;
    if (!api || !Array.isArray(api.KEYS) || typeof api.classify !== 'function') {
      throw new Error('A1Cat belum dimuatkan sebelum a1-home-data.js');
    }
    return api;
  }

  function recordDateParts(record) {
    const r = record || {};
    let year = Number(r.year);
    let month = Number(r.month);
    let day = Number(r.day);
    if ((!year || !month || !day) && r.date) {
      const parts = String(r.date).split('/');
      if (parts.length >= 3) {
        day = day || Number(parts[0]);
        month = month || Number(parts[1]);
        year = year || Number(parts[2]);
      }
    }
    return {
      year: Number.isFinite(year) ? year : 0,
      month: Number.isFinite(month) ? month : 0,
      day: Number.isFinite(day) ? day : 0
    };
  }

  function recordTimestamp(record) {
    const p = recordDateParts(record);
    const time = clean(record && record.startTime).match(/^(\d{1,2}):(\d{2})/);
    const hour = time ? Number(time[1]) : 0;
    const minute = time ? Number(time[2]) : 0;
    return Date.UTC(p.year || 1970, Math.max(0, (p.month || 1) - 1), p.day || 1, hour, minute);
  }

  function zoneNumber(record) {
    const raw = clean((record && record.zoneName) || (record && record.zoneId)).toUpperCase();
    const match = raw.match(/(?:ZON\s*|Z)([1-8])\b/);
    return match ? Number(match[1]) : null;
  }

  function countDaysInMonth(year, month) {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }

  function getMytDateParts(date) {
    const shifted = new Date(date.getTime() + (8 * 60 * 60 * 1000));
    return {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate()
    };
  }

  function elapsedDaysForPeriod(year, month, now) {
    const current = getMytDateParts(now);
    const targetKey = (year * 12) + month;
    const currentKey = (current.year * 12) + current.month;
    if (targetKey < currentKey) return countDaysInMonth(year, month);
    if (targetKey > currentKey) return 0;
    return Math.min(current.day, countDaysInMonth(year, month));
  }

  function build(records, opts) {
    const options = opts || {};
    const input = Array.isArray(records) ? records : [];
    const categoriesApi = categoryApi();
    const directory = options.directory || (root && root.PPDK_DATA) || {};
    const today = options.today instanceof Date
      ? options.today
      : (options.now instanceof Date ? options.now : new Date());
    const todayMyt = getMytDateParts(today);

    const year = Number(options.year || directory.targetYear || todayMyt.year);
    const month = Number(options.month || directory.targetMonth || todayMyt.month);
    const label = (MONTH_LABELS[month] || ('Bulan ' + month)) + ' ' + year;

    const schoolsByZone = (directory.filters && directory.filters.schoolsByZone) || {};
    const officersByZone = (directory.filters && directory.filters.officersByZone) || {};
    const officialByZone = {};
    const officialSchoolToZone = new Map();
    for (let n = 1; n <= 8; n += 1) {
      const labelKey = 'ZON ' + n;
      const list = Array.isArray(schoolsByZone[labelKey]) ? schoolsByZone[labelKey] : [];
      officialByZone[n] = list
        .map(clean)
        .filter(Boolean)
        .filter(name => schoolKey(name) !== 'PPD CONTOH');
      officialByZone[n].forEach(name => officialSchoolToZone.set(schoolKey(name), n));
    }
    const officialOfficerKeys = new Set(
      Object.values(officersByZone)
        .flat()
        .map(name => clean(name).toUpperCase())
        .filter(Boolean)
    );

    const coverageTotal = Array.from(officialSchoolToZone.keys()).length;
    const validVisitRecords = input.filter(record => {
      if (!record) return false;
      if (record.report_type && record.report_type !== 'school_visit') return false;
      return schoolKey(record.school) !== 'PPD CONTOH';
    });

    const periodRecords = validVisitRecords.filter(record => {
      const p = recordDateParts(record);
      return p.year === year && p.month === month;
    });

    const visited = new Set(
      periodRecords
        .map(record => schoolKey(record.school))
        .filter(key => officialSchoolToZone.has(key))
    );
    const sortedPeriod = periodRecords.slice().sort((a, b) => recordTimestamp(b) - recordTimestamp(a));
    const schoolVisits = Object.create(null);
    const schoolVisitLatestTs = Object.create(null);
    officialSchoolToZone.forEach((zone, key) => {
      schoolVisits[key] = {
        count: 0,
        lastDate: null,
        lastLabel: '—',
        summary: '',
        categoryLabel: ''
      };
    });
    periodRecords.forEach(record => {
      const key = schoolKey(record.school);
      const visit = schoolVisits[key];
      if (!visit) return;
      visit.count += 1;
      const timestamp = recordTimestamp(record);
      if (schoolVisitLatestTs[key] == null || timestamp > schoolVisitLatestTs[key]) {
        const parts = recordDateParts(record);
        const category = categoriesApi.classify(record);
        schoolVisitLatestTs[key] = timestamp;
        visit.lastDate = [
          String(parts.year).padStart(4, '0'),
          String(parts.month).padStart(2, '0'),
          String(parts.day).padStart(2, '0')
        ].join('-');
        visit.lastLabel = parts.day + ' ' + (MONTH_TITLE_SHORT[parts.month] || '');
        visit.summary = clean(record.agenda || record.issue || '');
        visit.categoryLabel = clean(category && category.label);
      }
    });

    const zones = [];
    for (let n = 1; n <= 8; n += 1) {
      const roster = new Set(officialByZone[n].map(schoolKey));
      const zoneVisited = new Set();
      periodRecords.forEach(record => {
        const key = schoolKey(record.school);
        if (roster.has(key)) zoneVisited.add(key);
      });
      zones.push({
        n,
        label: 'ZON ' + n,
        visited: zoneVisited.size,
        total: roster.size
      });
    }

    const daysInMonth = countDaysInMonth(year, month);
    const elapsedDays = elapsedDaysForPeriod(year, month, today);
    const daily = Array.from({ length: elapsedDays }, () => 0);
    periodRecords.forEach(record => {
      const day = recordDateParts(record).day;
      if (day >= 1 && day <= elapsedDays) daily[day - 1] += 1;
    });

    const officers = new Set();
    periodRecords.forEach(record => {
      (Array.isArray(record.members) ? record.members : []).forEach(name => {
        const value = clean(name);
        const key = value.toUpperCase();
        if (value && (!officialOfficerKeys.size || officialOfficerKeys.has(key))) officers.add(key);
      });
    });

    const categoryMeta = new Map(categoriesApi.KEYS.map(key => [key, categoriesApi.meta(key)]));
    input.forEach(record => {
      const category = categoriesApi.classify(record);
      if (category && categoriesApi.KEYS.includes(category.key) && !categoryMeta.has(category.key)) {
        categoryMeta.set(category.key, {
          key: category.key,
          label: category.label,
          icon: category.icon
        });
      }
    });

    const issueBuckets = Object.create(null);
    categoriesApi.KEYS.forEach(key => { issueBuckets[key] = 0; });
    let complaints = 0;
    periodRecords.forEach(record => {
      const a1 = categoriesApi.classify(record);
      if (!a1.hasIssue) return;
      complaints += 1;
      issueBuckets[a1.key] += 1;
    });

    const categories = categoriesApi.KEYS.map((key, index) => {
      const meta = categoryMeta.get(key);
      if (!meta) throw new Error('Metadata A1Cat tiada untuk kunci: ' + key);
      return {
      key,
      label: meta.label,
      icon: meta.icon,
      count: issueBuckets[key],
      pct: complaints ? Math.round((issueBuckets[key] / complaints) * 100) : 0,
      _order: index
      };
    }).sort((a, b) => b.count - a.count || a._order - b._order)
      .map(({ _order, ...item }) => item);

    const divisor = elapsedDays;
    const sessions = periodRecords.length;
    const latest = sortedPeriod[0] || null;
    const latestParts = latest ? recordDateParts(latest) : null;

    const recent = sortedPeriod.slice(0, 3).map(record => {
      const parts = recordDateParts(record);
      const displayCategory = categoriesApi.classify(record);
      const zn = officialSchoolToZone.get(schoolKey(record.school)) || zoneNumber(record);
      return {
        day: String(parts.day || '').padStart(2, '0'),
        mon: MONTH_SHORT[parts.month] || '',
        school: clean(record.school),
        zoneN: zn,
        summary: clean(record.agenda || record.issue || ''),
        categoryKey: displayCategory.key,
        categoryLabel: displayCategory.label,
        icon: displayCategory.icon
      };
    });

    const result = {
      period: { year, month, label },
      coverage: {
        visited: visited.size,
        total: coverageTotal,
        pct: coverageTotal ? Math.round((visited.size / coverageTotal) * 100) : 0,
        remaining: Math.max(0, coverageTotal - visited.size),
        lastVisitLabel: latestParts ? (latestParts.day + ' ' + (MONTH_SHORT[latestParts.month] || '')) : '—'
      },
      zones,
      schoolVisits,
      stats: {
        sessions,
        officers: officers.size,
        isdTickets: periodRecords.reduce((sum, record) => sum + (Array.isArray(record.isdNumbers) ? record.isdNumbers.length : 0), 0),
        complaints,
        avgPerDay: divisor ? Number((sessions / divisor).toFixed(1)) : 0,
        peak: daily.length ? Math.max.apply(null, daily) : 0,
        daily
      },
      categories,
      recent
    };

    return result; // A1_BUILD_RESULT
  }

  const api = Object.freeze({ build });
  if (root) root.A1Home = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
