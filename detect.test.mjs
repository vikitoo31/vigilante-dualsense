import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detect } from './detect.mjs';

const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
const page = (body) => `<html><head><title>Mando DualSense Grand Theft Auto VI</title></head><body>${body}</body></html>`;

test('JSON-LD OutOfStock → agotado (PlayStation)', () => {
  const html = page(jsonLd({ '@type': 'Product', name: 'DualSense Grand Theft Auto VI', offers: { availability: 'https://schema.org/OutOfStock' } }) + '<button>Reservar</button>');
  assert.equal(detect(html, { negativeMarkers: [] }), 'unavailable');
});

test('JSON-LD PreOrder → disponible (El Corte Inglés)', () => {
  const html = page(jsonLd({ '@type': 'Product', name: 'Mando inalámbrico Sony DualSense Edición Limitada GTA VI', offers: { availability: 'https://schema.org/PreOrder', price: 84.99 } }));
  assert.equal(detect(html, { negativeMarkers: ['Agotado'] }), 'available');
});

test('JSON-LD de un producto relacionado en stock no cuenta', () => {
  const html = page(
    jsonLd({ '@type': 'Product', name: 'DualSense GTA VI', offers: { availability: 'OutOfStock' } }) +
      jsonLd({ '@type': 'ItemList', itemListElement: [{ '@type': 'Product', name: 'DualSense Midnight Black', offers: { availability: 'InStock' } }] })
  );
  assert.equal(detect(html, { negativeMarkers: [] }), 'unavailable');
});

test('Meta product:availability out of stock → agotado (Press Start)', () => {
  const html = `<html><head><meta property="product:availability" content="out of stock"></head><body>Grand Theft Auto VI</body></html>`;
  assert.equal(detect(html, { negativeMarkers: ['Notify me when available'] }), 'unavailable');
});

test('Texto "Avísame cuando haya stock" con entidades HTML → agotado (GAME)', () => {
  const html = page('<p>Agotado</p><button>Av&iacute;same cuando haya stock</button>');
  assert.equal(detect(html, { negativeMarkers: ['Avísame cuando haya stock'] }), 'unavailable');
});

test('Sin marcador de agotado en página del producto → disponible', () => {
  const html = page('<p>84,99€</p><button>Añadir al carrito</button>');
  assert.equal(detect(html, { negativeMarkers: ['Avísame cuando haya stock'] }), 'available');
});

test('Captcha o bloqueo (no menciona el producto) → desconocido', () => {
  const html = '<html><body>Please verify you are a human</body></html>';
  assert.equal(detect(html, { negativeMarkers: ['Agotado'] }), 'unknown');
});

test('Página de JavaScript sin datos (Xtralife sin render) → desconocido', () => {
  const html = '<html><head><title>xtralife</title></head><body>Please enable JavaScript</body></html>';
  assert.equal(detect(html, { negativeMarkers: ['RESERVAS AGOTADAS'] }), 'unknown');
});

test('Tienda sin marcadores y sin datos estructurados → desconocido', () => {
  assert.equal(detect(page('<button>Reservar</button>'), { negativeMarkers: [] }), 'unknown');
});
