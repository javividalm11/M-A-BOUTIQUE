# ⚙️ Configurar la Dashboard (Cloudflare KV + R2)

La dashboard (`/admin.html`) permite editar productos, subir fotos y gestionar catálogos PDF,
y los cambios se ven **en vivo para todos los clientes**. Para que funcione necesitas 3 cosas
en Cloudflare: un **KV** (datos), un **R2** (archivos) y una **contraseña**.

> Requisito: el sitio debe estar desplegado como **Cloudflare Pages** (no como Worker suelto),
> porque usa *Pages Functions* (la carpeta `functions/`). Ver README para desplegar como Pages.

---

## Paso 1 — Crear el KV (base de datos)
1. Panel de Cloudflare → **Storage & Databases** → **KV** → **Create a namespace**.
2. Nombre: `maboutique-content` → **Add**.

## Paso 2 — Crear el R2 (fotos y PDFs)
1. Panel → **R2** → **Create bucket**.
2. Nombre: `maboutique-media` → **Create bucket**.
   *(No hace falta hacerlo público: los archivos se sirven por `/files/...`.)*

## Paso 3 — Enlazar (bindings) al proyecto Pages
1. Panel → **Workers & Pages** → tu proyecto **maboutique** → **Settings**.
2. **Bindings** (o *Functions → Bindings*) → **Add binding**:
   - **KV namespace**: Variable name = `MA_KV` → selecciona `maboutique-content`.
   - **R2 bucket**: Variable name = `MA_R2` → selecciona `maboutique-media`.
3. **Environment variables / Secrets** → **Add**:
   - Nombre: `ADMIN_PASSWORD` → Valor: tu contraseña (por defecto `m&Aboutiqu3`). Márcalo como **Secret**.
   > Si NO configuras `ADMIN_PASSWORD`, se usa `m&Aboutiqu3` por defecto. **Cámbiala** para mayor seguridad.
4. Guarda y **vuelve a desplegar** (Deployments → Retry/Redeploy) para que tomen efecto.

---

## Paso 4 — Usar la dashboard
1. Entra a `https://TU-SITIO/admin.html`
2. Contraseña: la que pusiste (o `m&Aboutiqu3`).
3. Primera vez: botón **“Cargar catálogo actual”** para importar los productos que ya vienen,
   edítalos y pulsa **Guardar cambios**.
4. **Fotos**: en cada producto, botón *Subir foto* (se guarda en R2).
5. **Catálogos PDF**: pestaña *Catálogos* → *Nuevo catálogo* → título + archivo PDF.
   Aparecen en la tienda en la sección **Catálogos**.

## Notas
- Mientras no configures el KV/R2, la tienda **sigue funcionando** con el catálogo incluido en el código.
- La contraseña se valida en el **servidor** (no queda expuesta en el navegador).
- Cambiar `ADMIN_PASSWORD` en Cloudflare cambia la contraseña sin tocar el código.
