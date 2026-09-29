(function (root) {
  'use strict';

  const KEYS = Object.freeze([
    'rangkaian',
    'pencetak',
    'komputer',
    'sistem',
    'penyelenggaraan'
  ]);

  const META = Object.freeze({
    rangkaian: Object.freeze({ key: 'rangkaian', label: 'Rangkaian', icon: 'i-wifi' }),
    pencetak: Object.freeze({ key: 'pencetak', label: 'Pencetak', icon: 'i-printer' }),
    komputer: Object.freeze({ key: 'komputer', label: 'Komputer', icon: 'i-laptop' }),
    sistem: Object.freeze({ key: 'sistem', label: 'Sistem', icon: 'i-cog' }),
    penyelenggaraan: Object.freeze({ key: 'penyelenggaraan', label: 'Penyelenggaraan', icon: 'i-wrench' })
  });

  /*
   * Sumber tunggal kategori A-1.
   *
   * refined() dan purpose() menyalin peraturan lama dashboard.html tanpa
   * mengubah susunan atau regex.
   *
   * Pemetaan kategori panjang -> lima kunci A-1:
   * - Rangkaian & Capaian Internet -> rangkaian
   * - Pencetak & Peranti Luaran -> pencetak
   * - Kerosakan Perkakasan & Komputer -> komputer
   * - Sistem, Perisian & Akaun ID -> sistem
   * - Pengurusan Aset & Pelupusan -> penyelenggaraan
   * - Multimedia & Dokumentasi Khas -> penyelenggaraan
   * - Sokongan Acara & Program Khas -> penyelenggaraan
   * - Infrastruktur & Pendawaian / Infrastruktur Makmal -> penyelenggaraan
   * - Penyelenggaraan Rutin Komputer & Makmal / kategori berisu lain -> penyelenggaraan
   * - Khidmat Selesai (Tiada Isu) -> hasIssue:false
   *
   * Bagi rekod tanpa isu, key/label/icon datang daripada purpose() supaya
   * representasi recent Home kekal seperti R1; hasIssue tetap false dan rekod
   * itu tidak dikira sebagai aduan.
   */

  function purpose(r) {
    const record = r || {};
    const txt = ((record.agenda || '') + ' ' + (record.title || '')).toUpperCase();
    if (/PRINTER|PENCETAK|FOTOSTAT|SCANNER/.test(txt)) return 'Penyelenggaraan Pencetak & Peranti';
    if (/ROUTER|ACCESS POINT|\bAP\b|MESH|LAN|RANGKAIAN|MYGOVNET|INTERNET|WIFI|TALIAN/.test(txt)) return 'Pemasangan & Pengujian Rangkaian';
    if (/ANTIVIRUS|WINDOWS|M365|DELIMA|SISTEM|IGFMAS|PERISIAN/.test(txt)) return 'Sokongan Perisian & Akaun';
    if (/LAPTOP|KOMPUTER|DESKTOP|\bPC\b|SSD|HARD DISK|PROJEKTOR|CHARGING CART|TROL[IY] PENGECAS/.test(txt)) return 'Penyelenggaraan Perkakasan & Komputer';
    if (/JURI|PERTANDINGAN|ACARA|MAJLIS|AUDIO|SPEAKER|MIXER|VIDEO/.test(txt)) return 'Sokongan Acara & Multimedia';
    if (/TINJAUAN|PEMANTAUAN|BIMBINGAN|NASIHAT|\bUAT\b|PENILAIAN/.test(txt)) return 'Pemantauan & Bimbingan ICT';
    return 'Khidmat Bantuan Teknikal Am';
  }

  function refined(r) {
    const record = r || {};
    const iss = (record.issue || '').trim();
    if (!iss || iss.includes('Khidmat bantu dan semakan teknikal dilaksanakan') || iss.includes('Tiada isu')) {
      return 'Khidmat Selesai (Tiada Isu)';
    }
    let cat = record.issueCategory;
    if (!cat || cat === 'Khidmat Bantuan Teknikal Lain') {
      const txt = (iss + ' ' + (record.agenda || '') + ' ' + (record.school || '')).toUpperCase();
      if (/PENCETAK|PRINTER|PENGIMBAS|SCANNER|TONER|CARTRIDGE/.test(txt)) {
        return 'Pencetak & Peranti Luaran';
      }
      if (/MYGOVNET|SUBWARAN|ROUTER|ACCESS POINT|\bWIFI\b|INTERNET|TALIAN INTERNET|KABEL.*LAN|\bLAN\b|RANGKAIAN/.test(txt)) {
        return 'Rangkaian & Capaian Internet';
      }
      if (/ANTIVIRUS|VIRUS|DELIMA|MICROSOFT|WINDOWS|FORMAT|INSTALL|PASSWORD|KATA LALUAN|ID PENGGUNA|SISTEM|1GFMAS|IGFMAS/.test(txt)) {
        return 'Sistem, Perisian & Akaun ID';
      }
      if (/PROJEKTOR|KOMPUTER|LAPTOP|DESKTOP|\bPC\b|MONITOR|\bRAM\b|HARD DISK|\bSSD\b|MOUSE|KEYBOARD|\bCPU\b|TROLI PENGECAS|CHARGING CART|RASPBERRY PI/.test(txt)) {
        return 'Kerosakan Perkakasan & Komputer';
      }
      if (/PELUPUSAN|LUPUS|KEW\.?PA|\bASET\b/.test(txt)) {
        return 'Pengurusan Aset & Pelupusan';
      }
      if (/VIDEO|RAKAMAN|FOTOGRAFI|MULTIMEDIA|KORPORAT|AUDIO|SPEAKER|MIXER/.test(txt)) {
        return 'Multimedia & Dokumentasi Khas';
      }
      if (/JURI|PERTANDINGAN|MAJLIS|PROGRAM KHAS/.test(txt)) {
        return 'Sokongan Acara & Program Khas';
      }
      return 'Penyelenggaraan Rutin Komputer & Makmal';
    }
    return cat;
  }

  function metaForLongCategory(longCategory) {
    switch (longCategory) {
      case 'Rangkaian & Capaian Internet': return META.rangkaian;
      case 'Pencetak & Peranti Luaran': return META.pencetak;
      case 'Kerosakan Perkakasan & Komputer': return META.komputer;
      case 'Sistem, Perisian & Akaun ID': return META.sistem;
      default: return META.penyelenggaraan;
    }
  }

  function metaForPurpose(purposeCategory) {
    switch (purposeCategory) {
      case 'Pemasangan & Pengujian Rangkaian': return META.rangkaian;
      case 'Penyelenggaraan Pencetak & Peranti': return META.pencetak;
      case 'Penyelenggaraan Perkakasan & Komputer': return META.komputer;
      case 'Sokongan Perisian & Akaun': return META.sistem;
      default: return META.penyelenggaraan;
    }
  }

  function classify(record) {
    const longCategory = refined(record);
    const hasIssue = longCategory !== 'Khidmat Selesai (Tiada Isu)';
    const meta = hasIssue
      ? metaForLongCategory(longCategory)
      : metaForPurpose(purpose(record));
    return {
      key: meta.key,
      label: meta.label,
      icon: meta.icon,
      hasIssue
    };
  }

  const api = Object.freeze({
    KEYS,
    meta: key => META[key],
    classify,
    refined,
    purpose
  });

  if (root) root.A1Cat = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
