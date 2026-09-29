(function (root) {
  'use strict';

  const cfg = (root && root.PPD_SYSTEM_CONFIG) || {};
  const positions = cfg.officerPositions || {};
  const short = {
    'Juruteknik Komputer': 'JTK',
    'Penolong Pegawai Teknologi Maklumat': 'PPTM',
    'Penyelaras Juruteknik Komputer': 'Penyelaras JTK'
  };

  const norm = value => String(value || '')
    .toUpperCase()
    .replace(/^(ENCIK|PUAN|CIK)\s+/, '')
    .replace(/\bA\/L\b/g, 'ANAK')
    .replace(/\bBTE?\b/g, 'BINTI')
    .replace(/[^A-Z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const index = {};
  Object.keys(positions).forEach(name => { index[norm(name)] = positions[name]; });

  root.PPDK_OFFICER_POSITIONS = Object.freeze({
    get: name => index[norm(name)] || null,
    short: name => {
      const position = index[norm(name)];
      return position ? (short[position] || position) : null;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
