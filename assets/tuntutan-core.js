(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PPDK_TUNTUTAN_CORE = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const MONTHS_MS = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];

  function pad2_(value) {
    return String(value).padStart(2, '0');
  }

  function normalizeIsoDate(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    let m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return m[1] + '-' + m[2] + '-' + m[3];
    m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (m) return m[3] + '-' + pad2_(m[2]) + '-' + pad2_(m[1]);
    return '';
  }

  function formatDateMY(value) {
    const iso = normalizeIsoDate(value);
    if (!iso) return '';
    const parts = iso.split('-');
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  function toUtcDay_(iso) {
    const p = normalizeIsoDate(iso).split('-').map(Number);
    return p.length === 3 ? Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000) : NaN;
  }

  function uniqueSortedDates(values) {
    return Array.from(new Set((values || []).map(normalizeIsoDate).filter(Boolean))).sort();
  }

  function groupConsecutiveDates(values) {
    const dates = uniqueSortedDates(values);
    if (!dates.length) return [];
    const groups = [];
    let start = dates[0];
    let prev = dates[0];
    for (let i = 1; i < dates.length; i += 1) {
      const current = dates[i];
      if (toUtcDay_(current) === toUtcDay_(prev) + 1) {
        prev = current;
        continue;
      }
      groups.push({ start: start, end: prev });
      start = current;
      prev = current;
    }
    groups.push({ start: start, end: prev });
    return groups;
  }

  function formatDateLines(values) {
    const lines = [];
    groupConsecutiveDates(values).forEach(function (g) {
      lines.push(formatDateMY(g.start));
      if (g.end !== g.start) {
        lines.push('-');
        lines.push(formatDateMY(g.end));
      }
    });
    return lines;
  }

  function splitOfficers(value) {
    if (Array.isArray(value)) return value.map(function (v) { return String(v || '').trim(); }).filter(Boolean);
    return String(value || '').split(',').map(function (v) { return v.trim(); }).filter(Boolean);
  }

  function uniqueKeepOrder(values) {
    const seen = new Set();
    const out = [];
    (values || []).forEach(function (value) {
      const key = String(value || '').trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        out.push(key);
      }
    });
    return out;
  }

  function pickDescription_(row) {
    return String(row.keterangan || row.objektif || row.title || row.keputusan || row.isu || 'Khidmat Bantu ICT').trim();
  }

  function normalizeRecord(row) {
    const isdList = Array.isArray(row.isdList) ? row.isdList : (Array.isArray(row.isdNumbers) ? row.isdNumbers : []);
    return {
      id: String(row.id || ''),
      zon: String(row.zon || row.zoneName || '').trim().toUpperCase(),
      tarikhIso: normalizeIsoDate(row.tarikh_iso || row.tarikhIso || row.tarikh || row.date),
      sekolah: String(row.nama_sekolah || row.sekolah || row.school || '').trim(),
      pegawai: splitOfficers(row.pegawai || row.members),
      isdList: uniqueKeepOrder(isdList.map(function (v) { return String(v || '').replace(/^#/, '').trim(); }).filter(Boolean)),
      keterangan: pickDescription_(row),
      raw: row
    };
  }

  function groupByIsd(records, options) {
    const opts = options || {};
    const mode = opts.modTapis === 'semua' ? 'semua' : 'isd';
    const zon = String(opts.zon || '').trim().toUpperCase();
    const grouped = new Map();
    const tanpaIsd = [];
    const reviewMultiple = [];

    (records || []).map(normalizeRecord).filter(function (row) {
      return !zon || row.zon === zon;
    }).forEach(function (row) {
      if (!row.isdList.length) {
        tanpaIsd.push(row);
        if (mode === 'semua') {
          grouped.set('__NO_ISD__' + row.id, {
            bil: 0,
            sumber: 'ISD',
            noIsd: '',
            keterangan: row.keterangan,
            tarikh: row.tarikhIso ? [row.tarikhIso] : [],
            sekolah: row.sekolah,
            pegawai: row.pegawai.slice(),
            pegawaiTuntutan: '',
            laporanIds: row.id ? [row.id] : [],
            manual: false,
            dikecualikan: false,
            amaranSekolah: false,
            semakPelbagaiIsd: false
          });
        }
        return;
      }

      if (row.isdList.length > 1) reviewMultiple.push({ id: row.id, isdList: row.isdList.slice() });
      row.isdList.forEach(function (isd) {
        if (!grouped.has(isd)) {
          grouped.set(isd, {
            bil: 0,
            sumber: 'ISD',
            noIsd: isd,
            keterangan: row.keterangan,
            tarikh: [],
            sekolah: row.sekolah,
            pegawai: [],
            pegawaiTuntutan: '',
            laporanIds: [],
            manual: false,
            dikecualikan: false,
            amaranSekolah: false,
            sekolahAlternatif: [],
            semakPelbagaiIsd: row.isdList.length > 1
          });
        }
        const target = grouped.get(isd);
        if (row.tarikhIso) target.tarikh = uniqueSortedDates(target.tarikh.concat(row.tarikhIso));
        target.pegawai = uniqueKeepOrder(target.pegawai.concat(row.pegawai));
        target.laporanIds = uniqueKeepOrder(target.laporanIds.concat(row.id ? [row.id] : []));
        if (row.sekolah && target.sekolah && row.sekolah !== target.sekolah) {
          target.amaranSekolah = true;
          target.sekolahAlternatif = uniqueKeepOrder((target.sekolahAlternatif || []).concat(row.sekolah));
        } else if (!target.sekolah) {
          target.sekolah = row.sekolah;
        }
        if (row.isdList.length > 1) target.semakPelbagaiIsd = true;
      });
    });

    const baris = Array.from(grouped.values()).sort(function (a, b) {
      const ad = a.tarikh[0] || '9999-99-99';
      const bd = b.tarikh[0] || '9999-99-99';
      return ad.localeCompare(bd) || String(a.noIsd).localeCompare(String(b.noIsd));
    });
    baris.forEach(function (row, index) { row.bil = index + 1; });
    return { baris: baris, tanpaIsd: tanpaIsd, pelbagaiIsd: reviewMultiple };
  }

  function median(numbers) {
    const a = (numbers || []).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });
    if (!a.length) return null;
    const mid = Math.floor(a.length / 2);
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
  }

  function basicPatternReason_(isd) {
    if (!/^\d{6}$/.test(isd)) return 'format';
    if (/^(\d)\1{5}$/.test(isd)) return 'digit-sama';
    if (isd === '123456' || isd === '654321') return 'turutan';
    if (/^(\d{2,3})\1+$/.test(isd)) return 'corak-berulang';
    const digits = isd.split('');
    const counts = digits.reduce(function (acc, d) { acc[d] = (acc[d] || 0) + 1; return acc; }, {});
    const maxRepeat = Math.max.apply(null, Object.values(counts));
    if (new Set(digits).size <= 3 && maxRepeat >= 3 && /(\d)\1{2,}/.test(isd)) return 'corak-berulang';
    return '';
  }

  function findSuspiciousIsd(values) {
    const list = uniqueKeepOrder((values || []).map(function (v) { return String(v || '').replace(/^#/, '').trim(); }).filter(Boolean));
    const numeric = list.filter(function (v) { return /^\d{6}$/.test(v) && !basicPatternReason_(v); }).map(Number);
    const med = median(numeric);
    const min = med === null ? null : med * 0.6;
    const max = med === null ? null : med * 1.4;
    return list.reduce(function (out, isd) {
      const patternReason = basicPatternReason_(isd);
      if (patternReason) {
        out.push({ noIsd: isd, sebab: patternReason });
      } else if (med !== null && (Number(isd) < min || Number(isd) > max)) {
        out.push({ noIsd: isd, sebab: 'luar-julat', median: med, min: min, max: max });
      }
      return out;
    }, []);
  }

  function mergeClaimRows(rows) {
    const grouped = new Map();
    (rows || []).filter(function (row) { return row && !row.dikecualikan && row.noIsd && row.sekolah; }).forEach(function (source) {
      const row = Object.assign({}, source, {
        noIsd: String(source.noIsd || '').replace(/^#/, '').trim(),
        sekolah: String(source.sekolah || '').trim(),
        keterangan: String(source.keterangan || '').trim(),
        tarikh: uniqueSortedDates(source.tarikh || []),
        pegawai: uniqueKeepOrder(source.pegawai || []),
        laporanIds: uniqueKeepOrder(source.laporanIds || [])
      });
      const key = row.noIsd + '|' + row.sekolah.toUpperCase();
      if (!grouped.has(key)) {
        grouped.set(key, row);
        return;
      }
      const target = grouped.get(key);
      target.tarikh = uniqueSortedDates(target.tarikh.concat(row.tarikh));
      target.pegawai = uniqueKeepOrder(target.pegawai.concat(row.pegawai));
      target.laporanIds = uniqueKeepOrder(target.laporanIds.concat(row.laporanIds));
      if (!target.keterangan && row.keterangan) target.keterangan = row.keterangan;
      if (!target.pegawaiTuntutan && row.pegawaiTuntutan) target.pegawaiTuntutan = row.pegawaiTuntutan;
      if (target.pegawaiTuntutan && row.pegawaiTuntutan && target.pegawaiTuntutan !== row.pegawaiTuntutan) target.claimantConflict = true;
      target.manual = Boolean(target.manual && row.manual);
    });
    const out = Array.from(grouped.values()).sort(function (a, b) {
      const ad = a.tarikh[0] || '9999-99-99';
      const bd = b.tarikh[0] || '9999-99-99';
      return ad.localeCompare(bd) || a.noIsd.localeCompare(b.noIsd);
    });
    out.forEach(function (row, index) { row.bil = index + 1; });
    return out;
  }

  function monthLabel(month, year) {
    const index = Number(month) - 1;
    return (MONTHS_MS[index] || '') + (year ? ' ' + String(year) : '');
  }

  return Object.freeze({
    MONTHS_MS: MONTHS_MS.slice(),
    normalizeIsoDate: normalizeIsoDate,
    formatDateMY: formatDateMY,
    uniqueSortedDates: uniqueSortedDates,
    groupConsecutiveDates: groupConsecutiveDates,
    formatDateLines: formatDateLines,
    splitOfficers: splitOfficers,
    uniqueKeepOrder: uniqueKeepOrder,
    normalizeRecord: normalizeRecord,
    groupByIsd: groupByIsd,
    median: median,
    findSuspiciousIsd: findSuspiciousIsd,
    mergeClaimRows: mergeClaimRows,
    monthLabel: monthLabel
  });
});
