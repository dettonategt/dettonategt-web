import { spawn, spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = 4322;
const origin = `http://127.0.0.1:${port}`;

if (spawnSync('cloudflared', ['--version'], { stdio: 'ignore' }).status !== 0) {
  console.error('Necesitas instalar cloudflared: https://developers.cloudflare.com/tunnel/downloads/');
  process.exit(1);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// El túnel comparte solamente la compilación pública dentro de dist/.
const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, origin).pathname);
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) {
      res.writeHead(404).end('No encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
    if (req.method === 'HEAD') res.end();
    else createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch {
    res.writeHead(404).end('No encontrado');
  }
});

server.on('error', (error) => {
  console.error(`No se pudo iniciar el sitio: ${error.message}`);
  process.exit(1);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Sitio listo en ${origin}`);
  console.log('Comparte la URL https://…trycloudflare.com que aparecerá a continuación.');
  console.log('Mantén esta terminal abierta. Ctrl+C cierra el sitio y el túnel.');

  const tunnel = spawn('cloudflared', ['tunnel', '--no-autoupdate', '--url', origin], { stdio: 'inherit' });
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    server.close();
    server.closeAllConnections();
    tunnel.kill('SIGTERM');
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  tunnel.on('error', (error) => {
    console.error(`No se pudo iniciar Cloudflare Tunnel: ${error.message}`);
    stop();
    process.exitCode = 1;
  });
  tunnel.on('exit', (code) => {
    if (!stopping) {
      server.close();
      server.closeAllConnections();
      process.exitCode = code ?? 1;
    }
  });
});
