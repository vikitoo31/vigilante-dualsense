// Lógica para decidir si una página tiene el mando disponible.
// Devuelve 'available' | 'unavailable' | 'unknown'.

const PRODUCT_KEYWORD = /grand theft auto|gta\s*(vi|6)/i;

const POSITIVE = /(InStock|PreOrder|LimitedAvailability|OnlineOnly|PreSale|BackOrder)$/i;
const NEGATIVE = /(OutOfStock|SoldOut|Discontinued)$/i;

/** Quita acentos, etiquetas y entidades para comparar textos. */
export function normalizeText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&([a-z])(acute|grave|tilde|uml|circ|cedil);/gi, '$1')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeMarker(marker) {
  return marker.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/** Recorre el JSON-LD y devuelve las disponibilidades del producto GTA VI. */
export function availabilityFromJsonLd(html) {
  const found = [];
  const blocks = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(visit);

    const types = [].concat(node['@type'] || []);
    const isProduct = types.some((t) => /product/i.test(String(t)));
    if (isProduct) {
      const name = typeof node.name === 'string' ? node.name : '';
      // Ignora productos relacionados que no son el mando de GTA VI.
      if (!name || PRODUCT_KEYWORD.test(name)) {
        for (const offer of [].concat(node.offers || [])) {
          if (offer && offer.availability) found.push(String(offer.availability));
          for (const sub of [].concat(offer?.offers || [])) {
            if (sub && sub.availability) found.push(String(sub.availability));
          }
        }
      }
      return; // no bajamos dentro de un producto
    }
    for (const value of Object.values(node)) visit(value);
  };

  for (const match of blocks) {
    try {
      visit(JSON.parse(match[1].trim()));
    } catch {
      // JSON-LD mal formado: lo ignoramos
    }
  }

  if (found.some((a) => POSITIVE.test(a))) return 'available';
  if (found.some((a) => NEGATIVE.test(a))) return 'unavailable';
  return null;
}

/** Lee <meta property="product:availability" ...> u og:availability. */
export function availabilityFromMeta(html) {
  const re = /<meta[^>]+(?:property|name)=["'](?:product|og):availability["'][^>]*>/gi;
  for (const tag of html.match(re) || []) {
    const content = /content=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase().trim();
    if (!content) continue;
    if (/out of stock|oos|sold out|discontinued/.test(content)) return 'unavailable';
    if (/in stock|instock|preorder|pre-order|available for order/.test(content)) return 'available';
  }
  return null;
}

/** Decide el estado de una tienda a partir del HTML. */
export function detect(html, store) {
  if (!html || !PRODUCT_KEYWORD.test(html)) return 'unknown'; // captcha, bloqueo o página cambiada

  const fromJsonLd = availabilityFromJsonLd(html);
  if (fromJsonLd) return fromJsonLd;

  const fromMeta = availabilityFromMeta(html);
  if (fromMeta) return fromMeta;

  const markers = store.negativeMarkers || [];
  if (markers.length === 0) return 'unknown';

  const text = normalizeText(html);
  if (!PRODUCT_KEYWORD.test(text)) return 'unknown';
  const soldOut = markers.some((m) => text.includes(normalizeMarker(m)));
  return soldOut ? 'unavailable' : 'available';
}
