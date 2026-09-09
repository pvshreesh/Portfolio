import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8' };
const pages = new Set(['/index.html', '/styles.css', '/script.js']);
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/') path = '/index.html';
    if (!pages.has(path) && !/^\/assets\/[\w .-]+$/.test(path)) {
      res.writeHead(404).end('Not found');
      return;
    }
    const body = await readFile(join(root, path.slice(1)));
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : error.code === 'ENOENT' ? 404 : 500;
    res.writeHead(status).end(status === 404 ? 'Not found' : 'Unable to serve request');
  }
});
server.listen(Number(process.env.PORT || 8000), '127.0.0.1', () => {
  console.log('Portfolio: http://127.0.0.1:' + server.address().port);
});
server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
