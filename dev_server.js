const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 8787;
const BASE_DIR = __dirname;
const ORG_CONFIG = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'config', 'organization.json'), 'utf8'));
const CONFIG_DOMAINS = ORG_CONFIG.domains || {};
const REMOTE_PROXY_ENABLED = process.env.PPD_ENABLE_REMOTE_PROXY === '1';
const REMOTE_API_HOST = process.env.PPD_REMOTE_API_HOST || CONFIG_DOMAINS.dashboard || '';
const REMOTE_ADMIN_HOST = process.env.PPD_REMOTE_ADMIN_HOST || CONFIG_DOMAINS.admin || '';

function readTemplateRuntime() {
  return JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'config', 'runtime.generated.json'), 'utf8'));
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=UTF-8' });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Universal CORS preflight handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Range, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Local sample APIs: enough for dashboard, map and optional auth gate to render
  // without touching any remote Cloudflare environment.
  if ((req.method === 'GET' || req.method === 'HEAD') && pathname === '/api/sekolah') {
    const runtime = readTemplateRuntime();
    sendJson(res, runtime.schools || []);
    return;
  }
  if ((req.method === 'GET' || req.method === 'HEAD') && pathname === '/api/public/bootstrap') {
    const runtime = readTemplateRuntime();
    const now = new Date();
    sendJson(res, {
      ok: true,
      records: [],
      filters: {
        schoolsByZone: runtime.schoolsByZone || {},
        officersByZone: runtime.officersByZone || {},
        membersByZone: runtime.officersByZone || {}
      },
      targetYear: now.getFullYear(),
      targetMonth: now.getMonth() + 1,
      organization: runtime.organization || {},
      zones: runtime.zones || [],
      meta: { source: 'public-template-local' }
    });
    return;
  }
  if ((req.method === 'GET' || req.method === 'HEAD') && pathname === '/api/public/version') {
    sendJson(res, {
      ok: true,
      dataVersion: 'public-template-local',
      ptisStaffGate: false
    });
    return;
  }

  // 1. Proxy /api/* and /report/print requests to production D1 backend
  if (pathname.startsWith('/api/') || pathname === '/report/print' || pathname === '/laporan/cetak') {
    if (!REMOTE_PROXY_ENABLED) {
      req.resume();
      res.writeHead(502, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({
        ok: false,
        error: 'Remote API proxy is disabled. Set PPD_ENABLE_REMOTE_PROXY=1 only when you intentionally want local UI to read a configured remote backend.'
      }));
      return;
    }
    // Local UI/QA must never mutate the production database through this proxy.
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.resume();
      res.writeHead(403, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({ ok: false, error: 'Production API writes are disabled in the local dev server.' }));
      return;
    }
    const targetHost = pathname.startsWith('/api/admin') ? REMOTE_ADMIN_HOST : REMOTE_API_HOST;
    if (!targetHost) {
      req.resume();
      res.writeHead(502, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({ ok: false, error: 'Remote API host is not configured.' }));
      return;
    }
    const remotePath = pathname + parsedUrl.search;
    const proxyHeaders = {
      ...req.headers,
      host: targetHost,
      'user-agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    const proxyReq = https.request({
      hostname: targetHost,
      port: 443,
      path: remotePath,
      method: req.method,
      headers: proxyHeaders
    }, (proxyRes) => {
      const responseHeaders = {
        ...proxyRes.headers,
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'access-control-allow-headers': '*'
      };
      res.writeHead(proxyRes.statusCode, responseHeaders);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('[API Proxy Error]', err.message);
      if (!res.headersSent) {
        res.writeHead(502, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: false, error: 'Proxy error: ' + err.message }));
      } else {
        res.end();
      }
    });

    req.pipe(proxyReq);
    return;
  }

  // 2. Map root and clean URLs to HTML files
  if (pathname === '/' || pathname === '') {
    pathname = '/landing_page_dossier.html';
  } else if (pathname === '/dashboard' || pathname === '/index.html' || pathname === '/dashboard.html') {
    pathname = '/index.html';
  } else if (pathname === '/admin' || pathname === '/dbadmin') {
    pathname = '/AdminApp.html';
  } else if (pathname === '/ptis' || pathname === '/laporan' || pathname === '/ptis.html') {
    pathname = '/ptis.html';
  } else if (pathname === '/map' || pathname === '/map.html') {
    pathname = '/map.html';
  } else if (pathname === '/radar' || pathname === '/radar.html') {
    pathname = '/radar.html';
  } else if (pathname === '/pwa' || pathname === '/pwa.html') {
    pathname = '/pwa.html';
  } else if (pathname === '/qrcode' || pathname === '/qrcode.html') {
    pathname = '/qrcode.html';
  } else if (pathname === '/lab' || pathname === '/lab/' || pathname === '/work' || pathname === '/work/' || pathname === '/lab/work' || pathname === '/lab/work/') {
    pathname = '/design-system-master-lab/work/home.html';
  } else if (pathname.startsWith('/lab/work/')) {
    pathname = pathname.replace('/lab/work/', '/design-system-master-lab/work/');
  } else if (pathname.startsWith('/work/')) {
    pathname = pathname.replace('/work/', '/design-system-master-lab/work/');
  } else if (pathname.startsWith('/lab/')) {
    pathname = pathname.replace('/lab/', '/design-system-master-lab/');
  }

  // 3. Block sensitive directories (/private/, /.git/, /.wrangler/, /qa/)
  const blockedPrefixes = ['/private', '/.git', '/.wrangler', '/qa'];
  const lowerPath = pathname.toLowerCase();
  if (blockedPrefixes.some(p => lowerPath === p || lowerPath.startsWith(p + '/'))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('403 Forbidden');
    return;
  }

  const serveFile = (targetPath) => {
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html') {
      fs.readFile(targetPath, 'utf8', (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }
        const devHtml = content
          .replaceAll('__BUILD_VERSION__', 'dev')
          .replaceAll('<!--BUILD_VERSION-->', 'dev');
        const buffer = Buffer.from(devHtml, 'utf8');
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': buffer.length,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(buffer);
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    fs.createReadStream(targetPath).pipe(res);
  };

  const filePath = path.join(BASE_DIR, pathname);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      return serveFile(filePath);
    }

    // Kalau fail tiada di folder utama, cuba cari di public/ + pathname sebelum pulangkan 404
    const publicPath = path.join(BASE_DIR, 'public', pathname);
    if (!publicPath.startsWith(BASE_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(publicPath, (pubErr, pubStats) => {
      if (!pubErr && pubStats.isFile()) {
        return serveFile(publicPath);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`====================================================`);
  console.log(`🚀 Portal ICT Local Dev Server is RUNNING!`);
  console.log(`📍 URL: http://localhost:${PORT}/`);
  console.log(`📍 Dashboard: http://localhost:${PORT}/index.html`);
  console.log(`📍 PTIS Form: http://localhost:${PORT}/ptis.html`);
  console.log(`📍 Admin App: http://localhost:${PORT}/AdminApp.html`);
  console.log(`📍 Geospatial Map: http://localhost:${PORT}/map.html`);
  console.log(`📍 Radar 3D: http://localhost:${PORT}/radar.html`);
  console.log(`📍 Lab Work (Home): http://localhost:${PORT}/lab/work/`);
  console.log(`====================================================`);
});
