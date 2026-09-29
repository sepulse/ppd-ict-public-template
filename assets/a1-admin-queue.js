(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PPDK_A1_ADMIN_QUEUE = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ACCESS = {
    facebook: new Set(['SUPER_ADMIN', 'ADMIN_FACEBOOK', 'PENYELARAS_JTK']),
    records: new Set(['SUPER_ADMIN', 'PENYELARAS_JTK', 'KETUA_ZON']),
    tuntutan: new Set(['SUPER_ADMIN', 'PENYELARAS_JTK']),
    staff: new Set(['SUPER_ADMIN'])
  };

  function roleOf(value) { return String(value || '').trim().toUpperCase(); }
  function can(kind, role) { return ACCESS[kind].has(roleOf(role)); }
  function finiteNumber(value) { const n = Number(value); return Number.isFinite(n) ? n : null; }

  function mytYearMonth(now) {
    const date = now instanceof Date ? now : new Date(now === undefined ? Date.now() : now);
    if (Number.isNaN(date.getTime())) throw new TypeError('now tidak sah');
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit' }).formatToParts(date);
    const out = {};
    parts.forEach(function (p) { if (p.type !== 'literal') out[p.type] = p.value; });
    return { year: Number(out.year), month: Number(out.month) };
  }

  function yearMonthOf(record) {
    if (finiteNumber(record.year) && finiteNumber(record.month)) return { year: Number(record.year), month: Number(record.month) };
    const iso = String(record.tarikh_iso || record.dateIso || '').trim();
    let m = iso.match(/^(\d{4})-(\d{2})-/);
    if (m) return { year: Number(m[1]), month: Number(m[2]) };
    const label = String(record.dateLabel || record.date || record.tarikh || '').trim();
    m = label.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return { year: Number(m[3]), month: Number(m[2]) };
    const millis = finiteNumber(record.dateMillis !== undefined ? record.dateMillis : record.sortTime);
    if (millis !== null) return mytYearMonth(millis);
    return null;
  }

  function deleted(record) {
    return Boolean(record && (
      record.deleted_at ||
      record.deleted === true ||
      String(record.status_kes || '').trim().toUpperCase() === 'DIPADAM'
    ));
  }

  function hasIsd(record) {
    if (Array.isArray(record && record.isdNumbers)) return record.isdNumbers.some(function (v) { return String(v || '').trim(); });
    return Boolean(String((record && (record.no_isd || record.noIsd)) || '').trim());
  }

  function recordArray(source) {
    if (Array.isArray(source)) return source;
    if (source && Array.isArray(source.records)) return source.records;
    return null;
  }

  function fbReady(source) {
    if (!source) return null;
    if (source.counts) {
      const ready = finiteNumber(source.counts.ready);
      if (ready !== null) return ready;
      const active = finiteNumber(source.counts.active);
      if (active !== null) return active;
    }
    if (!Array.isArray(source.items)) return null;
    return source.items.filter(function (item) {
      const status = String(item && item.status || '').trim().toUpperCase();
      return status !== 'DIPOSTING' && status !== 'DIPADAM';
    }).length;
  }

  function withoutIsdThisMonth(source, now) {
    const records = recordArray(source);
    if (!records) return null;
    const ym = mytYearMonth(now);
    return records.filter(function (record) {
      if (!record || deleted(record) || hasIsd(record)) return false;
      const rym = yearMonthOf(record);
      return rym && rym.year === ym.year && rym.month === ym.month;
    }).length;
  }

  function staffWithoutAccount(source) {
    if (!source) return null;
    const rows = Array.isArray(source) ? source : (Array.isArray(source.staff) ? source.staff : null);
    if (!rows) return null;
    return rows.filter(function (item) {
      if (!item) return false;
      return !String(item.accountId || '').trim();
    }).length;
  }

  function tuntutanText(source) {
    if (!source) return null;
    const status = String((source.draft && source.draft.status) || source.status || '').trim().toLowerCase();
    if (status === 'draf') return 'Draf tersimpan';
    if (status === 'siap') return 'Siap · tersimpan';
    return null;
  }

  function build(input) {
    input = input || {};
    const role = roleOf(input.role);
    const out = [];

    if (can('facebook', role)) {
      const value = fbReady(input.fbQueue);
      if (value !== null) out.push({ key: 'facebook', view: 'facebook', value: value, text: null, label: 'Siaran FB sedia diposting', action: 'Semak & hantar' });
    }

    if (can('records', role)) {
      const value = withoutIsdThisMonth(input.records, input.now);
      if (value !== null) out.push({ key: 'recordsWithoutIsd', view: 'records', value: value, text: null, label: 'Rekod bulan ini tanpa No. ISD', action: 'Lengkapkan rekod' });
    }

    if (can('tuntutan', role)) {
      const text = tuntutanText(input.tuntutan);
      if (text !== null) out.push({ key: 'tuntutanStatus', view: 'tuntutan', value: null, text: text, label: 'Status tuntutan bulan ini', action: 'Buka tuntutan' });
    }

    if (can('staff', role)) {
      const value = staffWithoutAccount(input.staff);
      if (value !== null) out.push({ key: 'staffWithoutAccount', view: 'users', value: value, text: null, label: 'Staf allowlist tanpa akaun', action: 'Cipta akaun' });
    }

    return out;
  }

  return Object.freeze({ build: build });
});
