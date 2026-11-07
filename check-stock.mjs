// Revisa las tiendas y avisa al móvil (ntfy) cuando el mando pasa a estar disponible.
// Uso: NTFY_TOPIC=mi-tema node check-stock.mjs
//      TEST_NOTIFICATION=true para mandar una notificación de prueba.

import { readFile, writeFile } from 'node:fs/promises';
import { STORES } from './stores.mjs';
import { detect } from './detect.mjs';

const STATE_FILE = new URL('./state.json', import.meta.url);
const NTFY_SERVER = process.env.NTFY_SERVER || 'https://ntfy.sh';
const NTFY_TOPIC = process.env.NTFY_TOPIC;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,pt;q=0.8,en;q=0.7',
};

async function notify({ title, message, url, priority = 5, tags = ['rotating_light'] }) {
  if (!NTFY_TOPIC) {
    console.warn('⚠️  NTFY_TOPIC no está definido; no se envía notificación.');
    return;
  }
  // Publicación en JSON para que los acentos y emojis no den problemas.
  const res = await fetch(NTFY_SERVER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: NTFY_TOPIC,
      title,
      message,
      priority,
      tags,
      click: url,
      actions: url ? [{ action: 'view', label: 'Abrir tienda', url }] : undefined,
    }),
  });
  if (!res.ok) console.error(`Error enviando a ntfy: ${res.status} ${await res.text()}`);
}

async function checkStore(store) {
  try {
    const res = await fetch(store.url, {
      headers: HEADERS,
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return { status: 'unknown', detail: `HTTP ${res.status}` };
    const html = await res.text();
    return { status: detect(html, store), detail: `HTTP ${res.status}` };
  } catch (err) {
    return { status: 'unknown', detail: err.name === 'TimeoutError' ? 'timeout' : err.message };
  }
}

async function loadState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  if (process.env.TEST_NOTIFICATION === 'true') {
    await notify({
      title: 'Prueba del vigilante DualSense GTA VI',
      message: 'Si ves esto, las notificaciones funcionan. 👌',
      priority: 3,
      tags: ['white_check_mark'],
    });
    console.log('Notificación de prueba enviada.');
  }

  const state = await loadState();
  const results = await Promise.all(STORES.map(async (s) => ({ store: s, ...(await checkStore(s)) })));

  const now = new Date().toISOString();
  let changed = false;

  for (const { store, status, detail } of results) {
    const prev = state[store.id]?.status;
    const icon = { available: '🟢', unavailable: '🔴', unknown: '⚪' }[status];
    console.log(`${icon} ${store.name} (${store.variant}): ${status} [${detail}]`);

    // 'unknown' (bloqueo, error, captcha) no cambia el estado guardado.
    if (status === 'unknown') continue;

    if (status === 'available' && prev !== 'available') {
      await notify({
        title: `¡Mando GTA VI disponible en ${store.name}!`,
        message: `Versión: ${store.variant}. Corre, que vuela. 🏃`,
        url: store.url,
      });
      console.log(`   → Notificación enviada para ${store.name}`);
    }

    if (prev !== status) {
      state[store.id] = { status, since: now };
      changed = true;
    }
  }

  if (changed) await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
