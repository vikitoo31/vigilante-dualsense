// Tiendas a vigilar. Para añadir una, copia un bloque y cambia los datos.
//
// Cómo se decide si hay stock (en este orden):
//   1. Datos estructurados de la página (JSON-LD de schema.org) del producto GTA VI.
//   2. Etiquetas meta "product:availability" / "og:availability".
//   3. Textos: si aparece alguno de `negativeMarkers` -> agotado.
//      Si no aparece ninguno y la página es del producto -> disponible.
//
// Amazon no está incluido a propósito: su robots.txt prohíbe el acceso
// automatizado. Para Amazon usa las alertas de Keepa (ver README).

export const STORES = [
  {
    id: 'ps-es-blanco',
    name: 'PlayStation España',
    variant: 'Blanco',
    url: 'https://www.playstation.com/es-es/accessories/dualsense-wireless-controller/buy-now/product/grand-theft-auto-vi-white-limited-edition/',
    negativeMarkers: [],
  },
  {
    id: 'ps-es-negro',
    name: 'PlayStation España',
    variant: 'Negro',
    url: 'https://www.playstation.com/es-es/accessories/dualsense-wireless-controller/buy-now/product/grand-theft-auto-vi-black-limited-edition/',
    negativeMarkers: [],
  },
  {
    id: 'game',
    name: 'GAME',
    variant: 'GTA VI',
    url: 'https://www.game.es/mando-inalambrico-dualsense-edicion-limitada-grand-theft-auto-vi/267671',
    negativeMarkers: ['Avísame cuando haya stock'],
  },
  {
    id: 'pccomponentes',
    name: 'PcComponentes',
    variant: 'Blanco',
    url: 'https://www.pccomponentes.com/mando-inalambrico-sony-dualsense-edicion-limitada-grand-theft-auto-vi-blanco',
    negativeMarkers: ['Avísame cuando esté disponible', 'Sin fecha exacta de entrada'],
  },
  {
    id: 'fnac-es',
    name: 'Fnac España',
    variant: 'Blanco',
    url: 'https://www.fnac.es/Mando-inalambrico-Sony-DualSense-Grand-Theft-Auto-VI-Blanco-Edicion-Limitada-para-PS5-Accesorio-Videoconsola/a13478359',
    negativeMarkers: ['Agotado'],
  },
  {
    id: 'fnac-pt',
    name: 'Fnac Portugal (envía a España)',
    variant: 'Blanco',
    url: 'https://www.fnac.pt/Comando-PS5-DualSense-PS5-PC-Mac-Bluetooth-Edicao-Limitada-GTA-VI-Branco-Periferico-ou-Jogo-Comando/a14688036',
    negativeMarkers: ['Stock esgotado', 'indisponível'],
  },
  {
    id: 'pressstart',
    name: 'Press Start (Portugal, envío gratis a España)',
    variant: 'Blanco',
    url: 'https://www.pressstart.pt/en/controlers-playstation/comando-sem-fios-dualsense-playstation-5-edicao-limitada-grand-theft-auto-vi-comp-pcmac.html',
    negativeMarkers: ['Notify me when available'],
  },
  {
    id: 'worten-pt',
    name: 'Worten Portugal',
    variant: 'Blanco',
    url: 'https://www.worten.pt/produtos/pre-venda-comando-sem-fios-sony-playstation-dualsense-edicao-limitada-grand-theft-auto-vi-white-ps5-pc-8993430',
    negativeMarkers: ['Esgotado', 'Indisponível'],
  },
  {
    id: 'xtralife',
    name: 'Xtralife',
    variant: 'Blanco',
    url: 'https://www.xtralife.com/producto/mando-dualsense-edicion-limitadagrand-theft-auto-vi-ps5/113163',
    negativeMarkers: ['RESERVAS AGOTADAS'],
  },
  {
    id: 'impactgame',
    name: 'Impact Game',
    variant: 'Blanco',
    url: 'https://impactgame.es/producto/reserva-dualsense-ed-limitada-grand-theft-auto-vi-blanco/',
    negativeMarkers: ['Sin existencias', 'actualmente agotado'],
  },
  {
    id: 'mediamarkt',
    name: 'MediaMarkt',
    variant: 'Blanco',
    url: 'https://www.mediamarkt.es/es/product/_mando-ps5-sony-mando-inalambrico-dualsenser-edicion-limitada-grand-theft-auto-vi-bluetooth-retroalimentacion-haptica-blanco-1673947.html',
    negativeMarkers: ['No disponible online', 'Agotado'],
  },
  {
    id: 'elcorteingles',
    name: 'El Corte Inglés',
    variant: 'Blanco',
    url: 'https://www.elcorteingles.es/videojuegos/A202288954-mando-inalambrico-sony-dualsense-edicion-limitada-gta-vi/',
    negativeMarkers: ['Agotado', 'No disponible'],
  },
];
