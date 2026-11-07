# Vigilante DualSense GTA VI

Revisa cada ~5 minutos varias tiendas de España y Portugal y te manda una
notificación al móvil (app **ntfy**) en cuanto el mando de GTA VI pasa a estar
disponible. Solo avisa una vez por tienda cada vez que vuelve el stock.

Tiendas incluidas: PlayStation España (blanco y negro), GAME, PcComponentes,
Fnac España, Fnac Portugal, Press Start, Worten Portugal, Xtralife, Impact Game,
MediaMarkt y El Corte Inglés. Puedes añadir o quitar tiendas en `stores.mjs`.

## Puesta en marcha (unos 10 minutos)

### 1. Instala ntfy en el móvil
1. Descarga **ntfy** (gratis) desde App Store o Google Play.
2. Pulsa **+** y suscríbete a un tema con un nombre difícil de adivinar,
   por ejemplo `gta6-mando-k7q2x9`. Quien sepa el nombre puede leer tus avisos,
   así que no uses algo obvio.
3. En los ajustes de ese tema, activa las notificaciones de prioridad máxima
   para que suene aunque tengas el modo no molestar.

### 2. Sube el proyecto a GitHub
1. Crea un repositorio **público** nuevo (por ejemplo `vigilante-dualsense`).
   Tiene que ser público: en los privados, ejecutarlo cada 5 minutos gasta más
   minutos gratis de los que da GitHub (2.000/mes). El nombre del tema va como
   secreto, así que no queda expuesto.
2. Sube todos los archivos, **incluida la carpeta `.github`**:
   ```bash
   cd vigilante-dualsense
   git init && git add . && git commit -m "Vigilante DualSense GTA VI"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/vigilante-dualsense.git
   git push -u origin main
   ```

### 3. Añade el secreto
En el repo: **Settings → Secrets and variables → Actions → New repository secret**
- Nombre: `NTFY_TOPIC`
- Valor: el nombre de tu tema (p. ej. `gta6-mando-k7q2x9`)

### 4. Prueba que funciona
**Actions → Vigilar DualSense GTA VI → Run workflow**, marca
*Enviar una notificación de prueba* y ejecútalo. Te debería llegar un aviso al
móvil en unos segundos.

En el log de esa ejecución verás el estado de cada tienda:
- 🟢 disponible · 🔴 agotado · ⚪ no se pudo leer (bloqueo, captcha o error)

Las ⚪ no cambian nada ni generan avisos. Si alguna tienda sale siempre en ⚪,
es que bloquea a los servidores de GitHub; puedes quitarla de `stores.mjs`.

## Cosas a tener en cuenta
- **Primer aviso**: si en la primera ejecución alguna tienda sale 🟢, te avisará
  enseguida. Entra a mirar: puede ser stock real o que la página haya cambiado.
- **Retrasos de GitHub**: el cron de cada 5 minutos a veces se retrasa unos
  minutos en horas punta.
- **Amazon no está incluido** porque prohíbe el acceso automatizado. Para Amazon
  usa **Keepa** (keepa.com): crea una alerta de "vuelve a estar en stock" para el
  mando en Amazon.es, Amazon.de, Amazon.it y Amazon.fr.
- **Apagarlo**: Actions → el workflow → menú "···" → *Disable workflow*.
  GitHub también desactiva los cron tras 60 días sin actividad en el repo.

## Probar en local
```bash
node --test            # tests de la lógica de detección
NTFY_TOPIC=tu-tema node check-stock.mjs
```
