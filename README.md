# 🛍️ M&A Boutique — Página de Ventas

Página web premium de ventas para **M&A Boutique**: jeans Medusa (MDS), ropa Shein, fragancias Jafra y Oriflame, zapatos y accesorios **sobre pedido**, con pedidos automáticos por WhatsApp.

- **100% estática** (HTML + CSS + JS) → carga rápida, ideal para SEO.
- **Sin dependencias externas** (solo Google Fonts, opcional).
- **Lista para Cloudflare Pages**.
- **Optimizada para SEO + GEO** (datos estructurados, Open Graph, sitemap, robots).

---

## 📁 Estructura

```
M&A/
├── index.html              ← Página principal
├── robots.txt              ← SEO / permisos de bots
├── sitemap.xml             ← Mapa del sitio
├── _headers                ← Cabeceras de seguridad y caché (Cloudflare)
├── README.md               ← Este archivo
└── assets/
    ├── css/styles.css      ← Diseño y animaciones
    ├── js/products.js      ← ⭐ CATÁLOGO Y CONFIGURACIÓN (edita aquí)
    ├── js/app.js           ← Lógica (carrito, WhatsApp, animaciones)
    └── img/
        ├── favicon.svg     ← Ícono de la pestaña
        └── og-cover.svg    ← Imagen para redes sociales
```

---

## ✏️ Cómo EDITAR (lo más importante)

Todo lo que necesitas cambiar está en **`assets/js/products.js`**.

### 1) Cambiar el WhatsApp / marca
Al inicio del archivo, en `CONFIG`:
```js
whatsapp: "5212871654171",   // formato: 52 + 1 + 10 dígitos, SIN + ni espacios
whatsappDisplay: "+52 1 287 165 4171",
```
> Si los mensajes no llegan, prueba con `"522871654171"` (sin el `1`).

### 2) Agregar / editar productos
Cada producto es una línea. Ejemplo (jeans Medusa):
```js
{ code: "AM 881", tipo: "Cargo", name: "Jean Cargo Denim", sizes: [7,9], featured: true },
```
Otras categorías:
```js
{ code: "OR-01", tipo: "Dama", name: "Giordani Gold", note: "50 ml · Lujo" },
```
- `featured: true` → aparece destacado.
- `sizes` → tallas disponibles (jeans/zapatos).
- `note` → texto libre (fragancias/accesorios).

### 3) Fotos de los productos
Por defecto cada producto muestra un **placeholder elegante** (degradado por categoría + código
de modelo). Es seguro, uniforme y con estilo de boutique, ideal mientras subes tus fotos reales.

**Para poner una foto real** en un producto, añade la propiedad `img` con la ruta del archivo:
```js
{ code:"AM 881", tipo:"Cargo", name:"Jean Cargo Denim", sizes:[7,9], img:"assets/img/products/am881.jpg" },
```
Guarda la imagen en `assets/img/products/`. Recomendado: **600×800 px** (vertical 3:4), `.jpg` o `.webp`.
Si la ruta falta o falla, vuelve a mostrarse el degradado (nunca se ve roto).

> **Sobre fotos automáticas:** se intentó poblar con imágenes de bancos gratuitos (Wikimedia, Flickr,
> Openverse), pero la calidad/relevancia era inconsistente y **hasta apareció contenido inapropiado**
> bajo búsquedas genéricas. Por seguridad de tu marca, NO se dejaron fotos automáticas sin revisar.
> **Fuentes correctas de fotos reales:**
> - **Jeans Medusa:** el PDF "Existencias Julio 7" (tus productos exactos, calidad de catálogo).
> - **Shein/Jafra/Oriflame/zapatos:** las fotos de tu proveedor o las que tú tomes.

### 4) Cambiar la imagen social (WhatsApp/Facebook)
Reemplaza `assets/img/og-cover.svg` por una imagen **1200×630 px** (`.jpg`) y actualiza la ruta en `index.html` (`og:image`).

### 5) Música de fondo
Coloca tu archivo `bg-music.mp3` en `assets/audio/` (ver `assets/audio/LEEME.txt`).
El botón dorado ♪ (abajo a la izquierda) reproduce/pausa. Intenta sonar sola al cargar;
si el navegador lo bloquea (política de autoplay), arranca en el **primer clic/toque/scroll**.
⚠️ Usa solo música libre de regalías o con licencia — no subas canciones con copyright a un sitio comercial.

---

## 🚀 Subir a Cloudflare Pages (gratis)

**Opción A — Arrastrar y soltar (la más simple):**
1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Arrastra **toda la carpeta `M&A`** (o su contenido).
3. Publica. Te dará una URL tipo `https://maboutique.pages.dev`.

**Opción B — Con GitHub (recomendado para actualizar fácil):**
1. Sube la carpeta a un repositorio de GitHub.
2. En Cloudflare Pages → **Connect to Git** → elige el repo.
3. Build command: *(vacío)* · Output directory: `/` (raíz).
4. Cada vez que hagas cambios en GitHub, se publica solo.

**Dominio propio:** en Pages → **Custom domains** → agrega tu dominio (ej. `maboutique.mx`).
Luego actualiza las URLs `https://maboutique.pages.dev` en `index.html`, `sitemap.xml` y `robots.txt` por tu dominio real.

---

## 🤖 Opciones para AUTOMATIZAR las ventas

La página **ya incluye la automatización base**: el cliente arma su pedido y, con un clic, se abre WhatsApp con el pedido **completo y formateado**, listo para que solo confirmes el precio. De ahí puedes escalar:

### Nivel 1 — Ya incluido ✅ (costo $0)
- **Carrito → WhatsApp**: el pedido llega listo (`wa.me` con mensaje pre-armado).
- **Pedido directo por producto** (botón verde en cada tarjeta).
- **Pedido guardado** en el navegador del cliente (localStorage).

### Nivel 2 — WhatsApp Business (gratis, 30 min de setup)
- Instala **WhatsApp Business** (app).
- Configura: **mensaje de bienvenida** automático, **respuestas rápidas** (/precio, /envio, /pago), **mensaje de ausencia**, **etiquetas** de clientes (Nuevo, Pagado, Enviado).
- Sube tu **Catálogo** de WhatsApp Business para compartir productos con precio.

### Nivel 3 — Chatbot / respuestas automáticas
Conecta un bot que responda solo y registre pedidos:
- **ManyChat** o **Chatfuel** (fácil, visual).
- **Wati**, **360dialog** o **Twilio** (WhatsApp Business API oficial, para volumen).
- Úsalo para: responder precios 24/7, capturar datos, dar seguimiento y remarketing.

### Nivel 4 — Registro y seguimiento de pedidos (tu futura dashboard)
- **Google Sheets + Apps Script**: cada pedido se guarda en una hoja de cálculo automáticamente.
- **Airtable** o **Notion**: base de datos visual con estados (Pendiente → Pagado → Enviado).
- **Zapier / Make (Integromat)**: conecta WhatsApp/Formulario → Sheet → correo → etiqueta.
- Aquí encaja la **dashboard de seguimiento** que mencionaste; se puede integrar sin rehacer la página.

### Nivel 5 — Pagos y catálogo social
- **Links de pago**: Mercado Pago, Clip, Conekta, PayPal.me → los mandas por WhatsApp.
- **Meta Commerce**: catálogo sincronizado con Instagram Shopping y WhatsApp.
- **Remarketing**: Píxel de Meta + TikTok Pixel (se agregan en `index.html`).

---

## 🔍 SEO + GEO (ya configurado)

- ✅ `<title>`, meta description, keywords, canonical.
- ✅ Open Graph + Twitter Cards (para que se vea bonito al compartir).
- ✅ Datos estructurados **JSON-LD**: `Store`, `FAQPage` (mejora posicionamiento y respuestas de IA/GEO).
- ✅ `robots.txt` (incluye permiso a bots de IA: GPTBot, ClaudeBot, PerplexityBot…).
- ✅ `sitemap.xml`.
- ✅ HTML semántico, `lang="es-MX"`, `geo.region=MX`.
- ✅ Carga rápida (Core Web Vitals) sin librerías pesadas.

**Para mejorar aún más:**
1. Registra el sitio en [Google Search Console](https://search.google.com/search-console) y sube el `sitemap.xml`.
2. Cambia todas las URLs de ejemplo por tu dominio real.
3. Agrega fotos reales con `alt` descriptivos (el catálogo ya usa el nombre del producto como `alt`).
4. Crea una ficha de **Google Business Profile** para SEO local (GEO geográfico).

---

## 🎨 Personalizar colores

En `assets/css/styles.css`, sección `:root`:
```css
--gold: #e8c88a;      /* dorado principal */
--rose: #ff5c8a;      /* acento rosa */
--bg:   #0c0b10;      /* fondo */
```

---

## ℹ️ Notas

- Los **39 modelos de jeans Medusa** provienen del catálogo *"Existencias Julio 7"*. Las tallas mostradas son las que aparecían disponibles; actualízalas según tu inventario.
- Los productos de **Shein, Jafra, Oriflame, zapatos y accesorios** son ejemplos curados para que la tienda se vea completa — reemplázalos por tu inventario e imágenes reales.
- Las marcas mencionadas (Medusa/MDS, Shein, Jafra, Oriflame) son propiedad de sus respectivos titulares; esta tienda opera como revendedor/pedido.
