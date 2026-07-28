# ⚙️ Configurar la Dashboard (solo Cloudflare KV — sin tarjeta)

La dashboard (`/admin.html`) permite editar productos, subir fotos y gestionar catálogos PDF,
y los cambios se ven **para todos los clientes**. Todo se guarda en un **KV** de Cloudflare
(gratis, **sin tarjeta**, sin R2).

> Requisito: el sitio debe estar desplegado como **Cloudflare Pages** (usa la carpeta `functions/`).
> Si sigue como *Worker*, primero pásalo a **Pages** (ver README).

---

## Paso 1 — KV (ya lo tienes ✅)
`maboutique-content` en **Storage & databases → Workers KV**. (Guarda textos, fotos y PDFs.)

## Paso 2 — Enlazar el KV al proyecto Pages
1. Panel → **Workers & Pages** → tu proyecto **maboutique** → **Settings**.
2. **Bindings** (o *Functions → Bindings*) → **Add binding** → **KV namespace**:
   - Variable name: **`MA_KV`**
   - KV namespace: `maboutique-content`
   - Save.

## Paso 3 — Contraseña del panel
1. En **Settings → Environment variables / Secrets** → **Add**:
   - Nombre: `ADMIN_PASSWORD` · Valor: tu contraseña (por defecto `m&Aboutiqu3`) · marca **Secret**.
   > Si NO la configuras, se usa `m&Aboutiqu3`. **Cámbiala** para más seguridad — la puedes cambiar aquí sin tocar el código.
2. **Guarda** y **vuelve a desplegar** (Deployments → Retry deployment) para que tome efecto.

---

## Paso 4 — Usar la dashboard
1. Entra a `https://TU-SITIO/admin.html` · Contraseña: la que pusiste.
2. Botón **“Cargar catálogo actual”** para importar los productos que ya vienen → edítalos → **Guardar cambios**.
3. **Fotos**: en cada producto, *Subir foto* (se comprime y guarda en KV).
4. **Catálogos PDF**: pestaña *Catálogos* → *Nuevo catálogo* → título + PDF. Aparecen en la tienda, sección **Catálogos**.

## Notas honestas
- **Sin R2 ni tarjeta**: todo va en KV (gratis: 1 GB, 100k lecturas/día). De sobra para una boutique.
- **Límite por archivo: ~24 MB** (fotos y PDFs normales entran sin problema).
- **Propagación**: tras *Guardar*, los cambios pueden tardar **hasta ~1 minuto** en verse en todo el mundo (así funciona KV). No es instantáneo al 100%, pero sí “casi en vivo”.
- Mientras no enlaces el KV, la tienda **sigue funcionando** con el catálogo incluido en el código.
- La contraseña se valida en el **servidor** (no queda expuesta en el navegador).
- Si algún día tienes mucho tráfico, se puede migrar las fotos a R2/CDN — pero para empezar, KV es perfecto.
