(function (root) {
  'use strict';

  const API_BASE = '';
  const cfg = (root && root.PPD_SYSTEM_CONFIG) || {};
  const org = cfg.organization || {};
  const zones = Array.isArray(cfg.zones) ? cfg.zones : [];
  const fallbackSchools = Array.isArray(cfg.schools) ? cfg.schools : [];

  const clean = value => String(value == null ? '' : value).trim();
  const normalizeSchoolKey = value => clean(value).toUpperCase().replace(/[^A-Z0-9]/g, '');

  function normalizeSchool(row) {
    const item = row || {};
    return {
      nama: clean(item.nama || item.name),
      kod: clean(item.kod || item.code),
      zon: clean(item.zon || item.zone || item.zoneName).toUpperCase(),
      kategori: clean(item.kategori || item.category),
      lat: Number(item.lat),
      lng: Number(item.lng),
      jarak_km: item.jarak_km === '' || item.jarak_km == null ? null : Number(item.jarak_km)
    };
  }

  function usableSchools(rows) {
    if (!Array.isArray(rows)) return [];
    return rows
      .map(normalizeSchool)
      .filter(item => item.nama && item.zon !== 'ZON PPD' && Number.isFinite(item.lat) && Number.isFinite(item.lng));
  }

  const HUBS = Object.freeze({
    PPD: Object.freeze({
      lat: Number(org.hub && org.hub.lat),
      lng: Number(org.hub && org.hub.lng),
      name: clean(org.hub && org.hub.name) || clean(org.organizationShortName) || 'PPD'
    }),
    RTM: Object.freeze({
      lat: Number(org.secondaryHub && org.secondaryHub.lat),
      lng: Number(org.secondaryHub && org.secondaryHub.lng),
      name: clean(org.secondaryHub && org.secondaryHub.name) || 'Hab Kedua'
    })
  });

  const AREA = Object.freeze(Object.fromEntries(
    zones
      .filter(z => z && z.id && z.id !== 'ZON PPD')
      .map(z => {
        const number = Number(String(z.id).replace(/\D+/g, ''));
        return [Number.isFinite(number) && number > 0 ? number : z.id, clean(z.area || z.name || z.id)];
      })
  ));

  async function load() {
    try {
      if (!root || typeof root.fetch !== 'function') throw new Error('fetch tidak tersedia');
      const response = await root.fetch(API_BASE + '/api/sekolah', { cache: 'no-store' });
      if (!response || !response.ok) throw new Error('GET /api/sekolah gagal');
      const data = await response.json();
      const schools = usableSchools(data);
      if (schools.length) return { schools, hubs: HUBS, source: 'd1' };
    } catch (_) {
      // Gunakan data contoh/config sebagai fallback untuk local development.
    }

    const schools = usableSchools(fallbackSchools);
    if (!schools.length) throw new Error('Tiada data sekolah sah. Jalankan npm run configure atau isi data sekolah.');
    return { schools, hubs: HUBS, source: 'config' };
  }

  function dist(nama, hub) {
    if (clean(hub).toLowerCase() !== 'ppd') return null;
    const key = normalizeSchoolKey(nama);
    const school = fallbackSchools.map(normalizeSchool).find(item => normalizeSchoolKey(item.nama) === key);
    return school && Number.isFinite(school.jarak_km) ? school.jarak_km : null;
  }

  const api = Object.freeze({
    API_BASE,
    AREA,
    hubs: HUBS,
    DEFAULT_SCHOOL_COORDS: fallbackSchools,
    OFFICIAL_DRIVING_DISTANCES: {},
    normalizeSchoolKey,
    load,
    dist
  });

  if (root) root.A1Geo = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
